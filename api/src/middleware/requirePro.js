const db = require('../db');

module.exports = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT status FROM subscriptions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [req.user.id]
    );
    if (!rows.length || rows[0].status !== 'active') {
      return res.status(403).json({ error: 'Pro subscription required' });
    }
    next();
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};
