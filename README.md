# MongoDB Schema Analyzer

Analyzes MongoDB databases and generates schema models with relationship detection. Just provide a connection string and get Mongoose schemas, documentation, and relationship diagrams.

## Installation

```bash
git clone https://github.com/ahmadnurfais/mongodb-schema-analyzer.git
cd mongodb-schema-analyzer
npm install
```

## Usage

```bash
node schema-analyzer.js <connection-string> [options]
```

### Options

- `--sample-size <number>` - Number of documents to sample per collection (default: 1000)
- `--output-dir <path>` - Output directory (default: ./schema-output)

### Examples

```bash
node schema-analyzer.js "mongodb://localhost:27017/mydb"
node schema-analyzer.js "mongodb+srv://user:pass@cluster.mongodb.net/mydb" --output-dir ./results/mydb-scheme --sample-size 500
```

## Output Files

- `database-schema.json` - Complete schema analysis
- `mongoose-schemas.js` - Ready-to-use Mongoose models
- `README.md` - Human-readable documentation
- `relationships.mermaid` - Visual relationship diagram

## Troubleshooting

### Permission Denied Error

Permission denied errors are usually caused by incorrect connection strings. The user may not have access to the specified database.

To check available databases for your user:

1. Change the connection string in `test-analyzer.js`
2. Run `npm test`

```bash
npm test
```

Example output:

```cmd
Connected to MongoDB, using database: test
If you are trying to analyze a database that is not available in the following list,
you will get permission denied. Change your connection string or database user permissions.
Available databases for your connection:
   - NeoEmployee
Permission denied on database 'test'.
```

After finding available databases, modify your connection string to include the correct database name:

```bash
# Wrong - defaults to 'test' database
mongodb://user:pass@localhost:27017/?authSource=admin

# Correct - specifies database name
mongodb://user:pass@localhost:27017/NeoEmployee?authSource=admin
```

### Other Common Issues

**Connection failed:**

- Check if MongoDB server is running
- Verify connection string format
- Ensure network connectivity

**Empty collections:**

- Increase sample size with `--sample-size` option
- Check if collections actually contain data
