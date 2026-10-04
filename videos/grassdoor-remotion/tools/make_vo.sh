#!/usr/bin/env bash
# Generate every voice-over line with Gemini TTS, trim silence, and verify by transcription.
set -u
cd "$(dirname "$0")/.."
VOICE=${VOICE:-Kore}
MODEL=${MODEL:-gemini-3.8-flash-tts}
mkdir -p public/audio/vo
while IFS='|' read -r id tag text; do
  [ -z "$id" ] && continue
  raw=public/audio/vo/$id.raw.wav
  for a in 1 2 3 4 5; do
    python3 tools/tts.py "$raw" "$VOICE" "$MODEL" "$text" </dev/null >/dev/null && break
    sleep $((a * 5))
  done
  # trim leading/trailing silence, keep a 40 ms head so consonants are not clipped
  ffmpeg -nostdin -y -loglevel error -i "$raw" -af "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse" -ar 48000 public/audio/vo/$id.wav
  rm -f "$raw"
  dur=$(ffprobe </dev/null -v error -show_entries format=duration -of csv=p=0 public/audio/vo/$id.wav)
  heard=$(python3 tools/listen.py public/audio/vo/$id.wav </dev/null 2>/dev/null)
  printf "%-10s %5.2fs  | %s\n" "$id" "$dur" "$heard"
done <<'LINES'
vo1|-|Grassdoor is back.
vo2|-|Explore every category, right from your phone.
vo3|-|California's top brands, unboxed.
vo4|-|Track it live. Delivered on time.
vo5|-|Twenty percent credit back, all October.
vo6|-|Everything you need, in one place.
vo7|-|Fast. Premium. Trusted.
vo8|-|Visit grassdoor dot com.
LINES
