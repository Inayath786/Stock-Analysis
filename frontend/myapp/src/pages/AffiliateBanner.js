import React from "react";

function AffiliateBanner() {
  return (
    <div
      style={{
        marginTop: "20px",
        padding: "15px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: "18px", marginBottom: "10px",color:"black" }}>
        🚀 Want to start investing? Try from Angel One Indias trusted SEBI Registered Broker
      </p>
      <a
        href="https://angel-one.onelink.me/Wjgr/ibc9bw04"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "4px",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Open ANGEL ONE Free Demat Account  
      </a>
      <p style={{ fontSize: "18px", marginBottom: "10px" ,color:"black"}}>
        🚀 Want to start investing Cryptos? Try from COIN SWITCH Indias trusted Cryptos Broker
      </p>
        <a
        href="https://coinswitch.co/in/refer?tag=RkxBq"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "4px",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Open COIN SWITCH Account  
      </a>
    </div>
  );
}

export default AffiliateBanner;
