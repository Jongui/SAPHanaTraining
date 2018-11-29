/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0*/
"use strict";

$.import("projects.xsjs", "session");
var SESSIONINFO = $.projects.xsjs.session;

/**
@param {connection} Connection - The SQL connection used in the OData request
@param {beforeTableName} String - The name of a temporary table with the single entry before the operation (UPDATE and DELETE events only)
@param {afterTableName} String -The name of a temporary table with the single entry after the operation (CREATE and UPDATE events only)
*/
function projectCreate(param) {

	try {
		var after = param.afterTableName;

		//Get Input New Record Values
		var pStmt = param.connection.prepareStatement("select * from \"" + after + "\"");
		var rs = null;
		var User = SESSIONINFO.recordSetToJSON(pStmt.executeQuery(), "Details");
		pStmt.close();
        console.log(JSON.stringify(User));  
        console.log(User.Details[0].PROJECTNAME);

		//Get Next Personnel Number
		pStmt = param.connection.prepareStatement("select \"projectRequestId\".NEXTVAL from dummy");
		var rs = pStmt.executeQuery();
		var projectRequestID = "";
		while (rs.next()) {
			projectRequestID = rs.getString(1);
		} 
		pStmt.close();
		pStmt = param.connection.prepareStatement("insert into \"ProjectsRequests.ProjectRequest\" " +
													"(\"PROJECTREQUESTID\", \"PROJECTNAME\", \"PARTNER\", \"STARTDATE\", \"PLANNEDDAYS\") " +
													"values(?,?,?,?,?)");
		var formattedRequestID = pad_with_zeroes(projectRequestID, 10);
		pStmt.setString(1, formattedRequestID.toString());
		pStmt.setString(2, User.Details[0].PROJECTNAME.toString());
		pStmt.setString(3, User.Details[0].PARTNER.toString());
		pStmt.setString(4, User.Details[0].STARTDATE.toString());
		pStmt.setString(5, User.Details[0].PLANNEDDAYS.toString());

		pStmt.executeUpdate();
		pStmt.close();

	} catch (e) {
		console.error(e);
		throw e;
	}
}



function pad_with_zeroes(number, length) {
    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }
    return my_string;
}