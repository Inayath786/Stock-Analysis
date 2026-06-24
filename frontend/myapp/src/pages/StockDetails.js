import React, { useState } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import { motion } from "framer-motion";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import AffiliateBanner from "./AffiliateBanner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function StockDetails() {
  const [symbol, setSymbol] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setError("");
    setData(null);
    if (!symbol.trim()) {
      setError("Please enter a stock symbol.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`https://stock-analysis-backend-xvm4.onrender.com/api/stock/${symbol}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data.");
    }
    setLoading(false);
  };

  const renderCharts = () => {
    if (!data || !data.dailyPrices) return null;

    const dates = Object.keys(data.dailyPrices).reverse();
    const closes = dates.map(
      (date) => parseFloat(data.dailyPrices[date]["4. close"])
    );

    const smaDates = Object.keys(data.sma || {}).reverse();
    const smaValues = smaDates.map(
      (date) => parseFloat(data.sma[date]["SMA"])
    );

    const earnings = data.earnings || [];
    const earningsYears = earnings.map((e) => e.fiscalDateEnding);
    const earningsEPS = earnings.map((e) => parseFloat(e.reportedEPS));

    return (
      <>
        <motion.div
          style={chartCardStyle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 style={cardHeadingStyle}>📈 Daily Close Price</h3>
          <Line
            data={{
              labels: dates,
              datasets: [
                {
                  label: `${symbol.toUpperCase()} Close Price`,
                  data: closes,
                  borderColor: "#0ef0ad",
                  backgroundColor: "rgba(14, 240, 173, 0.2)",
                  fill: true,
                  tension: 0.3,
                },
              ],
            }}
            height={100}
            options={{
              plugins: {
                legend: { display: false },
              },
              scales: {
                x: {
                  ticks: { color: "#aaa" },
                },
                y: {
                  ticks: { color: "#aaa" },
                },
              },
            }}
          />
        </motion.div>

        {smaDates.length > 0 && (
          <motion.div
            style={chartCardStyle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 style={cardHeadingStyle}>📊 10-Day SMA</h3>
            <Line
              data={{
                labels: smaDates,
                datasets: [
                  {
                    label: "SMA",
                    data: smaValues,
                    borderColor: "#ffa500",
                    backgroundColor: "rgba(255,165,0,0.2)",
                    fill: true,
                    tension: 0.3,
                  },
                ],
              }}
              height={100}
              options={{
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  x: { ticks: { color: "#aaa" } },
                  y: { ticks: { color: "#aaa" } },
                },
              }}
            />
          </motion.div>
        )}

        {earnings.length > 0 && (
          <motion.div
            style={chartCardStyle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h3 style={cardHeadingStyle}>💰 Annual Earnings (EPS)</h3>
            <Bar
              data={{
                labels: earningsYears,
                datasets: [
                  {
                    label: "Reported EPS",
                    data: earningsEPS,
                    backgroundColor: "#36a2eb",
                  },
                ],
              }}
              height={100}
              options={{
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  x: { ticks: { color: "#aaa" } },
                  y: { ticks: { color: "#aaa" } },
                },
              }}
            />
          </motion.div>
        )}
      </>
    );
  };

  const fundamentals = data?.overview
    ? [
        { label: "Market Cap", value: data.overview.MarketCapitalization || "-" },
        { label: "PE Ratio", value: data.overview.PERatio || "-" },
        { label: "Dividend Yield", value: data.overview.DividendYield || "-" },
        { label: "52-Week High", value: data.overview["52WeekHigh"] || "-" },
        { label: "52-Week Low", value: data.overview["52WeekLow"] || "-" },
        { label: "Profit Margin", value: data.overview.ProfitMargin || "-" },
        { label: "ROE (TTM)", value: data.overview.ReturnOnEquityTTM || "-" },
        { label: "Debt to Equity", value: data.overview.DebtToEquity || "-" },
      ]
    : [];

  return (
    <motion.div
      style={pageStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 style={headingStyle}>US Stock Details (Alpha Vantage)</h2>

      <div style={searchContainer}>
        <input
          type="text"
          placeholder="Enter symbol (e.g. AAPL)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          style={inputStyle}
        />
        <motion.button
          onClick={handleFetch}
          style={buttonStyle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
        >
          {loading ? "Loading..." : "Fetch"}
        </motion.button>
      </div>

      {error && (
        <motion.p
          style={{ color: "#ff4d4f", marginTop: "10px" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}

      {data && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginTop: "30px" }}
        >
          <h3 style={companyTitle}>
            {data.overview?.Name} ({data.overview?.Symbol})
          </h3>
          <p style={descriptionStyle}>
            {data.overview?.Description || "No description available."}
          </p>

          <ul style={listStyle}>
            <li>
              <span style={labelStyle}>Sector:</span> {data.overview?.Sector}
            </li>
            <li>
              <span style={labelStyle}>Industry:</span> {data.overview?.Industry}
            </li>
          </ul>

          <motion.div
            style={fundamentalsGrid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {fundamentals.map((item, i) => (
              <motion.div
                key={i}
                style={fundamentalsCard}
                whileHover={{ scale: 1.05 }}
              >
                <p style={fundamentalLabel}>{item.label}</p>
                <p style={fundamentalValue}>{item.value}</p>
              </motion.div>
            ))}
          </motion.div>

          {renderCharts()}
        </motion.div>
      )}<AffiliateBanner/>

       {/* Add a coffee button if you want */}
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <a
          href="https://www.buymeacoffee.com/inayath"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            backgroundColor: "#FFDD00",
            color: "#000",
            fontWeight: "bold",
            fontSize: "18px",
            padding: "12px 24px",
            borderRadius: "8px",
            textDecoration: "none",
            boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
            transition: "transform 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          ☕ Buy Me a Coffee
        </a>
      </div>
    </motion.div>
  );
}

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
  color: "#0ef0ad",
  fontSize: "2.5rem",
  textAlign: "center",
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
  marginLeft: "1rem",
};

const searchContainer = {
  display: "flex",
  marginBottom: "2rem",
};

const companyTitle = {
  fontSize: "1.8rem",
  color: "#0ef0ad",
  marginBottom: "0.5rem",
};

const descriptionStyle = {
  fontSize: "1rem",
  color: "#aaa",
  marginBottom: "1.5rem",
};

const listStyle = {
  listStyle: "none",
  padding: 0,
  marginBottom: "2rem",
};

const labelStyle = {
  color: "#0ef0ad",
  fontWeight: "bold",
  marginRight: "10px",
};

const fundamentalsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "1rem",
  marginBottom: "3rem",
};

const fundamentalsCard = {
  background: "rgba(255,255,255,0.05)",
  padding: "1rem",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.1)",
  textAlign: "center",
};

const fundamentalLabel = {
  fontSize: "0.9rem",
  color: "#aaa",
};

const fundamentalValue = {
  fontSize: "1.2rem",
  color: "#f0f2f5",
  fontWeight: "bold",
};

const chartCardStyle = {
  background: "rgba(255,255,255,0.04)",
  borderRadius: "8px",
  padding: "1.5rem",
  marginBottom: "2rem",
};

const cardHeadingStyle = {
  color: "#0ef0ad",
  fontSize: "1.3rem",
  marginBottom: "1rem",
};

export default StockDetails;
