import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import Apparel from './Apparel.tsx';
import Products from './Products.tsx';
import ProductDetails from './ProductDetails.tsx';
import Checkout from './Checkout.tsx';
import MarketNews from './MarketNews.tsx';
import Trading from './Trading.tsx';
import About from './About.tsx';
import FAQ from './FAQ.tsx';
import Contact from './Contact.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/apparel" element={<Apparel />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/market-news" element={<MarketNews />} />
        <Route path="/trading" element={<Trading />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
