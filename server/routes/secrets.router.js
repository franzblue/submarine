const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/', rejectUnauthenticated, (req, res) => {
  console.log('req.user:', req.user);
  console.log('/secrets GET route');
  console.log('is authenticated?', req.isAuthenticated());
  console.log('user', req.user);

  // only allow authenticated users acces - franz
  if(req.isAuthenticated() === false) {
    res.sendStatus(403);
  } else {
    let queryText = `SELECT * FROM "secret" WHERE "secrecy_level" <= $1`;
    pool
      .query(queryText, [req.user.clearance_level])
      .then((results) => res.send(results.rows))
      .catch((error) => {
        console.log('Error making SELECT for secrets:', error);
        res.sendStatus(500);
      });
    }
});

module.exports = router;
