import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const TranslatePage = () => {
  const [text, setText] = useState("");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTranslate = async () => {
    if (!text.trim()) {
      setError("Please enter some text to translate.");
      return;
    }

    setLoading(true);
    setError(null);
    setTranslation("");

    try {
      const res = await axios.post("http://localhost:4000/api/translate", {
        text,
      });

      if (res.data.error) {
        setError(res.data.error);
      } else {
        setTranslation(res.data.translation);
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Translation failed. Try again.");
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
      <h2 style={headingStyle}>🌐 Translate English → Hindi</h2>

      <textarea
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter English text here..."
        style={textareaStyle}
        disabled={loading}
      />

      <motion.button
        onClick={handleTranslate}
        disabled={loading || text.trim() === ""}
        style={buttonStyle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {loading ? "Translating..." : "Translate"}
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

      {translation && (
        <motion.div
          style={resultStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 style={translationHeading}>Translation:</h3>
          <p>{translation}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

// ---------- Styles ----------

const pageStyle = {
  maxWidth: "700px",
  margin: "50px auto",
  background: "#0e1c2f",
  color: "#f0f2f5",
  borderRadius: "12px",
  padding: "3rem",
  fontFamily: "Segoe UI, sans-serif",
  boxShadow: "0 0 20px rgba(0, 255, 163, 0.2)",
};

const headingStyle = {
  textAlign: "center",
  color: "#0ef0ad",
  marginBottom: "2rem",
  fontSize: "2.2rem",
  fontWeight: "700",
};

const textareaStyle = {
  width: "100%",
  padding: "1rem",
  fontSize: "1rem",
  borderRadius: "8px",
  background: "#121212",
  color: "#f0f2f5",
  border: "1px solid #0ef0ad",
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

const errorStyle = {
  marginTop: "1rem",
  background: "rgba(255,77,79,0.1)",
  color: "#ff4d4f",
  padding: "12px",
  borderRadius: "6px",
};

const resultStyle = {
  marginTop: "2rem",
  background: "rgba(255, 255, 255, 0.05)",
  padding: "1.5rem",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.1)",
};

const translationHeading = {
  color: "#0ef0ad",
  marginBottom: "1rem",
  fontSize: "1.3rem",
};

export default TranslatePage;
