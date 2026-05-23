from playwright.sync_api import sync_playwright
import os

SCREENSHOTS_DIR = "/Users/egg/egg system/egypt-globe-sites/screenshots"

# Capture full-page versions of problem pages for deeper inspection
pages = [
    ("home_full", "https://egyptglobe.com/"),
    ("about_full", "https://egyptglobe.com/about"),
    ("contact_full", "https://egyptglobe.com/contact"),
    ("services_full", "https://egyptglobe.com/services"),
    ("blog_full", "https://egyptglobe.com/blog"),
    ("applications_full", "https://egyptglobe.com/applications"),
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
        out = f"{SCREENSHOTS_DIR}/{slug}.png"
        page.screenshot(path=out, full_page=True)

        # Check for overflow-causing elements
        overflow_els = page.evaluate("""
            () => {
                const results = [];
                const all = document.querySelectorAll('*');
                for (const el of all) {
                    const rect = el.getBoundingClientRect();
                    if (rect.right > 375 + 2) {
                        results.push({
                            tag: el.tagName,
                            cls: el.className.toString().slice(0, 80),
                            right: Math.round(rect.right),
                            width: Math.round(rect.width)
                        });
                    }
                }
                return results.slice(0, 10);
            }
        """)
        if overflow_els:
            print(f"\n{slug} — elements overflowing viewport right edge:")
            for el in overflow_els:
                print(f"  <{el['tag']} class='{el['cls']}'> right={el['right']}px width={el['width']}px")
        else:
            print(f"{slug} — no overflow elements found")
        page.close()
    browser.close()
print("Done.")
