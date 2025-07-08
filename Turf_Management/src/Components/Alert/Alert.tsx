import { Dispatch, SetStateAction, useEffect } from "react";
import styled from "styled-components";

interface getdet {
  isopen: boolean;
  setopen: Dispatch<SetStateAction<boolean>>;
  testdisplay: string;
}

const Divider = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;

  div {
    padding: 20px;
    border-radius: 8px;
    background: rgba(230, 83, 83, 0.75);
    width: 300px;
    display: flex;
    flex-direction: column;
    position: relative;
    gap: 10px;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  }
  color: #fff;
`;

export function Modele({ isopen, setopen, testdisplay }: getdet) {
  useEffect(() => {
    if (isopen) {
      const timer = setTimeout(() => {
        setopen(false);
      }, 3000);

      return () => clearTimeout(timer); 
    }
  }, [isopen, setopen]);

  if (!isopen) return null;

  return (
    <Divider>
      <div>
        <h3>{testdisplay}</h3>
      </div>
    </Divider>
  );
}
