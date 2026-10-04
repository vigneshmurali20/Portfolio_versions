"""Generate the music bed with Lyria via the Gemini API.
usage: python3 tools/music.py <out_basename> <model>  (prompt from MUSIC_PROMPT or default)"""
import base64, json, os, sys, urllib.error, urllib.request

out, model = sys.argv[1], sys.argv[2]
prompt = os.environ.get("MUSIC_PROMPT") or (
    "Instrumental only, no vocals. A 21-second premium lifestyle TV commercial cue at exactly 120 BPM in 4/4, A minor. "
    "Modern deep-house / future-garage feel: warm analog synth chords, punchy kick, crisp shuffled hi-hats, round sub bass, "
    "airy pads, glassy pluck arpeggios. Structure: 0-2s filtered intro with rising swell; downbeat drop at 2s; groove builds "
    "to a riser into a big hit at 6s; driving section 6-12s; brief lift at 12s; full energy 15-19s; clean final button "
    "ending on a downbeat at 20.5s with a short tail. Polished, confident, optimistic, high-end brand sound."
)
body = {"contents": [{"parts": [{"text": prompt}]}]}
req = urllib.request.Request(
    f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
    data=json.dumps(body).encode(),
    headers={"Content-Type": "application/json", "x-goog-api-key": os.environ["GEMINI_API_KEY"]},
)
try:
    with urllib.request.urlopen(req, timeout=600) as r:
        d = json.load(r)
except urllib.error.HTTPError as e:
    print("HTTP", e.code, e.read().decode()[:600]); sys.exit(1)
for p in d["candidates"][0]["content"]["parts"]:
    if "inlineData" in p:
        mt = p["inlineData"].get("mimeType", "")
        ext = "mp3" if "mpeg" in mt or "mp3" in mt else "wav"
        open(f"{out}.{ext}", "wb").write(base64.b64decode(p["inlineData"]["data"]))
        print("wrote", f"{out}.{ext}", mt)
    elif "text" in p:
        print("text:", p["text"][:500])
