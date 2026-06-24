import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage";
import SummarizePage from "./pages/SummarizePage";
import MarketNewsPage from "./pages/MarketNewsPage";
import TranslatePage from "./pages/TranslatePage";
import KeywordPage from "./pages/KeyWordPage";
import NERPage from "./pages/NERPage";
import StockDetails from "./pages/StockDetails";
import IndianStockDetails from "./pages/INDstockDetails";
import RedditTrends from "./pages/RedditTrendPage";
import NewsImpactPage from "./pages/NewsImpactPage";
import ComparePage from "./pages/ComparePage";
import ScreenerPage from "./pages/ScreenerPage";
// Import other pages as you build them

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
<Route path="/summarize" element={<SummarizePage />} />
<Route path="/market-news" element={<MarketNewsPage />} />
<Route path="/translate" element={<TranslatePage />} />
<Route path="/keywords" element={<KeywordPage />} />
<Route path="/ner" element={<NERPage />} />
<Route path="/us-stock-details" element={<StockDetails />} />
<Route path="/ind-stock-details" element={<IndianStockDetails />} />
<Route path="/trends" element={<RedditTrends />} />
<Route path="/news-impact" element={<NewsImpactPage />} />
<Route path="/compare" element={<ComparePage />} />
<Route path="/screener" element={<ScreenerPage/>}/>
        {/* Other routes will go here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
