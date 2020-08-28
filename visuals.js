class VQueue{
  constructor(){
    if (!navigator.getUserMedia) navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||  navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (navigator.getUserMedia){
      navigator.mediaDevices.getUserMedia({audio:true, video: false}).then((stream) => {
        this.handleStream(stream)
      });
    }
    this.bass_specs = [60, 150];
    this.snare_specs = [2000, 3000];
    this.vScenes = [];

    this.last_bass = 0;
    this.last_bass_dir = 0;
    this.last_snare = 0;
    this.last_snare_dir = 0;

    let next_frame = (tmsp) => {
      this.onFrame();
      this._runVSceneMethod('draw', tmsp)
      window.requestAnimationFrame(next_frame)
    }
    window.requestAnimationFrame(next_frame)

  }

  _runVSceneMethod(method_name, param = null){
    this.vScenes.forEach((scene) => {
      if (scene[method_name]){
        scene[method_name](param)
      }
    });
  }

  handleStream(stream){
    this.ctx = new AudioContext();
    this.src = this.ctx.createMediaStreamSource(stream);
    this.bass_freq = this.ctx.createBiquadFilter()
    this.snare_freq = this.ctx.createBiquadFilter()
    this.bass_freq.type = 'bandpass';
    this.snare_freq.type = 'bandpass';

    let freq_center = (this.bass_specs[0] + this.bass_specs[1])/2;
    this.bass_freq.frequency.value = freq_center;
    this.bass_freq.Q.value = freq_center/(this.bass_specs[1] - this.bass_specs[0]);

    freq_center = (this.snare_specs[0] + this.snare_specs[1])/2;
    this.snare_freq.frequency.value = freq_center;
    this.snare_freq.Q.value = freq_center/(this.snare_specs[1] - this.snare_specs[0]);

    this.bass_analyser = this.ctx.createAnalyser();
    this.snare_analyser = this.ctx.createAnalyser();

    this.src.connect(this.bass_freq);
    this.src.connect(this.snare_freq);

    this.bass_freq.connect(this.bass_analyser);
    this.snare_freq.connect(this.snare_analyser);
  }

  getBass(){
    let n = this.bass_analyser.fftSize;
    var buffer = new Float32Array(n);
    this.bass_analyser.getFloatTimeDomainData(buffer);

    let std = 0;
    for (var i = 0; i < n; i++){
      std += (buffer[i] * buffer[i])
    }
    std = Math.sqrt(std)/n;
    std *= 10000


    let dir = std > this.last_bass;
    this.last_bass = std;
    if (!dir && this.last_bass_dir){
      this._runVSceneMethod('onBass', std)
    }else{
      // this._runVSceneMethod('onBass', std)
    }
    this.last_bass_dir = dir;
  }

  getSnare(){
    let n = this.snare_analyser.fftSize;
    var buffer = new Float32Array(n);
    this.snare_analyser.getFloatTimeDomainData(buffer);

    let std = 0;
    for (var i = 0; i < n; i++){
      std += (buffer[i] * buffer[i])
    }
    std = Math.sqrt(std)/n;
    std *= 10000

    let dir = std > this.last_snare;
    this.last_snare = std;
    if (!dir && this.last_snare_dir){
      this._runVSceneMethod('onSnare', std)
    }else{
      // this._runVSceneMethod('onBass', std)
    }
    this.last_snare_dir = dir;
  }

  onFrame(){
    if (this.bass_analyser){
      this.getBass();
    }
    if (this.snare_analyser){
      this.getSnare();
    }
  }

  appendVScene(vScene){
    this.vScenes.push(vScene);
  }
  removeVScene(vScene){
    let newVScenes = [];
    this.vScenes.forEach((scene) => {
      if (vScene != scene){
        newVScenes.push(scene)
      }
    });
    this.vScenes = newVScenes;
  }
}

class Levels{
  constructor(){
    this.bass = document.createElement('div')
    this.bass.setAttribute('class', 'bass')
    this.snare = document.createElement('div')
    this.snare.setAttribute('class', 'snare')
    this.bass_lvl = 0;
    this.snare_lvl = 0;
    document.body.appendChild(this.bass)
    document.body.appendChild(this.snare)
  }

  onBass(value){
    this.bass_lvl = value*10;
  }

  onSnare(value){
    this.snare_lvl = value*10;
  }

  draw(){
    // console.log(`${this.bass_lvl}px`);
    this.bass.style.setProperty('height', `${this.bass_lvl}px`)
    this.snare.style.setProperty('height', `${this.snare_lvl}px`)
  }
}
