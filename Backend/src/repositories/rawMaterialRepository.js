const pool = require('../config/db');

async function findAll({ limit, offset, name, category, status }) {
  const conditions = [];
  const values = [];
  let paramIndex = 1;

  if (name) {
    conditions.push(`name ILIKE $${paramIndex++}`);
    values.push(`%${name}%`);
  }
  if (category) {
    conditions.push(`category = $${paramIndex++}`);
    values.push(category);
  }
  if (status) {
    conditions.push(`status = $${paramIndex++}`);
    values.push(status);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const dataQuery = `
    SELECT * FROM raw_material
    ${whereClause}
    ORDER BY id DESC
    LIMIT $${paramIndex++} OFFSET $${paramIndex++}
  `;
  const countQuery = `SELECT COUNT(*) FROM raw_material ${whereClause}`;

  const dataValues = [...values, limit, offset];

  const [dataResult, countResult] = await Promise.all([
    pool.query(dataQuery, dataValues),
    pool.query(countQuery, values),
  ]);

  return {
    items: dataResult.rows,
    total: parseInt(countResult.rows[0].count, 10),
  };
}

async function findById(id) {
  const result = await pool.query('SELECT * FROM raw_material WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function findByNameOrCode(name, code, excludeId = null) {
  const query = excludeId
    ? 'SELECT * FROM raw_material WHERE (name = $1 OR code = $2) AND id != $3'
    : 'SELECT * FROM raw_material WHERE (name = $1 OR code = $2)';
  const values = excludeId ? [name, code, excludeId] : [name, code];
  const result = await pool.query(query, values);
  return result.rows;
}

async function create(data) {
  const { name, code, category, unit_of_measure, quantity, status, description } = data;
  const result = await pool.query(
    `INSERT INTO raw_material (name, code, category, unit_of_measure, quantity, status, description)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [name, code, category, unit_of_measure, quantity, status || 'active', description || null]
  );
  return result.rows[0];
}

async function update(id, data) {
  const { name, code, category, unit_of_measure, quantity, status, description } = data;
  const result = await pool.query(
    `UPDATE raw_material
     SET name = $1, code = $2, category = $3, unit_of_measure = $4,
         quantity = $5, status = $6, description = $7, updated_at = now()
     WHERE id = $8
     RETURNING *`,
    [name, code, category, unit_of_measure, quantity, status, description || null, id]
  );
  return result.rows[0] || null;
}

async function remove(id) {
  const result = await pool.query('DELETE FROM raw_material WHERE id = $1 RETURNING *', [id]);
  return result.rows[0] || null;
}

module.exports = {
  findAll,
  findById,
  findByNameOrCode,
  create,
  update,
  remove,
};