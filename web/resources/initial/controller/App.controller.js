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
			
			var procedureUrl = "projects/xsjs/CustomerProjects.xsjs?partnerId=";
			
			this.getOwnerComponent().getModel().setProperty("/procedureUrl", procedureUrl);
			this.getOwnerComponent().getModel().setProperty("/partnerID", "0000000001");
			
			this.getOwnerComponent().getModel().setProperty("/partnerIDCreate", "0000000001");
			this.getOwnerComponent().getModel().setProperty("/projectNameCreate", "New Project online");
			this.getOwnerComponent().getModel().setProperty("/startDateCreate", "2018-12-21");
			this.getOwnerComponent().getModel().setProperty("/plannedDaysCreate", 30);
			
			this.loadAllPartners();
			
		},
		
		onErrorCall: function(oError) {
			if (oError.statusCode === 500 || oError.statusCode === 400 || oError.statusCode === "500" || oError.statusCode === "400") {
				var errorRes = JSON.parse(oError.responseText);
				if (!errorRes.error.innererror) {
					sap.m.MessageBox.alert(errorRes.error.message.value);
				} else {
					if (!errorRes.error.innererror.message) {
						sap.m.MessageBox.alert(errorRes.error.innererror.toString());
					} else {
						sap.m.MessageBox.alert(errorRes.error.innererror.message);
					}
				}
				return;
			} else {
				sap.m.MessageBox.alert(oError.response.statusText);
				return;
			}
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
        			if(k === "STARTDATE" || k === "ENDDATE"){
        				var dateFormatFrom = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" });
        				var dateFormatTo = sap.ui.core.format.DateFormat.getDateInstance({pattern : "dd-MM-yyyy" });
        				var dateStr = obj[k];
        				var parsedDate = new Date(dateFormatFrom.parse(dateStr).getTime());
        				dateStr = dateFormatTo.format(parsedDate);
        				row.addCell(new sap.m.Text({text : dateStr}));
        			} else {
        				row.addCell(new sap.m.Text({text : obj[k]}));	
        			}
        		}

        		return row;
    		});
		},
		
		createProject: function(){
			var dateFormatFrom = sap.ui.core.format.DateFormat.getDateInstance({pattern : "dd-MM-yyyy" });
        	var dateFormatTo = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" });
			
			var partnerIDCreate = this.getOwnerComponent().getModel().getProperty("/partnerIDCreate");
			var projectNameCreate = this.getOwnerComponent().getModel().getProperty("/projectNameCreate");
			var startDateCreate = this.getOwnerComponent().getModel().getProperty("/startDateCreate");
			var plannedDaysCreate = this.getOwnerComponent().getModel().getProperty("/plannedDaysCreate");
			var TZOffsetMs = new Date(0).getTimezoneOffset()*60*1000;
			var parsedDate = new Date(dateFormatFrom.parse(startDateCreate).getTime() - TZOffsetMs);
			
			var oModel = this.getOwnerComponent().getModel("projectModel");
			var result = this.getView().getModel().getData();
			var oEntry = {};
			oEntry.PROJECTREQUESTID = "0000000001";
			oEntry.PROJECTNAME = projectNameCreate;
			oEntry.PARTNER = partnerIDCreate;
			oEntry.STARTDATE = parsedDate;
			oEntry.PLANNEDDAYS = plannedDaysCreate;
			
			oModel.setHeaders({
				"content-type": "application/json;charset=utf-8"
			});
			var mParams = {};
			mParams.success = function() {
				sap.m.MessageToast.show("Create successful");
			};
			mParams.error = this.onErrorCall;
			oModel.create("/ProjectsRequests", oEntry, mParams);

		},
		loadAllPartners: function(){
			
			var oTable = this.getView().byId("tblPartners");
			var columnList = new sap.m.ColumnListItem();
			var oModel = new sap.ui.model.odata.ODataModel("/partners/xsodata/PartnersAddress.xsodata/", true); 
			sap.ui.getCore().setModel(oModel, "partnerModel"); 
			
			var oMeta = sap.ui.getCore().getModel("partnerModel").getServiceMetadata();
			
			for ( var i = 0; i < oMeta.dataServices.schema[0].entityType[0].property.length; i++) {
				var property = oMeta.dataServices.schema[0].entityType[0].property[i];
                oTable.addColumn(new sap.m.Column({
                    header: new sap.m.Label({
                        text: property.name
                    }),
                    width: "125px"
                }));
                columnList.addCell(new sap.m.Text({
                    text: {
                        path: "partnerModel>"+property.name
                    },
                    name: property.name
                }));
			}
			var sort1 = new sap.ui.model.Sorter("NAME"); 
			oTable.bindItems({path: "partnerModel>/PartnersAddress", template: columnList, sorter: sort1 }); 
		}
	});
});
