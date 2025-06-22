const MongoSchemaAnalyzer = require('./schema-analyzer');

async function testAnalyzer() {
    const connectionString = 'mongodb://user:pass@host:port/database_name?options'; // Replace this with the connection string of your database

    const analyzer = new MongoSchemaAnalyzer(connectionString, {
        sampleSize: 100,
        outputDir: './test-output'
    });

    try {
        await analyzer.connect();
        const adminDb = analyzer.db.admin();
        const databases = await adminDb.listDatabases();
        console.log('\nIf you are trying to analyze the database that is not available in the following list');
        console.log('you will get the permision denied. Change your connection string or the permission for your database user.\n');
        console.log('Available databases for your connection:\n');
        databases.databases.forEach(db => {
            console.log(`   - ${db.name}`);
        });
        console.log();
        await analyzer.analyzeDatabase();
        console.log('Test completed successfully');
    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await analyzer.close();
    }
}

testAnalyzer();
