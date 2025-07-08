import React, { useState } from "react";
import { InputType, LoginButton, LoginContainer, SignUpLink } from "./styles";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { Email, Password } = formData;

    try {
      const payload = { Email, Password };
      const response = await axios.post(
        "https://localhost:7124/api/user/login",
        payload
      );

      if (response.status === 200 || response.status === 201) {
        // alert('Login successful!');
        setFormData({ Email: "", Password: "" });
        localStorage.setItem("token", response.data.token);
        console.log(localStorage.getItem("token"));
        navigate("/");
      }
    } catch (error) {
      console.error("Error during login:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please try again later.";
      alert(errorMessage);
    }
  };

  return (
    <div className="page-wrapper">
      <LoginContainer>
        <form onSubmit={handleSubmit}>
          <InputType
            type="text"
            name="Email"
            placeholder="Enter Your Email"
            value={formData.Email}
            onChange={handleChange}
          />
          <InputType
            type="password"
            name="Password"
            placeholder="Enter Your Password"
            value={formData.Password}
            onChange={handleChange}
          />
          <LoginButton type="submit">Login</LoginButton>
        </form>
        <SignUpLink as={Link} to="/signup">
          Don't Have an Account?
        </SignUpLink>
      </LoginContainer>
    </div>
  );
};

export default LoginPage;
