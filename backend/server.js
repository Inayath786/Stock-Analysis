
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
import yahooFinance from "yahoo-finance2";
import { nifty50Symbols } from "./nifty50.js";


dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());




const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

app.get("/api/stock/:symbol", async (req, res) => {
  const symbol = req.params.symbol;

  try {
    // Fetch company overview
    const overview = await axios.get("https://www.alphavantage.co/query", {
      params: {
        function: "OVERVIEW",
        symbol,
        apikey: API_KEY,
      },
    });

    // Fetch daily prices
    const prices = await axios.get("https://www.alphavantage.co/query", {
      params: {
        function: "TIME_SERIES_DAILY",
        symbol,
        apikey: API_KEY,
      },
    });

    // Fetch SMA (10-day)
    const sma = await axios.get("https://www.alphavantage.co/query", {
      params: {
        function: "SMA",
        symbol,
        interval: "daily",
        time_period: 10,
        series_type: "close",
        apikey: API_KEY,
      },
    });

    // Fetch earnings
    const earnings = await axios.get("https://www.alphavantage.co/query", {
      params: {
        function: "EARNINGS",
        symbol,
        apikey: API_KEY,
      },
    });

    res.json({
      overview: overview.data,
      dailyPrices: prices.data["Time Series (Daily)"],
      sma: sma.data["Technical Analysis: SMA"],
      earnings: earnings.data.annualEarnings,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch data from Alpha Vantage." });
  }
});


app.get("/api/stocks/:symbol", async (req, res) => {
  const symbol = req.params.symbol.toUpperCase() + ".NS";

  try {
    const quote = await yahooFinance.quote(symbol);

    res.json({
      symbol: quote.symbol,
      name: quote.shortName,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      percentChange: quote.regularMarketChangePercent,
      marketCap: quote.marketCap,
      peRatio: quote.trailingPE,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
    });
  }  catch (error) {
  console.error(error);
  res.status(500).json({
    error: error.message || "Unknown error",
    stack: error.stack,
  });
}
});


app.get("/api/screener", async (req, res) => {
  const { peBelow, marketCapAbove } = req.query;

  const results = [];

  for (let symbol of nifty50Symbols) {
    try {
      const quote = await yahooFinance.quote(symbol);

      // Skip if no data
      if (!quote) continue;

      const pe = quote.trailingPE || 0;
      const marketCap = quote.marketCap || 0;

      // Apply filters
      if (peBelow && pe > Number(peBelow)) continue;
      if (marketCapAbove && marketCap < Number(marketCapAbove)) continue;

      results.push({
        symbol: quote.symbol,
        name: quote.shortName,
        price: quote.regularMarketPrice,
        pe,
        marketCap,
        dividendYield: quote.trailingAnnualDividendYield,
        fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
        fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
      });
    } catch (error) {
      console.error(`Error fetching ${symbol}:`, error.message);
    }
  }

  res.json({
    count: results.length,
    results,
  });
});



// Comparison Route
app.get("/api/compare", async (req, res) => {
  const { symbols } = req.query;

  if (!symbols) {
    return res.status(400).json({
      error: "Please provide comma-separated symbols in ?symbols=",
    });
  }

  const symbolList = symbols.split(",").map((s) => s.trim());
  const results = [];

  for (let symbol of symbolList) {
    try {
      const quote = await yahooFinance.quote(symbol);

      if (!quote) continue;

      results.push({
        symbol: quote.symbol,
        name: quote.shortName,
        price: quote.regularMarketPrice,
        pe: quote.trailingPE,
        marketCap: quote.marketCap,
        dividendYield: quote.trailingAnnualDividendYield,
        fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
        fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
      });
    } catch (error) {
      console.error(`Error fetching ${symbol}:`, error.message);
    }
  }

  res.json({
    count: results.length,
    results,
  });
});


app.post("/api/news-impact", async (req, res) => {
  try {
    const { text } = req.body;

    const HF_API_KEY = process.env.HF_API_KEY;

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/ProsusAI/finbert",
      {
        inputs: text,
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
        },
      }
    );

    const label = response.data[0][0].label;
    const score = response.data[0][0].score;

    let impact;
    if (label === "positive") {
      impact = "likely up";
    } else if (label === "negative") {
      impact = "likely down";
    } else {
      impact = "neutral impact";
    }

    res.json({
      original_news: text,
      prediction: impact,
      confidence: score,
    });

  } catch (error) {
    console.error(error?.response?.data || error.message);
    res.status(500).json({
      error: "Error predicting news impact.",
    });
  }
});



const portfolios = {
  user1: [
    { symbol: "TCS.NS", quantity: 10, buyPrice: 3500 },
    { symbol: "INFY.NS", quantity: 20, buyPrice: 1250 }
  ],
};

app.post("/chatbot", async (req, res) => {
  try {
    const userQuestion = req.body.question;
    const userId = req.body.userId || "user1"; // default for testing

    const HF_API_KEY = process.env.HF_API_KEY;
    const NEWS_API_KEY = process.env.NEWS_API_KEY;

    // 1. Predict intent
    const zeroShotResponse = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
      {
        inputs: userQuestion,
        parameters: {
          candidate_labels: [
            "stock price",
            "company fundamentals",
            "latest news",
            "portfolio summary",
            "other"
          ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
        },
      }
    );

    const intent = zeroShotResponse.data.labels[0];
    console.log("Predicted intent:", intent);

    let answer = "";

    if (intent === "stock price") {
      // Try to extract ticker symbol (e.g. TCS.NS)
      const regex = /\b([A-Z]{2,5}\.NS)\b/;
      const matches = userQuestion.match(regex);

      if (matches && matches.length > 0) {
        const symbol = matches[0];
        const quote = await yahooFinance.quote(symbol);
        answer = `Current price of ${symbol} is ₹${quote.regularMarketPrice}`;
      } else {
        answer = "Please provide a stock symbol like TCS.NS.";
      }

    } else if (intent === "latest news") {
      // Try to extract company name from question
      const words = userQuestion.split(" ");
      let company = words.find((w) => w.length > 2 && w.toUpperCase() !== "NEWS");
      if (!company) {
        company = "stock market";
      }

      const newsRes = await axios.get(
        `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&q=${company}&language=en`
      );

      if (newsRes.data.results && newsRes.data.results.length > 0) {
        const headlines = newsRes.data.results.slice(0, 3).map(n => `- ${n.title}`);
        answer = `Here are latest news about ${company}:\n${headlines.join('\n')}`;
      } else {
        answer = `Sorry, I couldn’t find news for ${company}.`;
      }

    } else if (intent === "portfolio summary") {
      if (!portfolios[userId]) {
        answer = "No portfolio found.";
      } else {
        let summary = "";
        let totalProfit = 0;
        for (const holding of portfolios[userId]) {
          const quote = await yahooFinance.quote(holding.symbol);
          const currentPrice = quote.regularMarketPrice;
          const investedValue = holding.quantity * holding.buyPrice;
          const currentValue = holding.quantity * currentPrice;
          const profit = currentValue - investedValue;
          const profitPercent = ((profit / investedValue) * 100).toFixed(2);

          summary += `\n- ${holding.symbol}: Qty ${holding.quantity}, Current ₹${currentPrice}, P/L ₹${profit.toFixed(2)} (${profitPercent}%)`;
          totalProfit += profit;
        }

        answer = `Your portfolio summary:\n${summary}\n\nTotal Profit/Loss: ₹${totalProfit.toFixed(2)}`;
      }
    } else {
      answer = "Sorry, I couldn’t understand your question.";
    }

    res.json({
      question: userQuestion,
      intent,
      answer
    });

  } catch (error) {
    console.error(error?.response?.data || error.message);
    res.status(500).json({
      error: "Error processing chatbot request.",
    });
  }
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});