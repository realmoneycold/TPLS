import yfinance as yf
ticker = yf.Ticker("SPY")
expirations = ticker.options
print("Expirations:", expirations[:3])
opt = ticker.option_chain(expirations[0])
print(opt.calls.head())
