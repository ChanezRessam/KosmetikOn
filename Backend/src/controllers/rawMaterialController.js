const service = require('../services/rawMaterialService');
const { rawMaterialSchema } = require('../dtos/rawMaterialDto');

async function list(req, res, next) {
  try {
    const { page, pageSize, name, category, status } = req.query;
    const result = await service.getAll({ page, pageSize, name, category, status });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const material = await service.getById(req.params.id);
    res.json(material);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const parsed = rawMaterialSchema.parse(req.body);
    const material = await service.create(parsed);
    res.status(201).json(material);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const parsed = rawMaterialSchema.parse(req.body);
    const material = await service.update(req.params.id, parsed);
    res.json(material);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await service.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  getOne,
  create,
  update,
  remove,
};