import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Outline, Select, SelectedList, SelectedValue } from './cslot';
import authAxios from '../../api';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
`;

const FormColumn = styled.div`
  flex: 1;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 8px;
  color: orange;
`;

const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const StyledSelect = styled.select`
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  width: 100%;
  height : 38px;
`;

const StyledFileInput = styled.input`
  margin-top: 8px;
`;

const SubmitContainer = styled.div`
  margin:none;
  text-align: center;
`;

const CSlot = () => {
  const [turfName, setTurfName] = useState('');
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [price, setPrice] = useState('');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(true);
  const sportsOptions = ['Cricket', 'Football', 'Tennis', 'Badminton'];
  const timeSlots = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00 - ${String((i + 1) % 24).padStart(2, '0')}:00`);

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

  const handleSubmit = async () => {

    setIsSubmitting(false);

    if (!turfName || !location || !phoneNumber || !price || selectedSports.length === 0 || selectedTimeSlots.length === 0 || !file) {
      alert('Please fill in all fields and select sports and time slots.');
      return;
    }
    
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      alert('Please enter a valid phone number.');
      return;
    }

    const formdata = new FormData();
    formdata.append('Name', turfName);
    formdata.append('Location', location);
    formdata.append('ContactNumber', phoneNumber);
    formdata.append('Price', price);
    selectedSports.forEach((sport) => formdata.append('Sports', sport));
    selectedTimeSlots.forEach((slot) => formdata.append('Slots', slot));
    formdata.append('image', file);

    try {
      await authAxios.post('https://localhost:7124/api/user/create-turf', formdata);
      alert('Turf Created Successfully!');
    } catch (error) {
      console.error("Error Creating Turf:", error);
      alert("Failed to create Turf. Please try again.");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
  };

  return (
    <Outline>
      <h1 style={{ color: "black" }}>Create Your Own Turf</h1>
      <Container>
        {/* Left Column */}
        <FormColumn>
          <FormGroup>
            <Label>Turf Name</Label>
            <StyledInput type="text" value={turfName} onChange={(e) => setTurfName(e.target.value)} />
          </FormGroup>

          <FormGroup>
            <Label>Location</Label>
            <StyledInput type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
          </FormGroup>

          <FormGroup>
            <Label>Phone Number</Label>
            <StyledInput type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </FormGroup>

          <FormGroup>
            <Label>Price Amount</Label>
            <StyledInput type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </FormGroup>
        </FormColumn>

        {/* Right Column */}
        <FormColumn>
          <FormGroup>
            <Label>Select Sports</Label>
            <StyledSelect onChange={handleSportSelection}>
              <option value="">Select a Sport</option>
              {sportsOptions.map((sport) => (
                <option key={sport} value={sport}>{sport}</option>
              ))}
            </StyledSelect>
          </FormGroup>

          <SelectedList>
            {selectedSports.map((sport, index) => (
              <SelectedValue key={index}>🏅 {sport}</SelectedValue>
            ))}
          </SelectedList>

          <FormGroup>
            <Label>Select Time Slot</Label>
            <StyledSelect onChange={handleTimeSlotSelection}>
              <option value="">Select a Time Slot</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </StyledSelect>
          </FormGroup>

          <SelectedList>
            {selectedTimeSlots.map((time, index) => (
              <SelectedValue key={index}>🕒 {time}</SelectedValue>
            ))}
          </SelectedList>

          <FormGroup>
            <Label>Upload Image</Label>
            <StyledFileInput type="file" accept="image/*" required onChange={handleFileChange} />
          </FormGroup>
        </FormColumn>
      </Container>

      <SubmitContainer>
      {isSubmitting ? (
            <Button onClick={handleSubmit}>Submit</Button>
          ) : (
            null 
          )}
      </SubmitContainer>
    </Outline>
  );
};

export default CSlot;
