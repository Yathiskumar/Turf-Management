import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import LoginPage from "./Login";

jest.mock("axios");

describe("LoginPage Component", () => {
  test("renders the login form fields correctly", () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );

    expect(screen.getByPlaceholderText("Enter Your Email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter Your Password")
    ).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Don't Have an Account?")).toBeInTheDocument();
  });

  test("updates input fields correctly", () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );

    const emailInput = screen.getByPlaceholderText(
      "Enter Your Email"
    ) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(
      "Enter Your Password"
    ) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  test("handles form submission successfully", async () => {
    (axios.post as jest.Mock).mockResolvedValue({
      status: 200,
      data: { token: "fake-token" },
    });

    render(
      <Router>
        <LoginPage />
      </Router>
    );

    const emailInput = screen.getByPlaceholderText(
      "Enter Your Email"
    ) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(
      "Enter Your Password"
    ) as HTMLInputElement;
    const submitButton = screen.getByText("Login");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        "https://localhost:7124/api/user/login",
        {
          Email: "test@example.com",
          Password: "password123",
        }
      )
    );

    expect(localStorage.getItem("token")).toBe("fake-token");
  });

  test("shows error alert if submission fails", async () => {
    (axios.post as jest.Mock).mockRejectedValue({
      response: { data: { message: "Login failed. Please try again later." } },
    });
    window.alert = jest.fn();
    console.error = jest.fn();

    render(
      <Router>
        <LoginPage />
      </Router>
    );

    const submitButton = screen.getByText("Login");

    await act(() => fireEvent.click(submitButton));
    expect(axios.post).toHaveBeenCalledTimes(2);

    expect(window.alert).toHaveBeenCalledWith(
      "Login failed. Please try again later."
    );
  });
});
