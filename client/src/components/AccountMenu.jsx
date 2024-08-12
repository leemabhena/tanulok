import React, { useContext, useEffect, useState } from "react";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import { Button, Divider } from "@mui/material";
import { UserContext } from "./UserContext";
import { signOut } from "firebase/auth";
import { firestore, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { courseData, biology_data, addCourse } from "../utils";

const AccountMenu = ({ anchorEl, handleClose, open }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    getUserData();
    // addCourse(biology_data);
  }, []);

  const logout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/");
      })
      .catch((error) => {
        alert("There was an error signing out. Try again");
      });
  };

  const getUserData = async () => {
    const docRef = doc(firestore, "students", user.uid);
    const docSnap = await getDoc(docRef);
    setData(docSnap.data());
  };

  return (
    <div className="account-menu">
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div className="menu-profile-container">
          <div className="menu-profile-details">
            <div className="menu-avatar">
              <Avatar sx={{ width: "6rem", height: "6rem" }} />
            </div>
            <p className="menu-profile-name">{`${data?.name} ${data?.lastName}`}</p>
            <p className="menu-profile-email">{data?.email}</p>
            <p className="menu-profile-school">
              {`${data?.school} | Grade ${data?.grade}`}
            </p>
          </div>
          <div className="menu-profile-buttons">
            <Button variant="outlined" size="small">
              Profile
            </Button>
            <Button variant="outlined" size="small">
              Settings
            </Button>
          </div>
          <Divider />
          <div className="menu-profile-logout">
            <Button variant="contained" size="small" onClick={logout}>
              Sign Out
            </Button>
          </div>
        </div>
      </Menu>
    </div>
  );
};

export default AccountMenu;
