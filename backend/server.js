const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Route racine simple pour test
app.get('/api', (req, res) => {
  res.send('API Backend en marche');
});

// Import du router users
const { router: usersRouter } = require('./usersController');
app.use('/users', usersRouter);

app.listen(3000, () => {
  console.log('Backend démarré sur http://localhost:3000');
});
