const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
require('dotenv').config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

app.get('/create-checkout', async (req, res) => {
  const price = parseInt(req.query.price); // in dollars
  const amountInCents = price * 100;

  if (!price || price < 1) {
    return res.status(400).json({ error: 'Invalid price' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Membership Ticket - Minimum $${price}`,
          },
          unit_amount: amountInCents,
        },
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
        },
      }],
      success_url: 'https://pomegranate-guppy-ze9d.squarespace.com/thank-you-1?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://pomegranate-guppy-ze9d.squarespace.com/cancel',
    });

    res.redirect(303, session.url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create Stripe Checkout session' });
  }
});

app.get('/', (req, res) => {
  res.send('Stripe backend is running.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
