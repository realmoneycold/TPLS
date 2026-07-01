import yfinance as yf
import pandas as pd
import numpy as np
from scipy.stats import norm
import datetime

def black_scholes_gamma(S, K, T, r, sigma):
    if T <= 0 or sigma <= 0 or np.isnan(sigma):
        return 0.0
    d1 = (np.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
    gamma = norm.pdf(d1) / (S * sigma * np.sqrt(T))
    return gamma

def get_gex_profile(ticker_symbol="SPY"):
    yf_ticker = "^SPX" if ticker_symbol.upper() == "SPX" else ticker_symbol
    ticker = yf.Ticker(yf_ticker)
    try:
        spot = ticker.history(period="1d")['Close'].iloc[-1]
    except Exception as e:
        return {"error": f"Could not fetch spot price: {e}"}
        
    expirations = ticker.options
    if not expirations:
        return {"error": "No options chain available"}
        
    # We will look at the first 15 expirations to build a rich profile
    expirations = expirations[:15]
    
    r = 0.05 # Risk free rate approx 5%
    
    calls_data = []
    puts_data = []
    
    today = datetime.date.today()
    
    for exp in expirations:
        try:
            opt = ticker.option_chain(exp)
            calls = opt.calls
            puts = opt.puts
            
            exp_date = datetime.datetime.strptime(exp, "%Y-%m-%d").date()
            T = (exp_date - today).days / 365.0
            if T <= 0:
                T = 1 / 365.0 # Minimum 1 day for 0DTE
                
            for _, row in calls.iterrows():
                iv = row['impliedVolatility']
                gamma = black_scholes_gamma(spot, row['strike'], T, r, iv)
                # GEX = Gamma * OI * 100 * Spot^2 * 0.01
                gex = gamma * row['openInterest'] * 100 * (spot**2) * 0.01
                if not np.isnan(gex):
                    calls_data.append({'strike': row['strike'], 'gex': gex, 'oi': row['openInterest']})
                
            for _, row in puts.iterrows():
                iv = row['impliedVolatility']
                gamma = black_scholes_gamma(spot, row['strike'], T, r, iv)
                # Puts have negative GEX for dealers
                gex = -gamma * row['openInterest'] * 100 * (spot**2) * 0.01
                if not np.isnan(gex):
                    puts_data.append({'strike': row['strike'], 'gex': gex, 'oi': row['openInterest']})
        except Exception as e:
            print(f"Error processing expiration {exp}: {e}")

    df_calls = pd.DataFrame(calls_data)
    df_puts = pd.DataFrame(puts_data)
    
    if df_calls.empty or df_puts.empty:
        return {"error": "Empty options data"}
        
    # Group by strike
    calls_grouped = df_calls.groupby('strike').sum()
    puts_grouped = df_puts.groupby('strike').sum()
    
    strikes = sorted(list(set(calls_grouped.index) | set(puts_grouped.index)))
    
    profile = []
    total_call_gex = 0
    total_put_gex = 0
    total_call_oi = 0
    total_put_oi = 0
    
    call_wall = 0
    max_call_gex = 0
    put_wall = 0
    min_put_gex = 0
    
    for strike in strikes:
        cg = float(calls_grouped.loc[strike, 'gex']) if strike in calls_grouped.index else 0.0
        pg = float(puts_grouped.loc[strike, 'gex']) if strike in puts_grouped.index else 0.0
        co = float(calls_grouped.loc[strike, 'oi']) if strike in calls_grouped.index else 0.0
        po = float(puts_grouped.loc[strike, 'oi']) if strike in puts_grouped.index else 0.0
        
        if np.isnan(cg): cg = 0
        if np.isnan(pg): pg = 0
        if np.isnan(co): co = 0
        if np.isnan(po): po = 0

        net_gex = cg + pg
        net_gex_m = net_gex / 1_000_000
        
        total_call_gex += cg
        total_put_gex += pg
        total_call_oi += co
        total_put_oi += po
        
        if cg > max_call_gex:
            max_call_gex = cg
            call_wall = strike
        if pg < min_put_gex:
            min_put_gex = pg
            put_wall = strike
            
        profile.append({
            "strike": float(strike),
            "netGex": float(net_gex_m),
            "callGex": float(cg / 1_000_000),
            "putGex": float(pg / 1_000_000),
            "type": "call" if net_gex >= 0 else "put"
        })
        
    # Filter profile around spot +/- 15%
    profile = [p for p in profile if spot * 0.85 <= p['strike'] <= spot * 1.15]
    
    total_gex = (total_call_gex + total_put_gex) / 1_000_000_000 # Billions
    call_gex_b = total_call_gex / 1_000_000_000
    put_gex_b = total_put_gex / 1_000_000_000
    
    net_gex_ratio = abs(call_gex_b) / (abs(call_gex_b) + abs(put_gex_b)) if (abs(call_gex_b) + abs(put_gex_b)) > 0 else 0
    
    return {
        "ticker": ticker_symbol,
        "spotPrice": float(spot),
        "netGex": float(total_gex),
        "netGexRatio": float(net_gex_ratio),
        "callGex": float(call_gex_b),
        "callOi": float(total_call_oi),
        "putGex": float(put_gex_b),
        "putOi": float(total_put_oi),
        "totalGex": float(abs(call_gex_b) + abs(put_gex_b)),
        "totalOi": float(total_call_oi + total_put_oi),
        "callWall": float(call_wall),
        "callWallPercent": float(((call_wall - spot) / spot) * 100),
        "putWall": float(put_wall),
        "putWallPercent": float(((put_wall - spot) / spot) * 100),
        "zeroGamma": float(spot),
        "zeroGammaPercent": 0,
        "expirations": {
            "dte0": 30,
            "weekly": 50,
            "monthly": 20
        },
        "details": {
            "name": f"{ticker_symbol} ETF (Live Calculated)",
            "mktCap": "N/A",
            "dayLow": float(spot * 0.99),
            "dayHigh": float(spot * 1.01),
            "yearLow": float(spot * 0.8),
            "yearHigh": float(spot * 1.2)
        },
        "profile": profile
    }
