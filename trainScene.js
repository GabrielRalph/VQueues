class BallPaths{
  constructor(el){
    this.el = parseElement(el);
    this.el.innerHTML = ''
    this.path_b = this.el.createChild('path', {
      d: "M1022.9,593.1c-265.2,27.7-500.2,75.6-679.5,138.7C253,763.6,179.1,798.6,124,835.7C64.7,875.5,27.1,918,12.2,961.8C8,974,5.6,986.4,5,998.6",
      fill: 'none',
      stroke: 'none'
    })
    this.path_s = this.el.createChild('path', {
      d: "M1112.4,642c-232.2,26.7-437.5,72.7-593.7,133.2c-77.2,29.9-139.7,62.4-186,96.6c-45.8,33.9-74.4,68.6-85.1,103.1c-2.6,8.6-4.2,17.2-4.5,25.5",
      fill: 'none',
      stroke: 'none'
    })
    this.el.setAttribute('viewBox','-20 400 1000 600')

    this.sprites = [];
    this.last_time = null;
    this.hold_b = false;
    this.hold_s = false;

  }
  spawnSprite(path){
    let ellipse = this.el.createChild('ellipse', {fill: 'white'});
    let sprite = new Sprite(ellipse, path, {x: 'cx', y: 'cy', sx: 'rx', sy: 'ry'})
    this.sprites.push(sprite);
  }

  onBass(std){
    if (!this.hold_b){
      this.spawnSprite(this.path_b)
      this.hold_b = true;
      setTimeout(() =>{this.hold_b = false}, 150)
    }
  }
  onSnare(std){
    if (!this.hold_s){
      this.spawnSprite(this.path_s)
      this.hold_s = true;
      setTimeout(() =>{this.hold_s = false}, 50)
    }
  }

  removeSprite(sprite){
    sprite.el.remove()
    console.log('x');
    let newSprites = [];
    this.sprites.forEach((sprite_i) => {
      if (sprite_i != sprite){
        newSprites.push(sprite_i)
      }
    });
    this.sprites = newSprites;
  }

  draw(time){
    if (this.last_time != null){
      this.sprites.forEach((sprite) => {
        if(!sprite.draw(time - this.last_time)){
          this.removeSprite(sprite)
        }
      });
    }
    this.last_time = time
  }
}


class TrainScene{
  constructor(el){
    this.el = parseElement(el);
    this.el.innerHTML = ''
    this.el.createChild('path', {d: 'M0,0L1000,0L1000,1000L0,1000Z', fill: 'black'})
    loadSVG('./Lamalo Sprites/train.svg', (el) => {
      console.log('x');
      el.setAttribute('height', '1000')
      el.setAttribute('width', '1000')
      this.el.appendChild(el)
    })

    this.rails_num = 22;
    this.offset = 1;
    this.tracks = this.el.createChild('g')
    this.track_bars = this.tracks.createChild('g')
    this.back = this.el.createChild('g');
    this.rail = this.tracks.createChild('path', {
      d: 'M1110.1,622.1c-469.8,54-832.8,188.9-881.6,346.9c-3.2,10.3-5,20.5-5.4,30.6',
      fill: 'none',
      stroke: 'white',
      'stroke-width': '5'
    })
    this.rail2 = this.tracks.createChild('path', {
      d: "M1025,613C495.3,668.3,86.2,806.5,31.1,968.2c-3.6,10.5-5.6,21-6.1,31.3",
      fill: 'none',
      stroke: 'white',
      'stroke-width': '5'
    })

    this.path = this.el.createChild('path', {
      d: "M1022.9,593.1c-265.2,27.7-500.2,75.6-679.5,138.7C253,763.6,179.1,798.6,124,835.7C64.7,875.5,27.1,918,12.2,961.8C8,974,5.6,986.4,5,998.6",
      fill: 'none',
      stroke: 'none'
    })
    this.path2 = this.el.createChild('path', {
      d: "M1112.4,642c-232.2,26.7-437.5,72.7-593.7,133.2c-77.2,29.9-139.7,62.4-186,96.6c-45.8,33.9-74.4,68.6-85.1,103.1c-2.6,8.6-4.2,17.2-4.5,25.5",
      fill: 'none',
      stroke: 'none'
    })
    this.el.setAttribute('viewBox','0 400 1000 600')
    this.el.setAttribute('preserveAspectRatio','xMaxYMax meet')
    this.sprites_mgmt = new Sprites({
      fern: './Lamalo Sprites/Fern.svg',
      bigleaf: './Lamalo Sprites/bigleaf.svg',
      vine: './Lamalo Sprites/vine.svg'
    })
    this.last_time = null;
    this.sprites = []
    this.hold = false
    setTimeout(()=>{this.spawnSprite()},1000)

  }

  buildTracks(dt){
    let offset = this.offset;
    this.offset -= dt/220;
    if (this.offset < 0){
      this.offset = 1;
    }
    this.track_bars.innerHTML = ''
    let l1 = this.rail.getTotalLength() / this.rails_num;
    let l2 = this.rail2.getTotalLength() / this.rails_num;
    for ( var i = 0; i < this.rails_num; i++){
      let p1 = this.rail.getPointAtLength(offset*l1 + l1*i)
      let p2 = this.rail2.getPointAtLength(offset*l2 + l2*i)
      this.track_bars.createChild('path', {
        d: `M${p1.x},${p1.y}L${p2.x},${p2.y}`,
        stroke: 'white',
        fill: 'none',
        'stroke-width': '5'
      })
    }
  }

  onBass(std){
    if (!this.hold ){
      this.spawnSprite()
      this.hold = true;
      setTimeout(() =>{this.hold = false}, 200)
    }
  }
  spawnSprite(){
    if (this.sprites_mgmt.loading == 0){
      let sprite = null
      if (Math.random() > 0.5){
        sprite = this.sprites_mgmt.createSprite('random', this.path)
        this.back.appendChild(sprite.el);
      }else{
        sprite = this.sprites_mgmt.createSprite('random', this.path2)
        this.el.appendChild(sprite.el);
      }
      sprite.el.setAttribute('preserveAspectRatio', 'xMidYMax meet')
      this.sprites.push(sprite)
    }
  }

  removeSprite(sprite){
    let newSprites = [];
    sprite.el.remove()
    this.sprites.forEach((sprite_i) => {
      if (sprite_i != sprite){
        newSprites.push(sprite_i)
      }
    });
    this.sprites = newSprites;
  }

  draw(time){
    if (this.last_time != null){
      this.sprites.forEach((sprite) => {
        if(!sprite.draw(time - this.last_time)){
          this.removeSprite(sprite)
          console.log(sprite);
        }
      });
    }
    this.buildTracks(time - this.last_time)
    this.last_time = time
  }
}

function loadSVG(filename, callback){
  //Create an iframe of the svg file
  let iframe = document.createElement('iframe');
  iframe.style.setProperty('display', 'none')
  iframe.setAttribute('src', filename)

  //Append to the body
  document.body.appendChild(iframe)

  //When its loaded extract the svg and run the callback
  iframe.onload = () => {
    let doc = iframe.contentDocument || iframe.contentWindow.document
    let svg = doc.children[0]
    document.body.removeChild(iframe)
    callback(svg)
  }
}

class Sprites{
  constructor(options){
    this.sprite_svgs = {}
    this.loading = 0;
    this.onload = () => {
      console.log(this);
    }
    for (name in options){
      this.loading ++;
      this.load(options[name], name);
    }
  }

  createSprite(name, path){
    let sprite_svg = null;
    if (name === 'random'){
      var keys = Object.keys(this.sprite_svgs);
      sprite_svg = this.sprite_svgs[ keys[ keys.length*Math.random() << 0]].cloneNode(true);
    }else{
      sprite_svg = this.sprite_svgs[name].cloneNode(true)
    }
    let sprite = new Sprite(sprite_svg, path);
    return sprite
  }

  load(filename, sprite_name){
    //Create an iframe of the svg file
    let iframe = document.createElement('iframe');
    iframe.style.setProperty('display', 'none')
    iframe.setAttribute('src', filename)

    //Append to the body
    document.body.appendChild(iframe)

    //When its loaded extract the svg and run the callback
    iframe.onload = () => {
      let doc = iframe.contentDocument || iframe.contentWindow.document
      let svg = doc.children[0]
      this.sprite_svgs[sprite_name] = svg;
      this.loading --;
      if (this.loading == 0){
        this.onload();
      }
    }
  }
}

class Sprite{
  constructor(svg, path, keys = null){
    this.el = svg;
    this.path = path;

    this.keys = {
      x: 'x',
      y: 'y',
      sx: 'width',
      sy: 'height'
    }
    this.keys = keys;

    this.r = 50;
    this.speed = 5;

    this.r_i = this.r*0.9;
  }


  draw(time){
    let next = this.nextPos(time)
    if (next != false){
      this.pos = next;
      return true
    }else{
      return false
    }
  }

  set path(__path){
    this._path = __path
    this.path_length = __path.getTotalLength();
    this.path_pos = this.path_length;
  }
  get path(){
    return this._path
  }
  get rad_inc(){
    return this.r_i/(this.path_length/this.speed)
  }

  set pos(p){
    this.el.setAttribute(this.keys.x, p.x - this.r/2);
    this.el.setAttribute(this.keys.y, p.y - this.r);
  }
  nextPos(dist){
    this.path_pos -= (dist/20)*this.speed;
    this.r = this.r - this.rad_inc;
    if (this.path_pos > 0){
      return this.path.getPointAtLength(this.path_pos);
    }else{
      return false;
    }
  }

  set r(rad){
    this._r = rad > 0? rad: 0;
    this.el.setAttribute(this.keys.sx, `${Math.round(rad)}`)
    this.el.setAttribute(this.keys.sy, `${Math.round(rad)}`)
  }
  get r(){
    return this._r
  }

}
