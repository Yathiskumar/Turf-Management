import styled from "styled-components";

export const Container = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
  background-color: #f8f9fa;
  width: 95vw;
`;

export const SlotContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

export const HeaderSection = styled.div`
  text-align: center;
  margin-top: 70px;
`;

export const HeaderTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
`;

export const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  gap: 20px;
  margin-top: 10%;
`;

export const LeftColumn = styled.div`
  flex: 1;
  padding: 20px;
`;

export const VenueImage = styled.img`
  width: 750px;
  height: 400px;
  border-radius: 10px;
`;

export const RightColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const InfoContainer = styled.div`
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 90%;
`;

export const InfoTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const SportsContainer = styled.div`
  display: flex;
  gap: 10px;
`;

export const SportsImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #ddd;
`;

export const BookButton = styled.button`
  background-color: rgb(23, 204, 120);
  color: white;
  padding: 16px 15px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  // width:80%;
  // margin-left: 5%;
`;

export const Heading = styled.h3`
  font-size: 20px;
  font-weight: bold;
`;

export const SlotHeader = styled.h4`
  font-size: 1.2rem;
  font-weight: bold;
`;

export const SlotsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const Slot = styled.div`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
`;

export const FeedbackContainer = styled.div`
  margin-top: 30px;
`;

export const FeedbackTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const FeedbackList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

export const FeedbackItem = styled.li`
  padding: 8px;
  border-bottom: 1px solid #ddd;
`;

export const AddButton = styled.button`
  margin-top: 10px;
  padding: 10px;
  font-size: 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

export const FeedbackForm = styled.form`
  margin-top: 10px;
`;

export const FeedbackInput = styled.input`
  padding: 10px;
  width: 100%;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

export const NumberInput = styled.input`
  padding: 8px;
  width: 50%;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalContent = styled.div`
  background: white;
  width: 30%;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  position: relative;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
`;

export const RescheduleInput = styled.input`
  width: 80%;
  padding: 5px;
  font-size: 14px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export const WeekInput = styled.input`
  width: 50px;
  padding: 3px;
  font-size: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-left: 5px;
`;

export const SlotButton = styled.button`
  background: ${(props) => (props.selected ? "lightgreen" : "transparent")};
  border: 1px solid #007bff;
  color: #007bff;
  padding: 3px 6px;
  font-size: 12px;
  margin: 3px;
  cursor: pointer;
  border-radius: 3px;

  &:hover {
    background: #007bff;
    color: white;
  }
`;

export const SubmitButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background: #0056b3;
  }
`;

export const CancelButton = styled.button`
  background: #ccc;
  color: black;
  border: none;
  padding: 5px 10px;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 5px;

  &:hover {
    background: #999;
  }
`;

export const Buttons = styled.button`
  flex: 1;
  background-color: ${(props) => (props.red ? "#ff4d4d" : "#4caf50")};
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => (props.red ? "#cc0000" : "#388e3c")};
  }
`;

export const Scroll = styled.div``;
