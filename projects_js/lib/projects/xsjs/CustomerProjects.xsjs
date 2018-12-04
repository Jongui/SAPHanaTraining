/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0*/
"use strict";
function callProcedure(partnerId){
	var connection = $.hdb.getConnection();
	var getCustomerProjects = connection.loadProcedure( 
		"get_customer_projects_requests");
	var results = getCustomerProjects(partnerId);
//Pass output to response		
	$.response.status = $.net.http.OK;
	$.response.contentType = "application/json";
	$.response.setBody(JSON.stringify(results));
}
try {
	$.session.assertAppPrivilege("createProjects");
	var aCmd = $.request.parameters.get("cmd");
	var partnerId = $.request.parameters.get("partnerId");
	callProcedure(partnerId);
} catch (e) {
	console.error(e);
	throw e;
}