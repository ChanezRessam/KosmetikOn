require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../src/config/db');

async function createUser(email, password) {
  const hash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
    [email, hash]
  );
  console.log('Utilisateur créé :', result.rows[0]);
  process.exit(0);
}

const [,, email, password] = process.argv;
if (!email || !password) {
  console.error('Usage: node scripts/createUser.js <email> <password>');
  process.exit(1);
}

createUser(email, password).catch((err) => {
  console.error(err);
  process.exit(1);
});