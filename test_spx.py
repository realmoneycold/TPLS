import yfinance as yf
ticker = yf.Ticker("^SPX")
print("Spot:", ticker.history(period="1d"))
