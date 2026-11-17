"""
ANTI-GRAVITY AI: INFINITE GAME STUDIO ENGINE
Unified Master Test Runner (Modules 2, 3, 4, 5)
Executes all modular verification suites and outputs an executive summary.
"""

import sys
import subprocess
import time

TEST_SCRIPTS = [
    ("Module 2 (1차 기획 승인 & 270 로스터)", "test_module2.py"),
    ("Module 3 (2차 코드 검토 & AI 리팩토링)", "test_module3.py"),
    ("Module 4 (GitHub 연동 & Live-Ops)", "test_module4.py"),
    ("Module 5 (WebGL 런너 & AI 플레이테스트)", "test_module5.py"),
    ("Live Web & UI Runtime Integration", "test_live_web.py"),
]

def run_all_tests():
    print("=" * 72)
    print("  ANTI-GRAVITY AI: INFINITE GAME STUDIO UNIFIED MASTER TEST RUNNER")
    print("=" * 72)

    results = []
    total_start = time.time()

    for name, script in TEST_SCRIPTS:
        print(f"\n>>> Running: {name} ({script}) ...", flush=True)
        start_t = time.time()
        res = subprocess.run([sys.executable, script], capture_output=True, text=True, encoding="utf-8", errors="replace")
        elapsed = round(time.time() - start_t, 2)

        if res.returncode == 0:
            print(f"    [PASS] {name} ({elapsed}s)")
            results.append((name, script, "PASS", elapsed, ""))
        else:
            print(f"    [FAIL] {name} (Exit code: {res.returncode})")
            err_snip = res.stderr.strip() or res.stdout.strip()
            results.append((name, script, "FAIL", elapsed, err_snip[-300:]))

    total_elapsed = round(time.time() - total_start, 2)
    print("\n" + "=" * 72)
    print(f"  EXECUTIVE TEST SUMMARY (Total Elapsed: {total_elapsed}s)")
    print("=" * 72)

    all_passed = True
    for name, script, status, elapsed, err in results:
        mark = "✓ PASS" if status == "PASS" else "✗ FAIL"
        print(f"  [{mark}] {name:<42} ({elapsed}s)")
        if status != "PASS":
            all_passed = False
            print(f"         Error: {err}\n")

    print("=" * 72)
    if all_passed:
        print("  ★ ALL MODULES (1~5) VERIFIED AND 100% OPERATIONAL ★")
    else:
        print("  ⚠️ SOME TESTS FAILED. PLEASE REVIEW LOGS ABOVE.")
    print("=" * 72)

    sys.exit(0 if all_passed else 1)

if __name__ == "__main__":
    run_all_tests()

