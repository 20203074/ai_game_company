"""
ANTI-GRAVITY AI: INFINITE GAME STUDIO ENGINE
Module 5 Verification & Integration Test Suite (Full Implementation)
Tests all 4 core specifications defined in module5.txt:
1. In-Browser Playable Game & WebGL Runner (with CEO Debug Overlay & Real-Time Telemetry).
2. Autonomous AI QA Playtesting & Heatmap (100 runs, clear rate, death coordinates, anomaly detection).
3. Steam Store Front Studio & Global Marketing Localization (SVG Capsules, 4-Language Store Bundle).
4. Multi-Project Portfolio & Infinite Sprint Cycle (Portfolio analytics, post-release directives, auto sprint).
"""

import os
import sys
import json
import time
import urllib.request
import threading
from http.server import HTTPServer

import engine
from server import CompanyAPIHandler

def test_module5():
    print("=" * 70, flush=True)
    print("  ANTI-GRAVITY AI: MODULE 5 VERIFICATION & INTEGRATION TEST", flush=True)
    print("=" * 70, flush=True)

    # 1. Initialize Simulation Engine with LLM Brain
    e = engine.CompanySimulationEngine(headless=True)
    print("\n[TEST 1] Simulation Engine & LLM Brain Initialization", flush=True)
    assert e.running is True
    print(f"  - Engine active. GitHub Status: [{e.github_status}]", flush=True)

    # 2. Test In-Browser Playable Game & WebGL Runner (Feature 1)
    print("\n[TEST 2] In-Browser Playable WebGL Game & Real-Time Telemetry (Feature 1)", flush=True)
    e.selected_topic = {
        "id": 99,
        "title": "보이드 레인: 심연의 탄막 (Void Rain: Abyssal Storm)",
        "genre": "Void_BulletHell",
        "core_loop": "보이드 실드로 탄막 흡수 -> 에너지 반사 레이저 발사 -> 코어 탈취",
        "world": "시공간의 왜곡 속에서 무한으로 생성되는 탄막을 뚫고 심연의 코어를 파괴하는 전장",
        "art_sound": "사이버틱 보이드 이펙트와 네온 SFX",
        "target": "탄막 슈팅 & 불릿헬 하드코어 게이머"
    }
    e.execute_step(10) # Store Packaging & Build Generation

    safe_title = "".join(c for c in e.selected_topic["title"] if c.isalnum() or c in ("_", "-")).strip()
    date_str = time.strftime("%Y-%m-%d")
    build_path = os.path.join(engine.OUTPUT_DIR, f"{date_str}_{e.selected_topic['genre']}_{safe_title}", "4_Build", "index.html")
    assert os.path.exists(build_path), f"Playable build missing at {build_path}"
    
    with open(build_path, "r", encoding="utf-8") as f:
        html = f.read()
    assert "game-canvas" in html
    assert "btn-god" in html
    assert "btn-cd" in html
    assert "btn-speed" in html
    assert "GAME_TELEMETRY" in html
    print("  - Interactive WebGL/Canvas game runner & CEO Debug overlay verified on disk.", flush=True)

    # Test telemetry event ingestion
    initial_log_count = len(e.logs)
    e.handle_in_game_telemetry("PARRY_SUCCESS", {"score": 350, "hp": 100})
    e.handle_in_game_telemetry("BOSS_VICTORY", {"score": 2850, "finalScore": 5200})
    assert len(e.logs) > initial_log_count
    assert any("IN_GAME" in log["category"] for log in e.logs)
    print("  - In-game real-time telemetry successfully ingested and logged.", flush=True)

    # 3. Test 270 Agency Autonomous AI Playtesting & Heatmap (Feature 2)
    print("\n[TEST 3] 270 Agency Autonomous AI Playtesting & Heatmap (Feature 2)", flush=True)
    pt = e.run_ai_playtest(iterations=100)
    print(f"  - Lead Tester: {pt['lead_tester']}", flush=True)
    print(f"  - 100-Run Boss Clear Rate: {pt['clear_rate']}% [{pt['balance_status']}]", flush=True)
    print(f"  - Average Survival Duration: {pt['avg_survival_time_sec']}s", flush=True)
    print(f"  - Death Heatmap Recorded Points: {len(pt['death_heatmap'])} points", flush=True)
    print(f"  - Anomaly & Recommendation: {pt['recommendation']}", flush=True)
    assert pt["iterations"] == 100
    assert 0.0 <= pt["clear_rate"] <= 100.0
    assert len(pt["death_heatmap"]) > 0
    assert pt["balance_status"] in ["BALANCED", "TOO_HARD", "TOO_EASY"]

    # 4. Test Steam Store Front Studio & Global Localization (Feature 3)
    print("\n[TEST 4] Steam Store Front Studio & 4-Language Localization (Feature 3)", flush=True)
    sf = e.generate_store_front()
    print(f"  - Steam Game Title: {sf['title']} ({sf['genre']})", flush=True)
    print(f"  - Localized Synopses: {list(sf['localized'].keys())} (KO, EN, JP, ZH)", flush=True)
    print(f"  - Header Capsule SVG Length: {len(sf['capsules']['header_svg'])} bytes", flush=True)
    print(f"  - Main Capsule SVG Length: {len(sf['capsules']['main_svg'])} bytes", flush=True)
    print(f"  - Steam Community Review Rating: {sf['steam_score']}", flush=True)
    
    bundle_path = os.path.join(engine.OUTPUT_DIR, f"{date_str}_{e.selected_topic['genre']}_{safe_title}", "5_Marketing", "store_bundle")
    assert os.path.exists(os.path.join(bundle_path, "capsule_header.svg"))
    assert os.path.exists(os.path.join(bundle_path, "capsule_main.svg"))
    assert os.path.exists(os.path.join(bundle_path, "store_localized.json"))
    print("  - Steam Capsules & 4-Language Store Bundle verified in 5_Marketing/store_bundle/.", flush=True)

    # 5. Test Multi-Project Portfolio & Infinite Sprint Cycle (Feature 4)
    print("\n[TEST 5] Multi-Project Portfolio & Infinite Sprint Cycle (Feature 4)", flush=True)
    e.execute_step(11) # Live-Ops patch & tag
    e.execute_step(12) # Chief Secretary Briefing & Portfolio registration

    assert len(e.released_portfolio) >= 1
    p_game = e.released_portfolio[-1]
    print(f"  - Registered Master Release: '{p_game['title']}' ({p_game['version']})", flush=True)
    print(f"  - Studio Aggregate Downloads: {e.studio_metrics['total_downloads']:,} units", flush=True)
    print(f"  - Studio Aggregate Revenue: ${e.studio_metrics['total_revenue_usd']:,} USD", flush=True)
    print(f"  - Active Live Operations Games: {e.studio_metrics['active_live_games']}", flush=True)

    # Test Infinite Sprint Advancement
    e.auto_sprint_enabled = True
    initial_step = e.current_step
    e.advance_to_next_sprint()
    print(f"  - Advanced to Next Infinite Sprint: Current Step = STEP {e.current_step:02d} (Reset to STEP 01 with new topic: '{e.selected_topic['title']}')", flush=True)
    assert e.current_step == 1
    assert e.selected_topic is not None

    # Test Post-Release Live-Ops CEO Command
    cmd_res = e.parse_command(f"{p_game['title']} 시즌2 대규모 업데이트 진행해")
    print(f"  - Live-Ops Command: {cmd_res['responder']} -> {cmd_res['output']}", flush=True)
    assert "라이브" in cmd_res["responder"]
    assert "v1.1.0" in cmd_res["output"]

    # 6. Test REST API Endpoints for Module 5
    print("\n[TEST 6] REST API Endpoints Integration (/api/playtest, /api/storefront, /api/portfolio, /api/telemetry)", flush=True)
    import server as srv
    srv.engine_instance = e
    test_port = 8999
    server = HTTPServer(("127.0.0.1", test_port), CompanyAPIHandler)
    server_thread = threading.Thread(target=server.serve_forever, daemon=True)
    server_thread.start()
    time.sleep(0.3)

    try:
        base_url = f"http://127.0.0.1:{test_port}"

        # GET /api/playtest
        with urllib.request.urlopen(f"{base_url}/api/playtest") as resp:
            d = json.loads(resp.read().decode("utf-8"))
            assert d["status"] == "ok"
            assert "report" in d
            print("  - GET /api/playtest -> 200 OK", flush=True)

        # GET /api/storefront
        with urllib.request.urlopen(f"{base_url}/api/storefront") as resp:
            d = json.loads(resp.read().decode("utf-8"))
            assert d["status"] == "ok"
            assert "storefront" in d
            print("  - GET /api/storefront -> 200 OK", flush=True)

        # GET /api/portfolio
        with urllib.request.urlopen(f"{base_url}/api/portfolio") as resp:
            d = json.loads(resp.read().decode("utf-8"))
            assert d["status"] == "ok"
            assert len(d["data"]["portfolio"]) >= 1
            print(f"  - GET /api/portfolio -> 200 OK ({len(d['data']['portfolio'])} portfolio items)", flush=True)

        # POST /api/telemetry
        req = urllib.request.Request(
            f"{base_url}/api/telemetry",
            data=json.dumps({"event": "BOSS_DEFEATED", "data": {"score": 5000}}).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req) as resp:
            assert resp.status == 200
            print("  - POST /api/telemetry -> 200 OK", flush=True)

    finally:
        server.shutdown()
        server.server_close()

    print("\n" + "=" * 70, flush=True)
    print("  ★ ALL MODULE 5 SPECIFICATIONS PASSED WITH 100% SUCCESS ★", flush=True)
    print("=" * 70, flush=True)

if __name__ == "__main__":
    test_module5()
