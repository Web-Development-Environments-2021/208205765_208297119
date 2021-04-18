//usersDict : [userName] = [password, fullName, email, birthDate]
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
let pacSpeed = 10;
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
let ghostsArr;
let ghostWidth = 50;
let ghostHeigh = 40;
let ghostSpeed;
let ghostTarget = []
let ghostGoToCorner = [];
let countCandy = 0;
let radiusCandys = {5:12, 15:8, 25:4};
let backgroundSong=new Audio("Official-Anthem.wav");
let lives=5;
let medicationX;
let medicationY;
let strawberryX;
let strawberryY;
let medicationPosition = [];
let strawberryPosition = [];
let slowMotionTime = -500;
let bonusTime;
let bonusTimeTolive = 100*5;
let gameStopped=false;

$(function(){
	$.validator.addMethod("checkPassword",function(value,element){
		let containsLetters=false;
	let containDigits=false;
	for(let i=0;i<value.length;i++){//loop over password and check if contains letters or digits
		let asciiValue=value.charAt(i).charCodeAt(0);
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
		//showErrorMessage("#passwordRegError","Password must contain digits and letters");
		return false;
	}
	return true;
	});
})

$(function(){
	$.validator.addMethod("freeUserName",function(value,element){
		return !(value in usersDict);
	});
})


$(function(){
	$.validator.addMethod("checkName",function(value,element){
		for(let i=0;i<value.length;i++){
			let asciiValue=value.charAt(i).charCodeAt(0);
			if(asciiValue>=123 || asciiValue<=96){
				return false;
			}
		}
		return true;
	})
})

$(document).ready(function(){
	ctx=document.getElementById("myCanvas").getContext("2d");
	//$("#submitButton").click(validateDataAfterRegistretion);
	let slider=document.getElementById("ballsSlider");
	let ballsValue=document.getElementById("ballsValue");
	slider.oninput=function(){
		ballsValue.innerHTML=this.value;
	}
	let monstersSlider=document.getElementById("monstersSlider");
	let monstersValue=document.getElementById("monstersNumber");
	monstersSlider.oninput=function(){
		monstersValue.innerHTML=this.value;
	}
	window.addEventListener("keydown",function(event){
		if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Tab","Enter"].indexOf(event.code)>-1){
			event.preventDefault();
		}
	},false);
	$("#registerForm").validate({
		rules:{
			userName:{
				required:true,
				freeUserName:true
			},
			password:{
				required:true,
				checkPassword:true,
				minlength:6
			},
			fullName:{
				required:true,
				checkName:true
			},
			email:{
				required:true,
				email:true
			},
			birthDate:"required"
		},
		messages:{
			userName:{
				required:"Please enter user name",
				freeUserName:"Username isn't free"
			},
			password:{
				required:"Please enter password",
				checkPassword:"Password must contain at least 1 letter and 1 digit",
				minlength:"Password must be at least 6 chars"
			},
		fullName:{
			required:"Please enter full name",
			checkName:"full name must contain only letters"
		},
		email:{
			required:"Please enter email",
			email:"email isn't valid"
		},
		birthDate:"Please enter birth date"},
		submitHandler:function(form,event){
			let userName=$("#userName").val();
			let password=$("#password").val();
			let fullName=$("#fullName").val();
			let email=$("#email").val();
			let birthDate=$("#birthDate").val();
			usersDict[userName]=[password, fullName, email, birthDate];
			form.reset();
			showWelcomeScreen();
		}
	})

	});


function validateDetailsAfterLogIn(){
	let validLogIn=true;
	$(".errorFormRow").css("display","none");
	let userName=$('#LIuserName').val();
	if(userName==""){
		showErrorMessage("#errorLogInUsername","Empty user name");
		validLogIn=false;
	}
	
	let password=$("#LIpassword").val();
	if(password==""){
		showErrorMessage("#errorPasswordLogIn","Empty password");
		validLogIn=false;
	}

	if (!(userName in usersDict)){
		showErrorMessage("#errorLogInUsername","User name doesn't exist");
		validLogIn=false;
	}

	if (validLogIn && password == usersDict[userName][0]){
		loggedUser=userName;
		showSettings();
	}
	else{
		showErrorMessage("#errorPasswordLogIn","Password incorrect");
	}
}

function showErrorMessage(rowId,message){
	$(rowId).html(message);
	$(rowId).css("display","block");
}

function register(){
	$(".errorFormRow").css("display","none");
	document.getElementById("registerForm").reset();
	switchDivs("#outerRegisterDiv","flex");	
}

function logIn(){
	$(".errorFormRow").css("display","none");
	document.getElementById("logInForm").reset();
	switchDivs("#outerLogInDiv","flex");
}

function showWelcomeScreen(){
	switchDivs("#welcomeContainer","flex");
}

function showSettings(){
	document.getElementById("settingsForm").reset();
	changeSettingsReadOnlyPrperty(false);
	switchDivs("#gameAndSettingsDiv","flex");
	$("#settingsDiv").css("display","block");
	$("#gameDiv").css("display","none");
	$("#settingsButton").css("display","block");
	$("#randomButton").css("display","block");
	$("#monstersNumber").html("2");
	$("#ballsValue").html("2");
	document.getElementById("keyUp").placeholder="Press any key";
	document.getElementById("keyDown").placeholder="Press any key";
	document.getElementById("keyLeft").placeholder="Press any key";
	document.getElementById("keyRight").placeholder="Press any key";
	document.getElementById("gameTimeInput").placeholder="Min. 60 seconds";
	$(".explanationRow").css("display","none");
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
	backgroundSong.pause();
	backgroundSong.currentTime=0;
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
	let numberOfBalls=$("#ballsSlider").val();
	let fivePointsBallColor=$("#fivePointsColorPicker").val();
	let fifteenPointsColorPicker=$("#fifteenPointsColorPicker").val();
	let twentyFivePointsColorPicker=$("#twentyFivePointsColorPicker").val();
	let gameTime=$("#gameTimeInput").val();
	let numberOfMonsters=$("#monstersSlider").val();
	checkKeysSettings(keyup,keyDown,keyLeft,keyRight);
	if(checkSingleNumericValue(gameTime,60,0,"#gameTimeError","","Game time must be at least 60 seconds!")){
		timeOfGame=parseInt(gameTime);
	}
	if(validSettingsData){
		ballsColors["5"]=fivePointsBallColor;
		ballsColors["15"]=fifteenPointsColorPicker;
		ballsColors["25"]=twentyFivePointsColorPicker;
		ballsNumber=parseInt(numberOfBalls);
		monstersNumber=parseInt(numberOfMonsters);
		changeSettingsReadOnlyPrperty(true);
		$("#stopGameButton").css("display","inline");
		$("#resumeGameButton").css("display","inline");
		$(".explanationRow").css("display","block");
		startGame();
		$("#gameDiv").css("display","flex");
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
	$("#ballsSlider").val(ballsNumber.toString());
	$("#fivePointsColorPicker").val(ballsColors["5"]);
	$("#fifteenPointsColorPicker").val(ballsColors["15"]);
	$("#twentyFivePointsColorPicker").val(ballsColors["25"]);
	$("#gameTimeInput").val(timeOfGame.toString());
	$("#monstersSlider").val(monstersNumber.toString());
	document.getElementById("ballsValue").innerHTML=ballsNumber;
	document.getElementById("monstersNumber").innerHTML=monstersNumber;
}


function generateBoard(){
	// init board
	for(let i=0;i<board.length;i++){
		board[i]=new Array(10);
		for(let j=0;j<board[i].length;j++){
			board[i][j]=0;
		}
	}
	sizeY=450 / board[0].length;
	setWallsOnBoard();
	setBallsOnBoard();
	$("#settingsButton").css("display","none");
	$("#randomButton").css("display","none");
	
}

function setWallsOnBoard(){
	board[1][0]=1;
	board[2][0]=1;
	board[3][0]=1;
	board[2][1]=1;
	board[3][1]=1;
	board[5][1]=1;
	board[1][8]=1;
	board[1][9]=1;
	board[3][7]=1;
	board[3][8]=1;
	board[4][7]=1;
	board[4][8]=1;
	board[5][7]=1;
	board[5][8]=1;
	board[5][9]=1;
	board[7][0]=1;
	board[7][1]=1;
	board[8][0]=1;
	board[7][4]=1;
	board[7][5]=1;
	board[8][3]=1;
	board[8][4]=1;
	board[8][5]=1;
	board[8][6]=1;
	board[11][1]=1;
	board[12][1]=1;
	board[11][7]=1;
	board[11][8]=1;
	board[12][7]=1;
	board[12][8]=1;
}

function setBallsOnBoard(){
	let numberOfFiveBalls = parseInt(ballsNumber * 0.6);
	let numberOfFifteen = parseInt(ballsNumber * 0.3);
	let numberOfTwentyFive = ballsNumber - numberOfFiveBalls - numberOfFifteen;
	let arrayOfCounters = [numberOfFiveBalls, numberOfFifteen, numberOfTwentyFive];
	let counter = ballsNumber;
	let numToPrice = {0:5, 1:15, 2:25};
	(function() {
		while(counter > 0)
		{
			let i = Math.floor(Math.random()*board.length);
			let j = Math.floor(Math.random()*board[0].length);
			if(board[i][j]==0){
				let ball = Math.floor(Math.random()*3);
				while(arrayOfCounters[ball]==0){
					ball=Math.floor(Math.random()*3);
				}
				board[i][j] = numToPrice[ball];
				arrayOfCounters[ball]--;
				counter--;
			}
		}
	})();
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
	initParams();
	$("#scoreLabel").html("0");
	backgroundSong.loop=true;
	//backgroundSong.play();
	generateBoard();
	initPacmanPosition();
	initCherry();
	initGhostPositions();
	initGhostsArr();
	setGameIntervals();
	drawLives();
	initBonusPosition("medication");
}

function initParams(){
	countCandy=0;
	score=0;
	lives = 5;
	pacSpeed = 4;
	gameStopped=false;
	ghostSpeed = 1.5;
}

function setGameIntervals(){
	intervalTimer = setInterval(main, 25); // Execute as fast as possible
	gameIntervals.push(intervalTimer);
	setGameTimer();
	drawLives();
}

// terminate interval timer
function stopTimer()
{  
   	window.clearInterval( intervalTimer );
} 

function main(){
	drawMap();
	drawBonuses();
	drawCherry();	
	if (pacmanContact(cherryX+10, cherryY+5, 26, 22)){
		initCherry();
		changeScore(50);
	}

	movePacman()
	changeGhostsLocations();
	drawGhosts();
	drawPacman();
}

function setGameTimeLabel(){
	let minutes=0;
	let time=timeOfGame;
	while(time>=60){
		minutes++;
		time-=60;
	}
	if(time<10){
		$("#timeLabel").html("0"+minutes+":0"+time.toString());
	}
	else{
		$("#timeLabel").html("0"+minutes+":"+time.toString());
	}
	
}

function finishGame(){
	drawMap();
	drawBonuses();
	drawCherry();	

	drawGhosts();
	drawPacman();

	if(score<100){
		alert("You are better than "+score.toString()+" points!");
	}
	else{
		alert("Winner!!!");
	}
	$("#stopGameButton").css("display","none");
	$("#resumeGameButton").css("display","none");
}

function drawCherry(){
	cherryX += cherrySpeedX;
	cherryY += cherrySpeedY;

	if (cherryX+50 >= 900 || cherryX <= 0)
		cherrySpeedX *= -1;
	
	if (cherryY+40 >= 450 || cherryY <= 0)
		cherrySpeedY *= -1;

	let img = new Image();
	img.src = "Img/cherry.png";
	ctx.drawImage(img, cherryX, cherryY, 50, 40);
}

function initCherry(){
	/*//choose random point and direction start for the cherry
	cherryX = Math.floor(Math.random() * 800) + 50;
	cherryY = Math.floor(Math.random() * 400) + 25;
	let pythagorasDistance = Math.pow(Math.pow(cherryX - pacX, 2) + Math.pow(cherryY - pacY, 2), 0.5);

	while(pythagorasDistance < 100){
		cherryX = Math.floor(Math.random() * 800) + 50;
		cherryY = Math.floor(Math.random() * 400) + 25;
		pythagorasDistance = Math.pow(Math.pow(cherryX - pacX, 2) + Math.pow(cherryY - pacY, 2), 0.5);
	}*/
	cherryX = 900/2;
	cherryY = 450/2;

	let cherrySpeed = 5;
	if (Math.random() > 0.5)
		cherrySpeedX = cherrySpeed;
	else
		cherrySpeedX = -1 * cherrySpeed;

	if (Math.random() > 0.5)
		cherrySpeedY = cherrySpeed;
	else
		cherrySpeedY = -1 * cherrySpeed;
	drawCherry();
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
	
	//change size of the mouth.
	if (angle > 0.188 || angle < 0.0001)
		swicthAngle *= -1;
	angle = swicthAngle * 0.02 + angle;

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
	if (event.key === keys["Up"])
		pacDirection = "up";

	if (event.key === keys["Down"]) 
		pacDirection = "down";

	if (event.key === keys["Left"]) 
		pacDirection = "left";

	if (event.key === keys["Right"])
		pacDirection = "right";

	if(event.key=="Escape"){
		if(document.getElementById("modalDiv").style.display!="none"){
			closeAbout();
		}
	}
});

function movePacman(){
	let didMove = false;
	switch (pacDirection){
		case "up":
			if (!(checkWall(pacX-pacRadius, pacY-pacSpeed-pacRadius) || checkWall(pacX+pacRadius, pacY-pacSpeed-pacRadius))){
				pacY -= pacSpeed;
				didMove = true;
			}
			break;
		case "down":
			if (!(checkWall(pacX-pacRadius, pacY+pacSpeed+pacRadius) || checkWall(pacX+pacRadius, pacY+pacSpeed+pacRadius))){
				pacY += pacSpeed;
				didMove = true;
			}
			break;
		case "left":
			if (!(checkWall(pacX-pacSpeed-pacRadius, pacY-pacRadius) || checkWall(pacX-pacSpeed-pacRadius, pacY+pacRadius))){
				pacX -= pacSpeed;
				didMove = true;
			}
			break;
		case "right":
			if (!(checkWall(pacX+pacSpeed+pacRadius, pacY-pacRadius) || checkWall(pacX+pacSpeed+pacRadius, pacY+pacRadius))){
				pacX += pacSpeed;
				didMove = true;
			}
			break;
	}
	if (didMove)
		touchCandy();
}

window.addEventListener("keydown", function(event){
	if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Tab", "Enter"].indexOf(event.code)>-1){
		event.preventDefault();
	}
});

function checkWall(x, y){
	if (x >= 900 || x < 0)
		return true;
	if (y >= 450 || y < 0)
		return true;
	let i = Math.floor(x / 60);
	let j = Math.floor(y / 45);
	let wall = board[i][j];
	if (wall == 1)
		return true;
	return false;
}

function touchCandy(){
	let i = Math.floor(pacX / sizeX);
	let j = Math.floor(pacY / sizeY);
	if (board[i][j] == 0 || board[i][j] == 1)
		return;
	
	let thisRadiusCandys = radiusCandys[board[i][j]];
	if (pacmanContact(i*sizeX + sizeX/2 - thisRadiusCandys, j*sizeY + sizeY/2 - thisRadiusCandys, thisRadiusCandys*2, thisRadiusCandys*2)){
		changeScore(board[i][j]);
		board[i][j] = 0;
		countCandy++;
		if(countCandy==ballsNumber){
			stopGamesIntervals();
			finishGame();
		}
	}
}

function pacmanContact(x, y, width, heigh){
	// up - left
	if (pacX - pacRadius <= x && x <= pacX + pacRadius)
		if (pacY - pacRadius <= y && y <= pacY + pacRadius)
			return true;
	
	// up - right
	if (pacX - pacRadius <= x + width && x + width <= pacX + pacRadius)
		if (pacY - pacRadius <= y && y <= pacY + pacRadius)
			return true;
	
	// down - left
	if (pacX - pacRadius <= x && x <= pacX + pacRadius)
		if (pacY - pacRadius <= y + heigh && y + heigh <= pacY + pacRadius)
			return true;
	
	// down - right
	if (pacX - pacRadius <= x + width && x + width <= pacX + pacRadius)
		if (pacY - pacRadius <= y + heigh && y + heigh <= pacY + pacRadius)
			return true;
	
	// center - left
	if (pacX - pacRadius <= x && x <= pacX + pacRadius)
		if (pacY - pacRadius <= y + heigh/2 && y + heigh/2 <= pacY + pacRadius)
			return true;
	
	// center - right
	if (pacX - pacRadius <= x + width && x + width <= pacX + pacRadius)
		if (pacY - pacRadius <= y + heigh/2 && y + heigh/2 <= pacY + pacRadius)
			return true;
	
	// center - down
	if (pacX - pacRadius <= x + width/2 && x + width/2 <= pacX + pacRadius)
		if (pacY - pacRadius <= y + heigh && y + heigh <= pacY + pacRadius)
			return true;
	
	// center - up
	if (pacX - pacRadius <= x + width/2 && x + width/2 <= pacX + pacRadius)
		if (pacY - pacRadius <= y + heigh && y + heigh <= pacY + pacRadius)
			return true;
	
	// center
	if (pacX - pacRadius <= x + width/2 && x + width/2 <= pacX + pacRadius)
		if (pacY - pacRadius <= y + heigh/2 && y + heigh/2 <= pacY + pacRadius)
			return true;
		
	return false;
}

function initPacmanPosition(){
	//choose random empty point for pacman at start of game that not in the edges of the bord.
	let found = false;
	let i = -1;
	let j = -1;
	while (!found){
		i = Math.floor(Math.random() * board.length);
		j = Math.floor(Math.random() * board[0].length);
		if (board[i][j] != 1 && (i != 0 && j != 0) && (i != board.length-1 && j != 0) && (i != board.length-1 && j != board[0].length-1) && (i != 0 && j != board[0].length-1))
			found = true;
	}
	pacX = i * 60 + 30;
	pacY = j * 45 + 22;
}

function initBonusPosition(what){
	//choose random empty point for the bonuses.
	let found = false;
	let i = -1;
	let j = -1;
	while (!found){
		i = Math.floor(Math.random() * board.length);
		j = Math.floor(Math.random() * board[0].length);
		if (board[i][j] != 1)
			found = true;
	}
	if (what == "medication"){
		medicationX = i * 60;
		medicationY = j * 45;
		bonusTime = bonusTimeTolive;
	}
	if (what == "strawberry"){
		strawberryX = i * 60;
		strawberryY = j * 45;
		bonusTime = bonusTimeTolive * 2;
	}
}

function drawBonuses(){
	if (bonusTime <= bonusTimeTolive){
		let img = new Image();
		img.src = "Img/drug.jpg";
		ctx.drawImage(img, medicationX, medicationY, 50, 40);
		
		if (pacmanContact(medicationX, medicationY, 50, 40)){
			changeLives(1);
			initBonusPosition("strawberry");
			pacSpeed++;
		}
	}
	else{
		let img = new Image();
		img.src = "Img/strawberry.png";
		ctx.drawImage(img, strawberryX, strawberryY, 50, 40);
		
		if (pacmanContact(strawberryX, strawberryY, 50, 40)){
			initBonusPosition("medication");
			ghostSpeed = 1;
			slowMotionTime = 150;
		}
	}
	if (bonusTime <= 0){
		initBonusPosition("strawberry");
	}
	if (slowMotionTime > 0)
		slowMotionTime--;
	if (slowMotionTime == 0){
		slowMotionTime = -500;
		ghostSpeed = 1.5;
	}
	bonusTime--;
}

function initGhostPositions(){
	let directions=createDirections();
	for(let i=0;i<monstersNumber;i++){
		switch (directions[i]) {
			case 1:
				ghostsPositions[i] = [0,0];//top left corner
				ghostTarget.push([0, 0]);
				ghostGoToCorner.push(false);
				break;
			case 2:
				ghostsPositions[i] = [0,sizeY*(board[0].length-1)];//bottom left corener
				ghostTarget.push([0,sizeY*(board[0].length-1)]);
				ghostGoToCorner.push(false);
				break;
			case 3:
				ghostsPositions[i] = [sizeX*(board.length-1),0];//top right corner
				ghostTarget.push([sizeX*(board.length-1),0]);
				ghostGoToCorner.push(false);
				break;
			case 4:
				ghostsPositions[i] = [(board.length-1)*sizeX,(board[0].length-1)*sizeY];//bottom right corner
				ghostTarget.push([(board.length-1)*sizeX,(board[0].length-1)*sizeY]);
				ghostGoToCorner.push(false);
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
	setGameTimeLabel();
	$("#timeLabel").css("color","black");
	let timer=setInterval(function(){
		timeOfGame--;
		setGameTimeLabel();
		if(timeOfGame>0 && timeOfGame<10){
			$("#timeLabel").css("color","red");
		}
		if(timeOfGame==0){
			setGameTimeLabel();
			stopGamesIntervals();
			finishGame();
		}
	},1000);
	gameIntervals.push(timer);
}

function setGameTimeLabel(){
	let minutes=0;
	let time=timeOfGame;
	while(time>=60){
		minutes++;
		time-=60;
	}
	if(time<10){
		$("#timeLabel").html("0"+minutes+":0"+time.toString());
	}
	else{
		$("#timeLabel").html("0"+minutes+":"+time.toString());
	}
	
}

function initGhostsArr(){
	ghostsArr = [];
	switch (monstersNumber) {
		case 1:
			ghostsArr.push("Img/ghost1.png");
			break;
			case 2:
				ghostsArr.push("Img/ghost1.png");
				ghostsArr.push("Img/ghost2.png");
				break;
			case 3:
				ghostsArr.push("Img/ghost1.png");
				ghostsArr.push("Img/ghost2.png");
				ghostsArr.push("Img/ghost3.png");
				break;
			case 4:
				ghostsArr.push("Img/ghost1.png");
				ghostsArr.push("Img/ghost2.png");
				ghostsArr.push("Img/ghost3.png");
				ghostsArr.push("Img/ghost4.png");
				break;		
		default:
			break;

	}
}

function drawGhosts(){
	for(let i=0;i<ghostsArr.length;i++){
		let image=new Image();
		image.src=ghostsArr[i];
		ctx.drawImage(image, ghostsPositions[i][0], ghostsPositions[i][1], ghostWidth, ghostHeigh);
	}
}

function goToCorner(x){
	if (ghostGoToCorner[x]){
		for (let j=0; j<ghostsArr.length; j++){
			if (j != x){
				let dist = Math.pow(Math.pow(ghostsPositions[j][0] - ghostsPositions[x][0], 2) + Math.pow(ghostsPositions[j][1] - ghostsPositions[x][1], 2), 0.5);
				if (dist < 150){
					return;
				}
			}
		}
		ghostGoToCorner[x] = false;
		return;
	}
	for (let j=0; j<ghostsArr.length; j++){
		if (j != x && !ghostGoToCorner[j]){
			let dist = Math.pow(Math.pow(ghostsPositions[j][0] - ghostsPositions[x][0], 2) + Math.pow(ghostsPositions[j][1] - ghostsPositions[x][1], 2), 0.5);
			if (dist < 45){
				ghostGoToCorner[x] = true;
				return;
			}
		}
	}
}

function changeGhostsLocations(){
	for(let j=0;j<ghostsArr.length;j++){
		let ghostX=ghostsPositions[j][0];
		let ghostY=ghostsPositions[j][1];
		let availableDirectionsX = [];
		let availableDirectionsY = [];
		let newDist = 1;
		let minX = ghostX;
		let minY = ghostY;
		let bestDistanceX = 99999999999;
		let bestDistanceY = 99999999999;
		let changed=false;

		goToCorner(j)
		let demoPacX;
		let demoPacY;
		if (ghostGoToCorner[j]){
			demoPacX = ghostTarget[j][0];
			demoPacY = ghostTarget[j][1];
		}
		else{
			demoPacX = pacX - pacRadius;
			demoPacY = pacY - pacRadius;			
		}

		/*// make sure the ghost won't go together.
		if (j < 2){
			if (Math.abs(ghostX - demoPacX) > 40){
				if (j == 0)
					demoPacX -= 30;
				if (j == 1)
					demoPacX += 30;
			}
		}
		else{
			if (Math.abs(ghostY - demoPacY) > 40){
				if (j == 2)
					demoPacY -= 30;
				if (j == 3)
					demoPacY += 30;
			}
		}*/

		//check available directions.
		if (!(checkWall(ghostX, ghostY-ghostSpeed) || checkWall(ghostX+ghostWidth, ghostY-ghostSpeed)))
			availableDirectionsY.push("up");
		if (!(checkWall(ghostX, ghostY+ghostSpeed+ghostHeigh) || checkWall(ghostX+ghostWidth, ghostY+ghostSpeed+ghostHeigh)))
			availableDirectionsY.push("down");
		if (!(checkWall(ghostX-ghostSpeed, ghostY) || checkWall(ghostX-ghostSpeed, ghostY+ghostHeigh)))
			availableDirectionsX.push("left");
		if (!(checkWall(ghostX+ghostSpeed+ghostWidth, ghostY) || checkWall(ghostX+ghostSpeed+ghostWidth, ghostY+ghostHeigh)))
			availableDirectionsX.push("right");

		for(let i=0;i<availableDirectionsY.length;i++){
			switch (availableDirectionsY[i]){
				case "up":
					newDist = Math.abs(ghostY-ghostSpeed-demoPacY);
					if (newDist < bestDistanceY){
						minY = ghostY - ghostSpeed;
						bestDistanceY = newDist;
						changed=true;
					}
					break;
				case "down":
					newDist = Math.abs(ghostY+ghostSpeed-demoPacY);
					if (newDist < bestDistanceY){
						minY = ghostY + ghostSpeed;
						bestDistanceY = newDist;
						changed=true;
					}
					break;
				default:
					break;
			}
		}

		for(let i=0;i<availableDirectionsX.length;i++){
			switch (availableDirectionsX[i]){
				case "left":
					newDist = Math.abs(ghostX-ghostSpeed-demoPacX);
					if (newDist < bestDistanceX){
						minX = ghostX - ghostSpeed;
						bestDistanceX = newDist;
						changed=true;
					}
					break;
				case "right":
					newDist = Math.abs(ghostX+ghostSpeed-demoPacX);
					if (newDist < bestDistanceX){
						minX = ghostX + ghostSpeed;
						bestDistanceX = newDist;
						changed=true;
					}
					break;
				default:
					break;
			}
		}
		ghostsPositions[j] = [minX, minY];
		if (pacmanContact(minX, minY, ghostWidth, ghostHeigh)){
			changeScore(-10);
			let gameFinished=changeLives(-1);
			if(!gameFinished){
				initPacmanPosition();
			initGhostPositions();
			initGhostsArr();
			if (bonusTime > bonusTimeTolive)
				initBonusPosition("strawberry");
			else
				initBonusPosition("medication");
		}
			}
			
	}
}

function changeScore(s){
	// change the score of the game by s
	score += s;
	document.getElementById("scoreLabel").innerHTML = score;
}

function changeLives(num){
	lives += num;
	drawLives();
	if(lives==0){
		stopGamesIntervals();
		$("#stopGameButton").css("display","none");
		$("#resumeGameButton").css("display","none");
		alert("Loser!");
		return true;
	}
	return false;
}

function drawLives(){
	$("#livesDiv").html("");
	for(let i=0;i<lives;i++){
		let img=new Image(20,30);
		img.src="Img/live.png";
		img.className="liveImage";
		document.getElementById("livesDiv").appendChild(img);
	}
}

function aboutScreen(){
	if(currentDisplayedDiv=="#gameAndSettingsDiv"){
		if(document.getElementById("gameDiv").style.display!="none"){
			stopGamesIntervals();
		}
	}
	$("#modalDiv").css("display","block");
}

function closeAbout(){
	if(currentDisplayedDiv=="#gameAndSettingsDiv"){
		if(document.getElementById("gameDiv").style.display!="none" && !gameStopped){
			setGameIntervals();
		}
	}
	$("#modalDiv").css("display","none");
}

window.onclick=function(event){
	if(event.target==document.getElementById("modalDiv")){
		closeAbout();
	}
}



function stopGame(){
	stopGamesIntervals();
	gameStopped=true;
}

function resumeGame(){
	if(gameStopped){
		setGameIntervals();
		gameStopped=false;
	}
}

function changeSettingsReadOnlyPrperty(addReadOnly){
	if(addReadOnly){
		let gameAndSettingsDiv=document.getElementById("gameAndSettingsDiv");
		gameAndSettingsDiv.style.removeProperty("justify-content");
		gameAndSettingsDiv.style.removeProperty("align-items");
	}
	else{
		$("#gameAndSettingsDiv").css("justify-content","center");
		$("#gameAndSettingsDiv").css("align-items","center");
	}
	document.getElementById("keyUp").disabled=addReadOnly;
	document.getElementById("keyDown").disabled=addReadOnly;
	document.getElementById("keyLeft").disabled=addReadOnly;
	document.getElementById("keyRight").disabled=addReadOnly;
	document.getElementById("fivePointsColorPicker").disabled=addReadOnly;
	document.getElementById("fifteenPointsColorPicker").disabled=addReadOnly;
	document.getElementById("twentyFivePointsColorPicker").disabled=addReadOnly;
	document.getElementById("gameTimeInput").readOnly=addReadOnly;
	document.getElementById("ballsSlider").disabled=addReadOnly;
	document.getElementById("monstersSlider").disabled=addReadOnly;
}

function toDelete(){
	stopTimer();
	showSettings();
	generateRandomSettings();
	$("#gameDiv").css("display","block");
	startGame();
}