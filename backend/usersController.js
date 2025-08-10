const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connexion à la base SQLite
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) console.error(err.message);
  else console.log('Connecté à SQLite.');
});

// Route racine simple
app.get('/api', (req, res) => {
  res.send('API Backend en marche');
});

// Import du router users
const { router: usersRouter } = require('./usersController');
app.use('/users', usersRouter);

app.listen(3000, () => {
  console.log('Backend démarré sur http://localhost:3000');
});
