import React from "react";
import { Link } from "react-router-dom";

export const MenuItemLink = ({ menuItemProps, defaultDom, isUnderlined }) => {
  const linkStyle = {
    fontWeight: "400",
    fontSize: "16px",
    textDecoration: isUnderlined ? "underline" : "none",
    textDecorationColor: isUnderlined ? "#3E475E" : "inherit", // Set underline color
    textDecorationThickness: isUnderlined ? "2px" : "initial", // Set underline thickness
    textUnderlineOffset: isUnderlined ? "10px" : "initial", // Set underline offset
  };

  return (
    <Link to={menuItemProps.path!} style={linkStyle}>
      {defaultDom}
    </Link>
  );
};
