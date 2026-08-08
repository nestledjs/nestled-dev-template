#!/usr/bin/env python3
"""Compatibility wrapper for the metadata-aware TypeScript selection tool."""

from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path


def main() -> int:
    if shutil.which("pnpm") is None:
        print("pnpm is required to run fragment-to-select", file=sys.stderr)
        return 1

    script = Path(__file__).with_suffix(".ts").resolve()
    command = ["pnpm", "exec", "tsx", str(script), *sys.argv[1:]]
    return subprocess.run(command, check=False).returncode


if __name__ == "__main__":
    raise SystemExit(main())
