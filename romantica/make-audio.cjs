// Genera dos pequeñas composiciones originales, sin descargas ni dependencias.
const fs = require('fs');
const rate = 22050;
function create(name, romantic) {
  const beat = romantic ? .48 : .38, bars = 16, beats = romantic ? 3 : 4;
  const duration = bars * beats * beat, samples = new Float32Array(Math.ceil(duration * rate));
  const chords = romantic ? [[60,64,67],[57,60,64],[53,57,60],[55,59,62]] : [[45,48,52],[41,45,48],[48,52,55],[43,47,50]];
  function note(midi,start,length,volume,kind) {
    const f=440*2**((midi-69)/12), offset=Math.floor(start*rate), count=Math.floor(length*rate);
    for(let j=0;j<count && offset+j<samples.length;j++) {
      const t=j/rate, attack=Math.min(1,t/.025), release=Math.min(1,(length-t)/.12);
      const env=attack*release*(kind==='pluck'?Math.exp(-t*3):.75);
      let tone=Math.sin(2*Math.PI*f*t)+.28*Math.sin(4*Math.PI*f*t)+.12*Math.sin(6*Math.PI*f*t);
      samples[offset+j]+=tone*env*volume;
    }
  }
  for(let bar=0;bar<bars;bar++) {
    const chord=chords[bar%4], start=bar*beats*beat;
    chord.forEach(m=>note(m,start,beats*beat,.065,romantic?'pluck':'pad'));
    note(chord[0]-12,start,beat*1.8,.12,'pluck');
    for(let b=0;b<beats*2;b++) note(chord[(b+Math.floor(bar/4))%3]+12,start+b*beat/2,beat*.9,.085,'pluck');
    if(romantic) { note(chord[2]+12,start+beat,beat*1.5,.075,'pluck'); }
    else for(let b=0;b<beats;b++) note(26,start+b*beat,.17,.14,'pluck');
  }
  const out=Buffer.alloc(44+samples.length*2); out.write('RIFF');out.writeUInt32LE(out.length-8,4);out.write('WAVEfmt ',8);out.writeUInt32LE(16,16);out.writeUInt16LE(1,20);out.writeUInt16LE(1,22);out.writeUInt32LE(rate,24);out.writeUInt32LE(rate*2,28);out.writeUInt16LE(2,32);out.writeUInt16LE(16,34);out.write('data',36);out.writeUInt32LE(samples.length*2,40);
  samples.forEach((s,i)=>{const edge=Math.min(1,i/(rate*.06),(samples.length-i)/(rate*.25));out.writeInt16LE(Math.round(Math.max(-1,Math.min(1,s))*edge*25000),44+i*2)});
  fs.writeFileSync(`dist/assets/${name}.wav`,out);
}
create('epica',false);create('romantica',true);
