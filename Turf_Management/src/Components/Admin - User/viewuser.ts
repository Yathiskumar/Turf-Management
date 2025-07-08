import styled from "styled-components";

export const UserContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding: 16px;
  margin-top: 20px;
  margin-left: 3.5%;
  width: 94vw;
`;

export const UserCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  border-radius: 12px;
  position: relative;
  width: 340px;
  height: 150px;
`;

export const UserName = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

export const UserEmail = styled.p`
  font-size: 1rem;
  color: #555;
`;

export const Button = styled.button`
  background-color: #ff0000;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 8px;
  position: absolute;
  bottom: 8px;
  left: 140px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background-color: #e60000;
  }
`;

export const Image = styled.img`
  width: 50%;
  height: auto;
  border-radius: 8px;
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
`;
