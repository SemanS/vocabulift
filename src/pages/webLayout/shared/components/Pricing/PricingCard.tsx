import React from "react";
import "./PricingComponent.less";
import { Typography } from "antd";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "../../common/Button";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const PricingCard = ({
  title,
  monthlyPrice,
  annualPrice,
  features,
  isMonthly,
  isPrimary,
  annualPriceId,
  monthlyPriceId,
}) => {
  const [cookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const cardStyle = isPrimary ? "card card-primary" : "card";

  const stripeApiKey = import.meta.env.VITE_REACT_APP_STRIPE_API_KEY;

  const stripePromise = loadStripe(stripeApiKey);

  const handleClick = async (event) => {
    const priceId = isMonthly ? monthlyPriceId : annualPriceId;
    console.log("priceId" + JSON.stringify(priceId, null, 2));
    // Call your backend to create the Checkout Session
    const response = await fetch(
      `${
        import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT
      }/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      }
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
      {cookies.access_token ? (
        <Button fixedWidth={true} onClick={handleClick}>
          {"CHECKOUT"}
        </Button>
      ) : (
        <Button
          fixedWidth={true}
          onClick={() => {
            navigate("/login");
          }}
        >
          {"Login or Register"}
        </Button>
      )}
    </div>
  );
};

export default PricingCard;
