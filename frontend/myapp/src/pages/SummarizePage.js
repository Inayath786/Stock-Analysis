import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function SummarizePage() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError("Please enter some text to summarize.");
      return;
    }

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const res = await axios.post("/api/summarize", { text });
      setSummary(res.data.summary);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.error || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      style={pageStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 style={headingStyle}>📝 Summarize Text</h1>

      <textarea
        style={textareaStyle}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter or paste text here..."
        disabled={loading}
      />

      <motion.button
        style={buttonStyle}
        onClick={handleSummarize}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={loading}
      >
        {loading ? "Summarizing..." : "Summarize"}
      </motion.button>

      {error && (
        <motion.div
          style={errorStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          ⚠️ {error}
        </motion.div>
      )}

      {summary && (
        <motion.div
          style={resultStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 style={resultHeading}>Summary</h3>
          <p>{summary}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

const pageStyle = {
  maxWidth: "800px",
  margin: "60px auto",
  background: "#0e1c2f",
  padding: "3rem",
  borderRadius: "12px",
  color: "#f0f2f5",
  fontFamily: "Segoe UI, sans-serif",
  boxShadow: "0 0 20px rgba(0, 255, 163, 0.1)",
};

const headingStyle = {
  color: "#0ef0ad",
  fontSize: "2.5rem",
  textAlign: "center",
  marginBottom: "2rem",
  fontWeight: 700,
};

const textareaStyle = {
  width: "100%",
  minHeight: "200px",
  padding: "1rem",
  fontSize: "1rem",
  borderRadius: "8px",
  border: "1px solid #0ef0ad",
  background: "#121212",
  color: "#f0f2f5",
  marginBottom: "1.5rem",
};

const buttonStyle = {
  background: "#0ef0ad",
  color: "#0e1c2f",
  border: "none",
  padding: "14px 30px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "1rem",
};

const resultStyle = {
  marginTop: "2rem",
  background: "rgba(255,255,255,0.05)",
  padding: "1.5rem",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.1)",
};

const resultHeading = {
  color: "#0ef0ad",
  fontSize: "1.3rem",
  marginBottom: "1rem",
};

const errorStyle = {
  marginTop: "1rem",
  color: "#ff4d4f",
  background: "rgba(255,77,79,0.1)",
  padding: "10px",
  borderRadius: "6px",
};

export default SummarizePage;
