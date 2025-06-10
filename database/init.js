const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'bot.db');

class Database {
    constructor() {
        this.db = null;
    }

    initializeDatabase() {
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
                return;
            }
            console.log('Connected to SQLite database.');
            this.createTables();
        });
    }

    createTables() {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS tracked_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                message_id TEXT UNIQUE NOT NULL,
                channel_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;

        this.db.run(createTableQuery, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Database table created or already exists.');
            }
        });
    }

    addTrackedMessage(messageId, channelId, userId, content) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO tracked_messages (message_id, channel_id, user_id, content)
                VALUES (?, ?, ?, ?)
            `;
            
            this.db.run(query, [messageId, channelId, userId, content], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    getTrackedMessage(messageId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * FROM tracked_messages WHERE message_id = ?
            `;
            
            this.db.get(query, [messageId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    getAllTrackedMessages() {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM tracked_messages ORDER BY created_at DESC`;
            
            this.db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    removeTrackedMessage(messageId) {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM tracked_messages WHERE message_id = ?`;
            
            this.db.run(query, [messageId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes); // Returns number of rows affected
                }
            });
        });
    }

    closeDatabase() {
        if (this.db) {
            this.db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err.message);
                } else {
                    console.log('Database connection closed.');
                }
            });
        }
    }
}

const database = new Database();

module.exports = database;
