import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Calendar from "react-calendar";
import { format } from "date-fns";
import axios from "axios";
import {
  Container,
  HeaderSection,
  HeaderTitle,
  VenueImage,
  ContentWrapper,
  LeftColumn,
  InfoContainer,
  InfoTitle,
  SportsContainer,
  SportsImage,
  RightColumn,
  BookButton,
  SlotContainer,
  SlotHeader,
  SlotsContainer,
  Slot,
  FeedbackContainer,
  FeedbackList,
  FeedbackItem,
  FeedbackTitle,
  AddButton,
  FeedbackInput,
  FeedbackForm,
  Heading,
  NumberInput,
  CloseButton,
  ModalContent,
  ModalOverlay,
  Buttons,
  Scroll,
} from "./Booking.ts";
import NavBar from "../NavBar/NavBar.tsx";
import authAxios from "../../api.ts";
import { jwtDecode } from "jwt-decode";
import { qrcode, TurfBackGround } from "../../assets/index.ts";
import Modal from "react-modal";
import Payment from "../Payment/payment.tsx";
import { Modele } from "../Alert/Alert.tsx";

const sportImages = {
  Football:
    "https://cdn.pixabay.com/photo/2013/07/13/13/34/football-161132_1280.png",
  Cricket:
    "https://cdn.pixabay.com/photo/2013/07/13/09/46/cricket-155965_1280.png",
  Tennis:
    "https://cdn.pixabay.com/photo/2014/03/25/15/26/racket-296859_1280.png",
  Badminton:
    "https://cdn.pixabay.com/photo/2013/07/13/12/13/badminton-159415_1280.png",
};

let i = 0;

const TurfComponent = () => {
  const location = useLocation();
  const { turfId, image_path, name } = location.state || {};
  console.log(name);
  const [slots, setSlots] = useState([]);
  const [sports, setSports] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [newFeedback, setNewFeedback] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isFeedbackAdded, setIsFeedbackAdded] = useState(false);
  const [turfLocation, setTurfLocation] = useState("");
  const [contact, setContact] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  useEffect(() => {
    const fetchTurfData = async () => {
      try {
        const turfResponse = await authAxios.get(
          "https://localhost:7124/api/user/turf"
        );
        const turfData = turfResponse.data.turfs.find(
          (turf) => turf.turfId === turfId
        );
        if (turfData) {
          setSlots(turfData.slots);
          setSports(
            turfData.sports.map((sport) => ({
              name: sport,
              imageSrc: sportImages[sport] || "/assets/default-sport-image.jpg",
            }))
          );
          setTurfLocation(turfData.location);
          setPrice(turfData.price);
          setDescription(turfData.description);
          setContact(turfData.contactNumber);
        }
      } catch (error) {
        console.error("Error fetching turf data:", error);
      }
    };

    const fetchFeedbackData = async () => {
      try {
        const response = await authAxios.get(
          `https://localhost:7124/api/feedback/details/turf/${turfId}`
        );
        setFeedbackList(response.data.feedbacks || []);
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      }
    };

    fetchTurfData();
    fetchFeedbackData();
  }, [turfId]);

  const storefeedback = async () => {
    const payload = {
      FeedbackText: newFeedback.trim(),
    };

    try {
      await authAxios.post(
        `https://localhost:7124/api/feedback/${turfId}`,
        payload
      );
      setFeedbackList((prevFeedbackList) => [
        ...prevFeedbackList,
        { feedbackText: newFeedback.trim() },
      ]);
      setNewFeedback("");
      setShowInput(false);
      setIsFeedbackAdded(true);
      alert("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  const handleAddFeedbackClick = () => setShowInput(true);

  const handleFeedbackChange = (event) => setNewFeedback(event.target.value);

  const handleFeedbackSubmit = async (event) => {
    event.preventDefault();
    if (newFeedback.trim() !== "") {
      storefeedback();
    } else {
      alert("Feedback cannot be empty.");
    }
    window.location.reload();
  };

  const handleBookNowClick = () => setShowBookingModal(true);

  const handleSlotClick = (slot) => {
    setSelectedSlots((prevSlots) =>
      prevSlots.includes(slot)
        ? prevSlots.filter((s) => s !== slot)
        : [...prevSlots, slot]
    );
  };

  const handlePayment = () => {
    if (selectedSlots.length > 0) {
      setShowPayment(true);
      setTimeout(() => {
        setShowSuccessAnimation(true);
        setTimeout(() => {
          setShowPayment(false);
          setShowBookingModal(false);
          setShowSuccessAnimation(false);
          handleBookingSubmit();
        }, 2000);
      }, 3000);
    }
  };

  const handleDateChange = async (newDate) => {
    if (!newDate) return;

    try {
      const formattedDate = format(new Date(newDate), "yyyy-MM-dd'T'HH:mm:ss");

      const response = await authAxios.post(
        `https://localhost:7124/api/user/getslots/${turfId}?slot=${formattedDate}`
      );

      setSelectedDate(newDate);
      setSlots(response.data.slots || []);
      setSelectedSlots([]);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  const handleBookingSubmit = async () => {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (new Date(selectedDate) <= today) {
      alert("Selected date must be greater than today's date.");
      return;
    }

    if (selectedSlots.length === 0) {
      alert("Please select at least one slot.");
      return;
    }

    let recurringDates = [];
    for (let week = 0; week < selectedWeek; week++) {
      const recurringDate = new Date(selectedDate);
      recurringDate.setDate(recurringDate.getDate() + week * 7);
      recurringDates.push(format(recurringDate, "yyyy-MM-dd'T'HH:mm:ss"));
    }

    try {
      for (const date of recurringDates) {
        const payload = {
          SlotDateTime: date,
          Slots: selectedSlots,
        };

        await authAxios.post(
          `https://localhost:7124/api/booking/${turfId}`,
          payload
        );
      }
      setAlertMessage(
        `Booking Confirmed for ${
          recurringDates.length
        } week(s) Dates: ${recurringDates.join(", ")}`
      );
      setIsAlertOpen(true);

      setTimeout(() => {
        setIsAlertOpen(false);
        setShowBookingModal(false);
      }, 5000);
    } catch (error) {
      console.error("Error posting booking:", error);
      alert("Failed to confirm booking. Please try again.");
    }

    window.location.reload();
    setSelectedSlots([]);
  };

  return (
    <Container>
      <NavBar />
      <InfoTitle
        style={{
          marginTop: "5.5%",
          paddingLeft: "90px",
          fontSize: "25px",
          color: "black",
        }}
      ></InfoTitle>
      <ContentWrapper style={{ marginTop: "-1%" }}>
        <LeftColumn>
          <VenueImage
            src={`data:image/jpeg;base64,${image_path}`}
            alt={name || "Turf Image"}
          />
        </LeftColumn>
        <RightColumn>
          <InfoContainer style={{ marginTop: "20px" }}>
            <InfoTitle style={{ fontSize: "30px" }}>{name}</InfoTitle>
            <Heading>Price: ₹{price}</Heading>
            <InfoTitle>
              Location : {turfLocation || "Location not available"}
            </InfoTitle>
            <InfoTitle>Contact : +91 {contact}</InfoTitle>
            {/* <InfoTitle>Sports Available</InfoTitle> */}
            <SportsContainer style={{ marginTop: "22px" }}>
              {sports.map((sport, index) => (
                <div key={index}>
                  <SportsImage src={sport.imageSrc} alt={sport.name} />
                </div>
              ))}
            </SportsContainer>
          </InfoContainer>
          <BookButton onClick={handleBookNowClick}>Book Now</BookButton>
          <SlotsContainer></SlotsContainer>
        </RightColumn>
      </ContentWrapper>
      <p
        style={{
          width: "60%",
          textAlign: "justify",
          marginLeft: "2%",
          color: "rgb(100,100,100)",
        }}
      >
        {description}
      </p>
      <FeedbackContainer>
        <FeedbackTitle>User's Feedback</FeedbackTitle>
        <FeedbackList>
          {feedbackList.map((feedback, index) => (
            <FeedbackItem key={index}>
              {feedback.name} : {feedback.feedbackText}
            </FeedbackItem>
          ))}
        </FeedbackList>

        {showInput ? (
          <FeedbackForm onSubmit={handleFeedbackSubmit}>
            <FeedbackInput
              type="text"
              placeholder="Enter your feedback..."
              value={newFeedback}
              onChange={handleFeedbackChange}
            />
            <button type="submit">Submit Feedback</button>
          </FeedbackForm>
        ) : (
          !isFeedbackAdded && (
            <AddButton onClick={handleAddFeedbackClick}>Add</AddButton>
          )
        )}
      </FeedbackContainer>

      <Modal
        isOpen={showBookingModal}
        onRequestClose={() => setShowBookingModal(false)}
        contentLabel="Booking Modal"
        style={{
          content: {
            width: "25%",
            margin: "auto",
            padding: "10px",
            height: "350px",
            overflowY: "scroll", // Allows scrolling
            scrollbarWidth: "none", // Hides scrollbar in Firefox
            msOverflowStyle: "none",
          },
        }}
      >
        {!showPayment ? (
          <Scroll>
            <h2>Select Booking Details</h2>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              style={{ width: "50%", padding: "5px", fontSize: "14px" }}
              min={new Date().toISOString().split("T")[0]}
            />
            <br />
            <br />
            <label style={{ fontSize: "15px", fontWeight: "bold" }}>
              Enter week for Recurring Booking{" "}
            </label>
            <input
              type="number"
              value={selectedWeek}
              placeholder="Enter week number"
              onChange={(e) => setSelectedWeek(e.target.value)}
              style={{ width: "30px" }}
            />
            <h4>Available Slots</h4>
            <div>
              {slots.length === 0 ? (
                <p style={{ fontSize: "12px", color: "red" }}>
                  No slots available for this date
                </p>
              ) : (
                slots.map((slot, index) => (
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
            <div>
              <Buttons
                onClick={handlePayment}
                style={{ width: "100px", marginLeft: "50px" }}
              >
                Pay
              </Buttons>
              <Buttons
                onClick={() => setShowBookingModal(false)}
                style={{ marginLeft: "10px", width: "100px" }}
              >
                Cancel
              </Buttons>
            </div>
          </Scroll>
        ) : (
          <Payment />
        )}
      </Modal>

      <Modele
        isopen={isAlertOpen}
        setopen={setIsAlertOpen}
        testdisplay={alertMessage}
      />
    </Container>
  );
};

export default TurfComponent;
