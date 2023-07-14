import React from "react";
import { Link } from "react-router-dom";

export const MenuItemLink = ({ menuItemProps, defaultDom, isUnderlined }) => {
  return (
    <Link
      to={menuItemProps.path!}
      style={{
        fontWeight: "400",
        fontSize: "16px",
        textDecoration: isUnderlined ? "underline" : "none",
        color: isUnderlined ? "underline" : "none",
      }}
    >
      {defaultDom}
    </Link>
  );
};
