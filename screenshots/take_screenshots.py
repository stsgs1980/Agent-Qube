#!/usr/bin/env python3
"""
Start the Next.js server and take screenshots of all 3 views.
The app uses client-side navigation (tabs), not URL routing.
"""

import subprocess
import time
import os
import sys

SCREENSHOTS_DIR = "/home/z/my-project/screenshots"
PROJECT_DIR = "/home/z/my-project"
BASE_URL = "http://127.0.0.1:3000"

DESKTOP_VIEWPORT = {"width": 1440, "height": 900}
MOBILE_VIEWPORT = {"width": 375, "height": 812}

os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

def wait_for_server(url, timeout=45):
    import urllib.request
    import urllib.error
    start = time.time()
    while time.time() - start < timeout:
        try:
            req = urllib.request.Request(url)
            with urllib.request.urlopen(req, timeout=5) as resp:
                if resp.status == 200:
                    return True
        except (urllib.error.URLError, ConnectionRefusedError, OSError):
            pass
        time.sleep(1)
    return False

def take_screenshots():
    # Start the Next.js server
    print("Starting Next.js server...")
    env = os.environ.copy()
    server_proc = subprocess.Popen(
        ["node", "node_modules/.bin/next", "dev", "-p", "3000", "-H", "0.0.0.0"],
        cwd=PROJECT_DIR,
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
    )
    
    try:
        print("Waiting for server to be ready...")
        if not wait_for_server(BASE_URL, timeout=60):
            print("ERROR: Server did not start in time")
            server_proc.terminate()
            return False
        
        print("Server is ready!")
        time.sleep(3)  # Extra time for compilation
        
        from playwright.sync_api import sync_playwright
        
        # === DESKTOP SCREENSHOTS ===
        print("\n" + "=" * 60)
        print("Taking DESKTOP screenshots (1440x900)")
        print("=" * 60)
        
        with sync_playwright() as p:
            browser = p.chromium.launch(
                headless=True,
                args=['--no-sandbox', '--disable-setuid-sandbox']
            )
            context = browser.new_context(
                viewport=DESKTOP_VIEWPORT,
                device_scale_factor=1,
            )
            page = context.new_page()
            
            # 1. Dashboard
            print("\n--- Dashboard ---")
            page.goto(f"{BASE_URL}/", wait_until="networkidle", timeout=60000)
            time.sleep(3)
            
            screenshot_path = os.path.join(SCREENSHOTS_DIR, "dashboard_desktop_1440x900.png")
            page.screenshot(path=screenshot_path, full_page=False)
            print(f"  Viewport screenshot saved: {screenshot_path}")
            
            full_path = os.path.join(SCREENSHOTS_DIR, "dashboard_desktop_full.png")
            page.screenshot(path=full_path, full_page=True)
            print(f"  Full page saved: {full_path}")
            
            # 2. Hierarchy - click the Hierarchy button
            print("\n--- Hierarchy ---")
            try:
                hierarchy_btn = page.get_by_text("Hierarchy", exact=True)
                if hierarchy_btn.count() == 0:
                    # Try a broader selector
                    hierarchy_btn = page.locator("button:has-text('Hierarchy')")
                hierarchy_btn.click()
                time.sleep(3)  # Wait for hierarchy to load
                print("  Clicked Hierarchy button")
            except Exception as e:
                print(f"  Warning clicking Hierarchy: {e}")
                # Try alternative approach
                try:
                    page.click("text=Hierarchy")
                    time.sleep(3)
                except:
                    print("  Could not find Hierarchy button")
            
            screenshot_path = os.path.join(SCREENSHOTS_DIR, "hierarchy_desktop_1440x900.png")
            page.screenshot(path=screenshot_path, full_page=False)
            print(f"  Viewport screenshot saved: {screenshot_path}")
            
            full_path = os.path.join(SCREENSHOTS_DIR, "hierarchy_desktop_full.png")
            page.screenshot(path=full_path, full_page=True)
            print(f"  Full page saved: {full_path}")
            
            # 3. Go back to dashboard first, then click Workflows
            print("\n--- Going back to Dashboard for Workflows ---")
            page.goto(f"{BASE_URL}/", wait_until="networkidle", timeout=60000)
            time.sleep(3)
            
            # 4. Workflows - click the Workflows button
            print("\n--- Workflows ---")
            try:
                workflows_btn = page.get_by_text("Workflows", exact=True)
                if workflows_btn.count() == 0:
                    workflows_btn = page.locator("button:has-text('Workflows')")
                workflows_btn.click()
                time.sleep(3)
                print("  Clicked Workflows button")
            except Exception as e:
                print(f"  Warning clicking Workflows: {e}")
                try:
                    page.click("text=Workflows")
                    time.sleep(3)
                except:
                    print("  Could not find Workflows button")
            
            screenshot_path = os.path.join(SCREENSHOTS_DIR, "workflows_desktop_1440x900.png")
            page.screenshot(path=screenshot_path, full_page=False)
            print(f"  Viewport screenshot saved: {screenshot_path}")
            
            full_path = os.path.join(SCREENSHOTS_DIR, "workflows_desktop_full.png")
            page.screenshot(path=full_path, full_page=True)
            print(f"  Full page saved: {full_path}")
            
            browser.close()
        
        # === MOBILE SCREENSHOTS ===
        print("\n" + "=" * 60)
        print("Taking MOBILE screenshots (375x812)")
        print("=" * 60)
        
        with sync_playwright() as p:
            browser = p.chromium.launch(
                headless=True,
                args=['--no-sandbox', '--disable-setuid-sandbox']
            )
            context = browser.new_context(
                viewport=MOBILE_VIEWPORT,
                device_scale_factor=2,
                is_mobile=True,
                has_touch=True,
                user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
            )
            page = context.new_page()
            
            # 1. Dashboard
            print("\n--- Dashboard (Mobile) ---")
            page.goto(f"{BASE_URL}/", wait_until="networkidle", timeout=60000)
            time.sleep(3)
            
            screenshot_path = os.path.join(SCREENSHOTS_DIR, "dashboard_mobile_375x812.png")
            page.screenshot(path=screenshot_path, full_page=False)
            print(f"  Viewport screenshot saved: {screenshot_path}")
            
            full_path = os.path.join(SCREENSHOTS_DIR, "dashboard_mobile_full.png")
            page.screenshot(path=full_path, full_page=True)
            print(f"  Full page saved: {full_path}")
            
            # 2. Hierarchy
            print("\n--- Hierarchy (Mobile) ---")
            try:
                hierarchy_btn = page.locator("button:has-text('Hierarchy')")
                hierarchy_btn.click()
                time.sleep(3)
                print("  Clicked Hierarchy button")
            except Exception as e:
                print(f"  Warning clicking Hierarchy: {e}")
                try:
                    page.click("text=Hierarchy")
                    time.sleep(3)
                except:
                    print("  Could not find Hierarchy button")
            
            screenshot_path = os.path.join(SCREENSHOTS_DIR, "hierarchy_mobile_375x812.png")
            page.screenshot(path=screenshot_path, full_page=False)
            print(f"  Viewport screenshot saved: {screenshot_path}")
            
            full_path = os.path.join(SCREENSHOTS_DIR, "hierarchy_mobile_full.png")
            page.screenshot(path=full_path, full_page=True)
            print(f"  Full page saved: {full_path}")
            
            # 3. Go back to dashboard
            print("\n--- Going back to Dashboard for Workflows (Mobile) ---")
            page.goto(f"{BASE_URL}/", wait_until="networkidle", timeout=60000)
            time.sleep(3)
            
            # 4. Workflows
            print("\n--- Workflows (Mobile) ---")
            try:
                workflows_btn = page.locator("button:has-text('Workflows')")
                workflows_btn.click()
                time.sleep(3)
                print("  Clicked Workflows button")
            except Exception as e:
                print(f"  Warning clicking Workflows: {e}")
                try:
                    page.click("text=Workflows")
                    time.sleep(3)
                except:
                    print("  Could not find Workflows button")
            
            screenshot_path = os.path.join(SCREENSHOTS_DIR, "workflows_mobile_375x812.png")
            page.screenshot(path=screenshot_path, full_page=False)
            print(f"  Viewport screenshot saved: {screenshot_path}")
            
            full_path = os.path.join(SCREENSHOTS_DIR, "workflows_mobile_full.png")
            page.screenshot(path=full_path, full_page=True)
            print(f"  Full page saved: {full_path}")
            
            browser.close()
        
        print("\n" + "=" * 60)
        print("All screenshots completed!")
        print("=" * 60)
        
        for f in sorted(os.listdir(SCREENSHOTS_DIR)):
            if f.endswith('.png'):
                fpath = os.path.join(SCREENSHOTS_DIR, f)
                size = os.path.getsize(fpath)
                print(f"  {f} ({size:,} bytes)")
        
        return True
    
    finally:
        print("\nStopping server...")
        server_proc.terminate()
        try:
            server_proc.wait(timeout=10)
        except subprocess.TimeoutExpired:
            server_proc.kill()
        print("Server stopped.")

if __name__ == "__main__":
    success = take_screenshots()
    sys.exit(0 if success else 1)
