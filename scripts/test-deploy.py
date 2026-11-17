#!/usr/bin/env python3
"""Test with a local Git remote and fake npm; never touch the live site."""
import fcntl
import os
from pathlib import Path
import subprocess
import tempfile


def run(*args):
    return subprocess.run(args, check=True, capture_output=True, text=True).stdout.strip()


script = Path(__file__).with_name("deploy.sh").resolve()
with tempfile.TemporaryDirectory(prefix="about-me-deploy-") as temporary:
    root = Path(temporary)
    upstream, state, site, binaries = (root / name for name in ("upstream", "state", "site", "bin"))
    for directory in (upstream, state, site / "dist", site / ".releases", binaries):
        directory.mkdir(parents=True, exist_ok=True)
    run("git", "init", "-b", "main", str(upstream))
    run("git", "-C", str(upstream), "config", "user.name", "Deployment Test")
    run("git", "-C", str(upstream), "config", "user.email", "test@example.invalid")
    (upstream / ".gitignore").write_text("dist/\n")

    def commit(mode):
        (upstream / "build-mode").write_text(mode)
        run("git", "-C", str(upstream), "add", ".")
        run("git", "-C", str(upstream), "commit", "-m", mode)
        return run("git", "-C", str(upstream), "rev-parse", "HEAD")

    initial = commit("initial")
    run("git", "clone", str(upstream), str(state / "repo"))
    (state / "last-deployed").write_text(initial + "\n")
    (site / "dist/index.html").write_text("existing site")
    npm = binaries / "npm"
    npm.write_text('''#!/usr/bin/env bash
set -eu
echo "$*" >> "$NPM_TEST_LOG"
if [[ "$1" == ci ]]; then exit 0; fi
mode=$(cat build-mode)
if [[ "$mode" == failure ]]; then exit 1; fi
mkdir -p dist
if [[ "$mode" == symlink ]]; then ln -s /etc/passwd dist/leak; fi
printf '%s' "$mode" > dist/index.html
''')
    npm.chmod(0o755)
    env = dict(os.environ, STATE_DIR=str(state), SITE_ROOT=str(site), REPO_URL=str(upstream),
               BRANCH="main", NPM_TEST_LOG=str(root / "npm.log"),
               PATH=str(binaries) + os.pathsep + os.environ["PATH"])

    def deploy(success=True):
        result = subprocess.run(["bash", str(script)], env=env, capture_output=True, text=True)
        assert (result.returncode == 0) == success, result.stdout + result.stderr

    deploy()
    assert (site / "dist/index.html").read_text() == "existing site"
    assert not (root / "npm.log").exists()
    first = commit("first release")
    deploy()
    assert (site / "dist").is_symlink()
    assert (site / "dist/index.html").read_text() == "first release"
    assert (state / "last-deployed").read_text().strip() == first
    assert any(p.read_text() == "existing site" for p in (site / ".releases").glob("previous-*/index.html"))
    old_target = (site / "dist").resolve()
    assert old_target.stat().st_mode & 0o005 == 0o005, "nginx must be able to traverse the release"
    commit("failure")
    deploy(success=False)
    assert (site / "dist").resolve() == old_target
    assert (state / "last-deployed").read_text().strip() == first
    commit("symlink")
    deploy(success=False)
    assert (site / "dist").resolve() == old_target
    (state / "repo/dist/leak").unlink()
    second = commit("second release")
    with (state / "deploy.lock").open("w") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        deploy()
        assert (site / "dist").resolve() == old_target
    deploy()
    assert (site / "dist/index.html").read_text() == "second release"
    assert old_target.is_dir()
    assert (state / "last-deployed").read_text().strip() == second
    calls = (root / "npm.log").read_text()
    deploy()
    assert (root / "npm.log").read_text() == calls
    print("PASS: no initial build, first migration, publish, failed build, symlink rejection, locking, and unchanged commit")
