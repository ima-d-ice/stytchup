#!/usr/bin/env bash
# Converts the Playwright recording into the README assets.
# Requires ffmpeg (brew install ffmpeg).
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f docs/demo.webm ]; then
  echo "docs/demo.webm not found. Run: npm run demo:record"
  exit 1
fi

# Full walkthrough, 1280×800, no audio.
ffmpeg -y -loglevel error -i docs/demo.webm \
  -vf "scale=1280:-2:flags=lanczos" \
  -c:v libx264 -pix_fmt yuv420p -crf 24 -preset slow \
  -movflags +faststart -an docs/demo.mp4

# Looping README preview. Slightly faster, smaller, and limited to 160 colours.
ffmpeg -y -loglevel error -i docs/demo.webm \
  -filter_complex "setpts=PTS/1.3,fps=8,scale=700:-1:flags=lanczos,split[full][pal];[pal]palettegen=max_colors=160:stats_mode=diff[palette];[full][palette]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" \
  -loop 0 docs/demo.gif

ls -lh docs/demo.mp4 docs/demo.gif
