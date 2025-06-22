const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

class MongoSchemaAnalyzer {
    constructor(connectionString, options = {}) {
        this.connectionString = connectionString;
        this.sampleSize = options.sampleSize || 1000;
        this.outputDir = options.outputDir || './schema-output';
        this.client = null;
        this.db = null;
        this.schemas = {};
        this.relationships = [];
    }

    async connect() {
        try {
            this.client = new MongoClient(this.connectionString);
            await this.client.connect();

            // Try to get database name from connection string
            const url = new URL(this.connectionString);
            const dbName = url.pathname.slice(1); // Remove leading slash

            if (dbName) {
                this.db = this.client.db(dbName);
            } else {
                this.db = this.client.db();
            }

            console.log(`Connected to MongoDB, using database: ${this.db.databaseName}`);
            return this.client;
        } catch (error) {
            console.error('Connection failed:', error.message);
            throw error;
        }
    }

    async analyzeDatabase() {
        try {
            // Test permissions first
            try {
                await this.db.listCollections().toArray();
            } catch (authError) {
                if (authError.message.includes('not authorized')) {
                    console.error(`Permission denied on database '${this.db.databaseName}'.`);
                    console.error('Make sure your user has read permissions on this database.');
                    console.error('If you need to specify a different database, add it to your connection string:');
                    console.error('mongodb://user:pass@host:port/database_name?options');
                    throw authError;
                }
                throw authError;
            }

            // Get all collections
            const collections = await this.db.listCollections().toArray();
            console.log(`Found ${collections.length} collections`);

            // Analyze each collection
            for (const collection of collections) {
                console.log(`Analyzing collection: ${collection.name}`);
                await this.analyzeCollection(collection.name);
            }

            // Detect relationships
            console.log('Detecting relationships...');
            await this.detectRelationships();

            // Generate output
            await this.generateOutput();

        } catch (error) {
            console.error('Analysis failed:', error.message);
            throw error;
        }
    }

    async analyzeCollection(collectionName) {
        const collection = this.db.collection(collectionName);

        // Get sample documents
        const documents = await collection.find({}).limit(this.sampleSize).toArray();

        if (documents.length === 0) {
            console.log(`Collection ${collectionName} is empty`);
            return;
        }

        const schema = {
            collectionName,
            documentCount: await collection.countDocuments(),
            sampleSize: documents.length,
            fields: {},
            indexes: await collection.indexes(),
            relationships: []
        };

        // Analyze all documents to build comprehensive field map
        documents.forEach(doc => {
            this.analyzeDocument(doc, schema.fields, '');
        });

        // Calculate field statistics
        this.calculateFieldStats(schema.fields, documents.length);

        this.schemas[collectionName] = schema;
    }

    analyzeDocument(doc, fields, prefix) {
        for (const [key, value] of Object.entries(doc)) {
            const fieldPath = prefix ? `${prefix}.${key}` : key;

            if (!fields[fieldPath]) {
                fields[fieldPath] = {
                    type: new Set(),
                    isArray: false,
                    isOptional: false,
                    count: 0,
                    samples: [],
                    nestedFields: {}
                };
            }

            const field = fields[fieldPath];
            field.count++;

            if (value === null || value === undefined) {
                field.type.add('null');
                field.isOptional = true;
            } else if (Array.isArray(value)) {
                field.isArray = true;
                field.type.add('array');

                // Analyze array elements
                value.forEach((item, index) => {
                    if (typeof item === 'object' && item !== null) {
                        this.analyzeDocument(item, field.nestedFields, `[${index}]`);
                    } else {
                        field.type.add(typeof item);
                    }
                });
            } else if (typeof value === 'object' && value.constructor === Object) {
                field.type.add('object');
                this.analyzeDocument(value, field.nestedFields, fieldPath);
            } else {
                // Handle ObjectId
                if (value && typeof value.toString === 'function' &&
                    value.toString().match(/^[0-9a-fA-F]{24}$/)) {
                    field.type.add('ObjectId');
                    field.samples.push(value.toString());
                } else {
                    field.type.add(typeof value);
                    if (field.samples.length < 5) {
                        field.samples.push(value);
                    }
                }
            }
        }
    }

    calculateFieldStats(fields, totalDocs) {
        for (const [fieldPath, field] of Object.entries(fields)) {
            field.frequency = (field.count / totalDocs * 100).toFixed(2);
            field.isOptional = field.count < totalDocs;
            field.types = Array.from(field.type);

            // Clean up for output
            delete field.type;

            // Recursively calculate for nested fields
            if (Object.keys(field.nestedFields).length > 0) {
                this.calculateFieldStats(field.nestedFields, field.count);
            }
        }
    }

    async detectRelationships() {
        const collections = Object.keys(this.schemas);

        for (const sourceCollection of collections) {
            const sourceSchema = this.schemas[sourceCollection];

            for (const [fieldPath, field] of Object.entries(sourceSchema.fields)) {
                // Check if field contains ObjectIds
                if (field.types.includes('ObjectId') && field.samples.length > 0) {

                    // Check if these ObjectIds exist in other collections
                    for (const targetCollection of collections) {
                        if (targetCollection === sourceCollection) continue;

                        const targetCol = this.db.collection(targetCollection);

                        // Sample check - take a few ObjectIds and see if they exist in target
                        const sampleIds = field.samples.slice(0, 3);
                        let matchCount = 0;

                        for (const id of sampleIds) {
                            try {
                                const exists = await targetCol.findOne({ _id: require('mongodb').ObjectId(id) });
                                if (exists) matchCount++;
                            } catch (error) {
                                // Invalid ObjectId, skip
                                continue;
                            }
                        }

                        // If more than 50% of samples match, consider it a relationship
                        if (matchCount / sampleIds.length > 0.5) {
                            const relationship = {
                                from: sourceCollection,
                                fromField: fieldPath,
                                to: targetCollection,
                                toField: '_id',
                                type: field.isArray ? 'oneToMany' : 'oneToOne',
                                confidence: (matchCount / sampleIds.length * 100).toFixed(2)
                            };

                            this.relationships.push(relationship);
                            sourceSchema.relationships.push(relationship);
                        }
                    }
                }
            }
        }
    }

    async generateOutput() {
        // Create output directory
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }

        // Generate JSON schema
        await this.generateJSONSchema();

        // Generate Mongoose schemas
        await this.generateMongooseSchemas();

        // Generate documentation
        await this.generateDocumentation();

        // Generate relationship diagram
        await this.generateRelationshipDiagram();

        console.log(`Output generated in: ${this.outputDir}`);
    }

    async generateJSONSchema() {
        const jsonSchema = {
            database: this.db.databaseName,
            analyzedAt: new Date().toISOString(),
            collections: this.schemas,
            relationships: this.relationships
        };

        fs.writeFileSync(
            path.join(this.outputDir, 'database-schema.json'),
            JSON.stringify(jsonSchema, null, 2)
        );
    }

    async generateMongooseSchemas() {
        let mongooseCode = "// Generated Mongoose Schemas\n";
        mongooseCode += "const mongoose = require('mongoose');\nconst { Schema } = mongoose;\n\n";

        for (const [collectionName, schema] of Object.entries(this.schemas)) {
            mongooseCode += `// ${collectionName} Schema\n`;
            mongooseCode += `const ${this.toPascalCase(collectionName)}Schema = new Schema({\n`;

            const schemaFields = this.generateMongooseFields(schema.fields);
            mongooseCode += schemaFields;

            mongooseCode += "}, {\n";
            mongooseCode += "  timestamps: true,\n";
            mongooseCode += `  collection: '${collectionName}'\n`;
            mongooseCode += "});\n\n";

            mongooseCode += `const ${this.toPascalCase(collectionName)} = mongoose.model('${this.toPascalCase(collectionName)}', ${this.toPascalCase(collectionName)}Schema);\n\n`;
        }

        mongooseCode += "module.exports = {\n";
        mongooseCode += Object.keys(this.schemas)
            .map(name => `  ${this.toPascalCase(name)}`)
            .join(',\n');
        mongooseCode += "\n};\n";

        fs.writeFileSync(
            path.join(this.outputDir, 'mongoose-schemas.js'),
            mongooseCode
        );
    }

    generateMongooseFields(fields, indent = '  ') {
        let result = '';

        for (const [fieldPath, field] of Object.entries(fields)) {
            if (fieldPath.includes('.') || fieldPath.includes('[')) continue; // Skip nested paths for now

            result += `${indent}${fieldPath}: {\n`;

            // Determine primary type
            const primaryType = this.getMongooseType(field.types);
            result += `${indent}  type: ${primaryType}`;

            if (field.isOptional) {
                result += ',\n' + indent + '  required: false';
            }

            if (field.isArray) {
                result = result.replace(`type: ${primaryType}`, `type: [${primaryType}]`);
            }

            // Add relationships as refs
            const relationship = this.relationships.find(rel =>
                rel.fromField === fieldPath &&
                Object.keys(this.schemas).includes(rel.from)
            );

            if (relationship && primaryType === 'Schema.Types.ObjectId') {
                result += `,\n${indent}  ref: '${this.toPascalCase(relationship.to)}'`;
            }

            result += `\n${indent}}, // Frequency: ${field.frequency}%\n`;
        }

        return result;
    }

    getMongooseType(types) {
        if (types.includes('ObjectId')) return 'Schema.Types.ObjectId';
        if (types.includes('string')) return 'String';
        if (types.includes('number')) return 'Number';
        if (types.includes('boolean')) return 'Boolean';
        if (types.includes('object')) return 'Schema.Types.Mixed';
        if (types.includes('array')) return 'Array';
        return 'Schema.Types.Mixed';
    }

    async generateDocumentation() {
        let doc = `# Database Schema Documentation\n\n`;
        doc += `**Database:** ${this.db.databaseName}\n`;
        doc += `**Analyzed:** ${new Date().toISOString()}\n`;
        doc += `**Collections:** ${Object.keys(this.schemas).length}\n\n`;

        // Collections overview
        doc += `## Collections Overview\n\n`;
        for (const [name, schema] of Object.entries(this.schemas)) {
            doc += `### ${name}\n`;
            doc += `- **Documents:** ${schema.documentCount.toLocaleString()}\n`;
            doc += `- **Fields:** ${Object.keys(schema.fields).length}\n`;
            doc += `- **Relationships:** ${schema.relationships.length}\n\n`;
        }

        // Detailed schemas
        doc += `## Detailed Schemas\n\n`;
        for (const [name, schema] of Object.entries(this.schemas)) {
            doc += `### ${name}\n\n`;
            doc += `| Field | Type | Optional | Frequency |\n`;
            doc += `|-------|------|----------|----------|\n`;

            for (const [fieldPath, field] of Object.entries(schema.fields)) {
                if (fieldPath.includes('.')) continue; // Skip nested for table
                doc += `| ${fieldPath} | ${field.types.join(' \\| ')} | ${field.isOptional ? '✓' : '✗'} | ${field.frequency}% |\n`;
            }
            doc += `\n`;
        }

        // Relationships
        if (this.relationships.length > 0) {
            doc += `## Relationships\n\n`;
            doc += `| From | Field | To | Type | Confidence |\n`;
            doc += `|------|-------|----|----- |-----------|\n`;

            for (const rel of this.relationships) {
                doc += `| ${rel.from} | ${rel.fromField} | ${rel.to} | ${rel.type} | ${rel.confidence}% |\n`;
            }
        }

        fs.writeFileSync(
            path.join(this.outputDir, 'README.md'),
            doc
        );
    }

    async generateRelationshipDiagram() {
        let mermaid = `graph TD\n`;

        for (const [name] of Object.entries(this.schemas)) {
            mermaid += `  ${name}[${name}]\n`;
        }

        for (const rel of this.relationships) {
            const arrow = rel.type === 'oneToMany' ? '-->|1:N|' : '-->|1:1|';
            mermaid += `  ${rel.from} ${arrow} ${rel.to}\n`;
        }

        fs.writeFileSync(
            path.join(this.outputDir, 'relationships.mermaid'),
            mermaid
        );
    }

    toPascalCase(str) {
        return str.replace(/(?:^|_)([a-z])/g, (_, char) => char.toUpperCase());
    }

    async close() {
        if (this.client) {
            await this.client.close();
            console.log('Connection closed');
        }
    }
}

// Usage example and CLI
async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log(`
            MongoDB Schema Analyzer

            Usage:
            node schema-analyzer.js <connection-string> [options]

            Options:
            --sample-size <number>      Number of documents to sample per collection (default: 1000)
            --output-dir <path>         Output directory (default: ./schema-output)

            Example:
            node schema-analyzer.js "mongodb://localhost:27017/mydb"
            node schema-analyzer.js "mongodb+srv://user:pass@cluster.mongodb.net/mydb" --sample-size 500\n
        `);
        process.exit(1);
    }

    const connectionString = args[0];
    const options = {};

    // Parse options
    for (let i = 1; i < args.length; i += 2) {
        const flag = args[i];
        const value = args[i + 1];

        if (flag === '--sample-size') {
            options.sampleSize = parseInt(value);
        } else if (flag === '--output-dir') {
            options.outputDir = value;
        }
    }

    const analyzer = new MongoSchemaAnalyzer(connectionString, options);

    try {
        await analyzer.connect();
        await analyzer.analyzeDatabase();
        console.log('Schema analysis completed successfully!');
    } catch (error) {
        console.error('Analysis failed:', error.message);
        process.exit(1);
    } finally {
        await analyzer.close();
    }
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = MongoSchemaAnalyzer;
