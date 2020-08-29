// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDZN3RXo6hsm9b28AaSoFKAnlFyYs4quz4",
  authDomain: "svgdrawpad.firebaseapp.com",
  databaseURL: "https://svgdrawpad.firebaseio.com",
  projectId: "svgdrawpad",
  storageBucket: "svgdrawpad.appspot.com",
  messagingSenderId: "399249408634",
  appId: "1:399249408634:web:077e81e3cdbf1b47d0b1c3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

class FireFriend{
  constructor(){
    this.database = firebase.database();
    this.onmode = null;
    this.onlevels = null
    this.ref = this.database.ref('/mode')
    this.levelref = this.database.ref('/levels')
    this.buttons = {}
    this.mode = null
    
    this.ref.on('value', (sc) => {
      this.mode = sc.val();
      if (this.onmode instanceof Function){
        this.onmode(sc.val())
      }
    })

    this.levelref.on('value', (sc) => {
      let levels = sc.val();
      this.levels = levels;
      if (this.onlevels instanceof Function){
        this.onlevels(levels)
      }
    })

    this.modes = ['ball', 'train', 'ball path', 'levels'];
  }

  setMode(mode){
    this.ref.set(mode)
  }

  set mode(val){
    this._mode = val;
    if (val != null){
      console.log(val);
      for (var key in this.buttons){
        if (this.buttons[key]){
          this.buttons[key].setAttribute('class','normal')
        }
      }
      if (this.buttons[val]){
        this.buttons[val].setAttribute('class', 'highlight')
      }
    }
  }
  get mode(){
    return this._mode
  }

  incBass_thld(inc){
    let levels = this.levels;
    levels.bass_thld += inc;
    this.levelref.set(levels)
  }
  incSnare_thld(inc){
    let levels = this.levels;
    levels.snare_thld += inc;
    this.levelref.set(levels)
  }

  set bass_thld(val){
    this._bass_thld = val;
    if (this.bass_thld_el){
      this.bass_thld_el.innerHTML = val != undefined ? val : '...';
    }
  }
  get bass_thld(){
    return this._bass_thld
  }
  set snare_thld(val){
    this._snare_thld = val;
    if (this.snare_thld_el){
      this.snare_thld_el.innerHTML = val != undefined ? val : '...';
    }
  }
  get snare_thld(){
    return this._snare_thld
  }
  set levels(l){
    this.bass_thld = l.bass_thld;
    this.snare_thld = l.snare_thld;
  }
  get levels(){
    return {bass_thld: this.bass_thld, snare_thld: this.snare_thld}
  }

  attachThldButtons(el_bass, el_snare){
    this.bass_thld_el = parseElement(el_bass);
    this.bass_thld = this.bass_thld;
    this.snare_thld_el = parseElement(el_snare);
    this.snare_thld = this.snare_thld;
  }

  attachModeList(_el){
    let el = parseElement(_el);
    this.modes.forEach((mode) => {
      let button_template = document.createElement('h1')
      button_template.innerHTML = mode;
      button_template.onclick = () => {
        this.setMode(mode)
      }
      el.appendChild(button_template)
      this.buttons[mode] = button_template
    });
  }
}
