import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

export default function PrimarySearchAppBar() {
  //   const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" noWrap>
            Google Cloud
          </Typography>
          <div />
          <div>
            <Typography variant="body1" style={{ padding: "0 10px" }}>
              Dashboard
            </Typography>
            <Typography variant="body1" style={{ padding: "0 10px" }}>
              Paths
            </Typography>
            <Typography variant="body1" style={{ padding: "0 10px" }}>
              Explore
            </Typography>
            <Typography variant="body1" style={{ padding: "0 10px" }}>
              Profile
            </Typography>
            <Typography variant="body1" style={{ padding: "0 10px" }}>
              Subscriptions
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleProfileMenuOpen}
            >
              {/* <AccountCircle /> */}
            </IconButton>
          </div>
          <div>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="open drawer"
              onClick={handleProfileMenuOpen}
            >
              {/* <MenuIcon /> */}
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </div>
  );
}
