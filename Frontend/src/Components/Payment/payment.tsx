import React, { useState, useEffect } from "react";
import { qrcode } from "../../assets";
import styled from "styled-components";
import { Spin } from "antd";

const Payment = () => {
  const [paymentDone, setPaymentDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPaymentDone(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const Image = styled.img`
    background: transparent;
    margin-left: 15%;
    margin-top: 10%;
  `;

  const PaymentText = styled.p`
    margin-left: 5%;
    font-size: 20px;
    color: rgb(31, 148, 37);
    font-weight: bold;
  `;

  const LoaderContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
  `;

  return (
    <>
      <Image src={qrcode} alt="QR Code" />
      <LoaderContainer>
        {!paymentDone ? <Spin size="large" /> : <PaymentText>Payment Done</PaymentText>}
      </LoaderContainer>
    </>
  );
};

export default Payment;
