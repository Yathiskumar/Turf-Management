import { Dispatch, SetStateAction } from "react";
import styled from "styled-components";

interface getdet {
  isopen: boolean;
  setopen: Dispatch<SetStateAction<boolean>>;
  testdisplay: string;
  action: () => void;
  buttonname: string;
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
    background: rgba(255, 255, 255, 0.75);
    width: 300px;
    display: flex;
    flex-direction: column;
    position: relative;
    gap: 10px;
    align-items: center;
  }
  color: #0223dd;
`;

const Button = styled.button`
  background-color: #d41c1c;
  border: none;
  color: black;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
`;

export function Model({
  isopen,
  setopen,
  testdisplay,
  buttonname,
  action,
}: getdet) {
  if (!isopen) return null;

  return (
    <Divider>
      <div>
        <CloseButton onClick={() => setopen(false)}>✖</CloseButton>
        <h3>{testdisplay}</h3>
        <Button onClick={action}>{buttonname}</Button>
      </div>
    </Divider>
  );
}
