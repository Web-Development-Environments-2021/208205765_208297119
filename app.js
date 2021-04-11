
let usersDict={"k":["k", "", "", ""]};
let currentDisplayedDiv="#welcomeContainer";
let keys={"Up":"","Down":"","Left":"","Right":""};
let validSettingsData=true;
let ballsNumber=0;
let timeOfGame=0;
let monstersNumber=0;
let ballsColors={};
let board=new Array(15);



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
	$(currentDisplayedDiv).css("display","none");
	currentDisplayedDiv=newDivToSwitchTo;
	$(newDivToSwitchTo).css("display",display);
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
		$("#gameDiv").css("display","flex");
		createGame();
	}
}

function checkNumericValuesSettings(numberOfBalls,gameTime,numberOfMonsters){
	if(checkSingleNumericValue(numberOfBalls,50,90,"#errorBallsNumber","Number of balls must be a number","Number of balls must be between 50 to 90")){
		ballsNumber=parseInt(numberOfBalls);
	}
	if(checkSingleNumericValue(gameTime,60,0,"#gameTimeError","Game time must be at least 60 seconds!","")){
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

function createGame(){
	generateBoard();
}

function generateBoard(){
	// init board
	for(let i=0;i<board.length;i++){
		board[i]=new Array(10);
		for(let j=0;j<board[i].length;j++){
			board[i][j]=1;
		}
	}
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
	drowMap();
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

function drowMap(){
	let c = document.getElementById("myCanvas");
	let ctx = c.getContext("2d");
	let sizeX = 900 / board.length;
	let sizeY = 450 / board[0].length;

	ctx.clearRect(0, 0, 900, 450);
	for(let x=0; x<board.length; x+=1){
		for(let y=0; y<board[0].length; y+=1){
			if (board[x][y] == 1){
				ctx.fillStyle = "black";
				ctx.fillRect(x*sizeX, y*sizeY, sizeX, sizeY);
			}
			else{
				if (board[x][y] == 0){
					ctx.fillStyle = "white";
					ctx.fillRect(x*sizeX, y*sizeY, sizeX, sizeY);
				}				
				else{
					// draw candy
					ctx.beginPath();
					ctx.fillStyle = ballsColors[board[x][y]];
					ctx.arc(x*sizeX + sizeX/2, y*sizeY + sizeY/2, 7.5, 0, Math.PI*2);
					ctx.fill();
				}
			}			
					
		}
	}
}