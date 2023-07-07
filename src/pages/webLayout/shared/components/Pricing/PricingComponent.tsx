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
      monthlyPrice: 9.99,
      annualPrice: 79.99,
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
    <div className="container text-center">
      <h6>Our Pricing</h6>
      <label className="pricing" onClick={toggleMonthly}>
        <span className="label">Annually</span>
        <span className={`switch ${monthly ? "monthly" : ""}`}>
          <span className="slider"></span>
        </span>
        <span className="label">Monthly</span>
      </label>
      <div className="card-group">
        {pricingData.map((data, index) => (
          <PricingCard
            key={index}
            {...data}
            isMonthly={monthly}
            isPrimary={index === 1}
          />
        ))}
      </div>
    </div>
  );
};

export default PricingComponent;
