const express = require('express');
const app = express();

app.get('/api', (req, res) => {
  res.send('API Backend en marche');
});

app.listen(3000, () => {
  console.log('Backend démarré sur http://localhost:3000');
});
