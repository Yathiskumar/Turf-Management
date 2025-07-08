import styled from "styled-components";

export const Block = styled.div`
margin-top:2%;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  padding: 5%;
  min-height: 100vh;
  background-color: #f5f5f5;
  gap:50px;
`;

export const Box = styled.div`
  background: white;
  height: 360px;
  width: 27%;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 15px;
  margin: 4% 0;
  cursor: pointer;
  position: relative;


  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.15);
  }
`;

export const Image = styled.img`
  width: 100%;
  height: 230px;
  border-radius: 10px;
  object-fit: cover;
`;

export const InfoWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: left;
  padding: 10px;
`;

export const Titled = styled.h2`
  font-size: 16px;
  font-weight: bold;
  color: #2c3e50;
  font-family: "Lato", sans-serif;
  margin: 5px 0;
`;

export const Button = styled.button`
  background-color: rgb(41, 185, 79);
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  position: absolute;
  right: 30px;
  top: 80%;
  transform: translateY(-50%); /* Centers button vertically */

  &:hover {
    background-color:rgb(41, 185, 79);
    transform: translateY(-50%) scale(1.05);
  }
`;
