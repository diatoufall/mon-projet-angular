const express = require('express');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const verifyToken = require('./authMiddleware');

const router = express.Router();
const db = new sqlite3.Database('./database.db');
const JWT_SECRET = "ta_clé_secrète_très_forte_et_secrète";

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`);

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Le nom d'utilisateur et le mot de passe sont requis." });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);
  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`,
    [username, hashedPassword],
    function (err) {
      if (err) {
        return res.status(400).json({ error: 'Utilisateur déjà existant' });
      }
      res.json({ message: 'Utilisateur créé avec succès' });
    }
  );
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur du serveur.' });
    }
    if (!user) {
      return res.status(400).json({ error: 'Utilisateur non trouvé.' });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Mot de passe incorrect.' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({
      message: 'Connexion réussie',
      token: token
    });
  });
});
router.get('/profile', verifyToken, (req, res) => {
  db.get(`SELECT id, username FROM users WHERE id = ?`, [req.userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json(user);
  });
});
module.exports = router;