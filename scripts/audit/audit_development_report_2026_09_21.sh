#!/usr/bin/env bash

rc=0
report="docs/development-reports/2026-09-21.md"

[ -f "$report" ] || rc=1

grep -q '3eb09aae086b84f6f7e27e1ef78e88da19fdbde0' "$report" || rc=1
grep -q '91a7a5b7669f46f41c9dc680cfe46d91312b526e' "$report" || rc=1
grep -q '7b8af06f8899f171eca7e84ef718e898139d856b' "$report" || rc=1
grep -q 'Phase 001: SEALED' "$report" || rc=1
grep -q 'Phase 002: Canonical Proof + Digest Core' "$report" || rc=1

echo "development report audit rc=$rc"
test "$rc" -eq 0
