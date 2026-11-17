const express = require('express');
const mysql = require('mysql2');

const app = express();

let db;

function connectToDatabase(attempt = 1) {
    db = mysql.createConnection({
        host: 'app.db',
        user: 'root',
        password: 'root',
        database: 'appdb'
    });

    db.on('error', err => {
        console.log(`Database connection lost: ${err.message}`);
        if (err.fatal) {
            setTimeout(() => connectToDatabase(attempt + 1), 5000);
        }
    });

    db.connect(err => {
        if (err) {
            console.log(`Database connection attempt ${attempt} failed: ${err.message}`);
            if (attempt < 12) {
                setTimeout(() => connectToDatabase(attempt + 1), 5000);
            }
        } else {
            console.log("Database Connected!");
        }
    });
}

connectToDatabase();

app.get('/', (req, res) => {
    res.send("Application Deployed Successfully!");
});

app.get('/db', (req, res) => {
    if (!db) return res.status(503).send("Database unavailable");
    db.query('SELECT 1 AS result', (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));