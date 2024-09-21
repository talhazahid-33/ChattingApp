import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LogIn = () => {
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post("http://localhost:8000/login", {
          email: formData.email,
          password: formData.password,
        })
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data);
            localStorage.setItem("email", formData.email);
            localStorage.setItem("username", res.data.data[0].username);
            navigate("/chat");
          } else if (res.status === 404) {
            alert("Invalid Credentials");
          } else {
            alert("No such User Exists");
          }
        })
        .catch((e) => {
          alert("Some error occured");
          console.log(e);
        });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="background-div">
      <form className="formStyle" onSubmit={handleSubmit}>
        <div>
          <h2>Log In</h2>
          <h2>Welcome</h2>
        </div>
        <div className="form-group">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter Email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter Password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button
          style={{ marginTop: "20px" }}
          className="btn btn-primary"
          type="submit"
        >
          Log In
        </button>
        <br></br>
        <div>
          <Link to="/signup">SignUp</Link>
          <br></br>
          <Link to="/forget">Forget Password?</Link>
        </div>
      </form>
    </div>
  );
};

export default LogIn;
