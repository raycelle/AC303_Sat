$(document).ready(function(){

	//set up canvas
	var canvas = document.getElementById("myCanvas");
	var context = canvas.getContext("2d");

	//Set up grids
	var gridNum = 20;
	var gridSize = canvas.width / gridNum;

	//set up candy and player objects
	var player = {
		tail: 1,
		x: 7,
		y: 7,
		//direction: right - 0, left - 1, 
		//up - 2, down - 3, stopped - 5
		direction: 5,
		alive: true
	}

	var candy = {
		x: 0,
		y: 0,
		alive: false
	}

	//store coordinates of the body parts
	var snakeBody = [ [7,7] ];

	//set up keys
	var keyPressed = null;
	var leftKey = 37, upKey = 38, rightKey = 39, downKey = 40;

	//make custom insert method for Array
	Array.prototype.insert = function(index, item){
		//.splice(index to insert, no of items to delete, new items)
		this.splice(index, 0, item);
	} 

	function update(){
		//change direction
		if (keyPressed){
			if(keyPressed == rightKey && player.direction != 1) player.direction = 0;
			if(keyPressed == leftKey && player.direction != 0) player.direction = 1;
			if(keyPressed == upKey && player.direction != 3) player.direction = 2;
			if(keyPressed == downKey && player.direction != 2) player.direction = 3;
		}

		//spawn candy
		if(!candy.alive){
			candy.x = Math.floor(Math.random()*gridNum);
			candy.y = Math.floor(Math.random()*gridNum);

			//check if on snake, if on snake collided=true
			var collided;
			do {
				collided = false;
				for(var i = 0; i < player.tail; i++){
					if(candy.x == snakeBody[i][0] && candy.y == snakeBody[i][1]){
						candy.x = Math.floor(Math.random()*gridNum);
						candy.y = Math.floor(Math.random()*gridNum);
						collided = true;
						break;
					}
				}
			}while(collided)

			//set candy alive
			candy.alive = true;
		}

		//check if eating candy
		if(player.x == candy.x && player.y == candy.y){
			candy.alive = false;
			player.tail++;//player.tail = player.tail.+1
		}

		//check if hit itself
		if(player.tail>1){
			for(var i = 1; i < player.tail; i++){
				if(player.x == snakeBody[i][0] && player.y == snakeBody[i][1]){
					player.alive=false;
					clearInterval(updates);
				}
			}
		}

		//check if hit border
		if(player.x < 0 || player.x >= gridNum 
			|| player.y < 0 || player.y >= gridNum){

			player.alive=false;
			clearInterval(updates);
		}

		//move the player
		snakeBody.insert(0, [player.x, player.y])
		while(snakeBody.length > player.tail +1){
			snakeBody.pop();
		}

		switch(player.direction){
			//direction: right - 0, left - 1, 
			//up - 2, down - 3, stopped - 5
			//right
			case 0:
			player.x += 1; break;
			//left
			case 1:
			player.x -= 1; break;
			//Up
			case 2:
			player.y -= 1; break;
			//down
			case 3:
			player.y += 1; break;

		}

		if(player.alive){
			draw();
		}


	}

	function draw(){
		context.clearRect(0,0, canvas.width, canvas.height);
		//draw candy
		context.fillStyle = "red";
		context.fillRect(candy.x * gridSize, candy.y*gridSize, gridSize, gridSize);
		//draw snake
		for(var i = 0; i < player.tail; i++){
			context.fillStyle = "black";
			context.fillRect(snakeBody[i][0] * gridSize, snakeBody[i][1] * gridSize, gridSize, gridSize);
		}
	}

	//keyboard
	$(window).on("keydown", function(event){
		keyPressed = event.which;
	})

	//run frame updates
	update();
	var updates = setInterval(update, 100);



})