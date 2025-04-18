require('dotenv').config();
const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Membership Access',
          },
          unit_amount: 1000, // $10 in cents
        },
        quantity: 1,
      }],
      success_url: 'https://pomegranate-guppy-ze9d.squarespace.com/account/login/create?',
      cancel_url: 'https://pomegranate-guppy-ze9d.squarespace.com/payment/cancel',
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
