/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0, no-undef: 0*/
//To use a javascript controller its name must end with .controller.js
sap.ui.define([
	"initView/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("initView.controller.App", {

/*Triggered when the page first loads. Sets the config model and sets some more properties in the model*/
		onInit: function() {
			var oConfig = this.getOwnerComponent().getModel("config");
			var userName = oConfig.getProperty("/UserName");
			
			var procedureUrl = "/xsjs/CustomerProjects.xsjs?partnerId=";
			
			this.getOwnerComponent().getModel().setProperty("/procedureUrl", procedureUrl);
			this.getOwnerComponent().getModel().setProperty("/partnerID", "0000000001");
			
			this.getOwnerComponent().getModel().setProperty("/partnerIDCreate", "0000000001");
			this.getOwnerComponent().getModel().setProperty("/projectNameCreate", "New Project online");
			this.getOwnerComponent().getModel().setProperty("/startDateCreate", "2018-12-21");
			this.getOwnerComponent().getModel().setProperty("/plannedDaysCreate", 30);
			
		},
		
		callProcedure: function(){
			var procedureUrl = this.getOwnerComponent().getModel().getProperty("/procedureUrl");
			var partnerID = this.getOwnerComponent().getModel().getProperty("/partnerID");
			
			procedureUrl += partnerID;
			
			var responseText = JSON.parse(jQuery.ajax({
											url: procedureUrl,
											method: "GET",
											dataType: "json",
											async: false
										}).responseText);
			
			var aColumnData = [{
        			columnId: "PROJECTREQUESTID",
        			description: "Project ID"
    			}, {
        			columnId: "PROJECTNAME",
        			description: "Name"
    			}, {
        			columnId: "PARTNER",
        			description: "Partner ID"
    			}, {
        			columnId: "STARTDATE",
        			description: "Start Date"
    			}, {
        			columnId: "PLANNEDDAYS",
        			description: "Planned Days"
    			}, {
        			columnId: "ENDDATE",
        			description: "End Date"
    			}];

			
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
        		columns: aColumnData,
        		rows: responseText.ET_PARTNER_REQUESTS
    		});
    		
    		var oTable = this.getView().byId("tblProjects");
    		oTable.setModel(oModel);

    		oTable.bindAggregation("columns", "/columns", function(index, context) {
        		return new sap.m.Column({
            		header: new sap.m.Label({text: context.getObject().description})
        		});
    		});

    		oTable.bindItems("/rows", function(index, context) {
        		var obj = context.getObject();
        		var row = new sap.m.ColumnListItem();

        		for(var k in obj) {
        			row.addCell(new sap.m.Text({text : obj[k]}));
        		}

        		return row;
    		});
		},
		createProject: function(){
			
		}
	});
});
