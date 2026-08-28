const { ZodError } = require('zod');
const { AppError } = require('../services/rawMaterialService');

function errorHandler(err, req, res, next) {
  console.error(err);

  // Erreurs de validation Zod
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      code: 'VALIDATION_ERROR',
      message: 'Données invalides',
      details: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  // Erreurs métier personnalisées (AppError)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      code: err.code,
      message: err.message,
    });
  }

  // Erreur de contrainte unique PostgreSQL (au cas où elle passerait à travers)
  if (err.code === '23505') {
    return res.status(409).json({
      status: 'error',
      code: 'DUPLICATE',
      message: 'Une matière première avec ce nom ou ce code existe déjà',
    });
  }

  // Erreur générique / inattendue
  res.status(500).json({
    status: 'error',
    code: 'INTERNAL_ERROR',
    message: 'Une erreur interne est survenue',
  });
}

module.exports = errorHandler;