import React, { useState } from "react";
import { motion } from "framer-motion";

function NewsImpactPage() {
  const [newsText, setNewsText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!newsText.trim()) {
      alert("Please enter some news text.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/news-impact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newsText }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Error analyzing news impact.");
    }
    setLoading(false);
  };

  const containerStyle = {
    maxWidth: "850px",
    margin: "60px auto",
    fontFamily: "Segoe UI, sans-serif",
    padding: "2rem",
    background: "#0e1c2f",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(0, 255, 163, 0.15)",
    color: "#f0f2f5",
  };

  const headingStyle = {
    fontSize: "2.2rem",
    textAlign: "center",
    marginBottom: "1.5rem",
    color: "#0ef0ad",
  };

  const textareaStyle = {
    width: "100%",
    height: "150px",
    padding: "1rem",
    fontSize: "1rem",
    borderRadius: "8px",
    backgroundColor: "#121212",
    border: "1px solid #0ef0ad",
    color: "#fff",
    resize: "none",
    marginBottom: "1rem",
  };

  const buttonStyle = {
    display: "block",
    width: "100%",
    padding: "0.9rem",
    fontSize: "1rem",
    backgroundColor: "#0ef0ad",
    color: "#0e1c2f",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  };

  const resultBoxStyle = {
    marginTop: "2rem",
    background: "rgba(255, 255, 255, 0.06)",
    padding: "1.5rem",
    borderRadius: "10px",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  };

  const labelStyle = {
    color: "#0ef0ad",
    fontWeight: "bold",
    marginBottom: "6px",
  };

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <motion.h1
        style={headingStyle}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        🧠 News Impact Analyzer
      </motion.h1>

      <textarea
        style={textareaStyle}
        placeholder="Paste financial news text here..."
        value={newsText}
        onChange={(e) => setNewsText(e.target.value)}
      />

      <motion.button
        style={buttonStyle}
        onClick={handleSubmit}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze Impact"}
      </motion.button>

      {result && (
        <motion.div
          style={resultBoxStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 style={{ color: "#0ef0ad" }}>Prediction</h3>
          <p>
            <span style={labelStyle}>📈 Impact:</span> {result.prediction}
          </p>
          <p>
            <span style={labelStyle}>🔍 Confidence:</span>{" "}
            {(result.confidence * 100).toFixed(2)}%
          </p>
          <p>
            <span style={labelStyle}>📰 Original Text:</span>
          </p>
          <p style={{ color: "#ccc" }}>{result.original_news}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default NewsImpactPage;
