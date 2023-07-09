import React, { useState } from "react";
import "./PricingComponent.less"; // Make sure to put your CSS in this file.
import PricingCard from "./PricingCard";

const PricingComponent = () => {
  const [monthly, setMonthly] = useState(false);

  const toggleMonthly = () => setMonthly(!monthly);

  const pricingData = [
    {
      title: "Explorer",
      monthlyPrice: 0,
      annualPrice: 0,
      annualPriceId: "",
      monthlyPriceId: "",
      features: [
        "3-minute access to videos per day",
        "Up to 100 words/phrases translation",
        "No access to worksheets",
        "No access to words/phrases meaning",
        "No access to words/phrases alternatives",
      ],
    },
    {
      title: "Linguist",
      monthlyPrice: 0.01,
      annualPrice: 79.99,
      annualPriceId: import.meta.env.VITE_REACT_APP_LINGUIST_ANNUAL_PRICE_ID,
      monthlyPriceId: import.meta.env.VITE_REACT_APP_LINGUIST_MONTHLY_PRICE_ID,
      features: [
        "Unlimited access to all videos",
        "Unlimited words/phrases translation",
        "Access to worksheets",
        "500 words/phrases meaning monthly",
        "500 words/phrases alternatives monthly",
      ],
    },
    {
      title: "Polyglot",
      monthlyPrice: 14.99,
      annualPrice: 119.99,
      annualPriceId: import.meta.env.VITE_REACT_APP_POLYGLOT_ANNUAL_PRICE_ID,
      monthlyPriceId: import.meta.env.VITE_REACT_APP_POLYGLOT_MONTHLY_PRICE_ID,
      features: [
        "Unlimited access to all videos",
        "Unlimited words/phrases",
        "Access to worksheets",
        "Unlimited words/phrases meaning",
        "Unlimited words/phrases alternatives",
      ],
    },
  ];

  return (
    <div className="container text-center" id="pricing">
      <h6>Our Pricing</h6>
      <label className="pricing" onClick={toggleMonthly}>
        <span className="label">Monthly</span>
        <span className={`switch ${monthly ? "monthly" : ""}`}>
          <span className="slider"></span>
        </span>
        <span className="label">Annually</span>
      </label>
      <div className="card-group">
        {pricingData.map((data, index) => (
          <PricingCard
            key={index}
            {...data}
            isMonthly={!monthly}
            isPrimary={index === 1}
            annualPriceId={data.annualPriceId}
            monthlyPriceId={data.monthlyPriceId}
          />
        ))}
      </div>
    </div>
  );
};

export default PricingComponent;
