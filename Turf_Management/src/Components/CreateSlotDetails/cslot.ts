import styled from 'styled-components';
import { TurfBackGround } from '../../assets';

export const Outline = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height : 100vh;
  width: 98vw;
  background-color: rgb(209, 221, 196);
  padding: 20px;
`;

export const Input = styled.input`
  width: 40%;
  height: 40px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  padding: 10px;
  font-size: 16px;
  background-color: #ffffff;
  transition: all 0.3s ease;

  &:focus {
    border-color: #3b82f6;
    outline: none;
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
  }
`;

export const Select = styled.select`
  width: 20%;
  height: 40px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  padding: 14px;
  font-size: 8px;
  background-color: #ffffff;
`;

export const SelectedList = styled.div`
  margin-top: 10px;
  text-align: left;
`;

export const SelectedValue = styled.p`
  color: #333;
  font-size: 14px;
   font-family: 'Poppins', sans-serif;
  margin: 5px 0;
  color : pink;
`;

export const Button = styled.button`
  width: 100%;
  height: 45px;
  background-color: #3b82f6;
  color: white;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s ease;
  &:hover {
    background-color: #2563eb;
  }
`;

