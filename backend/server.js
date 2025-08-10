const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connexion à la base SQLite
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) console.error(err.message);
    else console.log('Connecté à SQLite.');
});

// Création de la table utilisateur
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
)`);

// Route d'inscription
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`,
        [username, hashedPassword],
        (err) => {
            if (err) return res.status(400).json({ error: 'Utilisateur existe déjà' });
            res.json({ message: 'Utilisateur créé' });
        }
    );
});

// Route de connexion
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
        if (!row) return res.status(400).json({ error: 'Utilisateur introuvable' });

        if (!bcrypt.compareSync(password, row.password)) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
        }

        const token = jwt.sign({ id: row.id }, 'SECRET_KEY', { expiresIn: '1h' });
        res.json({ message: 'Connexion réussie', token });
    });
});

app.listen(3000, () => {
    console.log('Backend démarré sur http://localhost:3000');
});
