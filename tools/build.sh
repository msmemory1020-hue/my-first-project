#!/usr/bin/env bash
# Netlify 배포용: tools/site.html(디자인 페이지, 카톡/OG 메타 포함) → ev5-vs-modely/index.html
# Claude 아티팩트(문서형)는 tools/page.html을 그대로 게시합니다.
set -euo pipefail
cd "$(dirname "$0")/.."
cp tools/site.html ev5-vs-modely/index.html
echo "built ev5-vs-modely/index.html from tools/site.html"
