"""Ask Gemini to transcribe / describe an audio file (QA for generated VO and music).
usage: python3 tools/listen.py <file> [prompt]"""
import base64, json, os, sys, urllib.request

f = sys.argv[1]
prompt = sys.argv[2] if len(sys.argv) > 2 else "Transcribe this audio exactly, word for word. Output only the transcript."
mime = "audio/wav" if f.endswith(".wav") else "audio/mpeg"
body = {"contents": [{"parts": [{"inline_data": {"mime_type": mime, "data": base64.b64encode(open(f, "rb").read()).decode()}}, {"text": prompt}]}]}
req = urllib.request.Request(
    f"https://generativelanguage.googleapis.com/v1beta/models/{os.environ.get('LISTEN_MODEL', 'gemini-3.8-flash')}:generateContent",
    data=json.dumps(body).encode(),
    headers={"Content-Type": "application/json", "x-goog-api-key": os.environ["GEMINI_API_KEY"]},
)
import time, urllib.error
for attempt in range(6):
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            d = json.load(r)
        break
    except urllib.error.HTTPError as e:
        if e.code in (429, 500, 503) and attempt < 5:
            time.sleep(4 * (attempt + 1)); continue
        raise
print(d["candidates"][0]["content"]["parts"][0]["text"].strip())
