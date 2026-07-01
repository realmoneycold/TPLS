export interface EconomicEvent {
  id: string;
  time: string;
  country: string;
  impact: string;
  event: string;
  actual: string | number | null;
  estimate: string | number | null;
  prior: string | number | null;
}

export interface MarketNewsItem {
  id: number;
  category: string;
  datetime: number;
  headline: string;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
  timeAgo: string;
}

const generateDynamicMockCalendar = (): EconomicEvent[] => {
  const d = new Date();
  const day = d.getDay();
  const diffToMonday = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diffToMonday));
  
  const getDayStr = (offsetDays: number, hour: number) => {
    const nd = new Date(monday);
    nd.setDate(nd.getDate() + offsetDays);
    nd.setUTCHours(hour, 0, 0, 0);
    return nd.toISOString();
  };

  return [
    { id: '0', time: getDayStr(0, 10), country: 'USD', impact: 'Medium', event: 'Pending Home Sales m/m', actual: null, estimate: '1.2%', prior: '0.8%' },
    { id: '1', time: getDayStr(1, 13), country: 'USD', impact: 'High', event: 'CB Consumer Confidence', actual: null, estimate: 94.2, prior: 93.1 },
    { id: '2', time: getDayStr(1, 14), country: 'USD', impact: 'Medium', event: 'JOLTS Job Openings', actual: null, estimate: '7.28M', prior: '7.62M' },
    { id: '3', time: getDayStr(2, 12), country: 'USD', impact: 'High', event: 'ADP Non-Farm Employment Change', actual: null, estimate: '118K', prior: '122K' },
    { id: '4', time: getDayStr(2, 18), country: 'USD', impact: 'Medium', event: 'Fed Chairman Speaks', actual: null, estimate: null, prior: null },
    { id: '5', time: getDayStr(2, 14), country: 'USD', impact: 'High', event: 'ISM Manufacturing PMI', actual: null, estimate: 53.7, prior: 54.0 },
    { id: '6', time: getDayStr(3, 12), country: 'USD', impact: 'High', event: 'Initial Jobless Claims', actual: null, estimate: '215K', prior: '220K' },
    { id: '7', time: getDayStr(4, 12), country: 'USD', impact: 'High', event: 'Non-Farm Employment Change', actual: null, estimate: '172K', prior: '114K' },
    { id: '8', time: getDayStr(4, 12), country: 'USD', impact: 'High', event: 'Unemployment Rate', actual: null, estimate: '4.3%', prior: '4.3%' },
  ];
};

const mockNews: MarketNewsItem[] = [
  { id: 999, category: 'breaking', datetime: Date.now() / 1000 - 15, headline: 'TARIFFS! We are putting a massive 25% Tariff on all imported goods from Europe and China starting Monday. MAKE AMERICA GREAT AGAIN! 🇺🇸', image: '', related: 'Macro, SPY, QQQ', source: 'Twitter - @realDonaldTrump', summary: '', url: '#', timeAgo: '15s ago' },
  { id: 998, category: 'breaking', datetime: Date.now() / 1000 - 45, headline: 'S&P 500 Futures plunge 60 points instantly following Trump tariff announcement. VIX spikes above 22.', image: '', related: 'SPY, VIX, ES_F', source: 'ZeroHedge', summary: '', url: '#', timeAgo: '45s ago' },
  { id: 997, category: 'breaking', datetime: Date.now() / 1000 - 120, headline: 'Nasdaq 100 heavily impacted as tech giants face new import restrictions. NVDA and AAPL down 3% in pre-market.', image: '', related: 'QQQ, NVDA, AAPL', source: 'CNBC Alert', summary: '', url: '#', timeAgo: '2m ago' },
  { id: 1, category: 'general', datetime: Date.now() / 1000 - 180, headline: 'Geopolitical Tensions escalate: Unconfirmed reports of supply chain disruptions in the Red Sea.', image: '', related: 'Oil, Global', source: 'Breaking', summary: '', url: '#', timeAgo: '3m ago' },
  { id: 2, category: 'general', datetime: Date.now() / 1000 - 300, headline: 'U.S. consumer confidence falls to lowest level since July as inflation concerns linger across major sectors.', image: '', related: 'Macro', source: 'WSJ', summary: '', url: '#', timeAgo: '5m ago' },
  { id: 3, category: 'general', datetime: Date.now() / 1000 - 900, headline: 'Massive SPY put volume detected at the 430 strike expiring this Friday. Dealers short gamma below 435.', image: '', related: 'SPY, Options', source: 'Tier1Alpha', summary: '', url: '#', timeAgo: '15m ago' },
  { id: 4, category: 'general', datetime: Date.now() / 1000 - 1800, headline: 'European Central Bank raises key interest rates by 25 basis points, signaling further hikes may be necessary.', image: '', related: 'ECB, Rates', source: 'Bloomberg', summary: '', url: '#', timeAgo: '30m ago' },
];

const calculateTimeAgo = (timestamp: number): string => {
  const seconds = Math.floor(Date.now() / 1000 - timestamp);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

// Caching
let cachedCalendar: Record<string, { data: EconomicEvent[], timestamp: number }> = {};
let cachedNews: { data: MarketNewsItem[], timestamp: number } | null = null;

const CACHE_DURATION_CALENDAR = 5 * 60 * 1000; // 5 minutes
const CACHE_DURATION_NEWS = 2 * 60 * 1000; // 2 minutes

export const fetchEconomicCalendar = async (startDate?: string, endDate?: string): Promise<EconomicEvent[]> => {
  const apiKey = import.meta.env.VITE_FMP_API_KEY;

  const cacheKey = `${startDate || 'current'}-${endDate || 'current'}`;

  if (cachedCalendar[cacheKey] && (Date.now() - cachedCalendar[cacheKey].timestamp < CACHE_DURATION_CALENDAR)) {
    return cachedCalendar[cacheKey].data;
  }

  try {
    let url = 'http://localhost:8000/api/calendar/';
    if (startDate && endDate) {
        url += `?start=${startDate}&end=${endDate}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch from backend');
    }
    
    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0) {
      cachedCalendar[cacheKey] = { data, timestamp: Date.now() };
      return data;
    }
  } catch (error) {
    console.warn("Django Calendar API failed, falling back to dynamic mock data.", error);
  }

  // Fallback
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateDynamicMockCalendar());
    }, 400);
  });
};

export const fetchMarketNews = async (category: string = 'general'): Promise<MarketNewsItem[]> => {
  if (cachedNews && (Date.now() - cachedNews.timestamp < CACHE_DURATION_NEWS)) {
    return cachedNews.data;
  }

  try {
    const response = await fetch('http://localhost:8000/api/live-news/');
    if (!response.ok) throw new Error('Live news fetch failed');
    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0) {
      const newsItems: MarketNewsItem[] = data.map((item: any, index: number) => {
        // Map FinancialJuice fields to our MarketNewsItem
        const timestamp = item.date_published ? new Date(item.date_published).getTime() / 1000 : Date.now() / 1000;
        return {
          id: item.news_id || item.NewsID || index,
          category: item.breaking ? 'breaking' : 'general',
          datetime: timestamp,
          headline: item.title || item.Title || 'No Headline',
          image: item.img || '',
          related: item.tags || '',
          source: item.fcname || item.Source || 'FinancialJuice',
          summary: item.description || '',
          url: item.eurl || '#',
          timeAgo: calculateTimeAgo(timestamp)
        };
      });

      cachedNews = { data: newsItems, timestamp: Date.now() };
      return newsItems;
    }
  } catch (error) {
    console.warn("Live Market News API failed, falling back to mock data.", error);
  }

  // Fallback
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockNews);
    }, 400);
  });
};
