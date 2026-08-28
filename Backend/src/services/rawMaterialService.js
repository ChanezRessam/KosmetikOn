const repository = require('../repositories/rawMaterialRepository');

class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

async function getAll({ page = 1, pageSize = 10, name, category, status }) {
  const limit = parseInt(pageSize, 10);
  const offset = (parseInt(page, 10) - 1) * limit;

  const { items, total } = await repository.findAll({ limit, offset, name, category, status });

  return {
    items,
    pagination: {
      page: parseInt(page, 10),
      pageSize: limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getById(id) {
  const material = await repository.findById(id);
  if (!material) {
    throw new AppError('Matière première introuvable', 404, 'NOT_FOUND');
  }
  return material;
}

async function create(data) {
  const existing = await repository.findByNameOrCode(data.name, data.code);
  if (existing.length > 0) {
    const field = existing[0].name === data.name ? 'name' : 'code';
    throw new AppError(
      `Une matière première avec ce ${field === 'name' ? 'nom' : 'code'} existe déjà`,
      409,
      'DUPLICATE'
    );
  }
  return repository.create(data);
}

async function update(id, data) {
  const current = await repository.findById(id);
  if (!current) {
    throw new AppError('Matière première introuvable', 404, 'NOT_FOUND');
  }

  const existing = await repository.findByNameOrCode(data.name, data.code, id);
  if (existing.length > 0) {
    const field = existing[0].name === data.name ? 'name' : 'code';
    throw new AppError(
      `Une matière première avec ce ${field === 'name' ? 'nom' : 'code'} existe déjà`,
      409,
      'DUPLICATE'
    );
  }

  return repository.update(id, data);
}

async function remove(id) {
  const deleted = await repository.remove(id);
  if (!deleted) {
    throw new AppError('Matière première introuvable', 404, 'NOT_FOUND');
  }
  return deleted;
}

module.exports = {
  AppError,
  getAll,
  getById,
  create,
  update,
  remove,
};