
let usersDict={"k":["k","","",""]};
let currentDisplayedDiv="#welcomeContainer";
let keys={"Up":"","Down":"","Left":"","Right":""};
let validSettingsData=true;
let ballsNumber=0;
let timeOfGame=0;
let monstersNumber=0;
let ballsColors={};


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
	usersDict[userName]=[password,fullName,email,birthDate];
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
	if(userName=="k"){
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
		document.getElementById("demo").innerHTML = "Tomerrrr";
		//start game here TODO
	}
	else{
		alert("User name or password are incorrect");
		return;
	}
}

function register(){
	switchDivs("#registerDiv","block");	
}

function logIn(){
	switchDivs("#logInDiv","block");
}

function showWelcomeScreen(){
	switchDivs("#welcomeContainer","flex");
}

function showSettings(){
	$("#gameAndSettingsDiv").css("display","flex");
	$("#settingsDiv").css("display","block");
	$(currentDisplayedDiv).css("display","none");
	currentDisplayedDiv="#settingsDiv";
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
	timeOfGame=60;
	monstersNumber=3;
	ballsNumber=60;
	ballsColors["5"]="red";
	ballsColors["15"]="blue;"
	ballsColors["25"]="green";
	updateSettingsValues();
	$("#gameDiv").css("display","flex");
}

function updateSettingsValues(){
	$("#keyUp").val("ArrowUp");
	$("#keyDown").val("ArrowDown");
	$("#keyLeft").val("ArrowLeft");
	$("#keyRight").val("ArrowRight");
	$("#numberOfBalls").val("60");
	$("#fivePointsColorPicker").val("#FF0000");
	$("#fifteenPointsColorPicker").val("#0040FF");
	$("#twentyFivePointsColorPicker").val("#00FF08");
	$("#gameTimeInput").val("60");
	$("#monstersPicker").val("60");
}

