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

const SubmitButton = styled.button`
  background: green;
  color: white;
  border: none;
  padding: 10px;
  margin-top: 10px;
  cursor: pointer;
`;

const FormGroup = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
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

const RemoveButton = styled.button`
  background: black;
  color: white;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
  margin-left: 5px;
`;

const CreateTurfModal = ({ onClose }: { onClose: () => void }) => {
  const [turfName, setTurfName] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [price, setPrice] = useState("");
  const [descripton, setDescription] = useState("");
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(number);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);

    if (value === "" || validatePhoneNumber(value)) {
      setError("");
    } else {
      setError("Please enter a valid 10-digit phone number.");
    }
  };
  const sportsOptions = ["Cricket", "Football", "Tennis", "Badminton"];
  const timeSlots = Array.from(
    { length: 24 },
    (_, i) =>
      `${String(i).padStart(2, "0")}:00 - ${String((i + 1) % 24).padStart(
        2,
        "0"
      )}:00`
  );

  const handleSportSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && !selectedSports.includes(value)) {
      setSelectedSports([...selectedSports, value]);
    }
  };

  const handleTimeSlotSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && !selectedTimeSlots.includes(value)) {
      setSelectedTimeSlots([...selectedTimeSlots, value]);
    }
  };

  const handleRemoveSport = (sportToRemove: string) => {
    setSelectedSports(
      selectedSports.filter((sport) => sport !== sportToRemove)
    );
  };

  const handleRemoveSlot = (slotToRemove: string) => {
    setSelectedTimeSlots(
      selectedTimeSlots.filter((slot) => slot !== slotToRemove)
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);
  };

  const handleSubmit = async () => {
    if (
      !turfName ||
      !location ||
      !phoneNumber ||
      !price ||
      selectedSports.length === 0 ||
      selectedTimeSlots.length === 0 ||
      !file
    ) {
      setAlertMessage("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("Name", turfName);
    formData.append("Location", location);
    formData.append("ContactNumber", phoneNumber);
    formData.append("Price", price);
    formData.append("Description", descripton);
    selectedSports.forEach((sport) => formData.append("Sports", sport));
    selectedTimeSlots.forEach((slot) => formData.append("Slots", slot));
    formData.append("image", file);

    try {
      await authAxios.post("/api/user/create-turf", formData);
      setIsAlertOpen(true);
      setAlertMessage("Turf Created Successfully!");
      setIsAlertOpen(true);
      setTimeout(() => {
        setIsAlertOpen(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error Creating Turf:", error);
      alert("Failed to create Turf. Please try again.");
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Create Turf</h2>

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
            onChange={handleChange}
            maxLength="10"
          />
          {error && <small style={{ color: "red" }}>{error}</small>}
        </FormGroup>

        <FormGroup>
          <Label>Price</Label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Description</Label>
          <Input
            type="text"
            value={descripton}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Sports</Label>
          <Select onChange={handleSportSelection}>
            <option value="">Select a Sport</option>
            {sportsOptions.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Selected Sports:</Label>
          {selectedSports.length > 0 ? (
            <SelectedList>
              {selectedSports.map((sport, index) => (
                <SelectedItem key={index}>
                  🏅 {sport}
                  <RemoveButton onClick={() => handleRemoveSport(sport)}>
                    ❌
                  </RemoveButton>
                </SelectedItem>
              ))}
            </SelectedList>
          ) : (
            <p>No sports selected</p>
          )}
        </FormGroup>

        <FormGroup>
          <Label>Select Time Slot</Label>
          <Select onChange={handleTimeSlotSelection}>
            <option value="">Select a Time Slot</option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Selected Slots:</Label>
          {selectedTimeSlots.length > 0 ? (
            <SelectedList>
              {selectedTimeSlots.map((slot, index) => (
                <SelectedItem key={index}>
                  🕒 {slot}
                  <RemoveButton onClick={() => handleRemoveSlot(slot)}>
                    ❌
                  </RemoveButton>
                </SelectedItem>
              ))}
            </SelectedList>
          ) : (
            <p>No slots selected</p>
          )}
        </FormGroup>

        <FormGroup>
          <Label>Upload Image</Label>
          <Input type="file" accept="image/*" onChange={handleFileChange} />
        </FormGroup>

        <SubmitButton onClick={handleSubmit}>Create</SubmitButton>
        <CloseButton onClick={onClose}>Close</CloseButton>
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

export default CreateTurfModal;
