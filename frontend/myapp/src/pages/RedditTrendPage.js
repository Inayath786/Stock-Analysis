import React, { useState } from "react";
import { motion } from "framer-motion";

function RedditTrends() {
  const [keyword, setKeyword] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTrends = async () => {
    if (!keyword.trim()) {
      setError("Please enter a stock name or symbol.");
      return;
    }

    setLoading(true);
    setError("");
    setPosts([]);

    try {
      const res = await fetch(`https://stock-analysis-backend-xvm4.onrender.com/company-news?symbol=${encodeURIComponent(keyword)}`);
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else if (data.reddit) {
        setPosts(data.reddit);
      } else {
        setError("No Reddit posts found.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch trends.");
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    maxWidth: "800px",
    margin: "60px auto",
    background: "#0e1c2f",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 0 12px rgba(0,255,163,0.2)",
    fontFamily: "Segoe UI, sans-serif",
    color: "#f0f2f5",
  };

  const headingStyle = {
    textAlign: "center",
    color: "#0ef0ad",
    fontSize: "2rem",
    marginBottom: "1.5rem",
  };

  const inputStyle = {
    padding: "12px",
    width: "65%",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #0ef0ad",
    backgroundColor: "#121212",
    color: "#f0f2f5",
    marginRight: "10px",
  };

  const buttonStyle = {
    padding: "12px 20px",
    fontSize: "1rem",
    background: "#0ef0ad",
    color: "#0e1c2f",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.06)",
    borderRadius: "10px",
    padding: "1rem",
    marginBottom: "1rem",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(8px)",
  };

  const errorStyle = {
    color: "#ff4d4f",
    marginTop: "1rem",
    textAlign: "center",
  };

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <motion.h2
        style={headingStyle}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        🔎 Reddit Trends
      </motion.h2>

      <div style={{ display: "flex", marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Enter stock or keyword (e.g. Tesla)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={inputStyle}
        />
        <motion.button
          style={buttonStyle}
          onClick={fetchTrends}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </motion.button>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {posts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 style={{ color: "#0ef0ad", marginBottom: "1rem" }}>
            Reddit Posts for: {keyword}
          </h3>
          {posts.map((post, idx) => (
            <motion.div
              key={idx}
              style={cardStyle}
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(14, 240, 173, 0.1)",
              }}
            >
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#0ef0ad",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                {post.title}
              </a>
              <p style={{ marginTop: "8px", color: "#ccc" }}>
                ⬆️ Score: {post.score}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

export default RedditTrends;
