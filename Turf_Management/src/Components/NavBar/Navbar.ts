import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const Navigation = styled.nav`
  padding: 1rem 2rem;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`;

export const NavList = styled.ul`
  display: flex;
  justify-content: space-between;
  padding: 0;
  margin: 0;
  list-style: none;
  align-items: center;
`;

export const NavLeft = styled.div`
  margin-left: 3%;
  display: flex;
`;

export const NavRight = styled.div`
  margin-left: auto;
  margin-right: 8%;
  display: flex;
`;

export const NavItem = styled.li`
  margin: 0 1rem;
`;

export const StyledNavLink = styled(NavLink)`
  color: #edf2f7;
  text-decoration: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 4px;
  font-size: 17px;

  &.active {
    color:rgb(45, 69, 206);
  }

  &:active {
    background-color: rgb(173, 18, 18);
  }
`;
