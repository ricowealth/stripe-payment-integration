const express = require('express');
const stripe = require('stripe')('sk_test_yourSecretKey');  // Replace with your Stripe secret key
const path = require('path');  // For serving static files

const app = express();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle GET request for the root path and send the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.json());

// Endpoint to create Stripe checkout session
app.post('/create-checkout-session', async (req, res) => {
  const { email, amount } = req.body;

  try {
    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Custom Membership Access',
          },
          unit_amount: amount,  // amount in cents
        },
        quantity: 1,
      }],
      customer_email: email, // Attach the customer email to the session
      success_url: 'https://pomegranate-guppy-ze9d.squarespace.com/thank-you-1',
      cancel_url: 'https://pomegranate-guppy-ze9d.squarespace.com/payment/cancel',
    });

    // Send the session ID back to the frontend
    res.json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
