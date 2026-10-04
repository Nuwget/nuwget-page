// Cuts the lines used by the Bubu easter egg out of the longer source clips and
// encodes each one as a small mono MP3 in public/audio.
// Usage: node scripts/trim-audio.mjs
//
// Cut points were found from a loudness envelope (silences between phrases), so
// adjust start/end here if a cut lands in the wrong place.
import fs from "node:fs";
import { MPEGDecoder } from "mpg123-decoder";
import { Mp3Encoder } from "@breezystack/lamejs";

const CLIPS = [
  {
    // "oooo family": first dip in loudness after the word
    src: "media/ssstik.io_1791109973755.mp3",
    out: "public/audio/family.mp3",
    start: 0,
    end: 2.24,
    fadeOut: 0.06,
  },
  {
    // "atatat atatat atatata": three bursts of staccato syllables, silence on both sides
    src: "media/ssstik.io_1791110423263.mp3",
    out: "public/audio/atatat.mp3",
    start: 23.38,
    end: 25.88,
    fadeOut: 0.03,
  },
];

const FADE_IN = 0.005;
await Promise.all(CLIPS.map(trim));

async function trim({ src, out, start, end, fadeOut }) {
  const dec = new MPEGDecoder();
  await dec.ready;
  const { channelData, sampleRate } = dec.decode(new Uint8Array(fs.readFileSync(src)));

  const from = Math.floor(start * sampleRate);
  const to = Math.min(channelData[0].length, Math.floor(end * sampleRate));
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
  const fo = Math.floor(fadeOut * sampleRate);
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
  fs.writeFileSync(out, Buffer.concat(chunks));
  console.log(`${out}: ${(mono.length / sampleRate).toFixed(2)} s, ${Math.round(fs.statSync(out).size / 1024)} KB`);
}
