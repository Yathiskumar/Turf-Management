import React, { useEffect } from 'react';

const Logout = () => {
  useEffect(() => {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };
    handleLogout();
  }, []);

  return null;
};

export default Logout;
