import sys
import traceback
import re
from urllib.request import Request, urlopen

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
}

try:
    url_main = "https://www.forexfactory.com/calendar?week=jun22.2026"
    req = Request(url_main, headers=headers)
    html = urlopen(req).read().decode('utf-8')

    matches = re.findall(r'href="(.*?calendar/\d+-.*?)"', html)
    for m in set(matches):
        print(m)
        
    if matches:
        detail_url = "https://www.forexfactory.com" + matches[0] if matches[0].startswith("/") else matches[0]
        print(f"\nFetching {detail_url}")
        req_det = Request(detail_url, headers=headers)
        det_html = urlopen(req_det).read().decode('utf-8')
        print("Detail page length:", len(det_html))
        if 'Measures' in det_html:
            print("FOUND MEASURES!")
    else:
        print("No detail urls found")
except Exception as e:
    print(f"Failed: {e}")
    traceback.print_exc()
