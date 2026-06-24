import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function MarketNewsPage() {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchNews = async () => {
    setLoading(true);
    setError("");
    setNews(null);

    try {
      const res = await axios.get("https://stock-analysis-backend-xvm4.onrender.com/api/market-news");
      console.log("NEWS DATA", res.data);
      setNews(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to fetch news.");
    } finally {
      setLoading(false);
    }
  };

  const pageStyle = {
    maxWidth: "800px",
    margin: "60px auto",
    fontFamily: "Segoe UI, Roboto, sans-serif",
    padding: "2rem",
    background: "#0e1c2f",
    borderRadius: "12px",
    boxShadow: "0 0 12px rgba(0, 255, 163, 0.2)",
    color: "#f0f2f5",
  };

  const headingStyle = {
    fontSize: "2.5rem",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "2rem",
    color: "#0ef0ad",
  };

  const buttonStyle = {
    display: "block",
    margin: "0 auto",
    padding: "0.9rem 2rem",
    fontSize: "1rem",
    backgroundColor: "#0ef0ad",
    color: "#0e1c2f",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  };

  const errorStyle = {
    color: "#ff4d4f",
    textAlign: "center",
    marginTop: "1rem",
    fontWeight: "bold",
  };

  const resultStyle = {
    marginTop: "2rem",
    padding: "1.5rem",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "8px",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  };

  const sectionHeading = {
    color: "#0ef0ad",
    marginBottom: "0.5rem",
  };

  return (
    <motion.div
      style={pageStyle}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h1
        style={headingStyle}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        📰 Market News
      </motion.h1>

      <motion.button
        style={buttonStyle}
        onClick={fetchNews}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={loading}
      >
        {loading ? "Fetching..." : "Fetch Latest Market News"}
      </motion.button>

      {error && <motion.div style={errorStyle}>{error}</motion.div>}

      {news && (
        <motion.div
          style={resultStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div>
            <h3 style={sectionHeading}>🧠 Headline</h3>
            <p style={{ marginBottom: "1rem" }}>{news.headline}</p>
          </div>

          <div>
            <h3 style={sectionHeading}>📝 Summary</h3>
            <p style={{ marginBottom: "1rem" }}>{news.summary}</p>
          </div>

          <div>
            <h3 style={sectionHeading}>📈 Sentiment</h3>
            <p>
              {news.sentiment}{" "}
              <span style={{ opacity: 0.7 }}>
                (Score: {news.score?.toFixed(3)})
              </span>
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default MarketNewsPage;
