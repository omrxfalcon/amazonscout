const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const stripeRoutes = require('./routes/stripe');
const productsRoutes = require('./routes/products');

const app = express();

// Allow the configured CLIENT_URL and any Chrome extension origin
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // curl / Postman
    const allowed = !origin ||
      origin === process.env.CLIENT_URL ||
      /^chrome-extension:\/\//.test(origin);
    callback(allowed ? null : new Error('Not allowed by CORS'), allowed);
  },
}));

// Stripe webhook requires the raw body BEFORE express.json parses it
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/products', productsRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }));

module.exports = app;
