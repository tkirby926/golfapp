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
  const timeid = props.timeid;
  const course_id = props.course_id;
  const num_users = props.num_users;
  const cost = props.cost;
  const elements = useElements();
  var error = ""
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }
    fetch(UserProfile.getUrl() + "/api/v1/payment_confirmed/" + timeid, { credentials: 'same-origin', method: 'PUT' })
    .then(response => response.json())
    .then((data) => {
      error = data.message
    })

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({  numusers: num_users,
                                    course: course_id,
                                    time: timeid,
                                    cost: props.cost,
                                    secret: clientSecret})
          }
          fetch(UserProfile.getUrl() + '/api/v1/add_receipt', requestOptions)
          .then(response => response.json())
          .then((data) => {
              
          });  
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          fetch(UserProfile.getUrl() + '/api/v1/payment_error/' + timeid, { method: 'PUT', headers: { 'Content-Type': 'application/json' }})
          .then(response => response.json())
          .then((data) => {
              if (data.error !== "") {
                return;
              }
          });  
          break;
        default:
          fetch(UserProfile.getUrl() + '/api/v1/payment_error/' + timeid, { method: 'PUT', headers: { 'Content-Type': 'application/json' }})
          .then(response => response.json())
          .then((data) => {
              if (data.error !== "") {
                return;
              }
          });  
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetch(UserProfile.getUrl() + '/api/v1/remove_time_spot/' + timeid,{ method: 'PUT', headers: { 'Content-Type': 'application/json' }})
    .then(response => response.json())
    .then((data) => {
        if (data.error !== "") {
          return;
        }
    });  

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "/thank_you/" + this.props.timeid,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" className="form_payment" onSubmit={handleSubmit} style={{justifyContent: 'center', alignContent: 'center', display: 'inline-block'}}>
      <PaymentElement id="payment-element" />
      <button class="button" disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}