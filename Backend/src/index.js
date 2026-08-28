require('dotenv').config({ quiet: true });

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const pool = require('./config/db');
const swaggerSpec = require('./config/swagger');
const rawMaterialRoutes = require('./routes/rawMaterialRoutes');
const authRoutes = require('./routes/authRoutes');
const authenticate = require('./middlewares/authMiddleware');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Route de test santé
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', dbTime: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Impossible de se connecter à la base de données' });
  }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes métier
app.use('/auth', authRoutes);
app.use('/raw-materials', authenticate, rawMaterialRoutes);

// Middleware d'erreur centralisé (toujours en dernier)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});