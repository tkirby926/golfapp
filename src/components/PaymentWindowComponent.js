import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./PaymentCheckoutForm";
import "./css/PaymentWindowComponent.css";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe("pk_test_51LIIQAG2PmM18WKOjDZkqBRW43SruZGQqBg2E5wFMjKujmDFb3Ik8zcrsidQS3NXtL8waAaVLH3eYaPsmoQsgLk100v5pWMotQ");

export default function PaymentWindowComponent() {
  const [user, setUser] = useState("");
  if (user === "null") {
    window.location.assign('/login?return_url=' + window.location.pathname);
  }
  const [clientSecret, setClientSecret] = useState("");
  const [cost, setCost] = useState("");
  const [course_info, setCourseInfo] = useState("");
  const timeid = window.location.href.split('/').pop()

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch(UserProfile.getUrl() + "/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 'timeid': timeid}),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setCost(data.cost);
        setCourseInfo(data.course_info);
      })
  }, []);

  const tax = (cost*.0816).toFixed(2);
  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  function returnToHome(e) {
    e.preventDefault();
    window.location.assign('/tee_time/' + timeid);
  }

  return (
    <div className="App">
        <div>
        <button style={{marginTop: '5vh', width: '100px', marginLeft: '15vw', marginBottom: '5vh'}} onClick={(event) => returnToHome(event)} class="button">Cancel</button>
        </div>
        <h1>{course_info[0]}</h1><br></br>
        {/* <p>{course_info[5]}</p><br></br> */}
        <h3>Tee time cost: ${cost}</h3>
        <h3>taxes and fees: ${tax}</h3>
        <h3>Subtotal: ${parseFloat(cost) + parseFloat(tax)}</h3>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm timeid={timeid} course_id = {course_info[0]}/>
        </Elements>
      )}
    </div>
  );
}