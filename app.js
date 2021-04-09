
let usersDict={"k":["k","","",""]};
let currentDisplayedDiv="#welcomeContainer";

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
		alert("Please fill the password field");
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
		alert("Please refill the full name again");
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
		if(asciiValue>=48 && asciiValue<=57){
			return false;
		}
	}
	return true;
}

function register(){
	switchDivs("#registerDiv","block");	
}

function showWelcomeScreen(){
	switchDivs("#welcomeContainer","flex");
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
