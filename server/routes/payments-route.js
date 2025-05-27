const router = require('express').Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const { authenticateToken } = require('./userAuth-route');

router.post('/create-payment-intent', authenticateToken, async (req, res) => {
    try {
        const { amount } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'ron',
            metadata: { userId: req.user.id },
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Unable to create payment.' });
    }
});

module.exports = router;
