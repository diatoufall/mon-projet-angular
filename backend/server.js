const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { router: usersRouter } = require('./usersController');

const app = express();
app.use(cors());
app.use(bodyParser.json());
console.log('Montage du router /users');
app.use('/users', usersRouter);
// Monte le router sous le chemin /users
app.use('/users', usersRouter);

app.listen(3000, () => {
  console.log('Backend démarré sur http://localhost:3000');
});
