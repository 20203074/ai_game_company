"""
ANTI-GRAVITY AI: INFINITE GAME STUDIO ENGINE
Module 4 & Module 5 Integrated Verification Test Suite
Tests:
1. .env configuration & GitHub 1 Game = 1 Repo Auto-Integration
2. Output 5-folder standardized structure & Interactive Playable WebGL Build
3. Auto Live-Ops & CHANGELOG.md & Release Tagging (Step 11)
4. Autonomous AI Playtesting & Death Heatmap (QA Dept 3)
5. Steam Storefront Studio & 4-Language Localization (KO/EN/JP/ZH)
6. Studio Portfolio & Infinite Sprint Cycle (Step 12)
7. REST API Endpoints (/api/playtest, /api/storefront, /api/portfolio, /api/telemetry, /api/github_sync)
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

def test_module4_and_5():
    print("=" * 70, flush=True)
    print("  ANTI-GRAVITY AI: MODULE 4 & 5 VERIFICATION TEST SUITE", flush=True)
    print("=" * 70, flush=True)

    # 1. Initialize Engine & Check .env
    e = engine.CompanySimulationEngine(headless=True)
    print("\n[TEST 1] Engine & .env Integration Check", flush=True)
    assert os.path.exists(engine.ENV_FILE), ".env file must exist or be copied from .env.example"
    print(f"  - .env loaded. GitHub Username: @{e.github_username}, Status: {e.github_status}", flush=True)
    assert e.github_status in ["CONNECTED", "AWAIT_INTEGRATION"]

    # 2. Test GitHub 1 Game = 1 Repo Simulation
    print("\n[TEST 2] GitHub 1 Game = 1 Repo Auto-Integration", flush=True)
    gh_res = e.create_github_repo("Cyberpunk_ARPG", "NeonBlade")
    print(f"  - Repo Name: {gh_res['repo_name']}", flush=True)
    print(f"  - Repo URL: {gh_res['repo_url']}", flush=True)
    print(f"  - Status: {gh_res['status']} ({gh_res['message']})", flush=True)
    assert "repo_name" in gh_res
    assert gh_res["status"] in ["success", "await_integration", "simulated"]

    # 3. Test Step 10 & Output Persistence with Playable WebGL Build
    print("\n[TEST 3] Step 10 Store Packaging & Interactive WebGL Build Persistence", flush=True)
    e.selected_topic = {
        "id": 88,
        "title": "루네스미스: 차원 공방전",
        "genre": "Retro_Metroidvania",
        "core_loop": "시간 왜곡 패링, 룬 인챈트, 던전 탐험",
        "world": "차원의 균열이 열린 고대 공방 유적",
        "art_sound": "네오 픽셀 아트와 신스웨이브",
        "target": "메트로배니아 매니아"
    }
    e.execute_step(10)
    safe_title = "".join(c for c in e.selected_topic["title"] if c.isalnum() or c in ("_", "-")).strip()
    date_str = time.strftime("%Y-%m-%d")
    folder_name = f"{date_str}_{e.selected_topic['genre']}_{safe_title}"
    target_dir = os.path.join(engine.OUTPUT_DIR, folder_name)
    
    assert os.path.exists(target_dir), f"Directory {target_dir} must exist"
    for sd in ["1_GDD", "2_Assets", "3_SourceCode", "4_Build", "5_Marketing"]:
        assert os.path.exists(os.path.join(target_dir, sd)), f"Subdirectory {sd} missing"
    
    # Check WebGL index.html playable build exists
    build_path = os.path.join(target_dir, "4_Build", "index.html")
    assert os.path.exists(build_path)
    with open(build_path, "r", encoding="utf-8") as f:
        html_code = f.read()
    assert "game-canvas" in html_code
    assert "btn-god" in html_code
    print("  - 5 Standard Subdirectories & Interactive WebGL Playable Build verified on disk.", flush=True)

    # 4. Test Step 11 Auto Live-Ops & CHANGELOG.md
    print("\n[TEST 4] Step 11 Auto Live-Ops & CHANGELOG.md / Release Tagging", flush=True)
    e.execute_step(11)
    changelog_path = os.path.join(target_dir, "CHANGELOG.md")
    assert os.path.exists(changelog_path)
    with open(changelog_path, "r", encoding="utf-8") as f:
        cl_text = f.read()
    assert "[v1.0.1]" in cl_text
    print("  - CHANGELOG.md generated successfully with v1.0.1 release tag notes.", flush=True)

    # 5. Test Autonomous AI Playtesting & Heatmap
    print("\n[TEST 5] Autonomous AI Playtesting & Balance Heatmap (QA Dept 3)", flush=True)
    pt_report = e.run_ai_playtest(iterations=100)
    print(f"  - Lead Tester: {pt_report['lead_tester']}", flush=True)
    print(f"  - Clear Rate: {pt_report['clear_rate']}% [{pt_report['balance_status']}]", flush=True)
    print(f"  - Avg Survival: {pt_report['avg_survival_time_sec']}s, Avg Score: {pt_report['avg_score']}", flush=True)
    print(f"  - Death Heatmap Points: {len(pt_report['death_heatmap'])} points recorded", flush=True)
    print(f"  - Recommendation: {pt_report['recommendation']}", flush=True)
    assert pt_report["iterations"] == 100
    assert "death_heatmap" in pt_report
    assert pt_report["balance_status"] in ["BALANCED", "TOO_HARD", "TOO_EASY"]

    # 6. Test Steam Storefront Studio & 4-Language Localization
    print("\n[TEST 6] Steam Storefront Studio & Multi-Language Localization", flush=True)
    store_front = e.generate_store_front()
    print(f"  - Game: {store_front['title']} ({store_front['genre']})", flush=True)
    print(f"  - Supported Languages: {list(store_front['localized'].keys())}", flush=True)
    print(f"  - Steam Score Rating: {store_front['steam_score']}", flush=True)
    assert "ko" in store_front["localized"]
    assert "en" in store_front["localized"]
    assert "jp" in store_front["localized"]
    assert "zh" in store_front["localized"]
    assert "header_svg" in store_front["capsules"]
    print("  - SVG Capsules & 4-Language Storefront Package verified.", flush=True)

    # 7. Test Step 12 Studio Portfolio Registration & Infinite Sprint
    print("\n[TEST 7] Step 12 Studio Portfolio Registration & Metrics", flush=True)
    e.execute_step(12)
    assert len(e.released_portfolio) >= 1
    p_game = e.released_portfolio[0]
    print(f"  - Registered Portfolio Game: {p_game['title']} ({p_game['version']})", flush=True)
    print(f"  - Downloads: {p_game['downloads']:,}, Revenue: ${p_game['revenue_usd']:,}", flush=True)
    print(f"  - Total Studio Downloads: {e.studio_metrics['total_downloads']:,}", flush=True)
    print(f"  - Total Studio Revenue: ${e.studio_metrics['total_revenue_usd']:,}", flush=True)

    # 8. Test Command Console Directives
    print("\n[TEST 8] Natural Language Console Directives", flush=True)
    c1 = e.parse_command("AI 플레이테스트 진행해줘")
    print(f"  - Console ['AI 플레이테스트']: {c1['output'][:65]}...", flush=True)
    assert "플레이테스트" in c1["output"] or "클리어율" in c1["output"]

    c2 = e.parse_command("스팀 상점 페이지 확인")
    print(f"  - Console ['스팀 상점']: {c2['output'][:65]}...", flush=True)
    assert "스팀 상점" in c2["output"] or "4개 국어" in c2["output"]

    c3 = e.parse_command("스튜디오 게임 포트폴리오 현황 보고")
    print(f"  - Console ['포트폴리오']: {c3['output'][:65]}...", flush=True)
    assert "포트폴리오" in c3["output"] or "다운로드" in c3["output"]

    c4 = e.parse_command("깃허브 상태 확인")
    print(f"  - Console ['깃허브']: {c4['output']}", flush=True)
    assert "GitHub" in c4["output"]

    # 9. Test REST API Server Endpoints
    print("\n[TEST 9] REST API Server Integration Endpoints", flush=True)
    test_port = 8899
    server = HTTPServer(("127.0.0.1", test_port), CompanyAPIHandler)
    server_thread = threading.Thread(target=server.serve_forever, daemon=True)
    server_thread.start()
    time.sleep(0.4)

    try:
        base_url = f"http://127.0.0.1:{test_port}"
        
        # GET /api/playtest
        with urllib.request.urlopen(f"{base_url}/api/playtest") as resp:
            data = json.loads(resp.read().decode("utf-8"))
            assert data["status"] == "ok"
            print("  - GET /api/playtest: 200 OK, report valid.", flush=True)

        # GET /api/storefront
        with urllib.request.urlopen(f"{base_url}/api/storefront") as resp:
            data = json.loads(resp.read().decode("utf-8"))
            assert data["status"] == "ok"
            assert "capsules" in data["storefront"]
            print("  - GET /api/storefront: 200 OK, capsules verified.", flush=True)

        # GET /api/portfolio
        with urllib.request.urlopen(f"{base_url}/api/portfolio") as resp:
            data = json.loads(resp.read().decode("utf-8"))
            assert data["status"] == "ok"
            print(f"  - GET /api/portfolio: 200 OK, active games: {len(data['data']['portfolio'])}", flush=True)

        # POST /api/telemetry
        req = urllib.request.Request(
            f"{base_url}/api/telemetry",
            data=json.dumps({"event": "PLAYER_HIT", "data": {"hp": 85, "score": 250}}).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req) as resp:
            assert resp.status == 200
            print("  - POST /api/telemetry: 200 OK, in-game telemetry synchronized.", flush=True)

        # POST /api/github_sync
        req = urllib.request.Request(
            f"{base_url}/api/github_sync",
            data=b"{}",
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req) as resp:
            assert resp.status == 200
            print("  - POST /api/github_sync: 200 OK, repo sync response received.", flush=True)

    finally:
        server.shutdown()
        server.server_close()

    print("\n" + "=" * 70, flush=True)
    print("  ★ ALL MODULE 4 & 5 TESTS PASSED WITH 100% SUCCESS ★", flush=True)
    print("=" * 70, flush=True)

if __name__ == "__main__":
    test_module4_and_5()

