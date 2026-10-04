"""Stream a music bed from Lyria RealTime (bidiGenerateMusic) and save 48 kHz stereo WAV.
usage: python3 tools/lyria_rt.py <out.wav> <seconds>"""
import asyncio, base64, json, os, sys, wave
import websockets

OUT, SECS = sys.argv[1], float(sys.argv[2])
URL = ("wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha."
       "GenerativeService.BidiGenerateMusic?key=" + os.environ["GEMINI_API_KEY"])
PROMPTS = json.loads(os.environ.get("LYRIA_PROMPTS", "null")) or [
    {"text": "premium lifestyle commercial, modern deep house, warm analog synth chords, punchy kick, crisp shuffled hi-hats, round sub bass", "weight": 1.0},
    {"text": "glassy pluck arpeggios, airy pads, optimistic, polished, high-end brand", "weight": 0.7},
]

async def main():
    pcm = bytearray()
    async with websockets.connect(URL, max_size=None, open_timeout=30) as ws:
        await ws.send(json.dumps({"setup": {"model": "models/lyria-realtime-exp"}}))
        print("setup:", (await ws.recv())[:200])
        await ws.send(json.dumps({"clientContent": {"weightedPrompts": PROMPTS}}))
        await ws.send(json.dumps({"musicGenerationConfig": {"bpm": 120, "temperature": 1.0, "guidance": 4.0, "density": 0.6, "brightness": 0.6, "scale": "A_FLAT_MAJOR_F_MINOR"}}))
        await ws.send(json.dumps({"playbackControl": "PLAY"}))
        need = int(SECS * 48000 * 2 * 2)
        while len(pcm) < need:
            msg = json.loads(await asyncio.wait_for(ws.recv(), 60))
            sc = msg.get("serverContent")
            if sc and "audioChunks" in sc:
                for ch in sc["audioChunks"]:
                    pcm += base64.b64decode(ch["data"])
            elif "filteredPrompt" in msg or "warning" in msg or "error" in msg:
                print(msg)
        await ws.send(json.dumps({"playbackControl": "STOP"}))
    with wave.open(OUT, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(48000); w.writeframes(bytes(pcm))
    print("wrote", OUT, len(pcm) / (48000 * 4), "s")

asyncio.run(main())
