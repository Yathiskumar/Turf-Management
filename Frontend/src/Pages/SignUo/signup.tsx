import React, { useState } from "react";
import axios from "axios";
import { InputType, LoginButton, LoginContainer } from "../Login/styles.ts";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { Name, Email, Password, confirmPassword } = formData;

    if (!Name.trim()) {
      alert("Name should not be empty");
      return;
    }

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(Email)) {
      alert("Invalid email format");
      return;
    }

    if (Password.length < 8) {
      alert("Password length must be greater than 8 characters");
      return;
    }

    if (Password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const payload = { Name, Email, Password };

      const response = await axios.post(
        "https://localhost:7124/api/user/register",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Registration successful! Please log in.");
        setFormData({
          Name: "",
          Email: "",
          Password: "",
          confirmPassword: "",
        });
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Error creating account. Please try again later.";
      alert(errorMessage);
    }
  };

  return (
    <LoginContainer>
      <form onSubmit={handleSubmit}>
        <InputType
          type="text"
          name="Name"
          placeholder="Enter Your Name"
          value={formData.Name}
          onChange={handleChange}
        />
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
        <InputType
          type="password"
          name="confirmPassword"
          placeholder="Confirm Your Password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <LoginButton type="submit">Create An Account</LoginButton>
      </form>
    </LoginContainer>
  );
};

export default Signup;
