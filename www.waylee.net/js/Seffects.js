//Waylee.net 代码源于网络，摘抄请勿删除此注释，2017.11.12
//判断用户PC/Phone平台
function browserRedirect() {
      var sUserAgent = navigator.userAgent.toLowerCase();
      var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
      var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
      var bIsMidp = sUserAgent.match(/midp/i) == "midp";
      var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
      var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
      var bIsAndroid = sUserAgent.match(/android/i) == "android";
      var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
      var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
      if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
       return false;
//	document.writeln("Phone");
      } else {
       return true;
//	document.writeln("PC");
      }
    }
var p=browserRedirect();
//是PC将显示像素字
if(p){ 
var S = {
                init: function () {
                    S.Drawing.init('.canvas');
                    document.body.classList.add('body--ready');
					if(p){
						S.UI.simulate("I'm|Waylee|welcome to|visit my blog|#countdown 3");	
					}else{
						S.UI.simulate("#countdown 3");	
					}
                    				
                    S.Drawing.loop(function () {
                        S.Shape.render();
						
                    });
					
                }
				
            };


            S.Drawing = (function () {
                var canvas,
                        context,
                        renderFn,
                        requestFrame = window.requestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.oRequestAnimationFrame ||
                        window.msRequestAnimationFrame ||
                        function (callback) {
                            window.setTimeout(callback, 1000 / 60);
                        };

                return {
                    init: function (el) {
                        canvas = document.querySelector(el);
                        context = canvas.getContext('2d');
                        this.adjustCanvas();

                        window.addEventListener('resize', function (e) {
                            S.Drawing.adjustCanvas();
                        });
                    },
                    loop: function (fn) {
                        renderFn = !renderFn ? fn : renderFn;
                        this.clearFrame();
                        renderFn();
                        requestFrame.call(window, this.loop.bind(this));
                    },
                    adjustCanvas: function () {
                        canvas.width = window.innerWidth - 100;
                        canvas.height = window.innerHeight - 30;
                    },
                    clearFrame: function () {
                        context.clearRect(0, 0, canvas.width, canvas.height);
                    },
                    getArea: function () {
                        return {w: canvas.width, h: canvas.height};
                    },
                    drawCircle: function (p, c) {
                        context.fillStyle = c.render();
                        context.beginPath();
                        context.arc(p.x, p.y, p.z, 0, 2 * Math.PI, true);
                        context.closePath();
                        context.fill();
                    }
                };
            }());


            S.UI = (function () {
                var interval,
                        currentAction,
                        time,
                        maxShapeSize = 30,
                        sequence = [],
                        cmd = '#';

                function formatTime(date) {
                    var h = date.getHours(),
                            m = date.getMinutes(),
                            m = m < 10 ? '0' + m : m;
                    return h + ':' + m;
                }

                function getValue(value) {
                    return value && value.split(' ')[1];
                }

                function getAction(value) {
                    value = value && value.split(' ')[0];
                    return value && value[0] === cmd && value.substring(1);
                }

                function timedAction(fn, delay, max, reverse) {
                    clearInterval(interval);
                    currentAction = reverse ? max : 1;
                    fn(currentAction);

                    if (!max || (!reverse && currentAction < max) || (reverse && currentAction > 0)) {
                        interval = setInterval(function () {
                            currentAction = reverse ? currentAction - 1 : currentAction + 1;
                            fn(currentAction);

                            if ((!reverse && max && currentAction === max) || (reverse && currentAction === 0)) {
                                clearInterval(interval);
                            }
                        }, delay);
                    }
                }

                function performAction(value) {
                    var action,
                            value,
                            current;

                    sequence = typeof (value) === 'object' ? value : sequence.concat(value.split('|'));

                    timedAction(function (index) {
                        current = sequence.shift();
                        action = getAction(current);
                        value = getValue(current);

                        switch (action) {
                            case 'countdown':
                                value = parseInt(value) || 10;
                                value = value > 0 ? value : 10;

                                timedAction(function (index) {
                                    if (index === 0) {
                                        if (sequence.length === 0) {
                                            S.Shape.switchShape(S.ShapeBuilder.letter(''));
											document.getElementById("willerce").style.transform="scale(1,1)";
											document.getElementById("jb").style.transform="scale(1,1)";
											if(p){ 			
											document.getElementById("bfq").play();
											document.getElementById("bfq").style.opacity=0.6;
											document.getElementById("bfq").style.display="block";
											}
											
                                        } else {
                                            performAction(sequence);
											
                                        }
                                    } else {
                                        S.Shape.switchShape(S.ShapeBuilder.letter(index), true);
										
                                    }
                                }, 1000, value, true);
								
                                break;

                            case 'rectangle':
                                value = value && value.split('x');
                                value = (value && value.length === 2) ? value : [maxShapeSize, maxShapeSize / 2];

                                S.Shape.switchShape(S.ShapeBuilder.rectangle(Math.min(maxShapeSize, parseInt(value[0])), Math.min(maxShapeSize, parseInt(value[1]))));
                                break;

                            case 'circle':
                                value = parseInt(value) || maxShapeSize;
                                value = Math.min(value, maxShapeSize);
                                S.Shape.switchShape(S.ShapeBuilder.circle(value));
                                break;

                            case 'time':
                                var t = formatTime(new Date());

                                if (sequence.length > 0) {
                                    S.Shape.switchShape(S.ShapeBuilder.letter(t));
                                } else {
                                    timedAction(function () {
                                        t = formatTime(new Date());
                                        if (t !== time) {
                                            time = t;
                                            S.Shape.switchShape(S.ShapeBuilder.letter(time));
                                        }
                                    }, 1000);
                                }
                                break;

                            default:
                                S.Shape.switchShape(S.ShapeBuilder.letter(current[0] === cmd ? 'HacPai' : current));
                        }
						
                    }, 2000, sequence.length);
					
                }
				
                return {
                    simulate: function (action) {
                        performAction(action);
                    }
                };
           
		   }());


            S.Point = function (args) {
                this.x = args.x;
                this.y = args.y;
                this.z = args.z;
                this.a = args.a;
                this.h = args.h;
				
            };


            S.Color = function (r, g, b, a) {
                this.r = r;
                this.g = g;
                this.b = b;
                this.a = a;
            };

            S.Color.prototype = {
                render: function () {
                    return 'rgba(' + this.r + ',' + +this.g + ',' + this.b + ',' + this.a + ')';
                }
            };


            S.Dot = function (x, y) {
                this.p = new S.Point({
                    x: x,
                    y: y,
                    z: 5,
                    a: 1,
                    h: 0
                });

                this.e = 0.07;
                this.s = true;

                this.c = new S.Color(255, 255, 255, this.p.a);

                this.t = this.clone();
                this.q = [];
				
            };

            S.Dot.prototype = {
                clone: function () {
                    return new S.Point({
                        x: this.x,
                        y: this.y,
                        z: this.z,
                        a: this.a,
                        h: this.h
                    });
                },
                _draw: function () {
                    this.c.a = this.p.a;
                    S.Drawing.drawCircle(this.p, this.c);
                },
                _moveTowards: function (n) {
                    var details = this.distanceTo(n, true),
                            dx = details[0],
                            dy = details[1],
                            d = details[2],
                            e = this.e * d;

                    if (this.p.h === -1) {
                        this.p.x = n.x;
                        this.p.y = n.y;
                        return true;
                    }

                    if (d > 1) {
                        this.p.x -= ((dx / d) * e);
                        this.p.y -= ((dy / d) * e);
                    } else {
                        if (this.p.h > 0) {
                            this.p.h--;
                        } else {
                            return true;
                        }
                    }

                    return false;
                },
                _update: function () {
                    if (this._moveTowards(this.t)) {
                        var p = this.q.shift();

                        if (p) {
                            this.t.x = p.x || this.p.x;
                            this.t.y = p.y || this.p.y;
                            this.t.z = p.z || this.p.z;
                            this.t.a = p.a || this.p.a;
                            this.p.h = p.h || 0;
                        } else {
                            if (this.s) {
                                this.p.x -= Math.sin(Math.random() * 3.142);
                                this.p.y -= Math.sin(Math.random() * 3.142);
                            } else {
                                this.move(new S.Point({
                                    x: this.p.x + (Math.random() * 50) - 25,
                                    y: this.p.y + (Math.random() * 50) - 25
                                }));
                            }
                        }
                    }

                    d = this.p.a - this.t.a;
                    this.p.a = Math.max(0.1, this.p.a - (d * 0.05));
                    d = this.p.z - this.t.z;
                    this.p.z = Math.max(1, this.p.z - (d * 0.05));
                },
                distanceTo: function (n, details) {
                    var dx = this.p.x - n.x,
                            dy = this.p.y - n.y,
                            d = Math.sqrt(dx * dx + dy * dy);

                    return details ? [dx, dy, d] : d;
                },
                move: function (p, avoidStatic) {
                    if (!avoidStatic || (avoidStatic && this.distanceTo(p) > 1)) {
                        this.q.push(p);
                    }
                },
                render: function () {
                    this._update();
                    this._draw();
					
                }
				
				
            };


            S.ShapeBuilder = (function () {
                var gap = 13,
                        shapeCanvas = document.createElement('canvas'),
                        shapeContext = shapeCanvas.getContext('2d'),
                        fontSize = 500,
                        fontFamily = 'Avenir, Helvetica Neue, Helvetica, Arial, sans-serif';

                function fit() {
                    shapeCanvas.width = Math.floor(window.innerWidth / gap) * gap;
                    shapeCanvas.height = Math.floor(window.innerHeight / gap) * gap;
                    shapeContext.fillStyle = 'red';
                    shapeContext.textBaseline = 'middle';
                    shapeContext.textAlign = 'center';
                }

                function processCanvas() {
                    var pixels = shapeContext.getImageData(0, 0, shapeCanvas.width, shapeCanvas.height).data;
                    dots = [],
                            pixels,
                            x = 0,
                            y = 0,
                            fx = shapeCanvas.width,
                            fy = shapeCanvas.height,
                            w = 0,
                            h = 0;

                    for (var p = 0; p < pixels.length; p += (4 * gap)) {
                        if (pixels[p + 3] > 0) {
                            dots.push(new S.Point({
                                x: x,
                                y: y
                            }));

                            w = x > w ? x : w;
                            h = y > h ? y : h;
                            fx = x < fx ? x : fx;
                            fy = y < fy ? y : fy;
							
                        }

                        x += gap;

                        if (x >= shapeCanvas.width) {
                            x = 0;
                            y += gap;
                            p += gap * 4 * shapeCanvas.width;
                        }
						
                    }

                    return {dots: dots, w: w + fx, h: h + fy};
                }

                function setFontSize(s) {
                    shapeContext.font = 'bold ' + s + 'px ' + fontFamily;
                }

                function isNumber(n) {
                    return !isNaN(parseFloat(n)) && isFinite(n);
                }

                function init() {
                    fit();
                    window.addEventListener('resize', fit);
                }

                // Init
                init();

                return {
                    imageFile: function (url, callback) {
                        var image = new Image(),
                                a = S.Drawing.getArea();

                        image.onload = function () {
                            shapeContext.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);
                            shapeContext.drawImage(this, 0, 0, a.h * 0.6, a.h * 0.6);
                            callback(processCanvas());
                        };

                        image.onerror = function () {
                            callback(S.ShapeBuilder.letter('What?'));
                        };

                        image.src = url;
                    },
                    circle: function (d) {
                        var r = Math.max(0, d) / 2;
                        shapeContext.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);
                        shapeContext.beginPath();
                        shapeContext.arc(r * gap, r * gap, r * gap, 0, 2 * Math.PI, false);
                        shapeContext.fill();
                        shapeContext.closePath();

                        return processCanvas();
                    },
                    letter: function (l) {
                        var s = 0;

                        setFontSize(fontSize);
                        s = Math.min(fontSize,
                                (shapeCanvas.width / shapeContext.measureText(l).width) * 0.8 * fontSize,
                                (shapeCanvas.height / fontSize) * (isNumber(l) ? 1 : 0.45) * fontSize);
                        setFontSize(s);

                        shapeContext.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);
                        shapeContext.fillText(l, shapeCanvas.width / 2, shapeCanvas.height / 2);
					
                        return processCanvas();
                    },
                    rectangle: function (w, h) {
                        var dots = [],
                                width = gap * w,
                                height = gap * h;

                        for (var y = 0; y < height; y += gap) {
                            for (var x = 0; x < width; x += gap) {
                                dots.push(new S.Point({
                                    x: x,
                                    y: y
                                }));
                            }
							
                        }

                        return {dots: dots, w: width, h: height};
                    }
                };
            }());


            S.Shape = (function () {
                
				var dots = [],
                        width = 0,
                        height = 0,
                        cx = 0,
                        cy = 0;

                function compensate() {
                    var a = S.Drawing.getArea();

                    cx = a.w / 2 - width / 2;
                    cy = a.h / 2 - height / 2;
					
                }
					
                return {
				
                    shuffleIdle: function () {
                        var a = S.Drawing.getArea();

                        for (var d = 0; d < dots.length; d++) {
                            if (!dots[d].s) {
                                dots[d].move({
                                    x: Math.random() * a.w,
                                    y: Math.random() * a.h
                                });
                            }
							
                        }
						
                    },
                    switchShape: function (n, fast) {
                        var size,
                                a = S.Drawing.getArea();

                        width = n.w;
                        height = n.h;

                        compensate();

                        if (n.dots.length > dots.length) {
                            size = n.dots.length - dots.length;
                            for (var d = 1; d <= size; d++) {
                                dots.push(new S.Dot(a.w / 2, a.h / 2));
								
                            }
							
                        }

                        var d = 0,
                                i = 0;

                        while (n.dots.length > 0) {
                            i = Math.floor(Math.random() * n.dots.length);
                            dots[d].e = fast ? 0.25 : (dots[d].s ? 0.14 : 0.11);

                            if (dots[d].s) {
                                dots[d].move(new S.Point({
                                    z: Math.random() * 20 + 10,
                                    a: Math.random(),
                                    h: 18
                                }));
                            } else {
                                dots[d].move(new S.Point({
                                    z: Math.random() * 5 + 5,
                                    h: fast ? 18 : 30
                                }));
                            }

                            dots[d].s = true;
                            dots[d].move(new S.Point({
                                x: n.dots[i].x + cx,
                                y: n.dots[i].y + cy,
                                a: 1,
                                z: 5,
                                h: 0
                            }));

                            n.dots = n.dots.slice(0, i).concat(n.dots.slice(i + 1));
                            d++;
							
                        }

                        for (var i = d; i < dots.length; i++) {
                           
						   if (dots[i].s) {
                                dots[i].move(new S.Point({
                                    z: Math.random() * 20 + 10,
                                    a: Math.random(),
                                    h: 20

                                }));

                                dots[i].s = false;
                                dots[i].e = 0.04;
                                dots[i].move(new S.Point({
                                    x: Math.random() * a.w,
                                    y: Math.random() * a.h,
                                    a: 0.3, //.4
                                    z: Math.random() * 4,
                                    h: 0
                                }));
								
                            }
							
                        }
						
                    },
                    render: function () {
					
                        for (var d = 0; d < dots.length; d++) {
                           
						   dots[d].render();
							
                        }
						
                    }
					
                };
				
            }());
			
            S.init();
			
}else{
	document.getElementById("bfq").style.display="none";
	document.getElementById("willerce").style.transform="scale(1,1)";
	document.getElementById("jb").style.transform="scale(1,1)";
	var canvas,
	ctx,
	width,
	height,
	size,
	lines,
	tick;

function line() {
	this.path = [];
	this.speed = rand(10, 20);
	this.count = randInt(10, 30);
	this.x = width / 2, +1;
	this.y = height / 2 + 1;
	this.target = {
		x: width / 2,
		y: height / 2
	};
	this.dist = 0;
	this.angle = 0;
	this.hue = tick / 5;
	this.life = 1;
	this.updateAngle();
	this.updateDist();
}

line.prototype.step = function(i) {
	this.x += Math.cos(this.angle) * this.speed;
	this.y += Math.sin(this.angle) * this.speed;

	this.updateDist();

	if (this.dist < this.speed) {
		this.x = this.target.x;
		this.y = this.target.y;
		this.changeTarget();
	}

	this.path.push({
		x: this.x,
		y: this.y
	});
	if (this.path.length > this.count) {
		this.path.shift();
	}

	this.life -= 0.001;

	if (this.life <= 0) {
		this.path = null;
		lines.splice(i, 1);
	}
};

line.prototype.updateDist = function() {
	var dx = this.target.x - this.x,
		dy = this.target.y - this.y;
	this.dist = Math.sqrt(dx * dx + dy * dy);
}

line.prototype.updateAngle = function() {
	var dx = this.target.x - this.x,
		dy = this.target.y - this.y;
	this.angle = Math.atan2(dy, dx);
}

line.prototype.changeTarget = function() {
	var randStart = randInt(0, 3);
	switch (randStart) {
		case 0: // up
			this.target.y = this.y - size;
			break;
		case 1: // right
			this.target.x = this.x + size;
			break;
		case 2: // down
			this.target.y = this.y + size;
			break;
		case 3: // left
			this.target.x = this.x - size;
	}
	this.updateAngle();
};

line.prototype.draw = function(i) {
	ctx.beginPath();
	var rando = rand(0, 10);
	for (var j = 0, length = this.path.length; j < length; j++) {
		ctx[(j === 0) ? 'moveTo' : 'lineTo'](this.path[j].x + rand(-rando, rando), this.path[j].y + rand(-rando, rando));
	}
	ctx.strokeStyle = 'hsla(' + rand(this.hue, this.hue + 30) + ', 80%, 55%, ' + (this.life / 3) + ')';
	ctx.lineWidth = rand(0.1, 2);
	ctx.stroke();
};

function rand(min, max) {
	return Math.random() * (max - min) + min;
}

function randInt(min, max) {
	return Math.floor(min + Math.random() * (max - min + 1));
};

function init() {
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	size = 30;
	lines = [];
	reset();
	loop();
}

function reset() {
	width = Math.ceil(window.innerWidth / 2) * 2;
	height = Math.ceil(window.innerHeight / 2) * 2;
	tick = 0;

	lines.length = 0;
	canvas.width = width;
	canvas.height = height;
}

function create() {
	if (tick % 10 === 0) {
		lines.push(new line());
	}
}

function step() {
	var i = lines.length;
	while (i--) {
		lines[i].step(i);
	}
}

function clear() {
	ctx.globalCompositeOperation = 'destination-out';
	ctx.fillStyle = 'hsla(0, 0%, 0%, 0.1';
	ctx.fillRect(0, 0, width, height);
	ctx.globalCompositeOperation = 'lighter';
}

function draw() {
	ctx.save();
	ctx.translate(width / 2, height / 2);
	ctx.rotate(tick * 0.001);
	var scale = 0.8 + Math.cos(tick * 0.02) * 0.2;
	ctx.scale(scale, scale);
	ctx.translate(-width / 2, -height / 2);
	var i = lines.length;
	while (i--) {
		lines[i].draw(i);
	}
	ctx.restore();
}

function loop() {
	requestAnimationFrame(loop);
	create();
	step();
	clear();
	draw();
	tick++;
}

function onresize() {
	reset();
}

window.addEventListener('resize', onresize);

init();
}			
