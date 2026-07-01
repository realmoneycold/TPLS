import time
import json
import asyncio
import httpx
from bs4 import BeautifulSoup
import re

SERVER_URL = "http://127.0.0.1:8000/api/live-news/"
TELEGRAM_URL = "https://t.me/s/SM_News_24h"

last_scraped_id = None

async def fetch_page(client, url):
    try:
        response = await client.get(url)
        response.raise_for_status()
        return response.text
    except Exception as e:
        print(f"Error fetching Telegram URL {url}: {e}")
        return None

async def parse_and_post_messages(client, html_content):
    global last_scraped_id
    soup = BeautifulSoup(html_content, 'html.parser')
    messages = soup.find_all('div', class_='tgme_widget_message')
    
    if not messages:
        return []
        
    new_items = []
    for msg in messages:
        msg_id_str = msg.get('data-post', '')
        if not msg_id_str:
            continue
            
        msg_id = int(msg_id_str.split('/')[-1])
        
        # Parse text
        text_div = msg.find('div', class_='tgme_widget_message_text')
        if not text_div:
            continue
            
        text = text_div.get_text(separator=' ', strip=True)
        
        # Parse time
        time_tag = msg.find('time', class_='time')
        datetime_str = time_tag.get('datetime', '') if time_tag else ''
        
        sentences = text.split('. ')
        title = sentences[0][:80] + '...' if len(sentences[0]) > 80 else sentences[0]
        
        breaking = any(kw in text.lower() for kw in ['breaking', 'urgent', 'alert', 'just in'])
            
        item = {
            "news_id": msg_id,
            "title": title,
            "description": text,
            "date_published": datetime_str,
            "fcname": "TPLS NEWS",
            "breaking": breaking,
            "eurl": "#"
        }
        new_items.append(item)
        
    return new_items

async def fetch_telegram_history(client, max_pages=5):
    print(f"Fetching history: {max_pages} pages")
    url = TELEGRAM_URL
    all_history = []
    
    for _ in range(max_pages):
        html = await fetch_page(client, url)
        if not html:
            break
            
        soup = BeautifulSoup(html, 'html.parser')
        messages = soup.find_all('div', class_='tgme_widget_message')
        if not messages:
            break
            
        # Parse and prepend (since older pages have older messages)
        page_items = await parse_and_post_messages(client, html)
        all_history = page_items + all_history
        
        # Find next page link (older messages)
        more_link = soup.find('a', class_='tme_messages_more')
        if not more_link or not more_link.get('href'):
            break
            
        url = "https://t.me" + more_link['href']
        
    # Post history chronologically (oldest first, so newest is at the top of Django)
    global last_scraped_id
    for item in all_history:
        # Avoid duplicate posts if we restart
        if last_scraped_id is not None and item['news_id'] <= last_scraped_id:
            continue
        try:
            print(f"Posting History: {item['title']}")
            res = await client.post(SERVER_URL, json=item, headers={'Content-Type': 'application/json'})
        except Exception as e:
            print(f"Error posting: {e}")
            pass
        if last_scraped_id is None or item['news_id'] > last_scraped_id:
            last_scraped_id = item['news_id']

async def fetch_telegram_news():
    global last_scraped_id
    async with httpx.AsyncClient() as client:
        html = await fetch_page(client, TELEGRAM_URL)
        if not html:
            return
            
        items = await parse_and_post_messages(client, html)
        for item in items:
            if last_scraped_id is not None and item['news_id'] <= last_scraped_id:
                continue
            try:
                print(f"Posting New: {item['title']}")
                await client.post(SERVER_URL, json=item, headers={'Content-Type': 'application/json'})
            except Exception as e:
                print(f"Error posting: {e}")
                pass
            if last_scraped_id is None or item['news_id'] > last_scraped_id:
                last_scraped_id = item['news_id']

async def main():
    print("Starting Telegram Scraper for TPLS NEWS...")
    async with httpx.AsyncClient() as client:
        await fetch_telegram_history(client, max_pages=10)
    
    while True:
        await fetch_telegram_news()
        await asyncio.sleep(10)

if __name__ == "__main__":
    asyncio.run(main())
