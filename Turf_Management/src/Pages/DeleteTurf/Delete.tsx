import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authAxios from "../../api.ts";
import NavBar from "../../Components/NavBar/NavBar.tsx";
import styled from "styled-components";
import { Model } from "../../Components/Confirmation/confirm.tsx";
import { Block, Box, Titled, Image, Button } from "./Delete";

const SearchInput = styled.input`
  position: absolute;
  top: 20%;
  right: 5%;
  padding: 8px;
  border-radius: 20px;
  border: 3px solid #ccc;
  font-size: 16px;
`;

const Delete = () => {
  const [turfs, setTurfs] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [isopen, setIsOpen] = useState(false);
  const [selectedTurfId, setSelectedTurfId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const response = await authAxios.get("api/user/turf");
        if (response.data && response.data.turfs) {
          setTurfs(response.data.turfs);
          setFilteredUsers(response.data.turfs);
        }
      } catch (error) {
        console.error("Error fetching turf data:", error);
      }
    };

    fetchTurfs();
  }, []);

  const handleTurfClick = (turf: any) => {
    navigate("/booking", {
      state: {
        turfId: turf.turfId,
        image_path: turf.image_path,
        name: turf.name,
      },
    });
  };

  var d = localStorage.getItem("token");
  var value = jwtDecode(d);
  var role =
    value["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  console.log(role);

  useEffect(() => {
    const filtered = turfs.filter((turf) =>
      turf.name.toLowerCase().includes(search.trim().toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [search, turfs]);

  const confirmDeleteTurf = (turfId: string) => {
    setSelectedTurfId(turfId);
    setIsOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedTurfId) return;

    try {
      await authAxios.delete(
        `https://localhost:7124/api/turf/${selectedTurfId}`
      );
      setTurfs((prevTurfs) =>
        prevTurfs.filter((turf) => turf.turfId !== selectedTurfId)
      );
      setIsOpen(false);
    } catch (error) {
      console.error("Error deleting turf:", error);
    }
  };

  return (
    <Block>
      <h1 style={{ textAlign: "left", width: "100%" }}>Turfs</h1>
      <NavBar />
      <SearchInput
        type="text"
        placeholder="Search by turf name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filteredUsers.map((turf, index) => (
        <Box key={turf.turfId}>
          <Image
            src={`data:image/jpeg;base64,${turf.image_path}`}
            alt={`Turf ${index + 1}`}
          />
          <Titled style={{ marginTop: "10px" }}>{turf.name}</Titled>
          <Titled>Price: ₹{turf.price}</Titled>
          <Titled>📍 {turf.location}</Titled>
          <Button onClick={() => confirmDeleteTurf(turf.turfId)}>Delete</Button>
        </Box>
      ))}


      <Model
        isopen={isopen}
        setopen={() => {setIsOpen(false);}}
        testdisplay="Do you want to delete this turf?"
        buttonname="Delete"
        action={handleDelete}
      />
    </Block>
  );
};

export default Delete;
