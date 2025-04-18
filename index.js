const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const path = require('path');  // Import path module for serving static files

// Load environment variables from .env
require('dotenv').config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Use your Stripe secret key from the .env file

app.use(bodyParser.json());

// Serve the index.html page when accessing the root URL (/)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));  // Adjust path if needed
});

// Existing route for creating checkout session
app.post('/create-checkout-session', async (req, res) => {
    const { ticketCount } = req.body;

    const price = 33; // Define your base ticket price here
    const amount = price * ticketCount; // Calculate total amount based on ticket count

    // Create the Checkout session
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `${ticketCount} Ticket${ticketCount > 1 ? 's' : ''}`,
                        },
                        unit_amount: amount * 100, // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            allow_promotion_codes: true,
            success_url: 'https://pomegranate-guppy-ze9d.squarespace.com/thank-you-1?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'https://pomegranate-guppy-ze9d.squarespace.com/cancel',
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
