const express = require('express');
const stripe = require('stripe')('sk_test_yourSecretKey');  // Replace with your Stripe secret key
const app = express();

app.use(express.json());

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
