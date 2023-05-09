import React, { useEffect, useState } from "react";
import "./css/PaymentWindowComponent.css"
import UserProfile from './Userprofile';

import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

export default function CheckoutForm(props) {
  const stripe = useStripe();
  const elements = useElements();
  const timeid = props.timeid;
  const course_id = props.course_id;
  const num_users = props.num_users;
  const cost = props.cost;
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState(null);

  useEffect(() => {
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (clientSecret && stripe) {
      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        setPaymentIntent(paymentIntent);
      });
    }
  }, [stripe]);

  const handlePayment = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        course: course_id,
        time: timeid,
        cost: cost,
        secret: paymentIntent.client_secret,
        intentid: paymentIntent.id,
      }),
    };

    fetch(UserProfile.getUrl() + "/api/v1/add_receipt", requestOptions)
      .then((response) => response.json())
      .then((data) => {})
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !paymentIntent) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment(paymentIntent.client_secret, {
      payment_method: {
        card: elements.getElement(PaymentElement),
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Payment succeeded!");
      handlePayment();
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" className="form_payment" onSubmit={handleSubmit} style={{justifyContent: 'center', alignContent: 'center', display: 'inline-block'}}>
      <PaymentElement id="payment-element" />
      <button className="button" disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}