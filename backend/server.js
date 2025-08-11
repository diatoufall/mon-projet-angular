const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

const usersRouter = require('./usersController');
app.use('/users', usersRouter);

app.get('/', (req, res) => {
  res.send('Accueil backend OK');
});

app.listen(port, () => {
  console.log(`Backend démarré sur http://localhost:${port}`);
});