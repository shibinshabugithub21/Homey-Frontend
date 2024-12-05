// components/PaymentForm.js
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const PaymentForm = ({ amount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);

        try {
            // Create a payment intent on your server
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_Backend_Port}/create-payment-intent`, {
                amount,
                currency: 'inr', // Set your currency
            });

            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (stripeError) {
                setError(stripeError.message);
                setSuccess(false);
            } else if (paymentIntent.status === 'succeeded') {
                setSuccess(true);
                setError(null);
                // Optionally handle success (e.g., redirect or show a success message)
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe}>
                Pay
            </button>
            {error && <p>{error}</p>}
            {success && <p>Payment succeeded!</p>}
        </form>
    );
};

export default PaymentForm;
