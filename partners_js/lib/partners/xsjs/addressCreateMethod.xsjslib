/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0*/
"use strict";

$.import("partners.xsjs", "session");
var SESSIONINFO = $.partners.xsjs.session;

/**
@param {connection} Connection - The SQL connection used in the OData request
@param {beforeTableName} String - The name of a temporary table with the single entry before the operation (UPDATE and DELETE events only)
@param {afterTableName} String -The name of a temporary table with the single entry after the operation (CREATE and UPDATE events only)
*/
function addressCreate(param) {

	try {
		var after = param.afterTableName;

		//Get Input New Record Values
		var pStmt = param.connection.prepareStatement("select * from \"" + after + "\"");
		var rs = null;
		var address = SESSIONINFO.recordSetToJSON(pStmt.executeQuery(), "Details");
		pStmt.close();
        console.log(JSON.stringify(address));  
        console.log(address.Details[0].PROJECTNAME);

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
		var formattedAddressID = pad_with_zeroes(addressID, 10);
		pStmt.setString(1, formattedAddressID.toString());
		pStmt.setString(2, address.Details[0].STREET.toString());
		pStmt.setString(3, address.Details[0].NUMBER.toString());
		pStmt.setString(4, address.Details[0].COUNTRY.toString());

		pStmt.executeUpdate();
		pStmt.close();
		
		/*pStmt = param.connection.prepareStatement("update \"" + after + "\" set ADDRESSID = ?" );
		pStmt.setString(1, formattedAddressID);
    	pStmt.executeUpdate();
    	pStmt.close();*/

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