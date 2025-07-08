import React from 'react'
import NavBar from '../../Components/NavBar/NavBar.tsx'
import Users from '../../Components/Users/Users.tsx'
import styled from 'styled-components';
import { TurfBackGround } from '../../assets/index.ts';

const Background = styled.div`
  height: 320vh;
  margin: 0;
  padding: 0;
  margin-top: -30px;
  width:101%;

`;


const History = () => {
  return (
    <Background>   
        <NavBar></NavBar>
        <Users />
    </Background>
  )
}

export default History;