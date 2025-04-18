require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Membership Access' },
          unit_amount: 1000, // $10 in cents
        },
        quantity: 1,
      }],
      success_url: 'https://pomegranate-guppy-ze9d.squarespace.com/thank-you-1',
cancel_url: 'https://pomegranate-guppy-ze9d.squarespace.com/payment-failed',  // Update with your cancel URL if applicable
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
