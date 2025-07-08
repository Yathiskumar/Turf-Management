import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import authAxios from "../../api";
import styled from "styled-components";
import NavBar from "../../Components/NavBar/NavBar.tsx";
import { Trash } from "../../assets";

const ProfileContainer = styled.div`
  margin-top: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  padding: 2rem;
  border-radius: 12px;
  width: 850px;
  margin-left: 20%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
`;

const ProfileInfo = styled.p`
  font-size: 1.1rem;
  margin: 0.5rem 0;
  strong {
    color: #555;
  }
`;

const Button = styled.button`
  background: rgb(93, 211, 20);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
  &:hover {
    background: rgb(76, 175, 10);
  }
`;

// Styled components for modal
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
  padding: 2rem;
  border-radius: 10px;
  width: 400px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-left: 10px;
`;

const SaveButton = styled(Button)`
  background: rgb(33, 150, 243);
  &:hover {
    background: rgb(25, 118, 210);
  }
`;

const CancelButton = styled(Button)`
  background: rgb(220, 53, 69);
  &:hover {
    background: rgb(200, 35, 50);
  }
  margin-left: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 15px;
`;

const FormRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Profile = () => {
  const [profileData, setProfileData] = useState({ name: "", email: "" });
  const [showModal, setShowModal] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ name: "", email: "" });
  const [refresh, setRefresh] = useState(false); 
  const fetchUserProfile = async () => {
    const tok = localStorage.getItem("token");
    if (tok) {
      try {
        const token = jwtDecode(tok);
        const userid = token["sub"];
        const response = await authAxios.get(
          `https://localhost:7124/api/user/${userid}`
        );
        setProfileData({
          name: response.data.details.name,
          email: response.data.details.email,
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [refresh]);

  const handleEdit = () => {
    setEditedProfile({ name: profileData.name, email: profileData.email });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await authAxios.put(`https://localhost:7124/api/user/edit`, {
        Name: editedProfile.name,
        Email: editedProfile.email,
      });

      setRefresh((prev) => !prev);
      setShowModal(false);
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  return (
    <>
      <NavBar />
      <ProfileContainer>
        <Title>Profile Details</Title>
        <ProfileInfo>
          <strong>Name:</strong> {profileData.name}
        </ProfileInfo>
        <ProfileInfo>
          <strong>Email:</strong> {profileData.email}
        </ProfileInfo>
        <img src={Trash} alt="Trash Icon" />
        <Button onClick={handleEdit}>Edit</Button>
      </ProfileContainer>

      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <h2>Edit Profile</h2>
            <FormRow>
              <label htmlFor="name">Name:</label>
              <Input
                type="text"
                name="name"
                value={editedProfile.name}
                onChange={handleChange}
                placeholder="Enter Name"
              />
            </FormRow>
            <FormRow>
              <label htmlFor="email">Email:</label>
              <Input
                type="email"
                name="email"
                value={editedProfile.email}
                onChange={handleChange}
                placeholder="Enter Email"
              />
            </FormRow>
            <ButtonContainer>
              <SaveButton onClick={handleSave}>Save</SaveButton>
              <CancelButton onClick={() => setShowModal(false)}>
                Cancel
              </CancelButton>
            </ButtonContainer>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default Profile;
