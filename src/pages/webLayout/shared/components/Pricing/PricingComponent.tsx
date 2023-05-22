import React, { useState } from "react";
import "./PricingComponent.less"; // Make sure to put your CSS in this file.
import PricingCard from "./PricingCard";

const PricingComponent = () => {
  const [monthly, setMonthly] = useState(false);

  const toggleMonthly = () => setMonthly(!monthly);

  const pricingData = [
    {
      title: "Basic",
      monthlyPrice: 19.99,
      annualPrice: 199.99,
      features: ["500 GB Storage", "2 Users Allowed", "Send up to 3 GB"],
    },
    {
      title: "Professional",
      monthlyPrice: 24.99,
      annualPrice: 249.99,
      features: ["1 TB Storage", "5 Users Allowed", "Send up to 10 GB"],
    },
    {
      title: "Master",
      monthlyPrice: 39.99,
      annualPrice: 399.99,
      features: ["2 TB Storage", "10 Users Allowed", "Send up to 20 GB"],
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
