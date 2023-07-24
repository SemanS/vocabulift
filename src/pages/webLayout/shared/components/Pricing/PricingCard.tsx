import React from "react";
import "./PricingComponent.less";
import { Typography } from "antd";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "../../common/Button";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "@/stores/user";
import { SubscriptionPeriod, SubscriptionType } from "@/models/user";

declare global {
  interface Window {
    Rewardful: any;
  }
}

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
  const [user, setUser] = useRecoilState(userState);

  const stripeApiKey = import.meta.env.VITE_REACT_APP_STRIPE_API_KEY;

  const stripePromise = loadStripe(stripeApiKey);

  function getClientReferenceId() {
    return (
      (window.Rewardful && window.Rewardful.referral) ||
      "checkout_" + new Date().getTime()
    );
  }

  const titleToSubscriptionType = {
    Explorer: SubscriptionType.Free,
    Linguist: SubscriptionType.Linguist,
    Polyglot: SubscriptionType.Polyglot,
    // add more if you have more types
  };

  const getSubscriptionValue = (
    type: SubscriptionType,
    period: SubscriptionPeriod
  ) => {
    // Let's assume that an Annual subscription is always a higher level than a Monthly subscription,
    // and the enum values for SubscriptionType are in ascending order
    const typeValue = Object.values(SubscriptionType).indexOf(type);
    const periodValue = period === SubscriptionPeriod.Annual ? 1 : 0;
    return typeValue * 10 + periodValue; // This assumes you won't have more than 10 subscription types
  };

  const getButtonLabel = () => {
    const cardSubscriptionType =
      titleToSubscriptionType[title as keyof typeof titleToSubscriptionType];
    const userSubscriptionValue = getSubscriptionValue(
      user.subscriptionType,
      user.subscriptionPeriod
    );
    const cardSubscriptionValue = getSubscriptionValue(
      cardSubscriptionType,
      isMonthly ? SubscriptionPeriod.Monthly : SubscriptionPeriod.Annual
    );

    // Return "Current Plan" for both monthly and annual subscriptions in case of free subscription
    if (cardSubscriptionType === SubscriptionType.Free) {
      return "Current Plan";
    }

    if (userSubscriptionValue < cardSubscriptionValue) {
      return "Upgrade";
    }
    if (userSubscriptionValue > cardSubscriptionValue) {
      return "Downgrade";
    }
    return "Current Plan";
  };

  const cancelSubscription = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT}/cancel-subscription`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.access_token}`,
        },
        body: JSON.stringify({
          subscriptionId: user.subscriptionId,
        }),
      }
    );

    if (response.ok) {
      const updatedUser = await response.json();
      setUser(updatedUser);
    } else {
      console.error("Failed to cancel subscription");
    }
  };

  const handleClick = async (event) => {
    const priceId = isMonthly ? monthlyPriceId : annualPriceId;
    // Call your backend to create the Checkout Session
    const clientReferenceId = getClientReferenceId();
    const response = await fetch(
      `${
        import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT
      }/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.access_token}`,
        },
        body: JSON.stringify({
          priceId,
          clientReferenceId: clientReferenceId,
        }),
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

  const buttonLabel = getButtonLabel();
  const isDisabled = buttonLabel === "Current Plan";

  const shouldShowCancelButton = () => {
    const cardSubscriptionType =
      titleToSubscriptionType[title as keyof typeof titleToSubscriptionType];
    return (
      user.subscriptionType === cardSubscriptionType &&
      user.subscriptionType !== SubscriptionType.Free
    );
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
      {cookies.access_token && shouldShowCancelButton() ? (
        <Button fixedWidth={true} onClick={cancelSubscription}>
          {"Cancel Subscription"}
        </Button>
      ) : null}
      {cookies.access_token ? (
        <Button
          fixedWidth={true}
          onClick={handleClick}
          disabled={buttonLabel === "Current Plan"}
        >
          {buttonLabel}
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
