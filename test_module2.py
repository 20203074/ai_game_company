import sys
import time
import engine

print("=== STARTING MODULE 2 VERIFICATION ===", flush=True)

# 1. Initialize Engine
e = engine.CompanySimulationEngine(headless=True)
print("[1] Engine initialized successfully.", flush=True)

# 2. Check 270 agency lazy loaded roster
roster = e.get_full_roster()
print(f"[2] Lazy loaded roster count: {len(roster)} agents", flush=True)
assert len(roster) >= 270, f"Expected 270 agents, got {len(roster)}"

# 3. Check Procedural Proposal Generation (Passing)
p1 = e.generate_new_game_proposal(forced_pass=True)
print(f"[3] Generated Passing Proposal: ID#{p1['id']} '{p1['title']}'", flush=True)
print(f"    - Genre: {p1['genre']}", flush=True)
print(f"    - QA Score: {p1['score']}점 (Verdict: {p1['qa_verdict']})", flush=True)
print(f"    - Core Loop: {p1['core_loop']}", flush=True)
print(f"    - Contributors: {p1.get('contributors')}", flush=True)
print(f"    - Approval Queue Count: {len(e.approval_queue)}건", flush=True)
assert p1["passed"] is True
assert p1["score"] >= 90
assert len(e.approval_queue) >= 4

# 4. Check Procedural Proposal Generation (QA Rejection & Guardrail Rule)
p2 = e.generate_new_game_proposal(forced_pass=False)
print(f"[4] Generated Rejected Proposal: ID#{p2['id']} '{p2['title']}'", flush=True)
print(f"    - Genre: {p2['genre']}", flush=True)
print(f"    - QA Verdict: {p2['qa_verdict']}", flush=True)
print(f"    - Rejected Queue Count: {len(e.rejected_queue)}건", flush=True)
assert p2["passed"] is False
assert p2["guardrail_status"] == "FAIL"

# 5. Check Step 4 HITL State & Pending Queue
e.execute_step(4)
print(f"[5] Step 4 HITL State: is_hitl_waiting={e.is_hitl_waiting}, is_paused={e.is_paused}", flush=True)
print(f"    - Active Floor Agents State (Dept 2, 3, 12 in CEO Room):", flush=True)
print(f"      기획1팀장(4): {e.agents[4]['state']} ('{e.agents[4]['speech_text']}')", flush=True)
print(f"      QA팀장(7): {e.agents[7]['state']} ('{e.agents[7]['speech_text']}')", flush=True)
print(f"      비서실장(26): {e.agents[26]['state']} ('{e.agents[26]['speech_text']}')", flush=True)
assert e.is_hitl_waiting is True
assert e.is_paused is True

# 6. Check Parallel Background Worker Thread is active
print(f"[6] Checking Parallel Background Thread: {e.bg_generator_thread.name} (is_alive={e.bg_generator_thread.is_alive()})", flush=True)
assert e.bg_generator_thread.is_alive() is True

# 7. Check Snapshot serialization (REST API schema)
snapshot = e.get_snapshot()
print(f"[7] Snapshot Schema Validation:", flush=True)
print(f"    - approval_queue: {len(snapshot['approval_queue'])} items", flush=True)
print(f"    - rejected_queue: {len(snapshot['rejected_queue'])} items", flush=True)
print(f"    - queue_counts: {snapshot['queue_counts']}", flush=True)
assert "approval_queue" in snapshot
assert "queue_counts" in snapshot

# 8. Check Representative Approval HITL Action -> Transition to Step 5
res = e.handle_hitl_action("승인", topic_id=p1['id'])
print(f"[8] Handled Approval Decision: {res}", flush=True)
print(f"    - Current step: STEP {e.current_step:02d} ({engine.STEPS_SPEC[e.current_step-1]['title']})", flush=True)
print(f"    - is_hitl_waiting: {e.is_hitl_waiting}, is_paused: {e.is_paused}", flush=True)
print(f"    - Processed Queue Count: {len(e.processed_queue)}건", flush=True)
assert e.current_step == 5, f"Expected step 5, got {e.current_step}"
assert e.is_hitl_waiting is False
assert len(e.processed_queue) >= 1

# Cleanup
e.running = False
print("=== ALL MODULE 2 TESTS PASSED PERFECTLY ===", flush=True)
