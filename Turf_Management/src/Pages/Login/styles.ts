import styled from "styled-components";

export const Body = styled.body`
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(0, 230, 81);
`;

export const LoginContainer = styled.div`
  margin-left: 85%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px; 
  height: 400px;
  padding: 30px;
  border-radius: 10px;
  background-image: url("/login-bg.jpg");
  background-size: cover;
  background-position: center;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(
    10px
  ); 
`;

export const InputType = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 50px;
  border: 1px solid #ccc;
  font-size: 16px;
  text-align: center;
  outline: none;
  transition: all 0.3s ease-in-out;

  &:focus {
    border-color: #4caf50;
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.8);
  }

  ::placeholder {
    color: #aaa;
  }
`;

export const LoginButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }

  &:focus {
    outline: none;
  }
`;

export const SignUpLink = styled.a`
  text-decoration: none;
  color: rgb(129, 76, 175);
  margin-top: 15px;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`;
