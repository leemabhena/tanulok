import {
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Alert,
} from "@mui/material";
import React, { useState, useContext } from "react";
import { firestore, auth } from "../firebase";
import { validateEmail } from "../utils";
import { UserContext } from "./UserContext";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  if (user) navigate("/dashboard/courses");

  const [isLogin, setLogin] = useState(true);

  return (
    <div className="auth-container">
      <Grid container>
        <Grid item md={6}>
          <div className="auth-image"></div>
        </Grid>

        <Grid item md={6}>
          {isLogin ? (
            <Login setLogin={setLogin} />
          ) : (
            <Register setLogin={setLogin} />
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Auth;

const Login = ({ setLogin }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { email, password } = formData;
    if (!email || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      setLoading(false);
      return;
    }

    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      setUser(user);

      // navigate to the dashboard courses
      navigate("/dashboard/courses");

      setLoading(false);
    } catch (error) {
      console.error("Error  user: ", error);
      setError(`Error logging user user. ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-form">
        <h5 className="logo login-logo">
          Tan<span>ulok</span>
          {error && <Alert severity="error">{error}</Alert>}
        </h5>
        <h1 className="login-heading">Sign In</h1>
        <Button variant="outlined" className="google-sign-in">
          <i className="bx bxl-google"></i> - Sign in with Google
        </Button>
        <p className="login-or">or</p>
        <div className="login-textfields">
          <TextField
            label="Email"
            required
            focused
            className="login-text-field"
            value={formData.email}
            name="email"
            onChange={handleChange}
            type="email"
            sx={{
              "& .MuiOutlinedInput-root": {
                fontFamily: "Poppins",
                "& fieldset": {
                  borderColor: "#f1f1f1",
                },
                "&:hover fieldset": {
                  borderColor: "#f1f1f1",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#f1f1f1",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#000",
                fontFamily: "Poppins",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#000",
              },
            }}
          />
          <TextField
            label="Password"
            required
            focused
            className="login-text-field"
            value={formData.password}
            name="password"
            onChange={handleChange}
            type="password"
            sx={{
              "& .MuiOutlinedInput-root": {
                fontFamily: "Poppins",
                "& fieldset": {
                  borderColor: "#f1f1f1",
                },
                "&:hover fieldset": {
                  borderColor: "#f1f1f1",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#f1f1f1",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#000",
                fontFamily: "Poppins",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#000",
              },
            }}
          />
        </div>
        <div className="login-remember">
          <div className="remember-me">
            <FormControlLabel
              control={<Checkbox size="small" defaultChecked />}
              label=<span>Remember me</span>
            />
          </div>
          <a href="#" className="forgot-pass">
            Forgot Password?
          </a>
        </div>
        <div className="login-buttons">
          <Button
            variant="text"
            sx={{ fontFamily: "Poppins" }}
            onClick={() => setLogin(false)}
          >
            Create Account
          </Button>
          <Button
            variant="contained"
            sx={{ fontFamily: "Poppins" }}
            onClick={handleSubmit}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const Register = ({ setLogin }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    school: "",
    grade: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { name, lastName, email, school, grade, password, confirmPassword } =
      formData;
    if (
      !name ||
      !lastName ||
      !email ||
      !school ||
      !grade ||
      !password ||
      !confirmPassword
    ) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      setUser(user);

      await setDoc(doc(firestore, "students", user.uid), {
        name,
        lastName,
        email,
        school,
        grade,
        coursesEnrolled: [],
        completedCourses: [],
      });

      // navigate to the dashboard courses
      navigate("/dashboard/courses");

      setLoading(false);
    } catch (error) {
      console.error("Error creating user: ", error);
      setError(`Error creating user. ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="register-form">
        <h5 className="logo login-logo">
          Tan<span>ulok</span>
          {error && <Alert severity="error">{error}</Alert>}
        </h5>
        <h1 className="login-heading">Create account</h1>
        <Button variant="outlined" className="google-sign-in">
          <i className="bx bxl-google"></i> - Sign in with Google
        </Button>
        <p className="login-or">or</p>
        <div className="register-textfields">
          <div className="register-textfields-inline">
            <TextField
              label="Name"
              required
              focused
              value={formData.name}
              name="name"
              onChange={handleChange}
              className="login-text-field text-field-mr"
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontFamily: "Poppins",
                  "& fieldset": {
                    borderColor: "#f1f1f1",
                  },
                  "&:hover fieldset": {
                    borderColor: "#f1f1f1",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#f1f1f1",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#000",
                  fontFamily: "Poppins",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#000",
                },
              }}
            />
            <TextField
              label="Lastname"
              required
              focused
              value={formData.lastName}
              name="lastName"
              onChange={handleChange}
              className="login-text-field"
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontFamily: "Poppins",
                  "& fieldset": {
                    borderColor: "#f1f1f1",
                  },
                  "&:hover fieldset": {
                    borderColor: "#f1f1f1",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#f1f1f1",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#000",
                  fontFamily: "Poppins",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#000",
                },
              }}
            />
          </div>
          <TextField
            label="Email"
            required
            type="email"
            focused
            className="login-text-field"
            value={formData.email}
            name="email"
            onChange={handleChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontFamily: "Poppins",
                "& fieldset": {
                  borderColor: "#f1f1f1",
                },
                "&:hover fieldset": {
                  borderColor: "#f1f1f1",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#f1f1f1",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#000",
                fontFamily: "Poppins",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#000",
              },
            }}
          />
          <div className="register-textfields-inline">
            <TextField
              label="School"
              required
              focused
              value={formData.school}
              name="school"
              onChange={handleChange}
              className="login-text-field text-field-mr"
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontFamily: "Poppins",
                  "& fieldset": {
                    borderColor: "#f1f1f1",
                  },
                  "&:hover fieldset": {
                    borderColor: "#f1f1f1",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#f1f1f1",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#000",
                  fontFamily: "Poppins",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#000",
                },
              }}
            />
            <TextField
              label="Grade"
              required
              focused
              className="login-text-field"
              value={formData.grade}
              name="grade"
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontFamily: "Poppins",
                  "& fieldset": {
                    borderColor: "#f1f1f1",
                  },
                  "&:hover fieldset": {
                    borderColor: "#f1f1f1",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#f1f1f1",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#000",
                  fontFamily: "Poppins",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#000",
                },
              }}
            />
          </div>
          <div className="register-textfields-inline">
            <TextField
              label="Password"
              required
              focused
              className="login-text-field text-field-mr"
              value={formData.password}
              name="password"
              onChange={handleChange}
              type="password"
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontFamily: "Poppins",
                  "& fieldset": {
                    borderColor: "#f1f1f1",
                  },
                  "&:hover fieldset": {
                    borderColor: "#f1f1f1",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#f1f1f1",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#000",
                  fontFamily: "Poppins",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#000",
                },
              }}
            />
            <TextField
              label="Confirm password"
              required
              focused
              className="login-text-field"
              value={formData.confirmPassword}
              name="confirmPassword"
              onChange={handleChange}
              type="password"
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontFamily: "Poppins",
                  "& fieldset": {
                    borderColor: "#f1f1f1",
                  },
                  "&:hover fieldset": {
                    borderColor: "#f1f1f1",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#f1f1f1",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#000",
                  fontFamily: "Poppins",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#000",
                },
              }}
            />
          </div>
        </div>
        <div className="login-buttons">
          <Button
            variant="text"
            sx={{ fontFamily: "Poppins" }}
            onClick={() => setLogin(true)}
          >
            Sign in
          </Button>
          <Button
            variant="contained"
            sx={{ fontFamily: "Poppins" }}
            onClick={handleSubmit}
          >
            {loading ? "Creating Account..." : "Create account"}
          </Button>
        </div>
      </div>
    </div>
  );
};

function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}
