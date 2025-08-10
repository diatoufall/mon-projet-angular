const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const usersRouter = require('./usersController');
console.log(">>> usersRouter =", usersRouter);  // <-- Ici on affiche ce que contient usersRouter

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`Requête reçue: ${req.method} ${req.url}`);
  next();
});
console.log("usersRouter stack:", usersRouter.stack.map(l => l.route && l.route.path));
app.use('/users', usersRouter);
app.get('/', (req, res) => {
  res.send('Accueil backend OK');
});
app.get('/test', (req, res) => {
  res.json({ message: 'test ok' });
});
app.listen(3000, () => {
  console.log('Backend démarré sur http://localhost:3000');
});
