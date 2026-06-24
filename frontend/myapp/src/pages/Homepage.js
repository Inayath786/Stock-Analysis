// src/pages/HomePage.js

import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function HomePage() {
  const navigate = useNavigate();

  const features = [
    { label: "Translate Text", path: "/translate" },
    { label: "Summarize Text", path: "/summarize" },
    { label: "Market News & Summary", path: "/market-news" },
    { label: "US Stock Details", path: "/us-stock-details" },
    { label: "IND Stock Details", path: "/ind-stock-details" },
    { label: "Screener", path: "/screener" },
    { label: "Market Trends", path: "/trends" },
    { label: "Comparison", path: "/compare" },
    { label: "News Impact Prediction", path: "/news-impact" },
    { label: "Keyword Extraction", path: "/keywords" },
    { label: "Named Entity Recognition", path: "/ner" },
  ];

  const containerStyle = {
    maxWidth: "1000px",
    margin: "40px auto",
    textAlign: "center",
    fontFamily: "Segoe UI, Roboto, sans-serif",
    padding: "20px",
    backgroundColor: "#f4f7fa",
    borderRadius: "12px",
    boxShadow: "0 0 20px rgba(0,0,0,0.1)",
  };

  const titleStyle = {
    fontSize: "36px",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#002c4c",
  };

  const descStyle = {
    fontSize: "18px",
    marginBottom: "40px",
    color: "#555",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    justifyContent: "center",
  };

  const buttonStyle = {
    padding: "15px 20px",
    fontSize: "16px",
    fontWeight: "600",
    backgroundColor: "#0e76a8",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        style={titleStyle}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        📈 Stock Insight AI
      </motion.h1>
      <motion.p
        style={descStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Your AI-powered toolkit for stock market analysis. Select a feature below to get started.
      </motion.p>

      <div style={gridStyle}>
        {features.map((feature, index) => (
          <motion.button
            key={feature.path}
            style={buttonStyle}
            onClick={() => navigate(feature.path)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            {feature.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

export default HomePage;
