/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0*/
"use strict";

$.import("system.xsjs", "session");
var SESSIONINFO = $.system.xsjs.session;

/**
@param {connection} Connection - The SQL connection used in the OData request
@param {beforeTableName} String - The name of a temporary table with the single entry before the operation (UPDATE and DELETE events only)
@param {afterTableName} String -The name of a temporary table with the single entry after the operation (CREATE and UPDATE events only)
*/
function partnerCreate(param) {
	
	try {
		$.session.assertAppPrivilege("createPartners");
		var after = param.afterTableName;

		//Get Input New Record Values
		var pStmt = param.connection.prepareStatement("select * from \"" + after + "\"");
		var rs = null;
		var partner = SESSIONINFO.recordSetToJSON(pStmt.executeQuery(), "Details");
		pStmt.close();
        console.log(JSON.stringify(partner));  
        console.log(partner.Details[0].NAME);

		//Get Next Personnel Number
		pStmt = param.connection.prepareStatement("select \"partnerId\".NEXTVAL from dummy");
		var rs = pStmt.executeQuery();
		var partnerID = "";
		while (rs.next()) {
			partnerID = rs.getString(1);
		} 
		pStmt.close();
		
		pStmt = param.connection.prepareStatement("insert into \"Partners.Partners\" " +
													"(\"PARTNERID\", \"NAME\", \"EMAIL\", \"ADDRESSID\") " +
													"values(?,?,?,?)");
		var formattedPartnerID = SESSIONINFO.padWithZeroes(partnerID, 10);
		pStmt.setString(1, formattedPartnerID.toString());
		pStmt.setString(2, partner.Details[0].NAME.toString());
		pStmt.setString(3, partner.Details[0].EMAIL.toString());

		pStmt.executeUpdate();
		pStmt.close();
		
		/*pStmt = param.connection.prepareStatement("update \"" + after + "\" set partnerID = ?" );
		pStmt.setString(1, formattedpartnerID);
    	pStmt.executeUpdate();
    	pStmt.close();*/

	} catch (e) {
		console.error(e);
		throw e;
	}
	
}