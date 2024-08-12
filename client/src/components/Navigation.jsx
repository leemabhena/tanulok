import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Avatar from "@mui/material/Avatar";
import React, { useState } from "react";
import { IconButton } from "@mui/material";
import AccountMenu from "./AccountMenu";
import { useNavigate } from "react-router-dom";

function Navigation() {
  const [activeLink, setActiveLink] = useState("Courses");
  const navigate = useNavigate();

  const handleLinkClick = (link, url) => {
    setActiveLink(link);
    navigate(url);
  };

  // Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="navigation">
      <div className="logo-container">
        <h6 className="logo">
          Tan<span>ulok</span>
        </h6>
      </div>
      <ul className="navigation-links">
        <li
          className={`nav-link ${activeLink === "Dashboard" ? "active" : ""}`}
          onClick={() => handleLinkClick("Dashboard", "/dashboard")}
        >
          Dashboard
        </li>
        <li
          className={`nav-link ${activeLink === "Courses" ? "active" : ""}`}
          onClick={() => handleLinkClick("Courses", "/dashboard/courses")}
        >
          Courses
        </li>
        <li
          className={`nav-link ${activeLink === "Study AI" ? "active" : ""}`}
          onClick={() => handleLinkClick("Study AI", "/dashboard/ai")}
        >
          Study AI
        </li>
        <li
          className={`nav-link ${activeLink === "Profile" ? "active" : ""}`}
          onClick={() => handleLinkClick("Profile", "/dashboard/profile")}
        >
          Profile
        </li>
        <li
          className={`nav-link ${
            activeLink === "Subscription" ? "active" : ""
          }`}
          onClick={() =>
            handleLinkClick("Subscription", "/dashboard/subscription")
          }
        >
          Subscription
        </li>
      </ul>
      <div className="navigation-profile">
        <ButtonGroup variant="outlined" className="nav-button-group">
          <Button>
            <i className="fa-solid fa-star"></i>
            <span className="nav-points">1024</span>
          </Button>
          <Button>
            <span className="ranking">5th</span>
          </Button>
        </ButtonGroup>
        <div className="profile-image">
          <IconButton
            onClick={handleClick}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar />
          </IconButton>
          <AccountMenu
            anchorEl={anchorEl}
            handleClose={handleClose}
            open={open}
          />
        </div>
      </div>
    </div>
  );
}
export default Navigation;
