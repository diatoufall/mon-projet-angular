const jwt = require('jsonwebtoken');
const JWT_SECRET = "ta_clé_secrète_très_forte_et_secrète"; 

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'Token manquant' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token invalide' });
    }
    req.userId = decoded.id;
    next();
  });
}

module.exports = verifyToken;
