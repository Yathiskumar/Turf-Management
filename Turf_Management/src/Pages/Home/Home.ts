import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: black;
    color: white;
    width: 101%;
    margin: 0;
    padding: 0;
    font-family: "Arial", sans-serif;
  }
`;

export const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const MainContent = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
  align-items: center;
  margin-top: 5%;
  margin-right: 10%;
  margin-left: 5%;
`;

export const TextContent = styled.div`
  margin-left: 5%;

  h1 {
    color: #333;
    line-height: 1.5;
  }
`;

export const FansLove = styled.h2`
  color: white;
  line-height: 1.3;
  margin-bottom: 4%;
  font-size: 35px;
`;

export const Paragraph = styled.p`
  color: rgb(151, 148, 148);
  font-size: 20px;
  width: 75%;
  line-height: 1.2;
  margin-bottom: 4%;
  word-spacing: 2px;
`;

export const ImageContent = styled.div`
  img {
    width: 120%;
    margin-left: 20%;
  }
`;

export const StartedButton = styled.button`
  background-color: #fc66c5;
  color: white;
  padding: 15px 60px;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  margin-left: 10%;

  &:hover {
    background-color: #fd88d2;
  }
`;
