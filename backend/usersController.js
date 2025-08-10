const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const router = express.Router();
const SECRET_KEY = 'SECRET123';

const db = new sqlite3.Database('./database.db');

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`);

router.post('/register', (req, res) => {
  console.log('POST /users/register reçu'); // <-- Pour debug

  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`,
    [username, hashedPassword],
    function(err) {
      if (err) return res.status(400).json({ error: 'Utilisateur déjà existant' });
      res.json({ message: 'Utilisateur créé avec succès' });
    }
  );
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (!user) return res.status(400).json({ error: 'Utilisateur introuvable' });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Mot de passe invalide' });

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  });
});

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).json({ error: 'Token manquant' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token invalide' });
    req.userId = decoded.id;
    next();
  });
}

module.exports = { router, verifyToken };
