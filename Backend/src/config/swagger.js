const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'KosmetikOn - API Matières Premières',
      version: '1.0.0',
      description: "API de gestion des matières premières pour l'industrie cosmétique",
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      schemas: {
        RawMaterial: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Glycérine végétale' },
            code: { type: 'string', example: 'MP-001' },
            category: { type: 'string', example: 'emollient' },
            unit_of_measure: { type: 'string', example: 'kg' },
            quantity: { type: 'number', example: 25.5 },
            status: { type: 'string', enum: ['active', 'inactive'] },
            description: { type: 'string', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        RawMaterialInput: {
          type: 'object',
          required: ['name', 'code', 'category', 'unit_of_measure', 'quantity'],
          properties: {
            name: { type: 'string' },
            code: { type: 'string' },
            category: { type: 'string' },
            unit_of_measure: { type: 'string' },
            quantity: { type: 'number' },
            status: { type: 'string', enum: ['active', 'inactive'] },
            description: { type: 'string', nullable: true },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            code: { type: 'string', example: 'DUPLICATE' },
            message: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);