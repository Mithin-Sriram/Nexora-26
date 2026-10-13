#!/usr/bin/env bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
export PATH="/home/yasar/.cache/nodejs/bin:$PATH"
cd "$DIR" && npm run dev
