import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function NERPage() {
  const [text, setText] = useState("");
  const [entities, setEntities] = useState(null);
  const [error, setError] = useState("");

  const handleNER = async () => {
    try {
      setError("");
      setEntities(null);

      const res = await axios.post("https://stock-analysis-backend-xvm4.onrender.com/api/ner", {
        text,
      });

      setEntities(res.data);
    } catch (err) {
      console.error(err);
      setError("NER processing failed.");
    }
  };

  const containerStyle = {
    maxWidth: "900px",
    margin: "50px auto",
    fontFamily: "Segoe UI, Roboto, sans-serif",
    backgroundColor: "#0e1c2f",
    color: "#f0f2f5",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 0 12px rgba(0,255,163,0.2)",
  };

  const headingStyle = {
    fontSize: "2rem",
    textAlign: "center",
    color: "#0ef0ad",
    marginBottom: "1.5rem",
  };

  const textareaStyle = {
    width: "100%",
    height: "120px",
    padding: "1rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #0ef0ad",
    background: "#121212",
    color: "#f0f2f5",
    resize: "none",
    marginBottom: "1rem",
  };

  const buttonStyle = {
    background: "#0ef0ad",
    color: "#0e1c2f",
    border: "none",
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    display: "block",
    margin: "0 auto",
    transition: "all 0.3s",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1.5rem",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "8px",
    overflow: "hidden",
    backdropFilter: "blur(10px)",
  };

  const thStyle = {
    padding: "12px",
    background: "#0ef0ad",
    color: "#0e1c2f",
    fontWeight: "bold",
  };

  const tdStyle = {
    padding: "12px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  };

  const errorStyle = {
    color: "#ff4d4f",
    textAlign: "center",
    marginTop: "1rem",
    fontWeight: "bold",
  };

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        style={headingStyle}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        🧠 Named Entity Recognition (NER)
      </motion.h2>

      <textarea
        style={textareaStyle}
        value={text}
        placeholder="Enter a news article, paragraph or sentence here..."
        onChange={(e) => setText(e.target.value)}
      />

      <motion.button
        style={buttonStyle}
        onClick={handleNER}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Extract Entities
      </motion.button>

      {error && <div style={errorStyle}>{error}</div>}

      {entities && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 style={{ marginTop: "2rem", color: "#0ef0ad" }}>
            Detected Entities:
          </h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Word</th>
                <th style={thStyle}>Entity</th>
                <th style={thStyle}>Confidence Score</th>
              </tr>
            </thead>
            <tbody>
              {entities.length > 0 ? (
                entities.map((ent, idx) => (
                  <motion.tr
                    key={idx}
                    whileHover={{
                      backgroundColor: "rgba(14, 240, 173, 0.1)",
                    }}
                  >
                    <td style={tdStyle}>{ent.word}</td>
                    <td style={tdStyle}>{ent.entity_group}</td>
                    <td style={tdStyle}>{ent.score?.toFixed(4)}</td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} style={tdStyle}>
                    No entities found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      )}
    </motion.div>
  );
}

export default NERPage;
