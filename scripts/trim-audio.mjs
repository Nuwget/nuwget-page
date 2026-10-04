// Cuts the "oooo family" line out of the longer source clip and encodes it as a
// small mono MP3 for the easter-egg modals.
// Usage: node scripts/trim-audio.mjs
import fs from "node:fs";
import { MPEGDecoder } from "mpg123-decoder";
import { Mp3Encoder } from "@breezystack/lamejs";

const SRC = "media/ssstik.io_1791109973755.mp3";
const OUT = "public/audio/family.mp3";
// Found with a loudness envelope: the first phrase runs 0.08 s to 3.40 s and is
// followed by real silence. Adjust END if the cut lands in the wrong place.
const START = 0;
const END = 3.42;
const FADE_IN = 0.005;
const FADE_OUT = 0.05;

const dec = new MPEGDecoder();
await dec.ready;
const { channelData, sampleRate } = dec.decode(new Uint8Array(fs.readFileSync(SRC)));

const from = Math.floor(START * sampleRate);
const to = Math.min(channelData[0].length, Math.floor(END * sampleRate));
const mono = new Float32Array(to - from);
for (let i = 0; i < mono.length; i++) {
  let s = 0;
  for (const ch of channelData) s += ch[from + i];
  mono[i] = s / channelData.length;
}

// normalise to about -1 dBFS and fade the edges
let peak = 0;
for (const v of mono) peak = Math.max(peak, Math.abs(v));
const gain = peak > 0 ? 0.89 / peak : 1;
const fi = Math.floor(FADE_IN * sampleRate);
const fo = Math.floor(FADE_OUT * sampleRate);
const pcm = new Int16Array(mono.length);
for (let i = 0; i < mono.length; i++) {
  let v = mono[i] * gain;
  if (i < fi) v *= i / fi;
  if (i > mono.length - fo) v *= (mono.length - i) / fo;
  pcm[i] = Math.max(-32768, Math.min(32767, Math.round(v * 32767)));
}

const enc = new Mp3Encoder(1, sampleRate, 96);
const chunks = [];
for (let i = 0; i < pcm.length; i += 1152) {
  const buf = enc.encodeBuffer(pcm.subarray(i, i + 1152));
  if (buf.length) chunks.push(Buffer.from(buf));
}
chunks.push(Buffer.from(enc.flush()));
fs.writeFileSync(OUT, Buffer.concat(chunks));
console.log(`${OUT}: ${(mono.length / sampleRate).toFixed(2)} s, ${Math.round(fs.statSync(OUT).size / 1024)} KB`);
