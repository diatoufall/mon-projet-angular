console.log(">>> usersController.js chargé depuis :", __filename);
const express = require('express');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();

const router = express.Router();
router.use((req, res, next) => {
  console.log(`Requête reçue dans usersRouter: ${req.method} ${req.path}`);
  next();
});
const db = new sqlite3.Database('./database.db');

// Table users
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`);

// Route test
router.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Route inscription
router.post('/register', (req, res) => {
  console.log('POST /users/register reçu');
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`,
    [username, hashedPassword],
    function (err) {
      if (err) return res.status(400).json({ error: 'Utilisateur déjà existant' });
      res.json({ message: 'Utilisateur créé avec succès' });
    }
  );
});

module.exports = router;
