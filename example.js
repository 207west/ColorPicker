$(function () {
	var $wells = $(".well");
	cpTopLeft = new ColorPicker({ 
		target: $wells.eq(0), 
		property: "background-color", 
		trigger: "click" 
	});
	cpTopMiddle = new ColorPicker({ 
		target: $wells.eq(1), 
		property: "background-color", 
		trigger: "click" 
	});
	cpTopRight = new ColorPicker({ 
		target: $wells.eq(2), 
		property: "background-color", 
		trigger: "click" 
	});
	cpLeftMiddle = new ColorPicker({ 
		target: $wells.eq(3), 
		property: "background-color", 
		trigger: "click" 
	});
	cpMiddle = new ColorPicker({ 
		target: $wells.eq(4), 
		property: "background-color", 
		trigger: "click" 
	});
	cpRightMiddle = new ColorPicker({ 
		target: $wells.eq(5), 
		property: "background-color", 
		trigger: "click" 
	});
	cpBottomLeft = new ColorPicker({ 
		target: $wells.eq(6), 
		property: "background-color", 
		trigger: "click" 
	});
	cpBottomMiddle = new ColorPicker({ 
		target: $wells.eq(7), 
		property: "background-color", 
		trigger: "click" 
	});
	cpBottomRight = new ColorPicker({ 
		target: $wells.eq(8), 
		property: "background-color", 
		trigger: "click" 
	});

	console.log("done");
});