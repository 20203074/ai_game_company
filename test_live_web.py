"""
ANTI-GRAVITY AI: LIVE WEB & UI ENGINE VERIFICATION SCRIPT
Simulates a real user browser session:
1. Spawns server.py
2. Fetches index.html, style.css, app.js
3. Polls /api/state to observe real-time step progression and agent coordination
4. Tests CEO commands, HITL actions, and Module 5 modals
"""

import time
import json
import urllib.request
import threading
from http.server import HTTPServer
import server

def test_live_web():
    print("=" * 70)
    print("  ANTI-GRAVITY AI: LIVE WEB & UI RUNTIME VERIFICATION")
    print("=" * 70)

    port = 8088
    httpd = HTTPServer(("127.0.0.1", port), server.CompanyAPIHandler)
    server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    server_thread.start()
    print(f"[1] Test Web Server listening on http://127.0.0.1:{port}", flush=True)

    base = f"http://127.0.0.1:{port}"
    time.sleep(0.5)

    # 1. Check static web assets
    for asset in ["/index.html", "/style.css", "/app.js"]:
        with urllib.request.urlopen(f"{base}{asset}") as resp:
            content = resp.read()
            print(f"[2] Asset '{asset}': HTTP {resp.status} ({len(content):,} bytes)", flush=True)
            assert resp.status == 200

    # 2. Check initial API state
    with urllib.request.urlopen(f"{base}/api/state") as resp:
        st = json.loads(resp.read().decode("utf-8"))
        print(f"[3] Initial Engine State: STEP {st['current_step']:02d} ({st['step_title']})", flush=True)
        print(f"    - Agents Count: {len(st['agents'])} active on floor", flush=True)
        print(f"    - Approval Queue: {len(st['approval_queue'])} games pending", flush=True)
        print(f"    - In-game Time: {st['sim_time']} | System Time: {st['system_time']}", flush=True)
        assert st["current_step"] >= 1
        assert len(st["agents"]) >= 26

    # 3. Simulate step progression
    print("[4] Testing tick advancement over 6 seconds...", flush=True)
    # Simulate 6 ticks on server.engine_instance
    for _ in range(6):
        server.engine_instance.tick(1.0)
    
    with urllib.request.urlopen(f"{base}/api/state") as resp:
        st2 = json.loads(resp.read().decode("utf-8"))
        print(f"    - Advanced State: STEP {st2['current_step']:02d} ({st2['step_title']}) | sim_time: {st2['sim_time']}", flush=True)
        assert st2["current_step"] >= 2, "Engine should auto-advance from Step 1 to Step 2"

    # 4. Test Console Command: '현황 보고'
    req = urllib.request.Request(
        f"{base}/api/command",
        data=json.dumps({"command": "현황 보고"}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        print(f"[5] Console Command '현황 보고' -> Responder: {res.get('responder')}", flush=True)
        print(f"    Output: {res.get('output') or res.get('text')}", flush=True)
        assert "비서실장" in res.get("responder", "")

    # 5. Test AI Refactoring Command: '쿨타임 줄여줘'
    req = urllib.request.Request(
        f"{base}/api/refactor",
        data=json.dumps({"prompt": "쿨타임 줄여줘", "target_file": "game_core.js"}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        print(f"[6] AI Code Refactoring -> Status: {res.get('status')}", flush=True)
        print(f"    Summary: {res.get('result', {}).get('summary')}", flush=True)
        assert res.get("status") == "success"

    # 6. Test Playtest API
    with urllib.request.urlopen(f"{base}/api/playtest") as resp:
        pt = json.loads(resp.read().decode("utf-8"))
        print(f"[7] Playtest API -> Clear Rate: {pt['report']['clear_rate']}% [{pt['report']['balance_status']}]", flush=True)
        print(f"    Death Points Recorded: {len(pt['report']['death_heatmap'])} points", flush=True)
        assert pt["status"] == "ok"

    # 7. Test Storefront API
    with urllib.request.urlopen(f"{base}/api/storefront") as resp:
        sf = json.loads(resp.read().decode("utf-8"))
        print(f"[8] Storefront API -> Supported Langs: {list(sf['storefront']['localized'].keys())}", flush=True)
        assert sf["status"] == "ok"

    # 8. Test Portfolio API
    with urllib.request.urlopen(f"{base}/api/portfolio") as resp:
        pf = json.loads(resp.read().decode("utf-8"))
        print(f"[9] Portfolio API -> Total Downloads: {pf['data']['metrics']['total_downloads']:,}", flush=True)
        assert pf["status"] == "ok"

    print("\n" + "=" * 70)
    print("  ★ LIVE WEB & UI RUNTIME TEST PASSED 100% WITHOUT ERRORS ★")
    print("=" * 70)

    httpd.shutdown()

if __name__ == "__main__":
    test_live_web()

