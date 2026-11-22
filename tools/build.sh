#!/usr/bin/env bash
# tools/page.html(아티팩트 원본) → ev5-vs-modely/index.html(Netlify용 완전한 문서 + 카톡/OG 메타)
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=tools/page.html
OUT=ev5-vs-modely/index.html
DESC="${OG_DESC:-천안 등록 기준 보조금 반영 실구매가 비교. 2026년 12월과 2027년 시나리오, 가격 변동, 테슬라 구매처 정리.}"
URL=https://ev5-modely.netlify.app/ev5-vs-modely/
{
  printf '<!doctype html>\n<html lang="ko">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
  printf '<meta name="description" content="%s">\n' "$DESC"
  printf '<meta property="og:type" content="website">\n<meta property="og:site_name" content="전기차 구매 검토">\n'
  printf '<meta property="og:title" content="EV5 vs 모델Y 실구매가 비교">\n'
  printf '<meta property="og:description" content="%s">\n' "$DESC"
  printf '<meta property="og:url" content="%s">\n' "$URL"
  printf '<meta property="og:image" content="%sog.png">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n' "$URL"
  printf '<meta name="twitter:card" content="summary_large_image">\n'
  sed -n '/<title>/,/<\/style>/p' "$SRC"
  printf '</head>\n<body>\n'
  sed -n '/<\/style>/,$p' "$SRC" | tail -n +2
  printf '</body>\n</html>\n'
} > "$OUT"
echo "built $OUT"
