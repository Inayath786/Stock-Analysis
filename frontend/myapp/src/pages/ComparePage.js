import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function ComparePage() {
  const [symbols, setSymbols] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchComparison = async () => {
    if (!symbols.trim()) {
      alert("Enter at least one symbol");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://stock-analysis-backend-xvm4.onrender.com/api/compare?symbols=${symbols}`
      );
      const result = await res.json();
      setData(result.results || []);
    } catch (err) {
      console.error(err);
      alert("Error fetching stock comparison.");
    }
    setLoading(false);
  };

  const labels = data.map((s) => s.symbol);
  const priceData = data.map((s) => s.price || 0);
  const marketCapData = data.map((s) =>
    s.marketCap ? s.marketCap / 1e9 : 0
  );
  const peData = data.map((s) => (s.pe ? s.pe : 0));

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return context.dataset.label + ": " + context.formattedValue;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    animation: {
      duration: 1200,
      easing: "easeOutQuart",
    },
  };

  const sectionStyle = {
    background: "#1b2735",
    borderRadius: "8px",
    padding: "1.5rem",
    marginBottom: "2rem",
    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
    color: "#f0f2f5",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "2rem",
        fontFamily: "Segoe UI, Roboto, sans-serif",
      }}
    >
      <motion.h2
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          color: "#0ef0ad",
          fontWeight: 700,
          fontSize: "2.5rem",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        📊 Stock Comparison
      </motion.h2>

      <motion.div
        style={{
          display: "flex",
          marginBottom: "2rem",
          justifyContent: "center",
          gap: "1rem",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.input
          value={symbols}
          onChange={(e) => setSymbols(e.target.value)}
          placeholder="e.g. RELIANCE.NS, TCS.NS"
          style={{
            padding: "0.8rem 1rem",
            width: "60%",
            borderRadius: "6px",
            border: "1px solid #0ef0ad",
            fontSize: "1rem",
            background: "#0e1c2f",
            color: "#f0f2f5",
          }}
          whileFocus={{ scale: 1.02 }}
        />
        <motion.button
          onClick={fetchComparison}
          style={{
            background: "#0ef0ad",
            color: "#0e1c2f",
            border: "none",
            padding: "0.8rem 1.5rem",
            cursor: "pointer",
            borderRadius: "6px",
            fontWeight: "bold",
            fontSize: "1rem",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
        >
          {loading ? "Loading..." : "Compare"}
        </motion.button>
      </motion.div>

      {data.length > 0 && (
        <>
          <motion.div
            style={sectionStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 style={{ marginBottom: "1rem", color: "#0ef0ad" }}>
              Price Comparison
            </h3>
            <Bar
              data={{
                labels,
                datasets: [
                  {
                    label: "Price (₹ or $)",
                    data: priceData,
                    backgroundColor: "#0ef0ad",
                  },
                ],
              }}
              options={chartOptions}
            />
          </motion.div>

          <motion.div
            style={sectionStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <h3 style={{ marginBottom: "1rem", color: "#0ef0ad" }}>
              Market Cap (in Billions)
            </h3>
            <Bar
              data={{
                labels,
                datasets: [
                  {
                    label: "Market Cap (B)",
                    data: marketCapData,
                    backgroundColor: "#ff9800",
                  },
                ],
              }}
              options={chartOptions}
            />
          </motion.div>

          <motion.div
            style={sectionStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            <h3 style={{ marginBottom: "1rem", color: "#0ef0ad" }}>
              PE Ratio Comparison
            </h3>
            <Bar
              data={{
                labels,
                datasets: [
                  {
                    label: "PE Ratio",
                    data: peData,
                    backgroundColor: "#36a2eb",
                  },
                ],
              }}
              options={chartOptions}
            />
          </motion.div>

          <motion.div
            style={sectionStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <h3 style={{ marginBottom: "1rem", color: "#0ef0ad" }}>
              Stock Details
            </h3>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                color: "#f0f2f5",
              }}
            >
              <thead
                style={{
                  backgroundColor: "#0ef0ad",
                  color: "#0e1c2f",
                }}
              >
                <tr>
                  <th style={{ padding: "12px", textAlign: "left" }}>
                    Symbol
                  </th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>
                    Dividend Yield
                  </th>
                  <th style={{ padding: "12px", textAlign: "left" }}>
                    52W High
                  </th>
                  <th style={{ padding: "12px", textAlign: "left" }}>
                    52W Low
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((stock, index) => (
                  <motion.tr
                    key={index}
                    style={{
                      backgroundColor:
                        index % 2 === 0 ? "rgba(255,255,255,0.05)" : "transparent",
                    }}
                    whileHover={{ backgroundColor: "rgba(14, 240, 173, 0.2)" }}
                  >
                    <td style={{ padding: "10px" }}>{stock.symbol}</td>
                    <td style={{ padding: "10px" }}>{stock.name}</td>
                    <td style={{ padding: "10px" }}>
                      {stock.dividendYield !== null
                        ? `${(stock.dividendYield * 100).toFixed(2)}%`
                        : "N/A"}
                    </td>
                    <td style={{ padding: "10px" }}>{stock.fiftyTwoWeekHigh}</td>
                    <td style={{ padding: "10px" }}>{stock.fiftyTwoWeekLow}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

export default ComparePage;
