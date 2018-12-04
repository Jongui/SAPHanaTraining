/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0*/
"use strict";

function fillSessionInfo(){
	var body = "";
	body = JSON.stringify({
		"session" : [{"UserName": $.session.getUsername(), "Language": $.session.language}]
	});
	$.response.contentType = "application/json";
	$.response.setBody(body);
	$.response.status = $.net.http.OK; 
}

function scopeCheck(scope){
	var body = "";
	try {
		$.session.assertAppPrivilege(scope);
		body = JSON.stringify({
			scope: true
		});
	} catch(e){
		body = JSON.stringify({
			scope: false
		});
	}
	$.response.contentType = "application/json";
	$.response.setBody(body);
	$.response.status = $.net.http.OK; 
}

var aCmd = $.request.parameters.get("cmd");
switch (aCmd) {
case "getSessionInfo":
	fillSessionInfo();
	break;
case "viewPartners":
	scopeCheck(aCmd);
	break;
case "createPartners":
	scopeCheck(aCmd);
	break;
default:
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	$.response.setBody("Invalid Request Method");
}