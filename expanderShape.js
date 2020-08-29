class ExpanderShape{
  constructor(el, filename){
    this.el = parseElement(el);
    this.el.innerHTML = '';
    window.onresize = () => {
      this.el.setProps({viewBox: `0 0 ${window.innerWidth}, ${window.innerHeight}`})
      this.mid = new Vector(window.innerWidth, window.innerHeight);
    }
    window.onresize()
    loadSVG(filename, (shape) => {
      this.shape = shape
      this.el.appendChild(this.shape)
    })
    this.speed = 5;
    this.hold = false;
  }

  onBass(std){
    if (!this.hold){
      if (this.r < std*20){
        this.r = std*20;
        this.hold = true;
        setTimeout(()=>{this.hold = false}, 100)
      }
    }
  }

  set r(val){
    let max = this.mid.y/1.5
    this._r = val > 0? ((val > max )? max :val):0;

    let offset = new Vector(this._r, this._r);

    if (this.mid){
        offset = this.mid.div(2).sub(offset.div(2));
    }
    if (this.shape){
      this.shape.setAttribute('width',this._r);
      this.shape.setAttribute('height',this._r);
      this.shape.setAttribute('x',offset.x);
      this.shape.setAttribute('y',offset.y);
    }
  }
  get r(){
    return this._r
  }
  draw(){
    this.r -= this.speed;
  }
}
