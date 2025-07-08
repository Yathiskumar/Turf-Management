import React, { useState, useEffect } from "react";
import {
  MainContent,
  TextContent,
  FansLove,
  Paragraph,
  ImageContent,
  StartedButton,
  PageWrapper,
  GlobalStyle,
} from "./Home";
import { Badminton, Football } from "../../assets/index";
import NavBarr from "../../Components/NavBar/NavBar.tsx";
import { useNavigate } from "react-router-dom";

const images = [Football, Badminton];

function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const navigate = useNavigate();

  const tok = localStorage.getItem("token");
  console.log(tok);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFade(true);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const log = () => {
    navigate("/login");
  };

  const sign = () => {
    navigate("/signup");
  };

  const boks = () => {
    navigate("/book");
  };

  const crates = () => {
    navigate("/create");
  };

  return (
    <>
      <GlobalStyle />
      <PageWrapper>
        <NavBarr />
        <MainContent>
          <TextContent>
            <FansLove>
              FIND PLAYERS & <br />
              VENUES NEARBY
            </FansLove>
            <Paragraph>
              Seamlessly explore sports venues and play with sports enthusiasts
              just like you!
            </Paragraph>
            {!tok ? (
              <>
                <StartedButton onClick={log}>Login</StartedButton>
                <StartedButton style={{ marginLeft: "10px" }} onClick={sign}>
                  Signup
                </StartedButton>
              </>
            ) : (
              <>
                <StartedButton onClick={boks}>Book</StartedButton>
                <StartedButton style={{ marginLeft: "10px" }} onClick={crates}>
                  Create
                </StartedButton>
              </>
            )}
          </TextContent>

          <ImageContent>
            <img
              key={currentImageIndex}
              src={images[currentImageIndex]}
              alt="Sport Image"
              style={{
                opacity: fade ? 1 : 0,
                transition: "opacity 1s ease-in-out",
              }}
            />
          </ImageContent>
        </MainContent>
      </PageWrapper>
    </>
  );
}

export default Home;
