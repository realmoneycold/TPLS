from backend.core.gex_calculator import get_gex_profile
data = get_gex_profile("SPY")
print("Call GEX:", data.get('callGex'))
print("Put GEX:", data.get('putGex'))
