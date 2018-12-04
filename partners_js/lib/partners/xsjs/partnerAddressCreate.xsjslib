/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0*/
"use strict";

$.import("partners.xsjs", "session");
var SESSIONINFO = $.partners.xsjs.session;

function partnerAddressCreate(param){
	
	
	try {
		$.session.assertAppPrivilege("createPartners");
		var after = param.afterTableName;

		//Get Input New Record Values
		var pStmt = param.connection.prepareStatement("select * from \"" + after + "\"");
		var rs = null;
		var partnerAddress = SESSIONINFO.recordSetToJSON(pStmt.executeQuery(), "Details");
		pStmt.close();
        console.log(JSON.stringify(partnerAddress));

		//Get Next Personnel Number
		pStmt = param.connection.prepareStatement("select \"addressId\".NEXTVAL from dummy");
		var rs = pStmt.executeQuery();
		var addressID = "";
		while (rs.next()) {
			addressID = rs.getString(1);
		} 
		pStmt.close();
		pStmt = param.connection.prepareStatement("insert into \"Partners.Addresses\" " +
													"(\"ADDRESSID\", \"STREET\", \"NUMBER\", \"COUNTRY\") " +
													"values(?,?,?,?)");
		var formattedAddressID = SESSIONINFO.padWithZeroes(addressID, 10);
		pStmt.setString(1, formattedAddressID.toString());
		pStmt.setString(2, partnerAddress.Details[0].STREET.toString());
		pStmt.setString(3, partnerAddress.Details[0].NUMBER.toString());
		pStmt.setString(4, partnerAddress.Details[0].COUNTRY.toString());

		pStmt.executeUpdate();
		pStmt.close();
		
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
		pStmt.setString(2, partnerAddress.Details[0].NAME.toString());
		pStmt.setString(3, partnerAddress.Details[0].EMAIL.toString());
		pStmt.setString(4, formattedAddressID.toString());

		pStmt.executeUpdate();
		pStmt.close();

	} catch (e) {
		console.error(e);
		throw e;
	}

}