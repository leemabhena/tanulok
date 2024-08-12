import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer-text">&copy; Tanulok {new Date().getFullYear()}</p>
    </footer>
  );
};

export default Footer;
