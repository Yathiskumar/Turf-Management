import styled from "styled-components";

export const Container = styled.div`
  padding-left: 40%;
  background-color: white;
  width: 698px;
  margin-top: 100px;
`;

export const Title = styled.h1`
  text-align: center;
  font-size: 32px;
  color: #333;
  width: 90vw;
  margin-top: 100px;
  margin-left: 3%;
`;

export const TurfsContainer = styled.div`
  padding-left: 10%;
  margin-top: 1%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 100%;
  gap: 50px;
`;

export const TurfCard = styled.div`
  width: 300px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  box-sizing: border-box;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-10px);
  }
`;

export const TurfTitle = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 15px;
`;

export const TurfImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
`;

export const DeleteButton = styled.button`
  background-color: #ff4d4f;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-right: 10px;

  &:hover {
    background-color: #e84141;
  }
`;

export const NoTurfsMessage = styled.p`
  text-align: center;
  font-size: 18px;
  color: #888;
  /* width: 100%; */
  margin-left: 500px;
`;

export const Button = styled.button`
  background-color: rgba(41, 223, 47, 0.87);
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-left: -100px;
  transition: background-color 0.3s ease;
  margin-left: -200px;
  &:hover {
    background-color: rgb(65, 232, 193);
  }
`;
