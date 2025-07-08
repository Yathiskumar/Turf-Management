import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { jwtDecode } from "jwt-decode";
import authAxios from "../../api";
import { Modele } from "../../Components/Alert/Alert.tsx";
import { Model } from "../Confirmation/confirm.tsx";
import {
  Block,
  Box,
  CancelContainer,
  CloseButton,
  ModalContent,
  ModalOverlay,
  Names,
  RescheduleInput,
} from "./Users.ts";
import Turf from "../Turf Slot/turf.tsx";
// import { CancelContainer } from "./Users.ts";

const Button = styled.button`
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

const Users = () => {
  const [userHistory, setUserHistory] = useState([]);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [bookingIdToReschedule, setBookingIdToReschedule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false); // New modal state
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [bookingIdToCancel, setBookingIdToCancel] = useState(null); // Store booking ID to cancel
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [turf, setTurf] = useState("");

  const getUserIdFromToken = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken?.sub || decodedToken?.id || "No ID found";
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  };

  const fetchUserHistory = async (userId) => {
    try {
      const historyResponse = await authAxios.get(
        `https://localhost:7124/api/user/${userId}/history`
      );
      console.log;
      setUserHistory(historyResponse.data.bookingHistory);
      setTurf(historyResponse.data.bookingHistory[0].turfId);
    } catch (error) {
      console.error("Error fetching history", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken(token);
    if (userId) fetchUserHistory(userId);
  }, []);

  const rescheduleBooking = async (bookingId, slotDateTime, turfId) => {
    if (new Date(slotDateTime) <= new Date()) {
      alert("You cannot reschedule a past booking.");
      return;
    }

    setBookingIdToReschedule(bookingId);
    setRescheduleDate("");
    setSelectedSlots([]); 
    setAvailableSlots([]); 
    setTurf(turfId);
    setIsModalOpen(true);
  };

  const confirmReschedule = async () => {
    if (!rescheduleDate) {
      alert("Please select a future date for rescheduling.");
      return;
    }

    try {
      const formattedDate = new Date(rescheduleDate).toISOString();
      const response = await authAxios.patch(
        `https://localhost:7124/api/booking/reschedule/${bookingIdToReschedule}?newSlotDateTime=${formattedDate}`
      );

      if (response.status === 200) {
        setUserHistory((prevHistory) =>
          prevHistory.map((item) =>
            item.id === bookingIdToReschedule
              ? { ...item, slotDateTime: formattedDate }
              : item
          )
        );
        setAlertMessage("Booking Rescheduled Successfully!");
        setIsAlertOpen(true);
        setIsModalOpen(false);
        setBookingIdToReschedule(null);
      } else {
        alert("Failed to reschedule the booking.");
      }
    } catch (error) {
      console.error("Error rescheduling booking", error);
      alert("Failed to reschedule the booking. Please try again.");
    }
  };

  const handleDateChange = async (newDate) => {
    if (!newDate) return;

    try {
      const formattedDate = new Date(newDate).toISOString();

      const response = await authAxios.post(
        `https://localhost:7124/api/user/getslots/${turf}?slot=${formattedDate}`
      );

      setSelectedDate(newDate);
      setAvailableSlots(response.data.slots || []); // Update available slots
      setSelectedSlots([]); // Reset selected slots
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  const cancelBooking = (bookingId, slotDateTime) => {
    if (new Date(slotDateTime) <= new Date()) {
      alert("You cannot cancel a past booking.");
      return;
    }

    setBookingIdToCancel(bookingId);
    setIsCancelModalOpen(true);
  };

  const confirmCancelBooking = async () => {
    if (!bookingIdToCancel) return;

    try {
      await authAxios.delete(
        `https://localhost:7124/api/booking/cancel/${bookingIdToCancel}`
      );
      setUserHistory((prevHistory) =>
        prevHistory.filter((item) => item.id !== bookingIdToCancel)
      );

      setAlertMessage("Booking Cancelled Successfully!");
      setIsAlertOpen(true);
      setIsCancelModalOpen(false);
      setBookingIdToCancel(null);
    } catch (error) {
      console.error("Error cancelling booking", error);
      alert("Failed to cancel the booking. Please try again.");
    }
  };

  const handleSlotClick = (slot) => {
    setSelectedSlots((prevSlots) =>
      prevSlots.includes(slot)
        ? prevSlots.filter((s) => s !== slot)
        : [...prevSlots, slot]
    );
  };

  const formatDate = (dateTime) => new Date(dateTime).toLocaleDateString();

  return (
    <>
      <Block>
        {userHistory.length > 0 ? (
          userHistory.map((historyItem, index) => (
            <Box key={index}>
              <Names>
                <b>Turf Name:</b> {historyItem.turfName}
              </Names>
              <Names>
                <b>Date:</b> {formatDate(historyItem.slotDateTime)}
              </Names>
              <Names>
                <b>Slots:</b> {historyItem.slots.join(", ")}
              </Names>

              <CancelContainer>
                <Button
                  red
                  onClick={() =>
                    cancelBooking(historyItem.id, historyItem.slotDateTime)
                  }
                >
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    rescheduleBooking(
                      historyItem.id,
                      historyItem.slotDateTime,
                      historyItem.turfId
                    )
                  }
                >
                  Reschedule
                </Button>
              </CancelContainer>
            </Box>
          ))
        ) : (
          <p style={{ marginTop: "10%", color: "black" }}>
            No booking history available
          </p>
        )}
      </Block>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={() => setIsModalOpen(false)}>X</CloseButton>
            <h3>Select a new date:</h3>
            <RescheduleInput
              type="date"
              value={rescheduleDate}
              onChange={(e) => {
                setRescheduleDate(e.target.value); // Keep updating rescheduleDate
                handleDateChange(e.target.value); // Fetch available slots
              }}
              min={new Date().toISOString().split("T")[0]}
            />

            <h4>Available Slots</h4>
            <div>
              {availableSlots.length === 0 ? (
                <p style={{ fontSize: "12px", color: "red" }}>
                  No slots available for this date
                </p>
              ) : (
                availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => handleSlotClick(slot)}
                    style={{
                      backgroundColor: selectedSlots.includes(slot)
                        ? "lightgreen"
                        : "antiquewhite",
                      cursor: "pointer",
                      margin: "5px",
                    }}
                  >
                    {slot}
                  </button>
                ))
              )}
            </div>
            <Button onClick={confirmReschedule}>Confirm</Button>
          </ModalContent>
        </ModalOverlay>
      )}

      <Model
        isopen={isCancelModalOpen}
        setopen={() => setIsCancelModalOpen(false)}
        testdisplay="Do you want to cancel this booking?"
        buttonname="Confirm"
        action={confirmCancelBooking}
      />

      <Modele
        isopen={isAlertOpen}
        setopen={setIsAlertOpen}
        testdisplay={alertMessage}
      />
    </>
  );
};

export default Users;
