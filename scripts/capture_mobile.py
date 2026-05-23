from playwright.sync_api import sync_playwright
import os

SCREENSHOTS_DIR = "/Users/egg/egg system/egypt-globe-sites/screenshots"
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

pages = [
    ("home", "https://egyptglobe.com/"),
    ("products", "https://egyptglobe.com/products"),
    ("about", "https://egyptglobe.com/about"),
    ("contact", "https://egyptglobe.com/contact"),
    ("services", "https://egyptglobe.com/services"),
    ("rfq", "https://egyptglobe.com/rfq"),
    ("products-salt", "https://egyptglobe.com/products/salt"),
    ("applications", "https://egyptglobe.com/applications"),
    ("global-presence", "https://egyptglobe.com/global-presence"),
    ("blog", "https://egyptglobe.com/blog"),
]

with sync_playwright() as p:
    browser = p.chromium.launch()
    for slug, url in pages:
        page = browser.new_page(viewport={"width": 375, "height": 812})
        try:
            page.goto(url, wait_until="networkidle", timeout=20000)
        except Exception:
            page.goto(url, wait_until="domcontentloaded", timeout=15000)
            page.wait_for_timeout(2000)
        out = f"{SCREENSHOTS_DIR}/mobile_{slug}.png"
        page.screenshot(path=out, full_page=False)
        # Also capture scroll width to detect horizontal overflow
        scroll_width = page.evaluate("document.documentElement.scrollWidth")
        client_width = page.evaluate("document.documentElement.clientWidth")
        print(f"{slug}: scrollWidth={scroll_width}, clientWidth={client_width}, overflow={'YES' if scroll_width > client_width else 'no'}")
        page.close()
    browser.close()

print("Done.")
