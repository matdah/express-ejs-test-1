/**
 * Installationsfil för Express + EJS + SQLite-exempel
 */
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Skapa tabell i SQLite-databasen

const db = new sqlite3.Database('./db/users.db');

db.serialize(() => {
    // Drop table if exists
    db.run("DROP TABLE IF EXISTS users");
    db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL,
        age INTEGER NOT NULL,
        created DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    const stmt = db.prepare("INSERT INTO users(name, age) VALUES (?, ?)");
    for (let i = 0; i < 10; i++) {
        stmt.run("User " + i, (10 + i));
    }
    stmt.finalize();

    console.log("Tabellen users skapad");
});

db.close();