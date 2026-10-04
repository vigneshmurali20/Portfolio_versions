"""Generate one voice-over line with Gemini TTS → 24 kHz mono WAV.
usage: python3 tools/tts.py <out.wav> <voice> <model> <text...>"""
import base64, json, os, sys, urllib.error, urllib.request, wave

out, voice, model = sys.argv[1], sys.argv[2], sys.argv[3]
text = " ".join(sys.argv[4:])
style = os.environ.get("TTS_STYLE")
body = {
    "contents": [{"parts": [{"text": text}]}],
    **({"systemInstruction": {"parts": [{"text": style}]}} if style else {}),
    "generationConfig": {
        "responseModalities": ["AUDIO"],
        "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}},
    },
}
req = urllib.request.Request(
    f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
    data=json.dumps(body).encode(),
    headers={"Content-Type": "application/json", "x-goog-api-key": os.environ["GEMINI_API_KEY"]},
)
try:
    with urllib.request.urlopen(req, timeout=120) as r:
        d = json.load(r)
except urllib.error.HTTPError as e:
    print("HTTP", e.code, e.read().decode()[:400]); sys.exit(1)
part = d["candidates"][0]["content"]["parts"][0]["inlineData"]
pcm = base64.b64decode(part["data"])
if pcm[:4] == b"RIFF":  # some models return a complete WAV file
    open(out, "wb").write(pcm)
    with wave.open(out) as w:
        print(out, part.get("mimeType"), w.getframerate(), round(w.getnframes() / w.getframerate(), 2), "s")
    sys.exit(0)
rate = 24000
mt = part.get("mimeType", "")
if "rate=" in mt:
    rate = int(mt.split("rate=")[1].split(";")[0])
with wave.open(out, "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(rate)
    w.writeframes(pcm)
print(out, mt, round(len(pcm) / 2 / rate, 2), "s")
