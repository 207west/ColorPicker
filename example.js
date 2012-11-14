(function () {

	var that = this;

	$(function () {
		"use strict";

		var $wells = $(".well");
		that.cpTopLeft = new ColorPicker({ 
			target: $wells.eq(0), 
			property: "background-color", 
			trigger: "click" 
		});
		that.cpTopMiddle = new ColorPicker({ 
			target: $wells.eq(1), 
			property: "background-color", 
			trigger: "click" 
		});
		that.cpTopRight = new ColorPicker({ 
			target: $wells.eq(2), 
			property: "background-color", 
			trigger: "click" 
		});
		that.cpLeftMiddle = new ColorPicker({ 
			target: $wells.eq(3), 
			property: "background-color", 
			trigger: "click" 
		});
		that.cpMiddle = new ColorPicker({ 
			target: $wells.eq(4), 
			property: "background-color", 
			trigger: "click" 
		});
		that.cpRightMiddle = new ColorPicker({ 
			target: $wells.eq(5), 
			property: "background-color", 
			trigger: "click" 
		});
		that.cpBottomLeft = new ColorPicker({ 
			target: $wells.eq(6), 
			property: "background-color", 
			trigger: "click" 
		});
		that.cpBottomMiddle = new ColorPicker({ 
			target: $wells.eq(7), 
			property: "background-color", 
			trigger: "click" 
		});
		that.cpBottomRight = new ColorPicker({ 
			target: $wells.eq(8), 
			property: "background-color", 
			trigger: "click" 
		});
	});

}).call(this);

