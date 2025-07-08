import React from "react";
import Turf from "../../Components/Turf Slot/turf.tsx";
import NavBar from "../../Components/NavBar/NavBar.tsx";
import { Background } from "./BookTurf.ts";

const BookTurf = () => {
  return (
    <Background>
      <NavBar></NavBar>
      <Turf />
    </Background>
  );
};

export default BookTurf;
