

import React, { useState, useEffect } from "react";

const Imager = () => {
  const [base64String, setBase64String] = useState("");



  useEffect(() => {
    console.log(localStorage.getItem("uploaded"))
    const storedBase64 = localStorage.getItem("uploaded");
    if (storedBase64) {
      setBase64String(storedBase64);
    }
  }, []);

  return (
    <div>
      <h3>Stored Base64 Image:</h3>
      {base64String ? (
        <img
          src={base64String}
          alt="Stored Image"
          style={{ maxWidth: "300px", border: "1px solid #ccc" }}
        />
      ) : (
        <p>No image found in storage</p>
      )}
    </div>
  );
};

export default Imager;
