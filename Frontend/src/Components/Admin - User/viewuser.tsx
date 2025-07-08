import React, { useState, useEffect } from "react";
import authAxios from "../../api";
import {
  UserContainer,
  UserCard,
  Button,
  UserName,
  UserEmail,
  Image,
} from "./viewuser";
import { Trash } from "../../assets";
import styled from "styled-components";
import { Model } from "../../Components/Confirmation/confirm.tsx";

const SearchInput = styled.input`
  position: absolute;
  top: 20%;
  right: 5%;
  padding: 8px;
  border-radius: 20px;
  border: 3px solid #ccc;
  font-size: 16px;
`;

const ViewUser = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [isopen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    index: number;
  } | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await authAxios.get(
          "https://localhost:7124/api/turf/users"
        );
        if (response.data && response.data.users) {
          setUsers(response.data.users);
          setFilteredUsers(response.data.users);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(search.trim().toLowerCase()) ||
        user.email.toLowerCase().includes(search.trim().toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  // Open modal and store user to delete
  const confirmDeleteUser = (userId: string, index: number) => {
    setSelectedUser({ id: userId, index });
    setIsOpen(true);
  };

  // Perform user deletion
  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      await authAxios.delete(
        `https://localhost:7124/api/turf/user/${selectedUser.id}`
      );
      setUsers((prevUsers) =>
        prevUsers.filter((_, idx) => idx !== selectedUser.index)
      );
      setIsOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <h1 id="testHeading" style={{ marginTop: "8%", marginLeft: "3%" }}>
        Users
      </h1>
      <SearchInput
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <UserContainer>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <UserCard key={user.id}>
              <Button
                role="button"
                onClick={() => confirmDeleteUser(user.id, index)}
              >
                Delete
              </Button>
              <UserName>{user.name}</UserName>
              <UserEmail>{user.email}</UserEmail>
              <Image src={Trash} alt="Delete Icon" />
            </UserCard>
          ))
        ) : (
          <p>No users available</p>
        )}
      </UserContainer>


      <Model
        isopen={isopen}
        setopen={() => setIsOpen(false)}
        testdisplay="Do you want to delete this user?"
        buttonname="Delete"
        action={handleDelete}
      />
    </>
  );
};

export default ViewUser;
