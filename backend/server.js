const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(`Requête reçue: ${req.method} ${req.url}`);
  next();
});

// Routes de l'API
// Route de base
app.get('/', (req, res) => {
  console.log("Route de base '/' appelée.");
  res.send('Accueil backend OK');
});

// Route de test simple
app.get('/test', (req, res) => {
  console.log("Route '/test' appelée.");
  res.json({ message: 'test ok' });
});

// Router pour les routes utilisateurs
const usersRouter = require('./usersController');
app.use('/users', usersRouter);

// Démarrage du serveur
app.listen(4000, () => {
  console.log('Backend démarré sur http://localhost:4000');
});