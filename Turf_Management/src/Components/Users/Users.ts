import styled from 'styled-components';
import { TurfBackGround, UserBackground } from '../../assets';

export const Box = styled.div`
background-color: #fff;
padding: 20px;
border: 1px solid #ddd;
border-radius: 10px;
width: 20%;
max-width: 500px;
height: 250px;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
display: flex;
flex-direction: column;
align-items: center;
gap: 10px;

@media (max-width: 768px) {
  width: 90%;
}
`;

export const Block = styled.div`
display: flex;
flex-wrap: wrap;
justify-content: center;
gap: 20px;
padding: 20px;
background-color: #f9f9f9;
min-height: 100vh;
margin-top: 10%;
width: 94.5vw;
`;


export const Names = styled.p`
font-size: 16px;
color: #333;
font-weight: 500;
`;

export const CancelContainer = styled.div`
display: flex;
justify-content: space-between;
width: 100%;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

export const CloseButton = styled.button`
  background: red;
  color: white;
  border: none;
  padding: 8px;
  cursor: pointer;
  float: right;
  border-radius: 5px;
`;

export const RescheduleInput = styled.input`
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin: 10px 0;
`;


