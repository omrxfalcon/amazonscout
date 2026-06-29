const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../db');
const requireAuth = require('../middleware/requireAuth');

// POST /api/stripe/checkout
// Creates a Stripe Checkout session and returns its URL.
// The extension opens this URL in a new tab.
router.post('/checkout', requireAuth, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      customer_email: req.user.email,
      metadata: { user_id: String(req.user.id) },
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/stripe/webhook
// Receives raw body — app.js must mount this BEFORE express.json().
router.post('/webhook', async (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  const obj = event.data.object;

  switch (event.type) {
    case 'checkout.session.completed': {
      const userId = obj.metadata?.user_id;
      if (userId && obj.subscription) {
        await db.query(
          `INSERT INTO subscriptions (user_id, stripe_subscription_id, stripe_customer_id, status)
           VALUES ($1, $2, $3, 'active')
           ON CONFLICT (stripe_subscription_id) DO UPDATE SET status = 'active', updated_at = NOW()`,
          [userId, obj.subscription, obj.customer]
        );
      }
      break;
    }
    case 'customer.subscription.updated': {
      await db.query(
        `UPDATE subscriptions SET status = $1, updated_at = NOW()
         WHERE stripe_subscription_id = $2`,
        [obj.status, obj.id]
      );
      break;
    }
    case 'customer.subscription.deleted': {
      await db.query(
        `UPDATE subscriptions SET status = 'canceled', updated_at = NOW()
         WHERE stripe_subscription_id = $1`,
        [obj.id]
      );
      break;
    }
  }

  res.json({ received: true });
});

module.exports = router;
