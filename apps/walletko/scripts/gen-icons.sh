#!/usr/bin/env bash
# Regenerates all PNG/ICO brand assets from the two SVG masters.
# Requires: rsvg-convert (librsvg), magick (ImageMagick).
set -euo pipefail

cd "$(dirname "$0")/../public"

GLASS="logo.svg"
SOLID="favicon.svg"

# >=64px outputs use the glass master
rsvg-convert -w 512 -h 512 "$GLASS" -o logo.png
rsvg-convert -w 64  -h 64  "$GLASS" -o logo-64.png
rsvg-convert -w 256 -h 256 "$GLASS" -o logo-256.png
rsvg-convert -w 180 -h 180 "$GLASS" -o apple-touch-icon.png
rsvg-convert -w 192 -h 192 "$GLASS" -o android-chrome-192x192.png
rsvg-convert -w 512 -h 512 "$GLASS" -o android-chrome-512x512.png

# 16/32px outputs use the solid master for legibility
rsvg-convert -w 16 -h 16 "$SOLID" -o favicon-16x16.png
rsvg-convert -w 32 -h 32 "$SOLID" -o favicon-32x32.png

# Multi-resolution .ico from the solid master
tmp48="$(mktemp --suffix=.png)"
rsvg-convert -w 48 -h 48 "$SOLID" -o "$tmp48"
magick favicon-16x16.png favicon-32x32.png "$tmp48" favicon.ico
rm -f "$tmp48"

echo "Generated brand assets in $(pwd)"
