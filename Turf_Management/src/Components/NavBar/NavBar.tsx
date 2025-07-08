import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import {
  Navigation,
  NavList,
  NavLeft,
  NavRight,
  NavItem,
  StyledNavLink,
} from './Navbar.ts';
import { Link, useLocation } from 'react-router-dom';
import { ProfilePhote } from '../../assets/index.ts';

function NavBar() {
  let role = 'null';
  const tok = localStorage.getItem('token');
  const location = useLocation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [manageDropdownVisible, setManageDropdownVisible] = useState(false);

  if (tok) {
    try {
      const decoded: any = jwtDecode(tok);
      role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    } catch (error) {
      console.error('Invalid token:', error);
    }
  }

  const navigationLeft = [
    { name: 'Home', path: '/' },
    { name: 'Book', path: '/book' },
    { name: 'Manage', path: '/users' },
    { name: 'My Turf', path: '/create' }
  ];

  const navigationRight = tok
    ? [{ name: 'Profile', path: '/profile' }]
    : [{ name: 'Login/SignUp', path: '/login' }];

  return (
    <Navigation style={{ backgroundColor: 'black' }}>
      <NavList>
        <NavLeft>
          {navigationLeft.map((item) => {
            if (item.name === 'Manage' && role !== 'Admin') return null;
            if (role === 'null' && item.name !== 'Home') return null;
            return (
              <NavItem key={item.name}>
                {item.name === 'Manage' ? (
                  <div
                    onMouseEnter={() => setManageDropdownVisible(true)}
                    onMouseLeave={() => setManageDropdownVisible(false)}
                    style={{ position: 'relative' }}
                  >
                    <StyledNavLink
                      to={item.path}
                      className={
                        (location.pathname.startsWith('/users') || location.pathname.startsWith('/delete'))
                          ? 'active'
                          : ''
                      }
                    >
                      {item.name}
                    </StyledNavLink>
                    {manageDropdownVisible && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: '0',
                          backgroundColor: 'black',
                          color: 'pink',
                          borderRadius: '5px',
                          border: '3px solid pink',
                        }}
                      >
                        <Link to="/users" style={{ display: 'block', padding: '8px 30px' }}>
                          User
                        </Link>
                        <Link to="/delete" style={{ display: 'block', padding: '8px 30px' }}>
                          Turf
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <StyledNavLink
                    to={item.path}
                    className={
                      (item.path === '/book' && location.pathname.startsWith('/book')) ||
                      (item.path !== '/profile' && location.pathname === item.path)
                        ? 'active'
                        : ''
                    }
                  >
                    {item.name}
                  </StyledNavLink>
                )}
              </NavItem>
            );
          })}
        </NavLeft>

        <NavRight>
          {navigationRight.map((item) => {
            if (item.name === 'Profile') {
              return (
                <NavItem
                  key={item.name}
                  onMouseEnter={() => setDropdownVisible(true)}
                  onMouseLeave={() => setDropdownVisible(false)}
                  style={{ position: 'relative' }}
                >
                  <StyledNavLink
                    to={item.path}
                    className={location.pathname === item.path ? 'active' : ''}
                  >
                    <img
                      src={ProfilePhote}
                      alt="Profile"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        marginRight:'-60px'
                      }}
                    />
                  </StyledNavLink>
                  {dropdownVisible && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '0',
                        backgroundColor: 'black',
                        color: 'pink',
                        borderRadius: '5px',
                        border: '3px solid pink',
                        zIndex: 1,
                      }}
                    >
                      <Link to="/profile" style={{ display: 'block', padding: '8px 16px' }}>
                        Profile
                      </Link>
                      <Link to="/history" style={{ display: 'block', padding: '8px 16px' }}>
                        History
                      </Link>
                      <Link to = "/logout" style={{ display: 'block', padding: '8px 16px' }}>
                        Logout
                      </Link>
                    </div>
                  )}
                </NavItem>
              );
            }
            return (
              <NavItem key={item.name}>
                <StyledNavLink
                  to={item.path}
                  className={
                    item.path !== '/profile' && location.pathname === item.path ? 'active' : ''
                  }
                >
                  {item.name}
                </StyledNavLink>
              </NavItem>
            );
          })}
        </NavRight>
      </NavList>
    </Navigation>
  );
}

export default NavBar;
