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
		}
	});
});
