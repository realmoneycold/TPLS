import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchGexLevels, fetchGexProfile, GexLevels, GexProfileItem } from './services/gexService';
import { fetchEconomicCalendar, fetchMarketNews, EconomicEvent, MarketNewsItem } from './services/newsService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, annotationPlugin);

export default function MarketNews() {
  const [activeTab, setActiveTab] = useState<'gex' | 'news'>('gex');
  const [tickerInput, setTickerInput] = useState('SPY');
  const [currentTicker, setCurrentTicker] = useState('SPY');
  const [levels, setLevels] = useState<GexLevels | null>(null);
  const [profile, setProfile] = useState<GexProfileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const previousNewsIds = useRef<Set<number>>(new Set());
  const alertSound = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'));

  // News State
  const [calendarEvents, setCalendarEvents] = useState<EconomicEvent[]>([]);
  const [liveNews, setLiveNews] = useState<MarketNewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [nyTime, setNyTime] = useState('');
  const [weekOffset, setWeekOffset] = useState(0);

  // Filter States
  const [impactFilter, setImpactFilter] = useState(() => {
    const saved = localStorage.getItem('marketNews_impactFilter');
    return saved ? JSON.parse(saved) : { High: true, Medium: true, Low: true, None: true };
  });

  const [currencyFilter, setCurrencyFilter] = useState(() => {
    const saved = localStorage.getItem('marketNews_currencyFilter');
    return saved ? JSON.parse(saved) : { AUD: true, CAD: true, CHF: true, CNY: true, EUR: true, GBP: true, JPY: true, NZD: true, USD: true };
  });

  useEffect(() => {
    localStorage.setItem('marketNews_impactFilter', JSON.stringify(impactFilter));
  }, [impactFilter]);

  useEffect(() => {
    localStorage.setItem('marketNews_currencyFilter', JSON.stringify(currencyFilter));
  }, [currencyFilter]);

  const toggleImpact = (level: string) => setImpactFilter(prev => ({ ...prev, [level]: !prev[level as keyof typeof prev] }));
  const toggleCurrency = (curr: string) => setCurrencyFilter(prev => ({ ...prev, [curr]: !prev[curr as keyof typeof prev] }));
  const setAllImpact = (val: boolean) => setImpactFilter({ High: val, Medium: val, Low: val, None: val });
  const setAllCurrency = (val: boolean) => setCurrencyFilter({ AUD: val, CAD: val, CHF: val, CNY: val, EUR: val, GBP: val, JPY: val, NZD: val, USD: val });

  const filteredEvents = calendarEvents.filter(ev => {
    let evImpact = ev.impact || 'None';
    if (evImpact === 'Non-Economic' || evImpact === '') evImpact = 'None';
    if (!impactFilter[evImpact as keyof typeof impactFilter]) return false;
    if (!currencyFilter[ev.country as keyof typeof currencyFilter]) return false;
    return true;
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        timeZone: 'America/New_York',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).toLowerCase().replace(' ', '');
      setNyTime(timeString);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const lvl = await fetchGexLevels(currentTicker);
        setLevels(lvl);
        const prof = await fetchGexProfile(currentTicker, lvl.spotPrice);
        setProfile(prof);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentTicker]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const loadNewsData = async () => {
      setNewsLoading(true);
      try {
        const { start, end } = getWeekRange(weekOffset);
        const startStr = start.toISOString().split('T')[0];
        const endStr = end.toISOString().split('T')[0];

        const [events, news] = await Promise.all([
          fetchEconomicCalendar(startStr, endStr),
          fetchMarketNews('general')
        ]);
        previousNewsIds.current = new Set(news.map(n => n.id));
        setCalendarEvents(events);
        setLiveNews(news);
      } catch (e) {
        console.error(e);
      } finally {
        setNewsLoading(false);
      }
    };

    loadNewsData();

    interval = setInterval(() => {
      fetchMarketNews('general').then(news => {
        let shouldDing = false;
        const marketKeywords = ['trump', 'iran', 'fed', 'fomc', 'powell', 'ecb', 'biden', 'putin', 'russia', 'china', 'opec', 'sec', 'war', 'missile', 'attack'];

        news.forEach(item => {
          if (!previousNewsIds.current.has(item.id)) {
            const fullText = `${item.headline} ${item.summary || ''}`.toLowerCase();
            if (marketKeywords.some(kw => fullText.includes(kw))) {
              shouldDing = true;
            }
          }
        });

        if (shouldDing) {
          alertSound.current.play().catch(e => console.log('Audio autoplay prevented by browser. User interaction needed first.', e));
        }

        previousNewsIds.current = new Set(news.map(n => n.id));
        setLiveNews(news);
      }).catch(console.error);
    }, 10000); // 10 seconds

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [weekOffset]);

  const getImpactIcon = (impact: string) => {
    switch (impact?.toLowerCase()) {
      case 'high':
        return <iconify-icon icon="lucide:folder" className="text-red-500 fill-red-500 text-lg"></iconify-icon>;
      case 'medium':
        return <iconify-icon icon="lucide:folder" className="text-orange-500 fill-orange-500 text-lg"></iconify-icon>;
      case 'low':
        return <iconify-icon icon="lucide:folder" className="text-yellow-500 fill-yellow-500 text-lg"></iconify-icon>;
      default:
        return <iconify-icon icon="lucide:folder" className="text-gray-500 fill-gray-500 text-lg"></iconify-icon>;
    }
  };

  const getSourceIcon = (source: string) => {
    const lowerSource = source?.toLowerCase() || '';
    if (lowerSource.includes('twitter')) {
      const cleanSource = source.replace(/Twitter\s*-\s*/i, '').replace(/^@/, '');
      return <><iconify-icon icon="lucide:twitter"></iconify-icon> @{cleanSource}</>;
    } else if (lowerSource.includes('wsj')) {
      return <><iconify-icon icon="lucide:file-text"></iconify-icon> {source}</>;
    } else if (lowerSource.includes('breaking') || lowerSource.includes('alert')) {
      return <><iconify-icon icon="lucide:alert-triangle"></iconify-icon> {source}</>;
    }
    return <><iconify-icon icon="lucide:radio-tower"></iconify-icon> {source}</>;
  };

  const getSourceColor = (source: string) => {
    const lowerSource = source?.toLowerCase() || '';
    if (lowerSource.includes('twitter') || lowerSource.includes('wsj')) {
      return "text-blue-400 bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10";
    } else if (lowerSource.includes('breaking') || lowerSource.includes('alert')) {
      return "text-red-400 bg-red-500/10 border-red-500/20 hover:bg-red-500/15";
    }
    return "text-yellow-500 bg-cardDark/50 border-borderGray hover:bg-cardDark";
  };

  const formatTime = (timeStr: string) => {
    try {
      const d = new Date(timeStr);
      // Subtract 1.5 hours (90 minutes) from the time as requested
      d.setMinutes(d.getMinutes() - 90);
      return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' }).toLowerCase() + ' et';
    } catch {
      return timeStr;
    }
  };

  const formatDateDay = (timeStr: string) => {
    try {
      const d = new Date(timeStr);
      return {
        day: d.toLocaleDateString([], { weekday: 'short' }),
        date: d.toLocaleDateString([], { month: 'short', day: 'numeric' })
      };
    } catch {
      return { day: '', date: '' };
    }
  };

  const isToday = (timeStr: string) => {
    try {
      const d = new Date(timeStr);
      const today = new Date();
      return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    } catch {
      return false;
    }
  };

  const getWeekRange = (offset: number) => {
    const d = new Date();
    const currentDay = d.getDay(); // 0 is Sunday
    const start = new Date(d);
    start.setDate(d.getDate() - currentDay + (offset * 7));
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { start, end };
  };

  const getWeekDates = () => {
    const { start, end } = getWeekRange(weekOffset);
    let prefix = '';
    if (weekOffset === 0) prefix = 'This Week: ';
    else if (weekOffset === -1) prefix = 'Last Week: ';
    else if (weekOffset === 1) prefix = 'Next Week: ';
    return `${prefix}${start.toLocaleDateString([], { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setCurrentTicker(tickerInput);
    }
  };

  const formatGex = (val: number) => {
    if (Math.abs(val) < 0.1 && val !== 0) {
      return (val * 1000).toFixed(2) + 'M';
    }
    return val.toFixed(2) + 'B';
  };

  const spotIndex = profile.findIndex(p => p.strike >= (levels?.spotPrice || 0));

  const chartData = {
    labels: profile.map(p => p.strike),
    datasets: [
      {
        label: 'Call Gamma',
        data: profile.map(p => p.callGex ?? (p.netGex > 0 ? p.netGex : 0)),
        backgroundColor: '#22c55e',
        borderWidth: 1,
        borderColor: profile.map(p => levels && p.strike === levels.callWall ? '#ffffff' : 'transparent'),
        borderRadius: 2,
      },
      {
        label: 'Put Gamma',
        data: profile.map(p => p.putGex ?? (p.netGex < 0 ? p.netGex : 0)),
        backgroundColor: '#ef4444',
        borderWidth: 1,
        borderColor: profile.map(p => levels && p.strike === levels.putWall ? '#ffffff' : 'transparent'),
        borderRadius: 2,
      }
    ]
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.dataset.label}: ${ctx.raw}M`
        }
      },
      annotation: {
        annotations: levels && spotIndex !== -1 ? {
          spotLine: {
            type: 'line',
            scaleID: 'x',
            value: spotIndex,
            borderColor: '#3b82f6',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              content: 'Spot',
              display: true,
              position: 'start',
              backgroundColor: 'transparent',
              color: '#3b82f6',
              font: { size: 10 }
            }
          }
        } : {}
      }
    },
    scales: {
      y: {
        stacked: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#9CA3AF' }
      },
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { color: '#9CA3AF', maxTicksLimit: 15 }
      }
    }
  };

  return (
    <div className="bg-bgDark text-white font-sans antialiased overflow-x-hidden min-h-screen flex flex-col">
      <div className="flex flex-col p-4 md:p-6 lg:p-8 w-full max-w-[1600px] mx-auto gap-6 flex-1">

        {/* Header Navigation */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 glass-panel rounded-2xl p-3 px-4 md:px-6 sticky top-4 z-50">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full md:w-auto">
            <Link to="/" className="flex items-center justify-center h-10">
              <img src="/TPLS.png" alt="TPL Logo" className="h-8 w-auto object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
            </Link>
            <nav className="flex items-center gap-1 sm:gap-2 bg-cardDark/50 p-1 rounded-full border border-borderGray w-full md:w-auto justify-center overflow-x-auto hide-scrollbar">
              <button
                onClick={() => setActiveTab('gex')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'gex' ? 'bg-cardDark border border-borderGray text-white shadow-sm' : 'text-textGray hover:text-white'}`}
              >
                <iconify-icon icon="lucide:layout-dashboard" className={activeTab === 'gex' ? "text-purpleLight" : ""}></iconify-icon>
                Gamma Exposure (GEX)
              </button>
              <button
                onClick={() => setActiveTab('news')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'news' ? 'bg-cardDark border border-borderGray text-white shadow-sm' : 'text-textGray hover:text-white'}`}
              >
                <iconify-icon icon="lucide:newspaper" className={activeTab === 'news' ? "text-purpleLight" : ""}></iconify-icon>
                News
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer hidden lg:block mr-2">
              <button className="flex items-center gap-1.5 px-5 py-2.5 bg-cardDark/50 rounded-full border border-borderGray text-sm font-bold text-textGray hover:text-white transition-all">
                <iconify-icon icon="lucide:layout-grid" className="text-lg"></iconify-icon>
                Portals
                <iconify-icon icon="lucide:chevron-down" className="text-sm"></iconify-icon>
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-cardDark border border-borderGray rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col p-2 z-50">
                <Link to="/" className="px-4 py-2 text-sm font-medium text-textGray hover:text-white hover:bg-white/5 rounded-md transition-colors">Home</Link>
                <Link to="/trading" className="px-4 py-2 text-sm font-medium text-textGray hover:text-white hover:bg-white/5 rounded-md transition-colors">Trading Academy</Link>
                <Link to="/apparel" className="px-4 py-2 text-sm font-medium text-textGray hover:text-white hover:bg-white/5 rounded-md transition-colors">Apparel Collection</Link>
              </div>
            </div>
            <a href="#" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-purple rounded-full text-sm font-bold text-white shadow-lg shadow-purpleAccent/20 hover:opacity-90 transition-all">
              <iconify-icon icon="mdi:discord" className="text-lg"></iconify-icon>
              Join TPLS
            </a>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">

          {/* Left Main Section */}
          <div className="lg:col-span-9 flex flex-col gap-6">

            {activeTab === 'gex' && (
              <div className="glass-panel rounded-3xl p-6 relative flex flex-col flex-1 w-full min-h-[600px]">
                {/* Top Bar: Search & Toggles */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                  <div className="w-full md:w-64 bg-cardDark border border-borderGray rounded-xl px-4 py-3 flex items-center gap-3">
                    <iconify-icon icon="lucide:search" className="text-textGray"></iconify-icon>
                    <input
                      type="text"
                      value={tickerInput}
                      onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
                      onKeyDown={handleSearch}
                      placeholder="Enter Ticker (e.g. SPY)"
                      className="bg-transparent border-none outline-none text-white w-full uppercase"
                    />
                  </div>

                  <div className="flex items-center gap-2 bg-cardDark border border-borderGray p-1 rounded-xl">
                    <button className="px-4 py-2 rounded-lg bg-purpleAccent text-white text-sm font-medium">Net GEX</button>
                    <button className="px-4 py-2 rounded-lg text-textGray hover:text-white text-sm font-medium transition-colors">Call/Put</button>
                    <div className="w-px h-4 bg-borderGray mx-1"></div>
                    <button className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium">Graph</button>
                    <button className="px-4 py-2 rounded-lg text-textGray hover:text-white text-sm font-medium transition-colors">Table</button>
                  </div>
                </div>

                {/* Stats Row */}
                {loading || !levels ? (
                  <div className="flex-1 flex items-center justify-center">
                    <iconify-icon icon="lucide:loader-2" className="text-4xl text-purpleAccent animate-spin"></iconify-icon>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8 pb-6 border-b border-borderGray">
                      <div>
                        <p className="text-xs text-textGray mb-1">Spot Price</p>
                        <p className="text-lg font-bold">${levels.spotPrice.toFixed(2)}</p>
                        <p className="text-[10px] text-textGray">{levels.ticker}</p>
                      </div>
                      <div>
                        <p className="text-xs text-textGray mb-1">Net GEX</p>
                        <p className="text-lg font-bold text-red-400">{formatGex(levels.netGex)}</p>
                        <p className="text-[10px] text-textGray">Ratio: {levels.netGexRatio.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-textGray mb-1">Call GEX</p>
                        <p className="text-lg font-bold text-green-500">${formatGex(levels.callGex)}</p>
                        <p className="text-[10px] text-textGray">{levels.callOi.toLocaleString()} OI</p>
                      </div>
                      <div>
                        <p className="text-xs text-textGray mb-1">Put GEX</p>
                        <p className="text-lg font-bold text-red-500">${formatGex(levels.putGex)}</p>
                        <p className="text-[10px] text-textGray">{levels.putOi.toLocaleString()} OI</p>
                      </div>
                      <div>
                        <p className="text-xs text-textGray mb-1">Total GEX</p>
                        <p className="text-lg font-bold text-blue-400">${formatGex(levels.totalGex)}</p>
                        <p className="text-[10px] text-textGray">{levels.totalOi.toLocaleString()} OI</p>
                      </div>
                      <div>
                        <p className="text-xs text-textGray mb-1">Call wall</p>
                        <p className="text-lg font-bold text-green-500">${levels.callWall}</p>
                        <p className="text-[10px] text-textGray">+{levels.callWallPercent.toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-textGray mb-1">Put Wall</p>
                        <p className="text-lg font-bold text-red-500">${levels.putWall}</p>
                        <p className="text-[10px] text-textGray">{levels.putWallPercent.toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-textGray mb-1">Zero Gamma</p>
                        <p className="text-lg font-bold text-white">${levels.zeroGamma.toFixed(2)}</p>
                        <p className="text-[10px] text-textGray">+{levels.zeroGammaPercent.toFixed(2)}%</p>
                      </div>
                    </div>

                    {/* Chart Area */}
                    <div className="flex-1 w-full min-h-[400px]">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                          <div className="w-1 h-5 bg-purpleAccent rounded-full"></div>
                          Strike Profile
                        </h3>
                        <div className="flex gap-2">
                          <button className="bg-cardDark border border-borderGray px-3 py-1.5 text-xs rounded flex items-center gap-2 text-textGray hover:text-white transition-colors">
                            <iconify-icon icon="lucide:search"></iconify-icon> All
                          </button>
                          <button className="bg-purpleAccent/20 border border-purpleAccent/50 px-3 py-1.5 text-xs rounded flex items-center gap-2 text-purpleLight transition-colors">
                            <iconify-icon icon="lucide:search"></iconify-icon> Near
                          </button>
                        </div>
                      </div>

                      <div className="w-full h-[350px]">
                        <Bar data={chartData} options={chartOptions} />
                      </div>

                      <div className="flex items-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                          <span className="text-xs text-textGray">Call Gamma</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                          <span className="text-xs text-textGray">Put Gamma</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Weekly Calendar News Card (Only shown on News Tab) */}
            {activeTab === 'news' && (
              <div className="glass-panel rounded-3xl p-6 relative flex flex-col flex-1 w-full min-h-[600px]">

                {/* Forex Factory Style Navigation & Table Header */}
                <div className="flex flex-col w-full h-full">

                  {/* Top Nav Bar */}
                  <div className="flex items-stretch bg-cardDark border border-borderGray rounded-t-2xl text-white font-medium text-sm overflow-hidden shadow-sm">
                    <button onClick={() => setWeekOffset(prev => prev - 1)} className="px-3 hover:bg-white/10 flex items-center justify-center border-r border-borderGray transition-colors">
                      <iconify-icon icon="lucide:chevron-left"></iconify-icon>
                    </button>
                    <div className="px-4 py-2.5 flex items-center justify-center flex-1 sm:flex-none text-purpleLight">
                      {getWeekDates()}
                    </div>
                    <button onClick={() => setWeekOffset(prev => prev + 1)} className="px-3 hover:bg-white/10 flex items-center justify-center border-l border-borderGray transition-colors">
                      <iconify-icon icon="lucide:chevron-right"></iconify-icon>
                    </button>
                    <div className="hidden sm:flex flex-1 items-center justify-end">
                      <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`px-4 hover:bg-white/10 h-full flex items-center justify-center transition-colors border-l border-borderGray ${isFilterOpen ? 'bg-white/10 text-green-400' : 'text-green-500'}`}
                      >
                        <iconify-icon icon="lucide:filter"></iconify-icon>
                      </button>
                    </div>
                  </div>

                  {/* Filter Dropdown Panel */}
                  {isFilterOpen && (
                    <div className="bg-white text-gray-800 border-x-4 border-b-4 border-t border-t-gray-300 border-green-400 text-sm p-4 z-20 flex flex-col shadow-xl">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Expected Impact */}
                        <div className="flex flex-col gap-2 md:border-r border-gray-300 pr-4">
                          <div className="font-bold text-black">Expected Impact <span className="text-xs font-normal text-blue-600 cursor-pointer hover:underline" onClick={() => setAllImpact(true)}>all</span>, <span className="text-xs font-normal text-blue-600 cursor-pointer hover:underline" onClick={() => setAllImpact(false)}>none</span></div>
                          <div className="flex gap-5 mt-2">
                            <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={impactFilter.High} onChange={() => toggleImpact('High')} className="accent-blue-600 w-3.5 h-3.5" /> <iconify-icon icon="lucide:folder" className="text-red-600 fill-red-600 text-lg drop-shadow-sm"></iconify-icon></label>
                            <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={impactFilter.Medium} onChange={() => toggleImpact('Medium')} className="accent-blue-600 w-3.5 h-3.5" /> <iconify-icon icon="lucide:folder" className="text-orange-500 fill-orange-500 text-lg drop-shadow-sm"></iconify-icon></label>
                            <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={impactFilter.Low} onChange={() => toggleImpact('Low')} className="accent-blue-600 w-3.5 h-3.5" /> <iconify-icon icon="lucide:folder" className="text-yellow-400 fill-yellow-400 text-lg drop-shadow-sm"></iconify-icon></label>
                            <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={impactFilter.None} onChange={() => toggleImpact('None')} className="accent-blue-600 w-3.5 h-3.5" /> <iconify-icon icon="lucide:folder" className="text-gray-400 fill-gray-400 text-lg drop-shadow-sm"></iconify-icon></label>
                          </div>
                        </div>

                        {/* Event Types */}
                        <div className="flex flex-col gap-2 md:border-r border-gray-300 pr-4">
                          <div className="font-bold text-black">Event Types <span className="text-xs font-normal text-blue-600 cursor-pointer hover:underline">(all, none)</span></div>
                          <div className="grid grid-cols-2 gap-y-2 gap-x-2 mt-2 text-black">
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="accent-blue-600 w-3.5 h-3.5" /> Growth</label>
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="accent-blue-600 w-3.5 h-3.5" /> Housing</label>
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="accent-blue-600 w-3.5 h-3.5" /> Inflation</label>
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="accent-blue-600 w-3.5 h-3.5" /> Consumer Surveys</label>
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="accent-blue-600 w-3.5 h-3.5" /> Employment</label>
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="accent-blue-600 w-3.5 h-3.5" /> Business Surveys</label>
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="accent-blue-600 w-3.5 h-3.5" /> Central Bank</label>
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="accent-blue-600 w-3.5 h-3.5" /> Speeches</label>
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="accent-blue-600 w-3.5 h-3.5" /> Bonds</label>
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="accent-blue-600 w-3.5 h-3.5" /> Misc</label>
                          </div>
                        </div>

                        {/* Currencies */}
                        <div className="flex flex-col gap-2">
                          <div className="font-bold text-black">Currencies <span className="text-xs font-normal text-blue-600 cursor-pointer hover:underline" onClick={() => setAllCurrency(true)}>all</span>, <span className="text-xs font-normal text-blue-600 cursor-pointer hover:underline" onClick={() => setAllCurrency(false)}>none</span></div>
                          <div className="grid grid-cols-2 gap-y-2 gap-x-2 mt-2 text-black">
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={currencyFilter.AUD} onChange={() => toggleCurrency('AUD')} className="accent-blue-600 w-3.5 h-3.5" /> AUD</label>
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={currencyFilter.CAD} onChange={() => toggleCurrency('CAD')} className="accent-blue-600 w-3.5 h-3.5" /> CAD</label>
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={currencyFilter.CHF} onChange={() => toggleCurrency('CHF')} className="accent-blue-600 w-3.5 h-3.5" /> CHF</label>
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={currencyFilter.CNY} onChange={() => toggleCurrency('CNY')} className="accent-blue-600 w-3.5 h-3.5" /> CNY</label>
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={currencyFilter.EUR} onChange={() => toggleCurrency('EUR')} className="accent-blue-600 w-3.5 h-3.5" /> EUR</label>
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={currencyFilter.GBP} onChange={() => toggleCurrency('GBP')} className="accent-blue-600 w-3.5 h-3.5" /> GBP</label>
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={currencyFilter.JPY} onChange={() => toggleCurrency('JPY')} className="accent-blue-600 w-3.5 h-3.5" /> JPY</label>
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={currencyFilter.NZD} onChange={() => toggleCurrency('NZD')} className="accent-blue-600 w-3.5 h-3.5" /> NZD</label>
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={currencyFilter.USD} onChange={() => toggleCurrency('USD')} className="accent-blue-600 w-3.5 h-3.5" /> USD</label>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Actions */}
                      <div className="flex flex-wrap items-center justify-end gap-6 border-t border-gray-300 pt-3 mt-4">
                        <div className="flex gap-2">
                          <button onClick={() => setIsFilterOpen(false)} className="px-3 py-1 bg-white border border-gray-400 hover:bg-gray-50 rounded text-black transition-colors">Apply Filter</button>
                          <button onClick={() => setIsFilterOpen(false)} className="px-3 py-1 bg-white border border-gray-400 hover:bg-gray-50 rounded text-black transition-colors">Cancel</button>
                        </div>
                        <button onClick={() => setIsFilterOpen(false)} className="flex items-center gap-1 font-bold text-blue-700 hover:underline">
                          <div className="w-3 h-1 bg-blue-500"></div> Remove Filter
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col overflow-y-auto custom-scrollbar flex-1 w-full bg-cardDark/30 rounded-b-2xl border border-borderGray border-t-0">
                    <div className="w-full overflow-x-auto">
                      <table className="w-full text-left text-sm text-white/90 whitespace-nowrap">
                        <thead className="bg-cardDark/80 text-textGray text-xs uppercase font-medium sticky top-0 z-10 border-b border-borderGray backdrop-blur-md">
                          <tr>
                            <th className="px-4 py-3 border-r border-borderGray/50">Date</th>
                            <th className="px-4 py-3 border-r border-borderGray/50 text-white font-semibold underline decoration-dotted underline-offset-4 cursor-pointer hover:text-purpleLight transition-colors">{nyTime}</th>
                            <th className="px-4 py-3 border-r border-borderGray/50 text-center">Currency</th>
                            <th className="px-4 py-3 border-r border-borderGray/50 text-center">Impact</th>
                            <th className="px-4 py-3 w-full">Event</th>
                            <th className="px-4 py-3 text-right">Actual</th>
                            <th className="px-4 py-3 text-right">Forecast</th>
                            <th className="px-4 py-3 text-right">Previous</th>
                            <th className="px-4 py-3 text-center">Graph</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-borderGray/50">
                          {newsLoading ? (
                            <tr>
                              <td colSpan={9} className="px-4 py-8 text-center text-textGray">
                                <iconify-icon icon="lucide:loader-2" className="animate-spin text-2xl mb-2"></iconify-icon>
                                <p>Loading Economic Calendar...</p>
                              </td>
                            </tr>
                          ) : (
                            (() => {
                              const daysOfWeek = [];
                              const { start } = getWeekRange(weekOffset);
                              const today = new Date();

                              for (let i = 0; i < 7; i++) {
                                const dayDate = new Date(start);
                                dayDate.setDate(start.getDate() + i);
                                daysOfWeek.push(dayDate);
                              }

                              return daysOfWeek.flatMap((dayDate, dayIndex) => {
                                const dayStr = dayDate.toLocaleDateString([], { weekday: 'short' });
                                const dateStr = dayDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
                                const isCurrentToday = dayDate.getDate() === today.getDate() && dayDate.getMonth() === today.getMonth() && dayDate.getFullYear() === today.getFullYear();

                                const dayEvents = filteredEvents.filter(ev => {
                                  try {
                                    const evD = new Date(ev.time);
                                    return evD.getDate() === dayDate.getDate() && evD.getMonth() === dayDate.getMonth() && evD.getFullYear() === dayDate.getFullYear();
                                  } catch {
                                    return false;
                                  }
                                });

                                if (dayEvents.length === 0) {
                                  return [
                                    <tr key={`empty-${dayIndex}`} className={`hover:bg-cardDark/50 transition-colors ${dayIndex > 0 ? 'border-t-2 border-borderGray' : ''}`}>
                                      <td className="px-4 py-3 align-middle">
                                        <div className={`flex flex-col ${isCurrentToday ? 'text-green-400 font-bold' : ''}`}>
                                          <span className="font-semibold text-textGray flex items-center gap-1">
                                            {dayStr} {isCurrentToday && <iconify-icon icon="lucide:calendar-check" className="text-green-500"></iconify-icon>}
                                          </span>
                                          <span className="text-xs text-textGray">{dateStr}</span>
                                        </div>
                                      </td>
                                      <td colSpan={8} className="px-4 py-3 text-center text-textGray/50 italic">
                                        No economic events scheduled
                                      </td>
                                    </tr>
                                  ];
                                }

                                return dayEvents.map((event, index) => {
                                  const showDate = index === 0;
                                  return (
                                    <tr key={event.id || `${dayIndex}-${index}`} className={`hover:bg-cardDark/50 transition-colors ${showDate && dayIndex > 0 ? 'border-t-2 border-borderGray' : ''}`}>
                                      <td className="px-4 py-3 align-middle">
                                        {showDate && (
                                          <div className={`flex flex-col ${isCurrentToday ? 'text-green-400 font-bold' : ''}`}>
                                            <span className="font-semibold text-textGray flex items-center gap-1">
                                              {dayStr} {isCurrentToday && <iconify-icon icon="lucide:calendar-check" className="text-green-500"></iconify-icon>}
                                            </span>
                                            <span className="text-xs text-textGray">{dateStr}</span>
                                          </div>
                                        )}
                                      </td>
                                      <td className="px-4 py-3 align-middle text-textGray">{formatTime(event.time)}</td>
                                      <td className="px-4 py-3 align-middle font-bold text-textGray">{event.country}</td>
                                      <td className="px-4 py-3 align-middle text-center">
                                        {getImpactIcon(event.impact)}
                                      </td>
                                      <td className="px-4 py-3 align-middle font-medium text-white">{event.event}</td>
                                      <td className="px-4 py-3 align-middle text-right font-medium">{event.actual !== null ? event.actual : ''}</td>
                                      <td className="px-4 py-3 align-middle text-right text-textGray">{event.estimate !== null ? event.estimate : ''}</td>
                                      <td className="px-4 py-3 align-middle text-right text-textGray">{event.prior !== null ? event.prior : ''}</td>
                                      <td className="px-4 py-3 align-middle text-center text-textGray hover:text-purpleLight cursor-pointer"><iconify-icon icon="lucide:bar-chart-2" className="text-blue-400/80"></iconify-icon></td>
                                    </tr>
                                  );
                                });
                              });
                            })()
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Section */}
          <div className="lg:col-span-3 flex flex-col gap-6">

            {activeTab === 'gex' && (
              <>
                {/* Expirations Card */}
                <div className="glass-panel rounded-3xl p-6 flex flex-col w-full border border-borderGray">
                  <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                    <div>
                      <p className="text-[10px] text-textGray mb-1">0DTE Exp</p>
                      <p className="text-lg font-bold">{levels?.expirations.dte0.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-textGray mb-1">Weekly Exp</p>
                      <p className="text-lg font-bold">{levels?.expirations.weekly.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-textGray mb-1">Monthly Exp</p>
                      <p className="text-lg font-bold">{levels?.expirations.monthly.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-cardDark border border-borderGray px-4 py-2.5 rounded-xl text-xs flex justify-between items-center text-white/90 hover:bg-white/5 transition-colors">
                      All Expirations <iconify-icon icon="lucide:chevron-down"></iconify-icon>
                    </button>
                    <button className="flex-1 bg-cardDark border border-borderGray px-4 py-2.5 rounded-xl text-xs flex justify-between items-center text-white/90 hover:bg-white/5 transition-colors">
                      <iconify-icon icon="lucide:sliders-horizontal" className="mr-1"></iconify-icon> Simulate <iconify-icon icon="lucide:chevron-down"></iconify-icon>
                    </button>
                  </div>
                </div>

                {/* Asset Details Card */}
                <div className="glass-panel rounded-3xl p-6 flex flex-col w-full border border-borderGray flex-1">
                  <h4 className="text-sm font-semibold flex items-center gap-2 mb-6">
                    <iconify-icon icon="lucide:building-2" className="text-textGray"></iconify-icon>
                    {levels?.details.name || 'Loading...'}
                  </h4>

                  {levels && (
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
                      <div>
                        <span className="text-textGray">Price:</span> <span className="font-medium ml-1">${levels.details.dayLow}</span>
                      </div>
                      <div>
                        <span className="text-textGray">Mkt Cap:</span> <span className="font-medium ml-1">${levels.details.mktCap}</span>
                      </div>
                      <div>
                        <span className="text-textGray">Day Low:</span> <span className="font-medium ml-1">${levels.details.dayLow}</span>
                      </div>
                      <div>
                        <span className="text-textGray">Day High:</span> <span className="font-medium ml-1">${levels.details.dayHigh}</span>
                      </div>
                      <div>
                        <span className="text-textGray">Year Low:</span> <span className="font-medium ml-1">${levels.details.yearLow}</span>
                      </div>
                      <div>
                        <span className="text-textGray">Year High:</span> <span className="font-medium ml-1">${levels.details.yearHigh}</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-auto pt-6 border-t border-borderGray flex items-center justify-between text-xs text-textGray">
                    <span>Data provided by TPLS API</span>
                    <iconify-icon icon="lucide:shield-check" className="text-green-500 text-lg"></iconify-icon>
                  </div>
                </div>
              </>
            )}

            {/* Unified Live Feed Card */}
            <div className="glass-panel rounded-3xl p-6 flex flex-col w-full border border-borderGray flex-1 min-h-[600px] max-h-[850px]">

              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-borderGray">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                  Live Market Feed
                </h3>
                {/* For future implementation */}
                {/* <div className="flex items-center gap-2 text-xs text-textGray hover:text-white cursor-pointer transition-colors">
                      <iconify-icon icon="lucide:filter"></iconify-icon> Filter Sources
                    </div> */}
              </div>

              {/* Scrollable Feed List */}
              <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2 flex-1">
                {newsLoading ? (
                  <div className="flex-1 flex items-center justify-center">
                    <iconify-icon icon="lucide:loader-2" className="text-4xl text-purpleAccent animate-spin"></iconify-icon>
                  </div>
                ) : liveNews.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-textGray text-sm">
                    No news available right now.
                  </div>
                ) : (
                  liveNews.map((news) => {
                    const marketKeywords = ['trump', 'iran', 'fed', 'fomc', 'powell', 'ecb', 'biden', 'putin', 'russia', 'china', 'opec', 'sec', 'war', 'missile', 'attack'];
                    const fullText = `${news.headline} ${news.summary || ''}`.toLowerCase();

                    let matchedKeyword = null;
                    for (const kw of marketKeywords) {
                      // use regex word boundary to match exact words if possible, or just simple includes
                      if (fullText.includes(kw)) {
                        matchedKeyword = kw.toUpperCase();
                        break;
                      }
                    }

                    let sourceClasses = getSourceColor(news.source);
                    let displaySource = news.source;
                    let textClass = "text-textGray";

                    if (matchedKeyword) {
                      sourceClasses = "bg-red-500/5 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.1)] hover:bg-red-500/10";
                      displaySource = `${news.source} (${matchedKeyword})`;
                      textClass = "text-red-500 font-bold";
                    } else if (news.isBreaking) {
                      sourceClasses = "bg-red-500/5 border-red-500/30 hover:bg-red-500/10";
                      textClass = "text-red-400";
                    }

                    return (
                      <div key={news.id} className={`p-4 rounded-2xl flex flex-col gap-2 transition-colors block border ${sourceClasses}`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${textClass}`}>
                            {getSourceIcon(displaySource)}
                          </span>
                          <span className="text-[10px] text-textGray font-medium">{news.timeAgo}</span>
                        </div>
                        <p className="text-sm font-medium text-white/90 leading-snug">{news.headline}</p>
                        {news.summary && news.summary !== news.headline && (
                          <p className="text-xs text-textGray leading-relaxed whitespace-pre-wrap mt-1">
                            {news.summary}
                          </p>
                        )}
                        {news.related && (
                          <div className="flex gap-2 mt-1 flex-wrap">
                            {news.related.split(',').slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="text-[9px] px-2 py-0.5 rounded-full bg-cardDark border border-borderGray text-textGray">{tag.trim()}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
