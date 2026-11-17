"""
ANTI-GRAVITY AI: INFINITE GAME STUDIO ENGINE
Dual Runtime Web & API Server
Serves static GUI and bridges to Python Simulation Engine via REST API
"""

import os
import sys
import json
import time
import socket
import threading
from urllib.parse import urlparse, parse_qs
from http.server import HTTPServer, SimpleHTTPRequestHandler

from engine import CompanySimulationEngine, BASE_DIR, OUTPUT_DIR

PORT = 8080
engine_instance = CompanySimulationEngine(headless=False)

# Start engine background tick thread (1 sec = 1 min in-game)
def background_engine_worker():
    while engine_instance.running:
        time.sleep(1.0)
        engine_instance.tick(1.0)

engine_thread = threading.Thread(target=background_engine_worker, daemon=True)
engine_thread.start()

class CompanyAPIHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        
        # API: Snapshot state
        if parsed.path == "/api/state":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            snapshot = engine_instance.get_snapshot()
            self.wfile.write(json.dumps(snapshot, ensure_ascii=False).encode("utf-8"))
            return

        # API: Lazy Loading 270 Agency Roster
        if parsed.path == "/api/roster":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            roster = engine_instance.get_full_roster()
            self.wfile.write(json.dumps({"roster": roster, "total": len(roster)}, ensure_ascii=False).encode("utf-8"))
            return

        # API: List output deliverables (recursive)
        if parsed.path == "/api/deliverables":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            files = []
            if os.path.exists(OUTPUT_DIR):
                for root, dirs, fnames in os.walk(OUTPUT_DIR):
                    for fname in fnames:
                        fpath = os.path.join(root, fname)
                        rel_path = os.path.relpath(fpath, OUTPUT_DIR).replace("\\", "/")
                        files.append({
                            "name": rel_path,
                            "filename": fname,
                            "size": os.path.getsize(fpath),
                            "modified": time.ctime(os.path.getmtime(fpath))
                        })
            files.sort(key=lambda x: x["name"], reverse=True)
            self.wfile.write(json.dumps({"files": files}, ensure_ascii=False).encode("utf-8"))
            return

        # API: Read single deliverable content
        if parsed.path.startswith("/api/deliverable_content"):
            query = parse_qs(parsed.query)
            filename = query.get("name", [""])[0]
            safe_path = os.path.normpath(os.path.join(OUTPUT_DIR, filename))
            if safe_path.startswith(OUTPUT_DIR) and os.path.isfile(safe_path):
                self.send_response(200)
                self.send_header("Content-Type", "text/plain; charset=utf-8")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                with open(safe_path, "r", encoding="utf-8", errors="replace") as f:
                    self.wfile.write(f.read().encode("utf-8"))
                return
            else:
                self.send_response(404)
                self.end_headers()
                return

        # API: Approval and proposal queue status (Module 2)
        if parsed.path == "/api/queue":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            queue_data = {
                "approval_queue": engine_instance.approval_queue,
                "rejected_queue": engine_instance.rejected_queue,
                "processed_queue": engine_instance.processed_queue,
                "counts": {
                    "approval": len(engine_instance.approval_queue),
                    "rejected": len(engine_instance.rejected_queue),
                    "processed": len(engine_instance.processed_queue),
                }
            }
            self.wfile.write(json.dumps(queue_data, ensure_ascii=False).encode("utf-8"))
            return

        # API: Project artifacts and source code (Module 3)
        if parsed.path == "/api/artifacts":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            artifacts = engine_instance.get_project_artifacts()
            self.wfile.write(json.dumps({"status": "ok", "artifacts": artifacts}, ensure_ascii=False).encode("utf-8"))
            return

        # API: AI Playtest Report (Module 5)
        if parsed.path == "/api/playtest":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            report = engine_instance.latest_playtest_report
            if not report:
                report = engine_instance.run_ai_playtest(iterations=100)
            self.wfile.write(json.dumps({"status": "ok", "report": report}, ensure_ascii=False).encode("utf-8"))
            return

        # API: Steam Storefront Bundle (Module 5)
        if parsed.path == "/api/storefront":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            store_front = engine_instance.latest_store_front
            if not store_front:
                store_front = engine_instance.generate_store_front()
            self.wfile.write(json.dumps({"status": "ok", "storefront": store_front}, ensure_ascii=False).encode("utf-8"))
            return

        # API: Studio Portfolio & Metrics (Module 5)
        if parsed.path == "/api/portfolio":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            data = {
                "portfolio": engine_instance.released_portfolio,
                "metrics": engine_instance.studio_metrics,
                "github_status": engine_instance.github_status,
                "github_username": engine_instance.github_username
            }
            self.wfile.write(json.dumps({"status": "ok", "data": data}, ensure_ascii=False).encode("utf-8"))
            return

        # Fallback to static file serving
        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length).decode("utf-8") if content_length > 0 else "{}"
        try:
            payload = json.loads(body)
        except Exception:
            payload = {}

        # API: Generate new proposal on-demand (Module 2)
        if parsed.path == "/api/generate_proposal":
            forced_pass = payload.get("forced_pass", None)
            new_prop = engine_instance.generate_new_game_proposal(forced_pass=forced_pass)
            self.send_json_response(200, {
                "status": "ok",
                "proposal": new_prop,
                "counts": {
                    "approval": len(engine_instance.approval_queue),
                    "rejected": len(engine_instance.rejected_queue),
                    "processed": len(engine_instance.processed_queue)
                }
            })
            return

        # API: Command console
        if parsed.path == "/api/command":
            cmd = payload.get("command", "")
            res = engine_instance.parse_command(cmd)
            self.send_json_response(200, res)
            return

        # API: HITL Approval Action (1차 기획 승인 / 2차 코드 검토)
        if parsed.path == "/api/hitl":
            action = payload.get("action", "")
            topic_id = payload.get("topic_id", 1)
            res = engine_instance.handle_hitl_action(action, topic_id)
            self.send_json_response(200, res)
            return

        # API: AI Code Refactoring (Module 3 Spec 2)
        if parsed.path == "/api/refactor":
            prompt = payload.get("prompt", "")
            target_file = payload.get("target_file", "game_core.js")
            res = engine_instance.refactor_code(prompt, target_file)
            self.send_json_response(200, {
                "status": "success",
                "result": res,
                "artifacts": engine_instance.get_project_artifacts()
            })
            return

        # API: Code Rollback (Guardrail 4)
        if parsed.path == "/api/rollback":
            target_file = payload.get("target_file", "game_core.js")
            res = engine_instance.rollback_code(target_file)
            self.send_json_response(200, {
                "status": "success",
                "result": res,
                "artifacts": engine_instance.get_project_artifacts()
            })
            return

        # API: Step transition control
        if parsed.path == "/api/step":
            step = payload.get("step")
            if step and 1 <= int(step) <= 12:
                engine_instance.execute_step(int(step))
                self.send_json_response(200, {"status": "ok", "current_step": int(step)})
            else:
                self.send_json_response(400, {"status": "error", "message": "유효하지 않은 스텝입니다."})
            return

        # API: Play/Pause/Speed toggle
        if parsed.path == "/api/control":
            if "paused" in payload:
                engine_instance.is_paused = bool(payload["paused"])
            if "speed" in payload:
                engine_instance.speed = float(payload["speed"])
            self.send_json_response(200, {"status": "ok", "paused": engine_instance.is_paused, "speed": engine_instance.speed})
            return

        # API: In-Game Real-Time Telemetry (Module 5 Feature 1)
        if parsed.path == "/api/telemetry":
            event_type = payload.get("event", "UNKNOWN")
            event_data = payload.get("data", {})
            engine_instance.handle_in_game_telemetry(event_type, event_data)
            self.send_json_response(200, {"status": "ok"})
            return

        # API: Trigger AI Playtest (Module 5 Feature 2)
        if parsed.path == "/api/playtest":
            iterations = int(payload.get("iterations", 100))
            report = engine_instance.run_ai_playtest(iterations=iterations)
            self.send_json_response(200, {"status": "ok", "report": report})
            return

        # API: GitHub Auto-Integration Sync (Module 4 Spec 2)
        if parsed.path == "/api/github_sync":
            topic = engine_instance.selected_topic
            res = engine_instance.create_github_repo(topic["genre"], topic["title"])
            self.send_json_response(200, res)
            return

        # API: Toggle Auto Infinite Sprint (Module 5 Feature 4)
        if parsed.path == "/api/auto_sprint":
            enabled = bool(payload.get("enabled", True))
            engine_instance.auto_sprint_enabled = enabled
            self.send_json_response(200, {"status": "ok", "auto_sprint_enabled": engine_instance.auto_sprint_enabled})
            return

        self.send_response(404)
        self.end_headers()

    def send_json_response(self, code, data):
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode("utf-8"))

    def log_message(self, format, *args):
        # Suppress verbose HTTP polling logs in console
        pass

def find_available_port(start_port=8080):
    port = start_port
    while port < start_port + 100:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(("localhost", port)) != 0:
                return port
        port += 1
    return start_port

def run_server(port=None):
    if port is None:
        port = find_available_port(8080)
    server_address = ("", port)
    httpd = HTTPServer(server_address, CompanyAPIHandler)
    url = f"http://localhost:{port}/index.html"
    print("=" * 70)
    print("  ANTI-GRAVITY AI: INFINITE GAME STUDIO SIMULATION ENGINE")
    print(f"  Web Server Started at: {url}")
    print("  Dual Runtime Active (Server + Headless Engine Sync)")
    print("  Hit Ctrl+C to stop.")
    print("=" * 70)
    
    with open(os.path.join(BASE_DIR, "server_url.txt"), "w", encoding="utf-8") as f:
        f.write(url)

    # Automatically launch web browser UI
    import webbrowser
    def open_browser():
        time.sleep(0.6)
        try:
            webbrowser.open(url)
        except Exception:
            pass
    threading.Thread(target=open_browser, daemon=True).start()

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.server_close()

if __name__ == "__main__":
    p = int(sys.argv[1]) if len(sys.argv) > 1 else None
    run_server(p)
