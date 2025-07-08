import React, { useState } from "react";
import styled from "styled-components";
import authAxios from "../api";
import { Modele } from "./Alert/Alert";

const ModalOverlay = styled.div`
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

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  margin-top: 10%;

  &::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`;

const CloseButton = styled.button`
  background: red;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 10px;
  border-radius: 5px;
`;

const SaveButton = styled.button`
  background: green;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  width: 100%;
  margin-top: 10px;
`;

const FormGroup = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.label`
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;
const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const SelectedList = styled.div`
  margin-top: 5px;
  padding: 5px;
  background: #f1f1f1;
  border-radius: 4px;
`;

const SelectedItem = styled.span`
  display: inline-block;
  margin-right: 5px;
  background: lightblue;
  padding: 5px;
  border-radius: 4px;
`;

interface Props {
  turf: {
    id: string;
    name: string;
    price: number;
    location: string;
    contactNumber: string;
    sports: string[];
    slots: string[];
  };
  onClose: () => void;
}

const TurfUpdateModal: React.FC<Props> = ({ turf, onClose }) => {
  const [turfName, setTurfName] = useState(turf.name);
  const [location, setLocation] = useState(turf.location);
  const [phoneNumber, setPhoneNumber] = useState(turf.contactNumber);
  const [price, setPrice] = useState(turf.price);
  const [description, setDescription] = useState(turf.description);
  const [selectedSports, setSelectedSports] = useState<string[]>(turf.sports);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>(
    turf.slots
  );
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const sportsOptions = ["Cricket", "Football", "Tennis", "Badminton"];
  const timeSlots = Array.from(
    { length: 24 },
    (_, i) =>
      `${String(i).padStart(2, "0")}:00 - ${String((i + 1) % 24).padStart(
        2,
        "0"
      )}:00`
  );

  const removeSelectedSport = (sportToRemove: string) => {
    setSelectedSports(
      selectedSports.filter((sport) => sport !== sportToRemove)
    );
  };

  const removeSelectedTimeSlot = (timeToRemove: string) => {
    setSelectedTimeSlots(
      selectedTimeSlots.filter((time) => time !== timeToRemove)
    );
  };

  const handleUpdate = async () => {
    console.log("Dds");
    try {
      const payload = {
        TurfId: turf.turfId,
        Name: turfName,
        Location: location,
        ContactNumber: phoneNumber,
        Description: description,
        Price: Number(price),
        Sports: selectedSports,
        Slots: selectedTimeSlots,
      };

      console.log("Sending payload:", payload);

      await authAxios.put("/api/turf/update", payload);

      setIsAlertOpen(true);
      setAlertMessage("Turf Updated Successfully!");
      setIsAlertOpen(true);
      setTimeout(() => {
        setIsAlertOpen(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error updating turf:", error);
      alert("Failed to update Turf. Please try again.");
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>Close</CloseButton>
        <h2>Update Turf</h2>

        <FormGroup>
          <Label>Turf Name</Label>
          <Input
            type="text"
            value={turfName}
            onChange={(e) => setTurfName(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Location</Label>
          <Input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Phone Number</Label>
          <Input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Price Amount</Label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
          />
        </FormGroup>

        <FormGroup>
          <Label>Description</Label>
          <Input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Select Sports</Label>
          <Select
            onChange={(e) =>
              setSelectedSports([...selectedSports, e.target.value])
            }
          >
            <option value="">Select a Sport</option>
            {sportsOptions.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </Select>
        </FormGroup>

        <SelectedList>
          {selectedSports.map((sport, index) => (
            <SelectedItem key={index}>
              🏅 {sport}
              <button
                onClick={() => removeSelectedSport(sport)}
                style={{
                  marginLeft: "5px",
                  cursor: "pointer",
                  backgroundColor: "black",
                  border: "none",
                  color: "red",
                }}
              >
                ❌
              </button>
            </SelectedItem>
          ))}
        </SelectedList>

        <FormGroup>
          <Label>Select Time Slot</Label>
          <Select
            onChange={(e) =>
              setSelectedTimeSlots([...selectedTimeSlots, e.target.value])
            }
          >
            <option value="">Select a Time Slot</option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </Select>
        </FormGroup>

        <SelectedList>
          {selectedTimeSlots.map((time, index) => (
            <SelectedItem key={index}>
              🕒 {time}
              <button
                onClick={() => removeSelectedTimeSlot(time)}
                style={{
                  marginLeft: "5px",
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  color: "red",
                }}
              >
                ❌
              </button>
            </SelectedItem>
          ))}
        </SelectedList>

        <SaveButton onClick={handleUpdate}>Save Changes</SaveButton>
      </ModalContent>

      {isAlertOpen && (
        <Modele
          isopen={isAlertOpen}
          setopen={setIsAlertOpen}
          testdisplay={alertMessage}
        />
      )}
    </ModalOverlay>
  );
};

export default TurfUpdateModal;
