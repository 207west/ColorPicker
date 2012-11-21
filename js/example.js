(function () {

	var that = this;

	$(function () {
		"use strict";

		var $wells = $(".well");
		that.cpTopLeft = new ColorPicker({ 
			target: $wells.eq(0), 
			property: "background-color", 
			triggerEvent: "click" 
		});
		that.cpTopMiddle = new ColorPicker({ 
			target: $wells.eq(1), 
			property: "background-color", 
			triggerEvent: "click" 
		});
		that.cpTopRight = new ColorPicker({ 
			target: $wells.eq(2), 
			property: "background-color", 
			triggerEvent: "click" 
		});
		that.cpLeftMiddle = new ColorPicker({ 
			target: $wells.eq(3), 
			property: "background-color", 
			triggerEvent: "click" 
		});
		that.cpMiddle = new ColorPicker({ 
			target: $wells.eq(4), 
			property: "background-color", 
			triggerEvent: "click" 
		});
		// that.cpRightMiddle = new ColorPicker({ 
		// 	target: $wells.eq(5), 
		// 	property: "background-color", 
		// 	triggerEvent: "click" 
		// });
		that.cpBottomLeft = new ColorPicker({ 
			target: $wells.eq(6), 
			property: "background-color", 
			triggerEvent: "click" 
		});
		that.cpBottomMiddle = new ColorPicker({ 
			target: $wells.eq(7), 
			property: "background-color", 
			triggerEvent: "click" 
		});
		that.cpBottomRight = new ColorPicker({ 
			target: $wells.eq(8), 
			property: "background-color", 
			triggerEvent: "click" 
		});
		that.lnkTest = new ColorPicker({
			target: $("#lnkTest"),
			property: "color",
			triggerEvent: "click"
		});
		that.lnkWell6 = new ColorPicker({
			target: $("#well6"),
			property: "background-color",
			trigger: $("#lnkWell6"),
			triggerEvent: "click"
		});
		that.lnkWell4 = new ColorPicker({
			target: $("#well4"),
			property: "background-color",
			trigger: $("#lnkWell4"),
			triggerEvent: "click"
		});
	});

}).call(this);

