import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Block, Box, Titled, Image, Button, InfoWrapper } from "./turf";
import authAxios from "../../api.ts";

const Turf = () => {
  const [turfs, setTurfs] = useState([]);
  const navigate = useNavigate();
  const baseUrl = "https://localhost:7124";

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const response = await authAxios.get("api/user/turf");
        if (response.data && response.data.turfs) {
          setTurfs(response.data.turfs);
        }
      } catch (error) {
        console.error("Error fetching turf data:", error);
      }
    };

    fetchTurfs();
  }, []);

  const handleTurfClick = (turf) => {
    navigate("/booking", {
      state: { turfId: turf.turfId, image_path: turf.image_path, name: turf.name },
    });
  };

  var token = localStorage.getItem("token");
  var decoded = jwtDecode(token);
  var role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  return (
    <Block>
      {turfs.map((turf, index) => (
        <Box key={turf.turfId} onClick={() => handleTurfClick(turf)}>
          <Image src={`data:image/jpeg;base64,${turf.image_path}`} alt={`Turf ${index + 1}`} />
          <InfoWrapper>
            <Titled>{turf.name}</Titled>
            <Titled>Price: ₹{turf.price}</Titled>
            <Titled>📍 {turf.location}</Titled>
          </InfoWrapper>
          <Button>Book</Button>
        </Box>
      ))}
    </Block>
  );
};

export default Turf;
