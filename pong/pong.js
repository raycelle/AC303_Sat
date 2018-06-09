$(document).ready(function(){

	//setting up the game
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var gameOver = true;

	//set up constants
	const PI = Math.PI;
	const HEIGHT = canvas.height;
	const WIDTH = canvas.width;
	const upKey = 38, downKey = 40;

	//User Inputs
	var keyPressed = null;

	//setting up game objects
	var player = {
		x: null,
		y: null,
		width: 20,
		height: 100,
		update: function(){
			//move paddle according to key
			if(keyPressed == upKey) this.y -= 10;
			if(keyPressed == downKey) this.y += 10;

		},
		draw: function(){
			ctx.fillRect(this.x, this.y, this.width,this.height);
		}
	}

	var ai = {
		x: null,
		y: null,
		width: 20,
		height: 100,
		update: function(){
			let target = ball.y - (this.height - ball.size)/2;
			this.y += (target - this.y) * 0.1;
		},
		draw: function(){
			ctx.fillRect(this.x, this.y, this.width,this.height);
		}
	}

	var ball = {
		x: null,
		y: null,
		size: 20,
		speedx: null,
		speedy: null,
		speed: 10,
		update: function(){
			//move ball
			this.x += this.speedx;
			this.y += this.speedy;

			//bounce top and bottom
			if(this.y <= 0 || this.y +this.size >= HEIGHT){
				this.speedy *= -1;
			}

			//sense collision
			function checkCollision(a, b){
				return(a.x < b.x + b.width && a.y < b.y +b.height &&
					b.x < a.x +a.size && b.y < a.y + a.size);
			} 

			let other;

			if(ball.speedx < 0){
				other = player;
			} else {
				other = ai;
			}

			//check for collision
			let collided = checkCollision(ball, other);

			if(collided){
				//copy code in codeshare.io/fcawp3

				let n = (this.y + this.size - other.y) / (other.height + this.size);
				let phi = 0.25 * PI * (2 * n - 1)
				this.speedx = this.speed * Math.cos(phi);
				this.speedy = this.speed * Math.sin(phi);
				if(other == ai) this.speedx *= -1;
			}

			//check if gameover
			if(this.x + this.size < 0  || this.x > WIDTH){
				gameOver = true;
				$("button").fadeIn();
				if(this.x > WIDTH){
					$("h1").html("You Win!");
				} else {
					$("h1").html("You Lose!");
				}
			}



		},
		draw: function(){
			ctx.fillRect(this.x, this.y, this.size,this.size);
		}
	}


	//setting game functions
	function main(){
		//initialize
		init();

		//setup loop
		var loop = function(){
			update();
			draw();
			window.requestAnimationFrame(loop, canvas);
		}
		window.requestAnimationFrame(loop, canvas);
	}

	function init(){

		gameOver = false;
		$("h1").html("Pong");

		//center paddles
		player.x = 20;
		player.y = (HEIGHT - player.height)/ 2;

		ai.x = (WIDTH - ai.width - 20);
		ai.y = (HEIGHT - player.height)/ 2;

		//center ball
		ball.x = (WIDTH - ball.size) / 2;
		ball.y = (HEIGHT - ball.size) / 2;

		//serve ball
		ball.speedx = ball.speed;
		if(Math.round(Math.random())){
			ball.speedx *= -1;
		}
		ball.speedy = 0;

	}

	function update(){
		if(!gameOver)
			ball.update();
		ai.update();
		player.update();

	}

	function draw(){
		//fill background
		ctx.fillStyle = "black";
		ctx.fillRect( 0, 0, WIDTH, HEIGHT);

		//draw game objects
		ctx.fillStyle = "white";
		ball.draw();
		ai.draw();
		player.draw();

		//optional - draw line
	}

	//sense users key inputs
	$(document).on("keyup", function(){
		keyPressed = null;
	});

	$(document).on("keydown", function(e){
		keyPressed = e.which;
	});


	//button click
	$("button").on("click", function(){
		$(this).hide();
		init();
	} )


	//call main function to start
	main();





})