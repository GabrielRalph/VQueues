class BallScene{
  constructor(){

  }

  onbass(){
    setAllBallsVelocit(up)
  }
  ontrebble(){
    changeAllBallsColors()
  }
}

class Ball{
  constructor(ballBox, options = null){


    this.ballBox = ballBox;

    this.el = this.ballBox.el.createChild('ellipse')

    this.style = {stroke: 'red', fill: 'blue', strokeWidth: 0.5}

    this.pos = new Vector();
    this.v = new Vector();
    this.a = new Vector();

    this.r = 2;// relative
    this.g = 9.81

    if (options instanceof Object){
      for (var key in options){
        if (this[key]){
          this[key] = options[key]
        }
      }
    }
  }

  bounce(val){
    this._v.y = -0.1*val*this.a.y
  }

  set fill(val){
    this.style = {fill: val}
  }
  get fill(){
    return this._style.fill;
  }

  set stroke(val){
    this.style = {stroke: val}
  }
  get stroke(){
    return this._style.stroke;
  }

  set strokeWidth(val){
    this.style = {strokeWidth: val}
  }
  get strokeWidth(){
    return this._style.strokeWidth
  }

  set style(object){
    if (!(this._style instanceof Object)){
      this._style = {}
    }
    if (object.stroke){
      this._style['stroke'] = object.stroke
    }
    if (object.fill){
      this._style['fill'] = object.fill
    }
    if (object.strokeWidth){
      this._style['strokeWidth'] = object.strokeWidth
    }
    this.el.setProps({
      fill: this.fill,
      stroke: this.stroke,
      'stroke-width': `${this.strokeWidth}`
    })
  }
  get style(){
    return {stroke: this.stroke, fill: this.fill, strokeWidth: this.strokeWidth}
  }

  set r(length){
    length -= this.strokeWidth;
    this.el.setProps({
      rx: `${length}`,
      ry: `${length}`
    })
    this._r = length;
  }
  get r(){
    return this._r
  }

  get I(){
    return (2/5)*this.r*this.r*this.m // I_G = (2/5)r^2m for a solid sphere
  }

  set pos(p){
    if (p instanceof Vector){
      this.el.setProps({
        cx: `${p.x}`,
        cy: `${p.y}`
      })
      this._pos = p;
    }else{
      throw `${p} is not a Vector object`
    }
  }
  get pos(){
    return this._pos
  }

  set a(a_v){
    if ( a_v instanceof Vector ){
      this._a = a_v;
    }else{
      throw `${a_v} not a Vector Object`
    }
  }
  get a(){
    return this._a
  }

  set v(v_v){
    if ( v_v instanceof Vector ){
      this._v = v_v;
    }else{
      throw `${v_v} not a Vector Object`
    }
  }
  set v_x_flip(res){
    this._v.x *= -1*res
  }
  set v_y_flip(res){
    this._v.y *= -1*res
  }
  get v(){
    return this._v
  }


  draw(dt){
    this.resolveEdgeCollision(dt)
    this.v = this.v.add(this.a.mul(dt))
    this.pos = this.pos.add(this.v.mul(dt))
  }

  resolveEdgeCollision(dt){
    let box = this.ballBox.screenConstraints;
    let res = this.ballBox.boxEdgeRestitution;
    let fVel = this.v.add(this.a.mul(dt))
    let fPos = this.pos.add(fVel.mul(dt));
    if ((fPos.x + this.r > box.xMax) || (fPos.x - this.r < box.xMin)){
      this.v_x_flip = res.x;
    }
    if ((fPos.y + this.r > box.yMax) || (fPos.y - this.r < box.yMin)){
      this.v_y_flip = res.y;
    }
  }
}

class BallBox{
  constructor(el){
    this.el = parseElement(el)
    let vb = this.el.getViewBox();
    let min = vb.offset;
    let max = min.add(vb.size);
    this.screenConstraints = {xMin: min.x, yMin: min.y, xMax: max.x, yMax: max.y}
    this.boxEdgeRestitution = new Vector(0.99, 0.9);
    this.balls = []
    this.last_tmsp = null
    this.currentBall = 0
  }

  createBall(options){
    let ball = new Ball(this, options);
    this.balls.push(ball)
    return ball
  }

  removeBall(ball){
    var newBalls = [];
    this.el.removeChild(ball.el);
    this.balls.forEach((ball_i) => {
      if ( ball_i != ball ){
        newBalls.push(ball_i)
      }
    });
    ball.ballBox = null;
    this.balls = newBalls;
  }

  collideBalls(ball_a, ball_b){
    let cd = ball_b.pos.sub(ball_a.pos).dir()
    let v_a = {cd: ball_a.v.dot(cd)}
    let v_b = {cd: ball_b.v.dot(cd)}

    let n1 = v_b.cd
    let n2 = v_a.cd

    ball_a.v = (ball_a.v.add(cd.mul(v_b.cd - v_a.cd)))
    ball_b.v = (ball_b.v.add(cd.mul(v_a.cd - v_b.cd)))

    ball_b.pos = ball_a.pos.add(cd.mul(ball_a.r + ball_b.r + 0.001))
  }
  //Brute force O(n^2)
  resolveCollisions(){
    this.balls.forEach((ball_a) => {
      this.balls.forEach((ball_b) => {
        if(ball_a != ball_b){
          if(ball_a.pos.distance(ball_b.pos) < ball_a.r + ball_b.r){
              this.collideBalls(ball_a, ball_b)
          }
        }
      })
    })
  }

  onBass(std){
    if (std > 10){
      if(this.balls[this.currentBall]){
        console.log(std);
        this.balls[this.currentBall].bounce(std/3)
        this.currentBall ++;
        if (this.currentBall >= this.balls.length){
          this.currentBall = 0;
        }
      }
    }
  }

  draw(tmsp){
    if (this.last_tmsp != null){

      this.balls.forEach((ball) => {
        ball.draw((tmsp - this.last_tmsp)/1000)
        this.resolveCollisions()
      });
    }
    this.last_tmsp = tmsp;
  }
}
