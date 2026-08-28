const { z } = require('zod');

const rawMaterialSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(150),
  code: z.string().min(1, 'Le code est requis').max(50),
  category: z.string().min(1, 'La catégorie est requise').max(80),
  unit_of_measure: z.string().min(1, "L'unité de mesure est requise").max(20),
  quantity: z.number().nonnegative('La quantité doit être positive ou nulle'),
  status: z.enum(['active', 'inactive']).default('active'),
  description: z.string().max(2000).optional().nullable(),
});

module.exports = { rawMaterialSchema };