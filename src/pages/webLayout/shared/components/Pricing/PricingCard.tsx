import React from "react";
import "./PricingComponent.less";
import { Typography } from "antd";

const PricingCard = ({
  title,
  monthlyPrice,
  annualPrice,
  features,
  isMonthly,
  isPrimary,
}) => {
  const cardStyle = isPrimary ? "card card-primary" : "card";

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
      <a href="#" className="btn">
        Learn More
      </a>
    </div>
  );
};

export default PricingCard;
