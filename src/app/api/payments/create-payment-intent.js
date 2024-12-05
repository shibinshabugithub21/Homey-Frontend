// import { metadata } from '@/app/layout';
// import Stripe from 'strip'
// const stripe =new Stripe(process.env.STRIPE_SECRET_KEY);
// export default async function handler(req, res) {
//     if (req.method === 'POST') {
//         const { amount, currency } = req.body;

//         try {
//             const paymentIntent = await stripe.paymentIntents.create({
//                 amount,
//                 currency,
//                 metadata: { integration_check: 'accept_a_payment' },
//             });

//             res.status(200).json({ clientSecret: paymentIntent.client_secret });
//         } catch (error) {
//             console.error('Error creating payment intent:', error);
//             res.status(500).json({ error: error.message });
//         }
//     } else {
//         res.setHeader('Allow', ['POST']);
//         res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
// }
    
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { amount, currency } = req.body; // Amount in INR (in paise)

        const options = {
            amount: amount * 100, // Convert amount to paise
            currency: currency || 'INR',
            receipt: `receipt_order_${new Date().getTime()}`,
        };

        try {
            const order = await razorpay.orders.create(options);
            res.status(200).json(order);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create order' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
