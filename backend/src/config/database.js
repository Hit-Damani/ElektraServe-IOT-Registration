const { DatabaseSync } = require('node:sqlite');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const dbPath = process.env.DB_PATH;

if (!dbPath) {
  throw new Error('DB_PATH is not defined in .env file');
}

// Ensure the directory for the database file exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize native Node.js SQLite database
const db = new DatabaseSync(dbPath);

// Enable WAL mode and foreign key constraints
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

module.exports = db;
