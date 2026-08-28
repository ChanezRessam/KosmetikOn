const express = require('express');
const controller = require('../controllers/rawMaterialController');

const router = express.Router();

/**
 * @swagger
 * /raw-materials:
 *   get:
 *     summary: Liste les matières premières avec pagination et filtres
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: name
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [active, inactive] }
 *     responses:
 *       200:
 *         description: Liste paginée des matières premières
 */
router.get('/', controller.list);

/**
 * @swagger
 * /raw-materials/{id}:
 *   get:
 *     summary: Récupère une matière première par son id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Matière première trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RawMaterial'
 *       404:
 *         description: Introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', controller.getOne);

/**
 * @swagger
 * /raw-materials:
 *   post:
 *     summary: Crée une nouvelle matière première
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RawMaterialInput'
 *     responses:
 *       201:
 *         description: Créée avec succès
 *       400:
 *         description: Erreur de validation
 *       409:
 *         description: Nom ou code déjà existant
 */
router.post('/', controller.create);

/**
 * @swagger
 * /raw-materials/{id}:
 *   put:
 *     summary: Met à jour une matière première existante
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RawMaterialInput'
 *     responses:
 *       200:
 *         description: Mise à jour réussie
 *       404:
 *         description: Introuvable
 *       409:
 *         description: Nom ou code déjà existant
 */
router.put('/:id', controller.update);

/**
 * @swagger
 * /raw-materials/{id}:
 *   delete:
 *     summary: Supprime une matière première
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Supprimée avec succès
 *       404:
 *         description: Introuvable
 */
router.delete('/:id', controller.remove);

module.exports = router;