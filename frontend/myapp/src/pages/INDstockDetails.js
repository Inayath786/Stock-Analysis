import React, { useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";


import {
  CandlestickController,
  CandlestickElement,
} from "chartjs-chart-financial";

import { Chart } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import AffiliateBanner from "./AffiliateBanner";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   TimeScale,
//   BarElement,
//   CandlestickController,
//   CandlestickElement,
//   Tooltip,
//   Title,
//   Legend
// );
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Tooltip,
  Legend
);



const formatCurrency = (value) => {
  if (value == null) return "N/A";
  return `₹${Number(value).toLocaleString("en-IN")}`;
};

const formatNumber = (value, decimals = 2) => {
  if (value == null) return "N/A";
  return Number(value).toFixed(decimals);
};

const metricStyles = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    flex: "1 1 180px",
    background: "#ffffff",
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  label: {
    fontSize: "14px",
    color: "#888",
  },
  value: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#007bff",
  },
};

const IndianStockDetails = () => {
  const [symbol, setSymbol] = useState("TCS.NS");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setError("");
    setLoading(true);
    setData(null);
    try {
      const res = await axios.get(
        `https://stock-analysis-backend-xvm4.onrender.com/api/stocks/${symbol}`
      );
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch stock data.");
    } finally {
      setLoading(false);
    }
  };
const renderClosingPriceChart1 = () => {
  if (!data?.historical?.quotes?.length) return null;

  const labels = data.historical.quotes.map((d) => new Date(d.date));
  const closingPrices = data.historical.quotes.map((d) => d.close);

  return (
    <div style={{ marginTop: "30px", width: "100%", maxWidth: "900px" }}>
      <h3>📈 Closing Price Over Time</h3>
      <Chart
        type="line"
        data={{
          labels,
          datasets: [
            {
              label: `${data.symbol} Closing Price`,
              data: closingPrices,
              borderColor: "#007bff",
              backgroundColor: "rgba(0, 123, 255, 0.1)",
              fill: true,
              tension: 0.2,
            },
          ],
        }}
        options={{
          responsive: true,
          scales: {
            x: {
              type: "time",
              time: {
                unit: "day",
              },
            },
            y: {
              beginAtZero: false,
              ticks: {
                callback: function (value) {
                  return `₹${value}`;
                },
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `₹${context.parsed.y.toFixed(2)}`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

const renderClosingPriceChart = () => {
  if (!data?.historical?.quotes?.length) return null;

  const labels = data.historical.quotes.map((d) => new Date(d.date));
  const closingPrices = data.historical.quotes.map((d) => d.close);

  return (
    <div style={{ marginTop: "30px", width: "100%", maxWidth: "900px" }}>
      <h3>📈 Closing Price Over Time</h3>
      <Chart
        type="line"
        data={{
          labels,
          datasets: [
            {
              label: `${data.symbol} Closing Price`,
              data: closingPrices,
              borderColor: "#007bff",
              backgroundColor: "rgba(0, 123, 255, 0.1)",
              fill: true,
              tension: 0.3,
              pointRadius: 2,
              pointHoverRadius: 5,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: "time",
              time: {
                unit: "day",
              },
              title: {
                display: true,
                text: "Date",
              },
            },
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: "Price (₹)",
              },
              ticks: {
                callback: (value) => `₹${value}`,
              },
            },
          },
          plugins: {
            tooltip: {
              mode: "index",
              intersect: false,
              callbacks: {
                label: (context) => `₹${context.parsed.y.toFixed(2)}`,
              },
            },
            legend: {
              display: true,
              position: "top",
            },
          },
        }}
        height={400}
      />
    </div>
  );
};


  const renderVolumeChart = () => {
    if (!data?.historical?.quotes?.length) return null;

    const labels = data.historical.quotes.map((d) => new Date(d.date));
    const volumes = data.historical.quotes.map((d) => d.volume);

    return (
      <div style={{ marginTop: "30px", width: "100%", maxWidth: "900px" }}>
        <h3>📊 Volume</h3>
        <Chart
          type="bar"
          data={{
            labels,
            datasets: [
              {
                label: "Volume",
                data: volumes,
                backgroundColor: "#28a745",
              },
            ],
          }}
          options={{
            responsive: true,
            scales: {
              x: {
                type: "time",
                time: {
                  unit: "day",
                },
              },
            },
          }}
        />
      </div>
    );
  };

  const renderDividends = () => {
    const divs = data?.historical?.events?.dividends;
    if (!divs?.length) return null;

    return (
      <div style={{ marginTop: "20px" }}>
        <h3>💰 Dividends</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {divs.map((d, i) => (
            <li key={i} style={{ marginBottom: "10px" }}>
              •{" "}
              {new Date(d.date * 1000).toLocaleDateString("en-IN")}:{" "}
              <strong>{formatCurrency(d.amount)}</strong>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderAllMetrics = () => {
    if (!data) return null;

    const metrics = [
      { label: "Symbol", value: data.symbol },
      { label: "Company Name", value: data.name },
      { label: "Price", value: formatCurrency(data.price) },
      { label: "Change", value: formatNumber(data.change) },
      { label: "Percent Change", value: formatNumber(data.percentChange) + "%" },
      { label: "Market Cap", value: formatCurrency(data.marketCap) },
      { label: "PE Ratio", value: formatNumber(data.peRatio) },
      { label: "52 Week High", value: formatCurrency(data.fiftyTwoWeekHigh) },
      { label: "52 Week Low", value: formatCurrency(data.fiftyTwoWeekLow) },
      { label: "Dividend Yield", value: formatNumber(data.dividendYield) },
      { label: "ROCE", value: formatNumber(data.roce) },
      { label: "ROE", value: formatNumber(data.roe) },
      { label: "Book Value", value: formatCurrency(data.bookValue) },
      { label: "Face Value", value: formatCurrency(data.faceValue) },
    ];

    return (
      <div style={metricStyles.container}>
        {metrics.map((metric, idx) => (
          <div key={idx} style={metricStyles.card}>
            <div style={metricStyles.label}>{metric.label}</div>
            <div style={metricStyles.value}>{metric.value}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>📈 Indian Stock Details</h2>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Enter Symbol (e.g. TCS.NS)"
          style={{
            padding: "8px",
            width: "250px",
            marginRight: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={fetchData}
          disabled={loading}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {loading ? "Loading..." : "Get Details"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <>
          <h3>
            {data.name} ({data.symbol})
          </h3>
          <h1 style={{ color: data.change > 0 ? "green" : "red" }}>
            {formatCurrency(data.price)} | Change:{" "}
            {formatNumber(data.change)} (
            {formatNumber(data.percentChange)}%)
          </h1>

          {renderAllMetrics()}
          {renderClosingPriceChart()}
       
          {renderVolumeChart()}
          {renderDividends()}
        </>
      )}
      <AffiliateBanner/>
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
      
    </div>
  );
};

export default IndianStockDetails;
