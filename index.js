require('dotenv').config();
const express = require('express');  // This should be declared once
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { email, amount } = req.body;  // Extract email and amount from the request

    // Create a new Stripe checkout session with dynamic amount
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Custom Membership Access',
          },
          unit_amount: amount,  // Use the custom amount in cents
        },
        quantity: 1,
      }],
      customer_email: email,  // Set the email address of the customer
      success_url: 'https://pomegranate-guppy-ze9d.squarespace.com/thank-you-1',
      cancel_url: 'https://pomegranate-guppy-ze9d.squarespace.com/payment/cancel',
    });

    // Respond with the checkout session URL
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
