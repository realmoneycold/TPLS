export interface GexLevels {
  ticker: string;
  spotPrice: number;
  netGex: number; // in billions
  netGexRatio: number;
  callGex: number; // in billions
  callOi: number;
  putGex: number; // in billions
  putOi: number;
  totalGex: number; // in billions
  totalOi: number;
  callWall: number;
  callWallPercent: number;
  putWall: number;
  putWallPercent: number;
  zeroGamma: number;
  zeroGammaPercent: number;
  expirations: {
    dte0: number;
    weekly: number;
    monthly: number;
  };
  details: {
    mktCap: string;
    dayLow: number;
    dayHigh: number;
    yearLow: number;
    yearHigh: number;
    name: string;
  };
}

export interface GexProfileItem {
  strike: number;
  netGex: number; // in millions
  callGex?: number;
  putGex?: number;
  type: 'call' | 'put';
}

const mockSpylevels: GexLevels = {
  ticker: 'SPY',
  spotPrice: 732.15,
  netGex: -9.1,
  netGexRatio: 0.58,
  callGex: 12.8,
  callOi: 5192955,
  putGex: -21.9,
  putOi: 10812730,
  totalGex: 34.7,
  totalOi: 16005685,
  callWall: 800,
  callWallPercent: 9.27,
  putWall: 720,
  putWallPercent: -1.66,
  zeroGamma: 745.90,
  zeroGammaPercent: 1.88,
  expirations: {
    dte0: 0.0,
    weekly: 11.4,
    monthly: 23.2
  },
  details: {
    name: "State Street SPDR S&P 500 ETF",
    mktCap: "767.9B",
    dayLow: 726.86,
    dayHigh: 736.53,
    yearLow: 615.04,
    yearHigh: 760.40
  }
};

const generateMockProfile = (spot: number): GexProfileItem[] => {
  const profile: GexProfileItem[] = [];
  const start = Math.floor(spot - 70);
  const end = Math.floor(spot + 70);
  
  for (let strike = start; strike <= end; strike += 1) {
    if (strike % 2 !== 0 && strike % 5 !== 0) continue; // Sparse data for realism
    
    // Create the shape: huge negative near put wall (720), negative up to 745, positive after 745
    let val = 0;
    
    if (strike === 720) {
      val = -980; // massive put wall
    } else if (strike === 800) {
      val = 480; // massive call wall
    } else if (strike < 745) {
      // Put dominant
      val = -(Math.random() * 200 + 50 + (745 - strike) * 5);
      if (strike % 5 === 0) val *= 2.5; // spikes on major strikes
    } else {
      // Call dominant
      val = Math.random() * 100 + 20 + (strike - 745) * 3;
      if (strike % 5 === 0) val *= 2; // spikes on major strikes
    }
    
    profile.push({
      strike,
      netGex: val,
      type: val >= 0 ? 'call' : 'put'
    });
  }
  
  return profile;
};

const getNextFriday = (): string => {
  const d = new Date();
  d.setDate(d.getDate() + ((5 - d.getDay() + 7) % 7 || 7));
  return d.toISOString().split('T')[0];
};

let profileCache: { [key: string]: GexProfileItem[] } = {};

export const fetchGexLevels = async (ticker: string): Promise<GexLevels> => {
  try {
    const baseUrl = import.meta.env.PROD ? '/api' : 'http://localhost:8000/api';
    const response = await fetch(`${baseUrl}/gex/${ticker}/`);
    const data = await response.json();
    
    if (!response.ok || data.error) {
      console.warn("Falling back to mock SPY levels due to error:", data.error);
      return mockSpylevels;
    }

    // Cache the profile for the second fetch
    if (data.profile) {
      profileCache[ticker] = data.profile;
    }

    return data as GexLevels;
  } catch (error) {
    console.error("GEX Fetch Error:", error);
    return mockSpylevels;
  }
};

export const fetchGexProfile = async (ticker: string, spotPrice: number): Promise<GexProfileItem[]> => {
  if (profileCache[ticker] && profileCache[ticker].length > 0) {
    return profileCache[ticker];
  }
  
  // If not in cache, just generate mock profile
  return generateMockProfile(spotPrice);
};
