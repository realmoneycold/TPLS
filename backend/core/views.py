import os
import csv
import json
import subprocess
from datetime import datetime, timedelta
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Path to the scraper
SCRAPER_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../forexfactory-scraper-2.0.0'))

def get_economic_calendar(request):
    start_str = request.GET.get('start')
    end_str = request.GET.get('end')
    
    if not start_str or not end_str:
        # Determine the date range (Current week: Sunday to Saturday)
        today = datetime.now()
        idx = (today.weekday() + 1) % 7
        start_of_week = today - timedelta(days=idx)
        end_of_week = start_of_week + timedelta(days=6)
        start_str = start_of_week.strftime('%Y-%m-%d')
        end_str = end_of_week.strftime('%Y-%m-%d')
        
    cache_filename = f'output_{start_str}.csv'
    CSV_CACHE = os.path.join(SCRAPER_DIR, cache_filename)
    
    # Check if CSV exists and is recent (e.g., within the last 4 hours)
    needs_update = True
    if os.path.exists(CSV_CACHE):
        mtime = os.path.getmtime(CSV_CACHE)
        if (datetime.now().timestamp() - mtime) < 4 * 3600:
            needs_update = False
            
    if needs_update:
        # Run the scraper
        # Using the venv python we created earlier
        python_exec = os.path.join(SCRAPER_DIR, 'venv/bin/python')
        if not os.path.exists(python_exec):
             python_exec = 'python3' # fallback

        cmd = [
            python_exec,
            '-m', 'src.forexfactory.main',
            '--start', start_str,
            '--end', end_str,
            '--csv', cache_filename
        ]
        try:
            subprocess.run(cmd, cwd=SCRAPER_DIR, check=True, capture_output=True)
        except Exception as e:
            print("Scraper error:", e)
            # We'll continue and try to read whatever is in the CSV
    
    events = []
    if os.path.exists(CSV_CACHE):
        with open(CSV_CACHE, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                # The CSV datetime format is ISO string, e.g., '2026-06-25T01:00:00+03:30'
                events.append({
                    'id': f"{row.get('date')}-{row.get('time')}-{row.get('Event')}",
                    'time': row.get('datetime_local'),
                    'country': row.get('Currency'),
                    'impact': row.get('Impact'),
                    'event': row.get('Event'),
                    'actual': row.get('Actual') or None,
                    'estimate': row.get('Forecast') or None,
                    'prior': row.get('Previous') or None
                })
                
    return JsonResponse(events, safe=False)

# Global in-memory list to store live news items (in a real app, this would be a database/Redis)
LIVE_NEWS = []

@csrf_exempt
def live_news(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            # Store the data
            LIVE_NEWS.insert(0, data)
            # Keep only the latest 200 items to prevent memory leak
            if len(LIVE_NEWS) > 200:
                LIVE_NEWS.pop()
            return JsonResponse({'status': 'success', 'message': 'News added'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    
    elif request.method == 'GET':
        # Return the latest news
        return JsonResponse(LIVE_NEWS, safe=False)

from .gex_calculator import get_gex_profile

@csrf_exempt
def get_gex(request, ticker):
    if request.method == 'GET':
        try:
            data = get_gex_profile(ticker.upper())
            if "error" in data:
                return JsonResponse(data, status=400)
            return JsonResponse(data)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)
