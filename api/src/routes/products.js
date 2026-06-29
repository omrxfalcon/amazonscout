const router = require('express').Router();
const db = require('../db');
const requireAuth = require('../middleware/requireAuth');
const requirePro = require('../middleware/requirePro');

// All routes below require a valid JWT + active Pro subscription
router.use(requireAuth, requirePro);

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM saved_products WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/products
router.post('/', async (req, res) => {
  const { asin, title, price, bsr, reviews, opportunity_score } = req.body;
  if (!asin) return res.status(400).json({ error: 'ASIN is required' });

  try {
    const { rows } = await db.query(
      `INSERT INTO saved_products (user_id, asin, title, price, bsr, reviews, opportunity_score)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.user.id, asin, title, price ?? null, bsr ?? null, reviews ?? null, opportunity_score ?? null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Product already saved' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM saved_products WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/products/:id
router.put('/:id', async (req, res) => {
  const { title, price, bsr, reviews, opportunity_score } = req.body;
  try {
    const { rows } = await db.query(
      `UPDATE saved_products
       SET title = $1, price = $2, bsr = $3, reviews = $4, opportunity_score = $5, updated_at = NOW()
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [title, price ?? null, bsr ?? null, reviews ?? null, opportunity_score ?? null, req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await db.query(
      `DELETE FROM saved_products WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (!rowCount) return res.status(404).json({ error: 'Product not found' });
    res.status(204).end();
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
