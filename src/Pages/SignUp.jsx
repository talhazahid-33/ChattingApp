import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const validate = () => {
    let inputErrors = {};
    if (!formData.username) inputErrors.username = "Username is required";

    if (!formData.email) {
      inputErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      inputErrors.email = "Email address is invalid";
    }

    if (!formData.password) {
      inputErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      inputErrors.password = "Password must be at least 6 characters long";
    }

   
    setErrors(inputErrors);
    return Object.keys(inputErrors).length === 0;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (validate()) {
      console.log("Form submitted ", formData);
      try {
        await axios
          .post("http://localhost:8000/signup", formData)
          .then((res) => {
            if (res.status === 400) {
              alert("User Already Exists");
            } else if (res.status === 200) {
              localStorage.setItem("email", formData.email);
              localStorage.setItem("username", formData.username);
              navigate("/chat");
            }
            else{
              alert("SignUp failed")
            }
          });
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log("Form has errors");
    }
  }


  return (
    <div className="background-div">
      <form className="formStyle" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter Username"
            id="username"
            name="username"
            className="form-control"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>

        <div className="form-group">
          <input
            placeholder="Enter Email"
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <input
            placeholder="Enter Password"
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

       
        <div>
          <button className="btn btn-primary" type="submit">
            Sign Up
          </button>
          <br></br>
          <span>Already have an account ? </span>
          <Link to="/">Login</Link>
          <br></br>
        </div>
      </form>
    </div>
  );
};

export default Signup;
