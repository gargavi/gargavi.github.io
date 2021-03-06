const cvs = document.querySelector('canvas');
const c = cvs.getContext('2d');

if ( navigator.platform != "iPad" && navigator.platform != "iPhone" && navigator.platform != "iPod" ) {
  cvs.width = window.innerWidth; 
      //I'll use window.innerWidth in production
} else {
  cvs.width = screen.width;
}
cvs.height = window.innerHeight;
window.addEventListener('resize', function () {
  cvs.width = window.innerWidth;
  cvs.height = window.innerHeight;
  c.font =  cvs.height/4 + "px Arvo,serif";
  var x_cut = 1.1 * (c.measureText("AVI GARG").width)/2 ;
  var y_lower = x_cut/(3);
  var y_upper = x_cut/15;  
  c.clearRect(0, 0, window.innerWidth, window.innerHeight);
  console.log(x_cut); 
  console.log(y_upper);
  console.log(y_lower);

});

let mouse = {
  x: undefined,
  y: undefined
};

window.addEventListener('mousemove', function (e) {
  mouse.x = event.x;
  mouse.y = event.y;
});

var gradient = c.createLinearGradient(0, 0, cvs.width, 0);
gradient.addColorStop("0"," magenta");
gradient.addColorStop("0.5", "blue");
gradient.addColorStop(".75", "red")
c.fillStyle = gradient;
c.font =  cvs.height/4 + "px Arvo,serif";
var x_cut = (c.measureText("AVI GARG").width)/2 + 40;
var y_lower = x_cut/(3);
var y_upper = x_cut/15;


class MusicWave {
    constructor(x) {
        this.buffer = x;
        this.first = 0;
        this.ampvals = new Array();
        this.freqvals = new Array();
        for (let i = 0; i < 20; i ++ ){
            this.ampvals[i] = Math.random()*30 + 65;
            this.freqvals[i] = 1/(Math.random()*20 + 20);
        };
        this.yvals = new Array();
        for (let i = 0; i < cvs.width; i++ ){
          this.yvals[i] = this.sumsines(i);
        };

    }

    sumsines = function(x){
    //      //The more of these iterations we add the more complex it becomes
      var y = 0;
      for (let i = 0; i < 5; i++ ) {
        var b = this.freqvals[i];
        var a = this.ampvals[i];
        y = y + Math.sin((x + this.buffer)*b)*a;
      };
      return y;
    }
    draw = function(){
        if (this.first < 40){
            c.clearRect(0, 0, window.innerWidth, window.innerHeight);
            this.first++;
        } else {
            this.first = (this.first +1) % cvs.width;
        }
        var x = Math.floor(this.buffer - 10);
        var y = 0;
        c.textAlign = "center";
        c.strokeStyle = gradient;
        c.beginPath();
        while (x < this.buffer) {
          this.writename();
            y = 300 + this.yvals[x];
          if ((((x > cvs.width/2 - x_cut) && (x< cvs.width/2 -110) ) || ((x < cvs.width/2 + x_cut) && (x > cvs.width/2  - 70)) )
           && (y > cvs.height/2 - y_lower) && (y < cvs.height/2 + y_upper)) {
              c.moveTo(x, y);

          } else {
            c.lineTo(x, y);
            c.moveTo(x, y);
            c.stroke();
            c.fill();
          };
          x += 2;
        };

        c.closePath();
        this.update();
    }
    writename = function() {
        this.writer(Math.floor((this.buffer - 160)/100));
    }
    writer = function(i) {
      var str = "AVI GARG";
      var x = cvs.width/2 - c.measureText("AVI GARG").width/2 + 20 ;
      var y = cvs.height/2;
      for (let j = 0; j < i; j++){
        c.font =  cvs.height/4 + "px Arvo, serif";
        if (j == 3) {
          x += 110;
        } else {
          var ch = str.charAt(j);
          c.fillStyle = gradient;
          c.fillText(ch, x, y );
          x += c.measureText(ch).width;
        }
      };
      for(let j = i; j < 8; j++ ){
        c.font =  cvs.height/4 + "px Arvo, serif";
        if (j == 3) {
          x += 110;
        }else {
          var ch = str.charAt(j);
          c.fillStyle = "white";
          c.fillText(ch, x, y );
          x += c.measureText(ch).width;
        }
      };
    }

    update = function(){
      this.buffer = (this.buffer + 3) % cvs.width;
      if (this.buffer < 3) {
        c.clearRect(0, 0, window.innerWidth, window.innerHeight);
      };
    }
}


var animation = new MusicWave(30);
function animate() {
  requestAnimationFrame(animate);
  //c.clearRect(0, 0, window.innerWidth, window.innerHeight);
  if (animation.buffer > cvs.width - 10) {
    setTimeout(() => {animation.draw()}
      , 1000);
  } else {
      animation.draw();
  }

};

animate();
