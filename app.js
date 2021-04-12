let usersDict={"k":["k", "", "", ""]};
let currentDisplayedDiv="#welcomeContainer";
let keys={"Up":"","Down":"","Left":"","Right":""};
let validSettingsData=true;
let ballsNumber=0;
let timeOfGame=0;
let monstersNumber=0;
let ballsColors={};
let board=new Array(15);
let intervalTimer;
let score = 0;
let angle = 0;
let swicthAngle = -1;
let pacDirection = "right";
let pacSpeed = 5;
let pacX = 0;
let pacY = 0;
let pacRadius = 15;
let ctx;
let loggedUser;
let gameIntervals=[];
let cherryX = 0;
let cherryY = 0;
let cherrySpeedX = 5;
let cherrySpeedY = 5;
let sizeX = 900 / board.length;
let sizeY;
let ghostsPositions=[];
let ghostsArr=[];
let countCandy = 0;
let radiusCandys = {5:4, 15:8, 25:13};

$(document).ready(function(){
	ctx=document.getElementById("myCanvas").getContext("2d");
});

function validateDataAfterRegistretion(){
	let userName=$('#userName').val();
	if(userName==""){
		alert("Empty userName!");
		return;
	}
	if (userName in usersDict){
		alert("Please choose another userName");
		return;
	}
	let password=$("#password").val();
	if(password==""){
		alert("password should contain at least 1 letter and 1 digit");
		return;
	}
	if(!checkPassword(password)){
		alert("Please fill the password again");
		return;
	}
	let fullName=$("#fullName").val();
	if(fullName==""){
		alert("Please fill full name");
		return;
	}
	if(!checkFullName(fullName)){
		alert("full name should contain only letters");
		return;
	}
	let email=$("#email").val();
	if(email==""){
		alert("Please enter email!");
		return;
	}
	if(!checkEmail(email)){
		alert("Please enter valid email");
		return;
	}
	let birthDate=$("#birthDate").val();
	usersDict[userName]=[password, fullName, email, birthDate];
	loggedUser=userName;
	showSettings();
}

function checkEmail(email){
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function checkPassword(password){
	if(password.length<6){
		alert("Password should contain at least 6 chars");
		return false;
	}
	let containsLetters=false;
	let containDigits=false;
	for(let i=0;i<password.length;i++){//loop over password and check if contains letters or digits
		let asciiValue=password.charAt(i).charCodeAt(0);
		if(!containDigits){//check if contain digits
			if(asciiValue>=48 && asciiValue<=57){
				containDigits=true;
				continue;
			}
		}
		if(!containsLetters){//check if contain letters
			if(asciiValue>=65 && asciiValue<=122){
				containsLetters=true;
				continue;
			}
		}
	}
	if(!containDigits || !containsLetters){
		alert("Password should contain letters and digits");
		return false;
	}
	return true;
}

function checkFullName(fullName){
	for(let i=0;i<fullName.length;i++){
		let asciiValue=fullName.charAt(i).charCodeAt(0);
		if(asciiValue>=123 || asciiValue<=96){
			return false;
		}
	}
	return true;
}

function validateDetailsAfterLogIn(){
	let userName=$('#LIuserName').val();
	if(userName==""){
		alert("Empty userName!");
		return;
	}
	
	let password=$("#LIpassword").val();
	if(password==""){
		alert("Please fill the password field");
		return;
	}

	if (!(userName in usersDict)){
		alert("This user name dosent exist at the system");
		return;
	}

	if (password == usersDict[userName][0]){
		loggedUser=userName;
		showSettings();
	}
	else{
		alert("User name or password are incorrect");
		return;
	}
}

function register(){
	document.getElementById("registerForm").reset();
	switchDivs("#registerDiv","block");	
}

function logIn(){
	document.getElementById("logInForm").reset();
	switchDivs("#logInDiv","block");
}

function showWelcomeScreen(){
	switchDivs("#welcomeContainer","flex");
}

function showSettings(){
	document.getElementById("settingsForm").reset();
	switchDivs("#gameAndSettingsDiv","flex");
	$("#settingsDiv").css("display","block");
	$("#gameDiv").css("display","none");
	$("#settingsButton").css("display","block");
	$("#randomButton").css("display","block");
	}

/**
 * This method switch between the current screen and new screen
 * @param {*div} newDivToSwitchTo the new div to show 
 * @param {string} display  a string value of how display the div(flex,inline etc...)
 */
function switchDivs(newDivToSwitchTo,display){
	if(currentDisplayedDiv=="#gameAndSettingsDiv"){
		stopGamesIntervals();
	}
	$(currentDisplayedDiv).css("display","none");
	currentDisplayedDiv=newDivToSwitchTo;
	$(newDivToSwitchTo).css("display",display);
}

function stopGamesIntervals(){
	gameIntervals.forEach(function(item){
		clearInterval(item);
	});
	gameIntervals=[];
}

/**
 * This function gets the keys the user press for movment and show them to the user
 */
$(document).ready(function(){
	setKeyPressed("#keyUp");
	setKeyPressed("#keyDown");
	setKeyPressed("#keyLeft");
	setKeyPressed("#keyRight");
});

/**
 * This function sets a listener for each user input key to show the user the key he pressed
 * @param {*} keyIdToSet key input id to set the listener to
 */
function setKeyPressed(keyIdToSet){
	$(keyIdToSet).keydown(function(event){
		$(keyIdToSet).attr("placeholder",event.key);
		$(keyIdToSet).val(event.key);
	});
}

function validateSettings(){
	$(".errorRow").css("display","none");
	validSettingsData=true;
	let keyup=$("#keyUp").val();
	let keyDown=$("#keyDown").val();
	let keyLeft=$("#keyLeft").val();
	let keyRight=$("#keyRight").val();
	let numberOfBalls=$("#numberOfBalls").val();
	let fivePointsBallColor=$("#fivePointsColorPicker").val();
	let fifteenPointsColorPicker=$("#fifteenPointsColorPicker").val();
	let twentyFivePointsColorPicker=$("#twentyFivePointsColorPicker").val();
	let gameTime=$("#gameTimeInput").val();
	let numberOfMonsters=$("#monstersPicker").val();
	checkKeysSettings(keyup,keyDown,keyLeft,keyRight);
	checkNumericValuesSettings(numberOfBalls,gameTime,numberOfMonsters);
	if(validSettingsData){
		ballsColors["5"]=fivePointsBallColor;
		ballsColors["15"]=fifteenPointsColorPicker;
		ballsColors["25"]=twentyFivePointsColorPicker;
		startGame();
		$("#gameDiv").css("display","flex");
	}
}

function checkNumericValuesSettings(numberOfBalls,gameTime,numberOfMonsters){
	if(checkSingleNumericValue(numberOfBalls,50,90,"#errorBallsNumber","Number of balls must be a number","Number of balls must be between 50 to 90")){
		ballsNumber=parseInt(numberOfBalls);
	}
	if(checkSingleNumericValue(gameTime,60,0,"#gameTimeError","","Game time must be at least 60 seconds!")){
		timeOfGame=parseInt(gameTime);
	}
	if(checkSingleNumericValue(numberOfMonsters,1,4,"#monstersNumberError","Monsters number must be a number","Monsters number must be between 1 to 4")){
		monstersNumber=parseInt(numberOfMonsters);
	}
}

function checkSingleNumericValue(numericValue,min,max,rowId,message1,message2){
	if(numericValue==""){
		$(rowId+" td").html("Please enter value");
		$(rowId).css("display","block");
		validSettingsData=false;
		return false;
	}
	if(isNaN(numericValue)){
		$(rowId+" td").html(message1);
		$(rowId).css("display","block");
		validSettingsData=false;
		return false;
	}
	let intNumericValue=parseInt(numericValue);
	if(max==0){
		if(intNumericValue<min){
			$(rowId+" td").html(message2);
			$(rowId).css("display","block");
			validSettingsData=false;
			return false;
		}
		return true;
	}
	if(intNumericValue<min || intNumericValue>max){
		$(rowId+" td").html(message2);
		$(rowId).css("display","block");
		validSettingsData=false;
		return false;
	}
	return true;
}

function checkKeysSettings(keyUp,keyDown,keyLeft,keyRight){
	showKeyErrorMessage(keyUp,"#errorKeyUp","Up");
	showKeyErrorMessage(keyDown,"#errorKeyDown","Down");
	showKeyErrorMessage(keyLeft,"#errorLeftKey","Left");
	showKeyErrorMessage(keyRight,"#rightKeyError","Right");
}

function showKeyErrorMessage(keyToCheck,rowId,direction){
	if(keyToCheck==""){
		$(rowId).css("display","block");
		validSettingsData=false;
		}
	else{
		keys[direction]=keyToCheck;
	}
}

function generateRandomSettings(){
	keys["Up"]="ArrowUp";
	keys["Down"]="ArrowDown";
	keys["Left"]="ArrowLeft";
	keys["Right"]="ArrowRight";
	timeOfGame=Math.floor(Math.random()*120)+60;
	monstersNumber=Math.floor(Math.random()*4)+1;
	ballsNumber=Math.floor(Math.random()*40)+50;
	ballsColors["5"]=getRandomColor();
	ballsColors["15"]=getRandomColor();
	ballsColors["25"]=getRandomColor();
	updateSettingsValues();
	}

	function getRandomColor() {
		let letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
		  color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	  }

function updateSettingsValues(){
	$("#keyUp").val("ArrowUp");
	$("#keyDown").val("ArrowDown");
	$("#keyLeft").val("ArrowLeft");
	$("#keyRight").val("ArrowRight");
	$("#numberOfBalls").val(ballsNumber.toString());
	$("#fivePointsColorPicker").val(ballsColors["5"]);
	$("#fifteenPointsColorPicker").val(ballsColors["15"]);
	$("#twentyFivePointsColorPicker").val(ballsColors["25"]);
	$("#gameTimeInput").val(timeOfGame.toString());
	$("#monstersPicker").val(monstersNumber.toString());
}

function generateBoard(){
	// init board
	for(let i=0;i<board.length;i++){
		board[i]=new Array(10);
		for(let j=0;j<board[i].length;j++){
			board[i][j]=1;
		}
	}
	sizeY=450 / board[0].length;
	let randomStartRow=Math.floor(Math.random()*board.length);
	let randomStartColumn=Math.floor(Math.random()*board[0].length);
	board[randomStartRow][randomStartColumn]=0;
	let numberOfFreeCells=1;
	let stack=[[randomStartRow,randomStartColumn]];
	while(stack.length!=0){
		let position=stack.pop();
		let currentRow=position[0];
		let currentColumn=position[1];
		let directions=createDirections();
		(function(){
		for(let i=0;i<directions.length;i++){
			switch (directions[i]) {
				case 1://up
					if(currentRow-2>-1 && board[currentRow-2][currentColumn]==1){
						board[currentRow-1][currentColumn]=0;
						board[currentRow-2][currentColumn]=0;
						numberOfFreeCells+=2;
						stack.push([currentRow,currentColumn]);
						stack.push([currentRow-2,currentColumn]);
						return;
					}
					break;

				case 2://down
					if(currentRow+2<board.length && board[currentRow+2][currentColumn]==1){
						board[currentRow+2][currentColumn]=0;
						board[currentRow+1][currentColumn]=0;
						numberOfFreeCells+=2;
						stack.push([currentRow,currentColumn]);
						stack.push([currentRow+2,currentColumn]);
						return;
					}
					break;

				case 3://left
					if(currentColumn-2>-1 && board[currentRow][currentColumn-2]==1){
						board[currentRow][currentColumn-2]=0;
						board[currentRow][currentColumn-1]=0;
						numberOfFreeCells+=2;
						stack.push([currentRow,currentColumn]);
						stack.push([currentRow,currentColumn-2]);
						return;
					}
					break;

				case 4://right
					if(currentColumn+2<board[0].length && board[currentRow][currentColumn+2]==1){
						board[currentRow][currentColumn+2]=0;
						board[currentRow][currentColumn+1]=0;
						numberOfFreeCells+=2;
						stack.push([currentRow,currentColumn]);
						stack.push([currentRow,currentColumn+2]);
						return;
					}
					break;

				default:
					break;
			}
		}
	})();
	}
	numberOfFreeCells=setCornersToFree(numberOfFreeCells);
	if(numberOfFreeCells<ballsNumber){
		let breaked=false;
		for(let i=0;i<board.length;i++){
			for(let j=0;j<board[0].length;j++){
				if(board[i][j]==1){
					board[i][j]=0;
					numberOfFreeCells++;
				}
				if(numberOfFreeCells==ballsNumber){
					breaked=true;
					break;
				}
			}
			if(breaked){
				break;
			}
		}
		
	}
	setBallsOnBoard();
	$("#settingsButton").css("display","none");
	$("#randomButton").css("display","none");
	
}

function setBallsOnBoard(){
	let numberOfFiveBalls=parseInt(ballsNumber*0.6);
	let numberOfFifteen=parseInt(ballsNumber*0.3);
	let numberOfTwentyFive=ballsNumber-numberOfFiveBalls-numberOfFifteen;
	let arrayOfCounters=[numberOfFiveBalls,numberOfFifteen,numberOfTwentyFive];
	let counter=ballsNumber;
	(function() {
		for(let i=0;i<board.length;i++){
		for(let j=0;j<board[0].length;j++){
			if(board[i][j]==0){
				let ball=Math.floor(Math.random()*3);
				while(arrayOfCounters[ball]==0){
					ball=Math.floor(Math.random()*3);
				}
				switch (ball) {
					case 0:
						board[i][j]=5;
						arrayOfCounters[0]--;
						counter--;
						break;
					case 1:
						board[i][j]=15;
						arrayOfCounters[1]--;
						counter--;
						break;
					case 2:
						board[i][j]=25;
						arrayOfCounters[2]--;
						counter--;
						break;	
					
				}
				if(counter==0){
					return;
				}
			}
		}
	}})();
}


function setCornersToFree(numberOfFreeCells){
	if(board[0][0]!=0){
		numberOfFreeCells++;
		board[0][0]=0;
		if(board[1][0]==1 && board[0][1]==1){
			board[1][0]=0;
			numberOfFreeCells++;
		}
	}
	if(board[0][board[0].length-1]!=0){
		board[0][board[0].length-1]=0;
		numberOfFreeCells++;
		if(board[1][board[0].length-1]==1 && board[0][board[0].length-2]==1){
			board[1][board[0].length-1]=0;
			numberOfFreeCells++;
		}
	}
	if(board[board.length-1][0]!=0){
		board[board.length-1][0]=0;
		numberOfFreeCells++;
		if(board[board.length-2][0]==1 && board[board.length-1][1]==1){
			board[board.length-1][1]=0;
			numberOfFreeCells;
		}
	}
	if(board[board.length-1][board[0].length-1]!=0){
		board[board.length-1][board[0].length-1]=0;
		numberOfFreeCells++;
		if(board[board.length-1][board[0].length-2]==1 && board[board.length-2][board[0].length-1]==1){
			board[board.length-2][board[0].length-1]=0;
			numberOfFreeCells++;
		}
	}
	return numberOfFreeCells;
}

function createDirections(){
	let directions=[1,2,3,4];
	for (let i = directions.length - 1; i > 0; i--) {//shuffle directions
        const j = Math.floor(Math.random() * (i + 1));
        [directions[i], directions[j]] = [directions[j], directions[i]];
    }
	return directions;
}

function startGame(){
	$("#userNameToShow").html(loggedUser);
	generateBoard();
	chooseRandomEmptyPoint();
	initCherry();
	initGhostPositions();
	initGhostsArr();
	intervalTimer = setInterval(main, 25); // Execute as fast as possible
	gameIntervals.push(intervalTimer);
	setGameTimer();
	
}

// terminate interval timer
function stopTimer()
{  
   	window.clearInterval( intervalTimer );
} 

function main(){
	if (angle > 0.188 || angle < 0.0001)
		swicthAngle *= -1;
	angle = swicthAngle * 0.02 + angle;

	drawMap();
	drawPacman();
	drawCherry();
	if (pacmanContact(cherryX, cherryY, 50, 40)){
		initCherry();
		increaseScore(50);
	}
	drawGhosts();
	changeGhostsLocations();

	
}

function drawCherry(){
	cherryX += cherrySpeedX;
	cherryY += cherrySpeedY;

	if (cherryX+50 > 900 || cherryX < 0)
		cherrySpeedX *= -1;
	
	if (cherryY+40 > 450 || cherryY < 0)
		cherrySpeedY *= -1;

	let img = new Image();
	img.src = "Img/cherry.png";
	ctx.drawImage(img, cherryX, cherryY, 50, 40);
}

function drawMap(){
	ctx.clearRect(0, 0, 900, 450);
	for(let x=0; x<board.length; x+=1){
		for(let y=0; y<board[0].length; y+=1){
			if (board[x][y] == 1){
				ctx.fillStyle = "black";
				ctx.fillRect(x*sizeX, y*sizeY, sizeX, sizeY);
			}
			else{
				ctx.fillStyle = "white";
				ctx.fillRect(x*sizeX, y*sizeY, sizeX, sizeY);
				if (board[x][y] != 0){
					// draw candy
					ctx.beginPath();
					ctx.fillStyle = ballsColors[board[x][y]];
					ctx.arc(x*sizeX + sizeX/2, y*sizeY + sizeY/2, radiusCandys[board[x][y]], 0, Math.PI*2);
					ctx.fill();					
				}
			}				
		}
	}
}

function drawPacman(){
	switch (pacDirection) {
		case "right":
			drawPacmanInDirection(0.2,1.8,pacX,pacY-10);
			break;
		
		case "left":
			drawPacmanInDirection(1.2,0.8,pacX,pacY-10);
			break;

		case "up":
			drawPacmanInDirection(1.7,1.3,pacX+10,pacY);
			break;
			
		case "down":
			drawPacmanInDirection(0.7,0.3,pacX-10,pacY);
			break;

		default:
			break;
	}
}

function drawPacmanInDirection(startAngle,endAngle,eyeX,eyeY){
	// An arc with an opening at the right for the mouth
	ctx.beginPath();
	ctx.arc(pacX, pacY, pacRadius, (startAngle-angle) * Math.PI, (endAngle+angle) * Math.PI, false);

	// The mouth
	// A line from the end of the arc to the centre
	ctx.lineTo(pacX, pacY);

	// A line from the centre of the arc to the start
	ctx.closePath();

	// Fill the pacman shape with yellow
	ctx.fillStyle = "yellow";
	ctx.fill();

	// Draw the black outline (optional)
	ctx.stroke();

	// Draw the eye
	ctx.beginPath();
	ctx.arc(eyeX, eyeY, 3, 0, 2 * Math.PI, false);
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fill();
}

document.addEventListener('keydown', function (event) {
	if (event.key === keys["Up"]) {
		pacDirection = "up";
		if (!(checkWall(pacX-pacRadius, pacY-pacSpeed-pacRadius) || checkWall(pacX+pacRadius, pacY-pacSpeed-pacRadius))){
			pacY -= pacSpeed;
			touchCandy();
		}
	}
	if (event.key === keys["Down"]) {
		pacDirection = "down";
		if (!(checkWall(pacX-pacRadius, pacY+pacSpeed+pacRadius) || checkWall(pacX+pacRadius, pacY+pacSpeed+pacRadius))){
			pacY += pacSpeed;
			touchCandy();
		}
	}
	if (event.key === keys["Left"]) {
		pacDirection = "left";
		if (!(checkWall(pacX-pacSpeed-pacRadius, pacY-pacRadius) || checkWall(pacX-pacSpeed-pacRadius, pacY+pacRadius))){
			pacX -= pacSpeed;
			touchCandy();
		}
	}
	if (event.key === keys["Right"]) {
		pacDirection = "right";
		if (!(checkWall(pacX+pacSpeed+pacRadius, pacY-pacRadius) || checkWall(pacX+pacSpeed+pacRadius, pacY+pacRadius))){
			pacX += pacSpeed;
			touchCandy();
		}
	}	
  });

function checkWall(x, y){
	if (x > 899 || x < 0)
		return true;
	if (y > 449 || y < 0)
		return true;
	if (board[Math.floor(x / 60)][Math.floor(y / 45)] == 1)
		return true;
	return false;
}

function touchCandy(){
	let i = Math.floor(pacX / sizeX);
	let j = Math.floor(pacY / sizeY);
	if (board[i][j] == 0 || board[i][j] == 1)
		return;
	
	if (pacmanContact(i*sizeX + sizeX/2, j*sizeY + sizeY/2, radiusCandys[board[i][j]]*2, radiusCandys[board[i][j]]*2)){
		increaseScore(board[i][j]);
		board[i][j] = 0;
		countCandy++;
	}
}

function pacmanContact(x, y, width, heigh){
	if (pacX - pacRadius < x && x < pacX + pacRadius)
		if (pacY - pacRadius < y && y < pacY + pacRadius)
			return true;

	if (pacX - pacRadius < x + width && x + width < pacX + pacRadius)
		if (pacY - pacRadius < y && y < pacY + pacRadius)
			return true;
		
	if (pacX - pacRadius < x && x < pacX + pacRadius)
		if (pacY - pacRadius < y + heigh && y + heigh < pacY + pacRadius)
			return true;
		
	if (pacX - pacRadius < x + width && x + width < pacX + pacRadius)
		if (pacY - pacRadius < y + heigh && y + heigh < pacY + pacRadius)
			return true;
		
	return false;
}

function chooseRandomEmptyPoint(){
	//choose random empty point for pacman at start of game
	let found = false;
	let position = [-1, -1];
	while (!found){
		position = [Math.floor(Math.random() * board.length), Math.floor(Math.random() * board[0].length)]
		if (board[position[0]][position[1]] != 1 && board[position[0]][position[1]]!=board[0][0] && board[position[0]][position[1]]!=board[0][board[0].length-1] && board[position[0]][position[1]]!=board[board.length-1][0]
			&& board[position[0]][position[1]]!=board[board.length-1][board[0].length-1])
		{
			found = true;
		}
	}
	pacX = position[0] * 60 + 30;
	pacY = position[1] * 45 + 22;
}

function initCherry(){
	//choose random point and direction start for the cherry
	cherryX = Math.floor(Math.random() * 800) + 50;
	cherryY = Math.floor(Math.random() * 400) + 25;

	
	let cherrySpeed = 5;
	if (Math.random() > 0.5)
		cherrySpeedX = cherrySpeed;
	else
		cherrySpeedX = -1 * cherrySpeed;

	if (Math.random() > 0.5)
		cherrySpeedY = cherrySpeed;
	else
		cherrySpeedY = -1 * cherrySpeed;
}

function initGhostPositions(){
	let directions=createDirections();
	for(let i=0;i<monstersNumber;i++){
		switch (directions[i]) {
			case 1:
				ghostsPositions[i]=[0,0];//top left corner
				break;
			case 2:
				ghostsPositions[i]= [0,sizeY*(board[0].length-1)];//bottom left corener	
				break;
			case 3:
				ghostsPositions[i]=[sizeX*(board.length-1),0];//top right corner
				break;
			case 4:
				ghostsPositions[i]=[(board.length-1)*sizeX,(board[0].length-1)*sizeY];//bottom right corner
				break;		
			default:
				break;
		}
	}
}

/**
 * This function sets the timer for game
 */
function setGameTimer(){
	$("#timeLabel").html(timeOfGame.toString());
	let timer=setInterval(function(){
		timeOfGame--;
		$("#timeLabel").html(timeOfGame.toString());
		if(timeOfGame>0 && timeOfGame<10){
			$("#timeLabel").css("color","red");
		}
		if(timeOfGame==0){
			clearInterval(timer);
		}
	},1000);
	gameIntervals.push(timer);
}

function initGhostsArr(){
	switch (monstersNumber) {
		case 1:
			ghostsArr.push("Img/ghost1.png");
			break;
			case 2:
				ghostsArr.push("Img/ghost1.png");
				ghostsArr.push("Img/ghost2.jpg");
				break;
			case 3:
				ghostsArr.push("Img/ghost1.png");
				ghostsArr.push("Img/ghost2.jpg");
				ghostsArr.push("Img/ghost3.jpg");
				break;
			case 4:
				ghostsArr.push("Img/ghost1.png");
				ghostsArr.push("Img/ghost2.jpg");
				ghostsArr.push("Img/ghost3.jpg");
				ghostsArr.push("Img/ghost4.jpg");
				break;		
		default:
			break;

	}
}

function drawGhosts(){
	for(let i=0;i<ghostsArr.length;i++){
		let image=new Image();
		image.src=ghostsArr[i];
		ctx.drawImage(image,ghostsPositions[i][0],ghostsPositions[i][1],50,40);
	}
}

function changeGhostsLocations(){
	for(let j=0;j<ghostsPositions.length;j++){
		let ghostX=ghostsPositions[j][0];
		let ghostY=ghostsPositions[j][1];
		originalManhatanDistance=Math.abs(ghostX-pacX)+Math.abs(ghostY-pacY);
		let directions=createDirections();
		let newPosition=[];
		(function(){
			for(let i=0;i<directions.length;i++){
				switch (directions[i]) {
					case 1://up
						if(decideIfGoInThisDirection(originalManhatanDistance,ghostX,ghostY-1)){
							newPosition= [ghostX,ghostY-1];
							return;
						}
						break;
					case 2://down
						if(decideIfGoInThisDirection(originalManhatanDistance,ghostX,ghostY+1)){
							newPosition= [ghostX,ghostY+1];
							return;
						}
						break;
					case 3://left
						if(decideIfGoInThisDirection(originalManhatanDistance,ghostX-1,ghostY)){
							newPosition= [ghostX-1,ghostY];
							return;
						}
						break;
					case 4://right
						if(decideIfGoInThisDirection(originalManhatanDistance,ghostX+1,ghostY)){
							newPosition=[ghostX+1,ghostY];
							return;
						}
						break;		
					default:
						break;
				}
			}
		}());
		if(newPosition.length!=0){
			ghostsPositions[j]=newPosition;
		}
		else{
			////////////////choose random direction
		}
	}
}

function decideIfGoInThisDirection(originalManhatanDistance,ghostX,ghostY){
	if(!checkWall(ghostX,ghostY)){
		newManhatanDistance=Math.abs(ghostX-pacX)+Math.abs(ghostY-pacY);
		if(newManhatanDistance<originalManhatanDistance){
			return true;
		}
	}
	return false;
}

function increaseScore(s){
	score += s;
	document.getElementById("scoreLabel").innerHTML = score;
}

function toDelete(){
	stopTimer();
	showSettings();
	generateRandomSettings();
	$("#gameDiv").css("display","block");
	startGame();
}