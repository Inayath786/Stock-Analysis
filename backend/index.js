import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import yahooFinance from "yahoo-finance2";
import { nifty50Symbols } from "../backend/nifty50.js";
import cors from "cors"
import googleTrends from "google-trends-api"



dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());

const HUGGING_FACE_TRANSLATION_URL =
  "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-en-hi";

app.post("/api/translate", async (req, res) => {
  try {
    const { text } = req.body;

    const response = await axios.post(
      HUGGING_FACE_TRANSLATION_URL,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
      }
    );

    let translated = "";

    if (Array.isArray(response.data) && response.data.length > 0) {
      translated = response.data[0].translation_text;
    } else if (response.data.translation_text) {
      translated = response.data.translation_text;
    } else if (response.data.error) {
      return res.status(500).json({ error: response.data.error });
    } else {
      return res.status(500).json({ error: "Empty or unexpected response." });
    }

    res.json({ translation: translated });
  } catch (error) {
    console.error(error?.response?.data || error);
    res.status(500).json({ error: "Something went wrong." });
  }
});



const HUGGING_FACE_SUMMARIZATION_URL =
  "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

app.post("/api/summarize", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Please provide some text." });
    }

    const response = await axios.post(
      HUGGING_FACE_SUMMARIZATION_URL,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
      }
    );

    if (Array.isArray(response.data) && response.data.length > 0) {
      const summary = response.data[0].summary_text;
      res.json({ summary });
    } else if (response.data.error) {
      res.status(500).json({ error: response.data.error });
    } else {
      res.status(500).json({ error: "Unexpected or empty summarization result." });
    }
  } catch (error) {
    console.error("Summarization error:", error?.response?.data || error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

const HUGGING_FACE_QA_URL =
  "https://api-inference.huggingface.co/models/deepset/roberta-base-squad2";

app.post("/api/qa", async (req, res) => {
  try {
    const { question, context } = req.body;

    if (!question || !context) {
      return res.status(400).json({
        error: "Please provide both 'question' and 'context' in the request body.",
      });
    }

    const payload = {
      inputs: {
        question: question,
        context: context,
      },
    };

    const response = await axios.post(
      HUGGING_FACE_QA_URL,
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
      }
    );

    if (response.data?.answer) {
      res.json({
        answer: response.data.answer,
        score: response.data.score,
      });
    } else if (response.data.error) {
      res.status(500).json({ error: response.data.error });
    } else {
      res.status(500).json({ error: "Unexpected or empty QA response." });
    }
  } catch (error) {
    console.error(error?.response?.data || error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

const HUGGING_FACE_KEYWORD_URL =
  "https://api-inference.huggingface.co/models/ml6team/keyphrase-extraction-kbir-inspec";

app.post("/api/keywords", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res
        .status(400)
        .json({ error: "Please provide news text for keyword extraction." });
    }

    const response = await axios.post(
      HUGGING_FACE_KEYWORD_URL,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error?.response?.data || error);
    res.status(500).json({ error: "Keyword extraction failed." });
  }
});

const HUGGING_FACE_NER_URL =
  "https://api-inference.huggingface.co/models/dbmdz/bert-large-cased-finetuned-conll03-english";

app.post("/api/ner", async (req, res) => {
  try {
    const { text } = req.body;

    const response = await axios.post(
      HUGGING_FACE_NER_URL,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error?.response?.data || error);
    res.status(500).json({ error: "NER processing failed." });
  }
});


const NEWS_API_URL =
  "https://newsdata.io/api/1/news?apikey=" +
  process.env.NEWSDATA_API_KEY +
  "&q=stock market&language=en";

app.get("/api/market-news", async (req, res) => {
  try {
    console.log("Fetching news...");

    const newsResponse = await axios.get(NEWS_API_URL);

    console.log("News API returned:", newsResponse.data);

    const articles = newsResponse.data.results;

    if (!articles || articles.length === 0) {
      return res.status(500).json({
        error: "No news articles found.",
      });
    }

    const firstArticle = articles[0]?.description || articles[0]?.title || "";

    if (!firstArticle) {
      return res.status(500).json({
        error: "Article has no text to summarize.",
      });
    }

    console.log("Article to summarize:", firstArticle);

    const summaryRes = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      { inputs: firstArticle },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
      }
    );

    console.log("Summary result:", summaryRes.data);

    const summaryText = summaryRes.data[0]?.summary_text || "";

   const sentimentRes = await axios.post(
  "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment",
  { inputs: summaryText },
  {
    headers: {
      Authorization: `Bearer ${process.env.HF_API_KEY}`,
    },
  }
);


   console.log("Sentiment result:", sentimentRes.data);

let sentimentLabel = "Unknown";
let sentimentScore = null;

if (Array.isArray(sentimentRes.data) && sentimentRes.data.length > 0) {
  sentimentLabel = sentimentRes.data[0].label;
  sentimentScore = sentimentRes.data[0].score;
}

res.json({
  headline: articles[0]?.title,
  summary: summaryText,
  sentiment: sentimentLabel,
  score: sentimentScore,
});

  } catch (error) {
    console.error("API error:", error?.response?.data || error.message);
    res.status(500).json({
      error: error?.response?.data || "Something went wrong.",
    });
  }
});

 // Replace with your key

// Utility to get default date range (past 1 month)
const getDateRange = () => {
  const to = new Date();
  const from = new Date();
  from.setMonth(from.getMonth() - 1);

  const format = (date) => date.toISOString().split('T')[0];

  return {
    from: format(from),
    to: format(to),
  };
};
app.get('/company-news', async (req, res) => {
  const symbol = req.query.symbol;
  if (!symbol) return res.status(400).json({ error: 'Missing required "symbol" parameter' });

  const from = new Date();
  from.setMonth(from.getMonth() - 1);
  const to = new Date();

  const fromStr = from.toISOString().split('T')[0];
  const toStr = to.toISOString().split('T')[0];

  const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${fromStr}&to=${toStr}&token=${process.env.FINNHUB_API_KEY}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error("Finnhub API Error:", err.message); // Show error clearly
    res.status(500).json({ error: 'Error fetching company news from Finnhub.' });
  }
});



// Debug unknown routes


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
  let symbol = req.params.symbol.toUpperCase();
  if (!symbol.endsWith(".NS")) {
    symbol += ".NS";
  }

  try {
  const quote = await yahooFinance.quote(symbol, {
  modules: ["price", "summaryDetail", "defaultKeyStatistics", "financialData"],
});


    const historical = await yahooFinance.chart(symbol, {
      interval: "1d",
      period1: "2024-01-01",
      period2: "2024-07-01",
    });

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
  eps: quote.epsTrailingTwelveMonths,
  roe: quote.financialData?.returnOnEquity?.raw * 100,
  bookValue: quote.defaultKeyStatistics?.bookValue,
  faceValue: quote.price?.regularMarketDayHigh, // Replace with correct value if available
  dividendYield: quote.summaryDetail?.dividendYield?.raw * 100,
  roce: null, // Not directly available in Yahoo Finance API
  historical: historical,
});

  } catch (error) {
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
    console.log("Calling Hugging Face...");
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

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
  });
});


app.get("/test", (req, res) => {
  res.send("Backend working!");
});



app.listen(3000, () => {
  console.log("Server running on port 3000");
});
