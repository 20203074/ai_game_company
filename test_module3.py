"""
ANTI-GRAVITY AI: INFINITE GAME STUDIO ENGINE
Module 3 Verification & Integration Test Suite
Tests:
1. Source Code & Complete Asset Generation Pipeline (Narrative, Art, Sound, Programming).
2. 2nd HITL Code Review Inspector & Pause State (Step 9).
3. AI Refactoring Console (Natural language tuning directives).
4. Guardrail 4 Rollback Mechanism (Original code preservation).
5. Final Approval & Push Transition to Step 10 & output/ disk persistence.
6. REST API Server Endpoints (/api/artifacts, /api/refactor, /api/rollback, /api/hitl).
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

def test_module3():
    print("=" * 70, flush=True)
    print("  ANTI-GRAVITY AI: MODULE 3 VERIFICATION & INTEGRATION TEST", flush=True)
    print("=" * 70, flush=True)

    # -------------------------------------------------------------------------
    # 1. Initialize Simulation Engine
    # -------------------------------------------------------------------------
    e = engine.CompanySimulationEngine(headless=True)
    print("\n[TEST 1] Engine initialized successfully.", flush=True)
    assert e.running is True

    # -------------------------------------------------------------------------
    # 2. Step 1~4: Approve Game Proposal to Advance to Pipeline
    # -------------------------------------------------------------------------
    prop = e.generate_new_game_proposal(forced_pass=True)
    print(f"\n[TEST 2] Generated New Game Proposal ID#{prop['id']} '{prop['title']}' ({prop['genre']})", flush=True)
    
    e.execute_step(4) # HITL Step 4
    assert e.current_step == 4
    assert e.is_hitl_waiting is True

    # Representative Approves 1st HITL
    res1 = e.handle_hitl_action("승인", topic_id=prop['id'])
    print(f"  - 1st HITL Approved: {res1['message']}", flush=True)
    assert e.current_step == 5
    assert e.is_hitl_waiting is False
    assert e.selected_topic['id'] == prop['id']

    # -------------------------------------------------------------------------
    # 3. Advance to Step 8 & Step 9 (Module 3 Pipeline & 2nd HITL)
    # -------------------------------------------------------------------------
    print("\n[TEST 3] Advancing pipeline through Department Steps 5, 6, 7, 8 -> Step 9...", flush=True)
    e.execute_step(6) # Art Team
    e.execute_step(7) # Sound Team
    e.execute_step(8) # Programming Team (Triggers Artifact Generation)
    assert e.current_step == 8

    e.execute_step(9) # ★ 2차 대표 코드 검토 ★ (HITL INTERRUPT 2)
    print(f"  - Arrived at STEP {e.current_step:02d}: {engine.STEPS_SPEC[e.current_step-1]['title']}", flush=True)
    assert e.current_step == 9
    assert e.is_paused is True, "Engine MUST pause at Step 9 for HITL"
    assert e.is_hitl_waiting is True, "is_hitl_waiting MUST be True at Step 9"
    assert e.hitl_stage == 2, "hitl_stage MUST be 2 at Step 9"

    # Verify key agents are assembled in Executive Room (Room #1)
    ag19 = e.agents[19] # Yoon Ji-min (Lead Programmer)
    ag26 = e.agents[26] # Kim Se-ri (Chief Secretary)
    print(f"  - Lead Programmer (19): State={ag19['state']}, Target=({ag19['target_x']}, {ag19['target_y']})", flush=True)
    print(f"  - Chief Secretary (26): State={ag26['state']}, Target=({ag26['target_x']}, {ag26['target_y']})", flush=True)
    assert ag19["state"] == engine.AgentState.AWAIT_APPROVAL
    assert ag26["state"] == engine.AgentState.AWAIT_APPROVAL
    assert (ag19["target_x"], ag19["target_y"]) == (5, 7)
    assert (ag26["target_x"], ag26["target_y"]) == (6, 8)

    # -------------------------------------------------------------------------
    # 4. Verify Project Artifacts & Source Code Generation (Spec 1)
    # -------------------------------------------------------------------------
    print("\n[TEST 4] Verifying Module 3 Deliverables & Source Code Artifacts...", flush=True)
    artifacts = e.get_project_artifacts()
    assert artifacts is not None
    assert artifacts["topic_title"] == prop["title"]
    assert artifacts["genre"] == prop["genre"]

    # Verify 5 deliverable files
    expected_files = ["game_core.js", "GameManager.cs", "main.py", "GDD_Detailed.md", "assets_manifest.json"]
    for fname in expected_files:
        assert fname in artifacts["files"], f"Missing deliverable file: {fname}"
        fobj = artifacts["files"][fname]
        assert len(fobj["content"]) > 50, f"File content too short: {fname}"
        assert fobj["loc"] > 5, f"LOC too low: {fname}"
        print(f"  - File [{fname}]: {fobj['title']} ({fobj['loc']} Lines, {fobj['size']})", flush=True)

    # Verify 4 Department Contributors from 270 agency roster
    print(f"  - Department Leads: {artifacts['leads']}", flush=True)
    assert "narrative" in artifacts["leads"]
    assert "art" in artifacts["leads"]
    assert "sound" in artifacts["leads"]
    assert "programming" in artifacts["leads"]
    assert len(artifacts.get("contributors", [])) == 4

    # Verify Metrics
    metrics = artifacts["metrics"]
    print(f"  - Code Metrics: LOC={metrics['loc_total']}, FPS={metrics['fps_target']}, Score={metrics['code_quality_score']} pts", flush=True)
    assert metrics["fps_target"] == 60
    assert metrics["code_quality_score"] >= 90
    assert "PASSED" in metrics["security_guardrails"]

    # -------------------------------------------------------------------------
    # 5. Verify AI Refactoring Console (Spec 2 Directives)
    # -------------------------------------------------------------------------
    print("\n[TEST 5] Testing AI Refactoring Directives (Natural Language Tuning)...", flush=True)

    # Directive A: "이 부분 쿨타임 줄여줘"
    ref_a = e.refactor_code("이 부분 쿨타임 줄여줘", target_file="game_core.js")
    print(f"  - Directive A ['쿨타임 단축']: {ref_a['summary']}", flush=True)
    assert ref_a["status"] == "success"
    assert "DASH_COOLDOWN = 0.75" in ref_a["updated_code"]
    assert "SKILL_COOLDOWN = 2.0" in ref_a["updated_code"]

    # Directive B: "전투 로직 수정해줘"
    ref_b = e.refactor_code("전투 로직 수정해줘", target_file="game_core.js")
    print(f"  - Directive B ['전투/공격력 버프']: {ref_b['summary']}", flush=True)
    assert "BASE_ATTACK_POWER = 65" in ref_b["updated_code"]
    assert "COMBO_CRITICAL_MULTIPLIER = 2.8" in ref_b["updated_code"]

    # Directive C: "패링 판정 시간 늘려줘"
    ref_c = e.refactor_code("패링 판정 시간 늘려줘", target_file="game_core.js")
    print(f"  - Directive C ['패링 확장']: {ref_c['summary']}", flush=True)
    assert "PARRY_WINDOW_SEC = 0.40" in ref_c["updated_code"]

    # Directive D: "대시 무적시간 늘려줘"
    ref_d = e.refactor_code("대시 무적시간 늘려줘", target_file="game_core.js")
    print(f"  - Directive D ['대시 무적 연장']: {ref_d['summary']}", flush=True)
    assert "DASH_INVINCIBLE_TIME = 0.45" in ref_d["updated_code"]

    # Directive E: "궁극기 충전속도 빠르게 해줘"
    ref_e = e.refactor_code("궁극기 충전속도 빠르게 해줘", target_file="game_core.js")
    print(f"  - Directive E ['궁극기 가속']: {ref_e['summary']}", flush=True)
    assert "ULTIMATE_CHARGE_RATE = 2.5" in ref_e["updated_code"]

    # Directive F: "60FPS 최적화 해줘"
    ref_f = e.refactor_code("60FPS 최적화 해줘", target_file="game_core.js")
    print(f"  - Directive F ['60FPS 최적화']: {ref_f['summary']}", flush=True)
    assert "[OPTIMIZED: 60FPS RAF LOCK]" in ref_f["updated_code"]

    # Directive G: Custom Free-form directive
    ref_g = e.refactor_code("보스 패턴 3페이즈 추가해줘", target_file="game_core.js")
    print(f"  - Directive G ['커스텀 지시']: {ref_g['summary']}", flush=True)
    assert "[AI REFACTOR - CEO DIRECTIVE]" in ref_g["updated_code"]

    # Verify History Stack
    history = e.project_artifacts["refactor_history"]
    print(f"  - Total Refactor History Count: {len(history)} items", flush=True)
    assert len(history) >= 8 # Initial + 7 directives

    # -------------------------------------------------------------------------
    # 6. Verify Code Rollback Mechanism (Guardrail 4: 원본 보존 복제본 원칙)
    # -------------------------------------------------------------------------
    print("\n[TEST 6] Testing Code Rollback Mechanism (Guardrail 4)...", flush=True)
    rb = e.rollback_code(target_file="game_core.js")
    print(f"  - Rollback Result: {rb['summary']}", flush=True)
    assert rb["status"] == "success"
    # Verify original values are restored
    assert "let DASH_COOLDOWN = 1.5;" in rb["restored_code"]
    assert "let BASE_ATTACK_POWER = 35;" in rb["restored_code"]
    assert "let PARRY_WINDOW_SEC = 0.20;" in rb["restored_code"]
    print("  - Successfully restored game_core.js to pre-refactored state.", flush=True)

    # -------------------------------------------------------------------------
    # 7. Verify Representative Final Approval ("최종 승인 및 푸시") -> Step 10
    # -------------------------------------------------------------------------
    print("\n[TEST 7] Testing Representative Final Approval & Push -> Step 10...", flush=True)
    res_final = e.handle_hitl_action("최종 승인 및 푸시", topic_id=prop['id'])
    print(f"  - Final Approval Result: {res_final['message']}", flush=True)
    assert res_final["status"] == "success"
    assert e.current_step == 10, "Engine MUST transition to Step 10 after 2nd HITL approval"
    assert e.is_hitl_waiting is False
    assert e.is_paused is False

    # Verify output/ disk persistence in 5 standard folders
    safe_title = "".join(c for c in prop["title"] if c.isalnum() or c in ("_", "-")).strip()
    date_str = time.strftime("%Y-%m-%d")
    expected_folder = f"{date_str}_{prop['genre']}_{safe_title}"
    output_target_dir = os.path.join(engine.OUTPUT_DIR, expected_folder)
    print(f"  - Checking persisted deliverables at: {output_target_dir}", flush=True)
    assert os.path.exists(output_target_dir), f"Directory does not exist: {output_target_dir}"

    subdirs = ["1_GDD", "2_Assets", "3_SourceCode", "4_Build", "5_Marketing"]
    for sd in subdirs:
        sd_path = os.path.join(output_target_dir, sd)
        assert os.path.isdir(sd_path), f"Missing subdirectory: {sd}"
        files_in_sd = os.listdir(sd_path)
        assert len(files_in_sd) > 0, f"Subdirectory is empty: {sd}"
        print(f"    - {sd}/: {files_in_sd}", flush=True)

    # -------------------------------------------------------------------------
    # 8. Verify Command Console Natural Language Integration
    # -------------------------------------------------------------------------
    print("\n[TEST 8] Testing Command Console Natural Language Refactoring Directives...", flush=True)
    cmd_res = e.parse_command("이 부분 쿨타임 줄여줘")
    print(f"  - Console Output: [{cmd_res['responder']}]: {cmd_res['output']}", flush=True)
    assert "프로그래밍팀장" in cmd_res["responder"]
    assert "쿨타임" in cmd_res["output"]

    # -------------------------------------------------------------------------
    # 9. Verify REST API Server Endpoints
    # -------------------------------------------------------------------------
    print("\n[TEST 9] Testing REST API Server Endpoints...", flush=True)
    test_port = 8899
    server_address = ("", test_port)
    httpd = HTTPServer(server_address, CompanyAPIHandler)
    server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    server_thread.start()

    base_url = f"http://127.0.0.1:{test_port}"
    time.sleep(0.3)

    try:
        # 9-1. GET /api/artifacts
        req = urllib.request.Request(f"{base_url}/api/artifacts")
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            print(f"  - GET /api/artifacts -> HTTP {resp.status}, status={data.get('status')}", flush=True)
            assert resp.status == 200
            assert "artifacts" in data
            assert "game_core.js" in data["artifacts"]["files"]

        # 9-2. POST /api/refactor
        refactor_payload = json.dumps({"prompt": "전투 로직 수정해줘", "target_file": "game_core.js"}).encode("utf-8")
        req = urllib.request.Request(f"{base_url}/api/refactor", data=refactor_payload, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            print(f"  - POST /api/refactor -> HTTP {resp.status}, summary={data['result']['summary']}", flush=True)
            assert resp.status == 200
            assert data["status"] == "success"
            assert "BASE_ATTACK_POWER = 65" in data["result"]["updated_code"]

        # 9-3. POST /api/rollback
        rollback_payload = json.dumps({"target_file": "game_core.js"}).encode("utf-8")
        req = urllib.request.Request(f"{base_url}/api/rollback", data=rollback_payload, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            print(f"  - POST /api/rollback -> HTTP {resp.status}, summary={data['result']['summary']}", flush=True)
            assert resp.status == 200
            assert data["status"] == "success"
            assert "let BASE_ATTACK_POWER = 35;" in data["result"]["restored_code"]

        # 9-4. POST /api/hitl with final approve
        hitl_payload = json.dumps({"action": "최종 승인", "topic_id": prop["id"]}).encode("utf-8")
        req = urllib.request.Request(f"{base_url}/api/hitl", data=hitl_payload, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            print(f"  - POST /api/hitl -> HTTP {resp.status}, result={data}", flush=True)
            assert resp.status == 200
            assert data["status"] == "success"

    finally:
        httpd.shutdown()
        httpd.server_close()

    # Cleanup
    e.running = False
    print("\n" + "=" * 70, flush=True)
    print("  ★ ALL MODULE 3 TESTS & INTEGRATION SUITES PASSED PERFECTLY (100%) ★", flush=True)
    print("=" * 70, flush=True)

if __name__ == "__main__":
    test_module3()
