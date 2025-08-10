const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { router: usersRouter } = require('./usersController');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Middleware global pour log toutes les requêtes
app.use((req, res, next) => {
  console.log(`Requête reçue: ${req.method} ${req.url}`);
  next();
});

app.use('/users', usersRouter);

app.listen(3000, () => {
  console.log('Backend démarré sur http://localhost:3000');
});
