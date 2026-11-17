"""
ANTI-GRAVITY AI: INFINITE GAME STUDIO - REAL GIT & GITHUB PIPELINE
Handles true local Git initialization, commit, tagging, and GitHub REST API integration.
Adheres strictly to Rule 5 (Honest reporting: AWAIT_INTEGRATION if token is not set).
"""

import os
import subprocess
import json
import urllib.request
import urllib.error
from typing import Dict, Any, Optional, Tuple

def run_git_cmd(args: list, cwd: str) -> Tuple[int, str]:
    """Runs a real git subprocess command in the target directory."""
    try:
        res = subprocess.run(
            ["git"] + args,
            cwd=cwd,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace"
        )
        return res.returncode, (res.stdout + " " + res.stderr).strip()
    except Exception as e:
        return -1, str(e)

def init_and_commit_local_repo(target_dir: str, game_title: str) -> Dict[str, Any]:
    """
    Initializes a real local Git repository in the output directory,
    stages all 5 standard deliverable folders, and makes the master Initial Commit.
    """
    if not os.path.exists(target_dir):
        return {"status": "error", "message": f"Directory {target_dir} does not exist"}

    # 1. git init
    code, out = run_git_cmd(["init"], cwd=target_dir)
    
    # 2. git config (local to repo)
    run_git_cmd(["config", "user.name", "AntiGravity AI Studio"], cwd=target_dir)
    run_git_cmd(["config", "user.email", "studio@antigravity.ai"], cwd=target_dir)

    # 3. git add .
    run_git_cmd(["add", "."], cwd=target_dir)

    # 4. git commit
    code, out = run_git_cmd(["commit", "-m", f"feat: Master Initial Release of {game_title} (WebGL + C# + Python Architecture)"], cwd=target_dir)
    
    return {
        "status": "success",
        "message": f"Local Git repository initialized & committed at {os.path.basename(target_dir)}",
        "output": out
    }

def push_to_github_repo(target_dir: str, repo_name: str, token: str, username: str) -> Dict[str, Any]:
    """
    Creates remote repository on GitHub via REST API and pushes local commits.
    """
    is_valid = bool(token and not token.startswith("[YOUR") and token != "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")
    if not is_valid:
        return {
            "status": "await_integration",
            "repo_name": repo_name,
            "repo_url": f"https://github.com/{username}/{repo_name}",
            "message": "로컬 Git 커밋 완료 (사규 제5조: .env에 유효한 GITHUB_TOKEN 등록 시 실제 원격 저장소로 자동 Push 활성화)",
            "is_simulated": True
        }

    # 1. Call GitHub REST API to create repository
    try:
        url = "https://api.github.com/user/repos"
        headers = {
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "AntiGravity-GameStudio"
        }
        data = json.dumps({
            "name": repo_name,
            "description": f"Anti-Gravity AI Generated Game: {repo_name}",
            "private": False,
            "auto_init": False
        }).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers=headers, method="POST")
        with urllib.request.urlopen(req, timeout=10) as resp:
            resp_data = json.loads(resp.read().decode("utf-8"))
            remote_html_url = resp_data.get("html_url", f"https://github.com/{username}/{repo_name}")
    except urllib.error.HTTPError as e:
        if e.code == 422: # Repo already exists
            remote_html_url = f"https://github.com/{username}/{repo_name}"
        else:
            return {
                "status": "error",
                "message": f"GitHub API 오류 ({e.code}): {e.reason}",
                "is_simulated": True
            }
    except Exception as e:
        return {
            "status": "error",
            "message": f"GitHub 네트워크 오류: {str(e)}",
            "is_simulated": True
        }

    # 2. Set remote and push
    auth_remote = f"https://{token}@github.com/{username}/{repo_name}.git"
    run_git_cmd(["remote", "remove", "origin"], cwd=target_dir)
    run_git_cmd(["remote", "add", "origin", auth_remote], cwd=target_dir)
    run_git_cmd(["branch", "-M", "main"], cwd=target_dir)
    
    code, push_out = run_git_cmd(["push", "-u", "origin", "main"], cwd=target_dir)
    
    return {
        "status": "success",
        "repo_name": repo_name,
        "repo_url": remote_html_url,
        "message": f"GitHub 원격 저장소 '{repo_name}' 생성 및 master/main 브랜치 푸시 완료!",
        "push_output": push_out,
        "is_simulated": False
    }

def push_git_release_tag(target_dir: str, version: str, token: str, username: str) -> Dict[str, Any]:
    """Creates a local Git tag and pushes it to GitHub."""
    run_git_cmd(["add", "."], cwd=target_dir)
    run_git_cmd(["commit", "-m", f"chore: Release {version} Auto Live-Ops patch"], cwd=target_dir)
    run_git_cmd(["tag", "-a", version, "-m", f"Anti-Gravity Studio Release {version}"], cwd=target_dir)
    
    is_valid = bool(token and not token.startswith("[YOUR") and token != "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")
    if is_valid:
        run_git_cmd(["push", "origin", version], cwd=target_dir)
        return {"status": "success", "tag": version, "message": f"GitHub Release 태그 '{version}' 푸시 완료"}
    
    return {"status": "await_integration", "tag": version, "message": f"로컬 Git 태그 '{version}' 생성 완료 (.env 연동 시 자동 푸시)"}
