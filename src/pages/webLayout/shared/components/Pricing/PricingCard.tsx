import React from "react";
import "./PricingComponent.less";
import { Typography } from "antd";
import { loadStripe } from "@stripe/stripe-js";

const PricingCard = ({
  title,
  monthlyPrice,
  annualPrice,
  features,
  isMonthly,
  isPrimary,
}) => {
  const cardStyle = isPrimary ? "card card-primary" : "card";

  const stripePromise = loadStripe(
    "pk_test_51NJch0AIigvyUQOLgpPpQDEtQl3z2fxvFFn9z7gDtU5UDo1B7LXUbilVfNA8Q6Mcx4zhR9V3rUA8NDKcRiVf1fIf00tVOS8aBu"
  );

  const handleClick = async (event) => {
    // Call your backend to create the Checkout Session
    const response = await fetch(
      `${
        import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT
      }/create-checkout-session`,
      { method: "POST" }
    );
    const session = await response.json();

    // When the customer clicks on the button, redirect them to Checkout.
    const stripe = await stripePromise;
    const { error } = await stripe!.redirectToCheckout({
      sessionId: session.id,
    });

    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    if (error) {
      console.warn("Error:", error);
    }
  };

  return (
    <div className={cardStyle}>
      <Typography.Title className="card-title">{title}</Typography.Title>
      <h3 className="card-price">
        <small>$</small>
        <span hidden={isMonthly}>{annualPrice}</span>
        <span hidden={!isMonthly}>{monthlyPrice}</span>
      </h3>
      <ul className="card-list">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <button role="link" onClick={handleClick}>
        Checkout
      </button>
      <a href="#" className="btn">
        Learn More
      </a>
    </div>
  );
};

export default PricingCard;
