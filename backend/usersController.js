const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const router = express.Router();
const db = new sqlite3.Database('./database.sqlite');
const SECRET_KEY = 'SECRET123';

// Enregistrement
router.post('/register', (req, res) => {
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

// Connexion
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

// Middleware pour vérifier le token
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'Token manquant' });

  jwt.verify(token.split(' ')[1], SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token invalide' });
    req.userId = decoded.id;
    next();
  });
}

module.exports = { router, verifyToken };
