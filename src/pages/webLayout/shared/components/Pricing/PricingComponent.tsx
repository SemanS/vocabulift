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
        "Access to Beginner-Level Videos",
        "Basic Transcript Interaction",
        "Limited Vocabulary Lists",
      ],
    },
    {
      title: "Linguist",
      monthlyPrice: 4.99,
      annualPrice: 39.99,
      features: [
        "Access to All Level Videos",
        "Full Transcript Interaction",
        "Unlimited Vocabulary Lists",
        "Access to Community Forum",
      ],
    },
    {
      title: "Polyglot",
      monthlyPrice: 6.99,
      annualPrice: 59.99,
      features: [
        "Access to All Level Videos",
        "Full Transcript Interaction",
        "Unlimited Vocabulary Lists",
        "Priority Access to New Features",
        "Dedicated Language Learning Support",
      ],
    },
  ];

  return (
    <div className="container text-center">
      <h1>Our Pricing</h1>
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
