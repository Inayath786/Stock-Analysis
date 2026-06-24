import React, { useState } from "react";
import { motion } from "framer-motion";

function ScreenerPage() {
  const [peBelow, setPeBelow] = useState("");
  const [marketCapAbove, setMarketCapAbove] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    let url = "https://stock-analysis-backend-xvm4.onrender.com/api/screener";

    const params = [];
    if (peBelow) params.push(`peBelow=${peBelow}`);
    if (marketCapAbove) params.push(`marketCapAbove=${marketCapAbove}`);
    if (params.length > 0) url += "?" + params.join("&");

    setLoading(true);
    try {
      const res = await fetch(url);
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error(error);
      alert("Error fetching screener data.");
    }
    setLoading(false);
  };

  const pageStyle = {
    maxWidth: "1200px",
    margin: "60px auto",
    background: "#0e1c2f",
    padding: "3rem",
    borderRadius: "12px",
    color: "#f0f2f5",
    fontFamily: "Segoe UI, sans-serif",
    boxShadow: "0 0 20px rgba(0, 255, 163, 0.1)",
  };

  const headingStyle = {
    textAlign: "center",
    color: "#0ef0ad",
    fontSize: "2.5rem",
    marginBottom: "2rem",
    fontWeight: 700,
  };

  const inputStyle = {
    flex: 1,
    padding: "14px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #0ef0ad",
    background: "#121212",
    color: "#f0f2f5",
    marginRight: "10px",
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
    transition: "all 0.3s ease",
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.06)",
    borderRadius: "8px",
    padding: "1.5rem",
    marginBottom: "1.5rem",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(8px)",
  };

  const labelStyle = {
    color: "#0ef0ad",
    fontWeight: "bold",
    marginRight: "10px",
  };

  return (
    <motion.div
      style={pageStyle}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2
        style={headingStyle}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        📊 Stock Screener
      </motion.h2>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2.5rem",
          flexWrap: "wrap",
        }}
      >
        <input
          type="number"
          placeholder="PE Ratio below..."
          value={peBelow}
          onChange={(e) => setPeBelow(e.target.value)}
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Market Cap above (₹)"
          value={marketCapAbove}
          onChange={(e) => setMarketCapAbove(e.target.value)}
          style={inputStyle}
        />
        <motion.button
          style={buttonStyle}
          onClick={handleSearch}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
        >
          {loading ? "Loading..." : "Screen"}
        </motion.button>
      </div>

      {!loading && results.length === 0 && (
        <motion.p
          style={{ textAlign: "center", color: "#aaa" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No results yet. Enter filters and search.
        </motion.p>
      )}

      {results.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.2 },
            },
          }}
        >
          {results.map((stock, index) => (
            <motion.div
              key={index}
              style={cardStyle}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(14, 240, 173, 0.1)" }}
            >
              <p>
                <span style={labelStyle}>Symbol:</span> {stock.symbol}
              </p>
              <p>
                <span style={labelStyle}>Name:</span> {stock.name}
              </p>
              <p>
                <span style={labelStyle}>Price:</span> ₹{stock.price?.toLocaleString()}
              </p>
              <p>
                <span style={labelStyle}>PE Ratio:</span>{" "}
                {stock.pe ?? "N/A"}
              </p>
              <p>
                <span style={labelStyle}>Market Cap:</span>{" "}
                {stock.marketCap
                  ? `₹ ${(stock.marketCap / 1e7).toFixed(2)} Cr`
                  : "N/A"}
              </p>
              <p>
                <span style={labelStyle}>Dividend Yield:</span>{" "}
                {stock.dividendYield !== null
                  ? (stock.dividendYield * 100).toFixed(2) + "%"
                  : "N/A"}
              </p>
              <p>
                <span style={labelStyle}>52W High:</span>{" "}
                {stock.fiftyTwoWeekHigh ?? "N/A"}
              </p>
              <p>
                <span style={labelStyle}>52W Low:</span>{" "}
                {stock.fiftyTwoWeekLow ?? "N/A"}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

export default ScreenerPage;
