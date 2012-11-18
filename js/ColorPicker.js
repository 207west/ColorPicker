(function () {
    var rgbaWhite = [255, 255, 255, 1.0],
        $window = $(this),
        $document = $(document),
        template = '<div class="color-picker-overlay hide"></div>' + 
                    '<div class="color-picker hide">' +
                        '<div class="color-picker-arrow"></div>' +
                        '<div class="color-sample-wrap box-wrap">' +
                            '<div class="color-sample box"></div>' +
                        '</div>' +
                        '<a href="#" class="close">&times;</a>' +
                        '<div class="color-box-wrap box-wrap">' +
                            '<div class="color-box box">' +
                                '<div class="color-box-overlay"></div>' +
                                '<div class="color-box-handle"><div class="color-box-handle-inner"></div></div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="box-wrap hue-slider-wrap">' +
                            '<div class="box hue-slider"><div class="hue-slider-handle"></div></div>' +
                        '</div>' +
                        '<div class="btn-wrap">' +
                            '<a href="#" class="btn btn-inverse btn-cancel">Cancel</a>' +
                            '<a href="#" class="btn btn-primary btn-save">Save</a>' +
                        '</div>' +
                   '</div>';

    this.ColorPicker = function (config) {
        var that = this;
        
        this.$el = null;
        this.$overlay = null;
        this.$cancel = null;
        this.$save = null;
        this.$close = null;

        this.property = config.property || "background-color";
        this.lastColor = null;
        this.color = new Color();

        this.init(config);
    };

    ColorPicker.prototype = {
        init: function (config) {
            var that = this,
                $template = $(template),
                $target = config.target,
                targetColor = "",
                $thisEl = this.$el = $template.filter(".color-picker").appendTo($("body"));

            this.$overlay = $template.filter(".color-picker-overlay").appendTo($("body"));

            this.$cancel = $thisEl.find(".btn-cancel");
            this.$save = $thisEl.find(".btn-save");
            this.$close = $thisEl.find(".close");

            this.target = new ColorPicker.Target({
                $el: $target || null,
                property: config.property
            });

            targetColor = this.target.getColor();
            this.lastColor = new Color(targetColor);
            this.setColor(targetColor);

            this.colorBox = new ColorPicker.ColorBox({
                $el: $thisEl.find(".color-box"),
                $handle: $thisEl.find(".color-box-handle"),
                parent: this
            });

            this.colorSample = new ColorPicker.ColorSample({
                $el: $thisEl.find(".color-sample"),
                parent: this
            });

            this.hueSlider = new ColorPicker.HueSlider({
                $el: $thisEl.find(".hue-slider"),
                $handle: $thisEl.find(".hue-slider-handle"),
                parent: this
            });

            if (config.trigger) {
                $target.on(config.trigger, function () { that.show.call(that) });
            }

            this.positionAtStart();
        },
        setupEvents: function () {
            var that = this,
                colorBox = this.colorBox,
                hueSlider = this.hueSlider,

                windowMouseDown = function (event) {
                    var colorBoxOffset = colorBox.$el.offset(),
                        hueSliderOffset = hueSlider.$el.offset(),
                        colorBoxRelativeX = event.pageX - colorBoxOffset.left,
                        colorBoxRelativeY = event.pageY - colorBoxOffset.top,
                        hueSliderRelativeX = event.pageX - hueSliderOffset.left,
                        hueSliderRelativeY = event.pageY - hueSliderOffset.top;

                    // setup the events only if the first click is within the colorbox region
                    if (colorBoxRelativeX > colorBox.minX && colorBoxRelativeX < colorBox.maxX && colorBoxRelativeY > colorBox.minY && colorBoxRelativeY < colorBox.maxY) {
                        colorBox.setHandlePosition(colorBoxRelativeX, colorBoxRelativeY);
                        that.setColor({ hsv: [hueSlider.hue, colorBox.saturation, colorBox.brightness] });

                        $window.on("mousemove.colorPicker", function (event) {
                            var relativeX = event.pageX - colorBoxOffset.left,
                                relativeY = event.pageY - colorBoxOffset.top;

                            colorBox.setHandlePosition(relativeX, relativeY);
                            that.setColor({ hsv: [hueSlider.hue, colorBox.saturation, colorBox.brightness]})
                        });
                    } else if (hueSliderRelativeY > hueSlider.minY && hueSliderRelativeY < hueSlider.maxY && hueSliderRelativeX > hueSlider.minX && hueSliderRelativeX < hueSlider.maxX) {
                        hueSlider.setHandlePosition(hueSliderRelativeY);
                        that.setColor({ hsv: [hueSlider.hue, colorBox.saturation, colorBox.brightness] });

                        $window.on("mousemove.colorPicker", function (event) {
                            var relativeX = event.pageX - hueSliderOffset.left,
                                relativeY = event.pageY - hueSliderOffset.top;

                            hueSlider.setHandlePosition(relativeY);
                            that.setColor({ hsv: [hueSlider.hue, colorBox.saturation, colorBox.brightness] })
                        });
                    }
                },
                windowMouseUp = function (event) {
                    $window.off("mousemove.colorPicker");
                },
                closeColorPicker = function () {
                    that.hide(); 
                    return false;
                },
                cancelAndCloseColorPicker = function () {
                    that.setColor(that.lastColor);
                    that.hide();
                    return false;
                },
                saveAndCloseColorPicker = function () {
                    that.lastColor = new Color(that.color);
                    that.hide();
                    return false;
                };

            // events

            $window.on({
                "mousedown.colorPicker": windowMouseDown,
                "mouseup.colorPicker": windowMouseUp
            });
            
            //$document.on("selectstart.colorPicker", function () { return false; });

            this.$cancel.on({
                "click.colorPicker": cancelAndCloseColorPicker,
                "mouseenter.colorPicker": function () { 
                    that.showColor(that.lastColor); 
                },
                "mouseleave.colorPicker": function () { 
                    that.showColor(that.color); 
                }
            });
            this.$close.on("click.colorPicker", closeColorPicker);
            this.$overlay.on("click.colorPicker", closeColorPicker);
            this.$save.on("click.colorPicker", saveAndCloseColorPicker);
        },
        teardownEvents: function () {
            $window.off(".colorPicker");
            $(document).off(".colorPicker");
            this.$cancel.off(".colorPicker");
            this.$close.off(".colorPicker");
            this.$overlay.off(".colorPicker");
            this.$save.off(".colorPicker");
        },
        show: function () {
            this.setupEvents();
            this.positionByTarget();
            this.$el.removeClass("hide");
            this.$overlay.removeClass("hide");
            this.target.$el.addClass("active");
            this.target.init();
        },
        hide: function () {
            var that = this;
            
            this.teardownEvents();
            this.$el.addClass("hide");
            this.$overlay.addClass("hide");
            this.target.$el.removeClass("active");
            this.target.destroy();
        },
        positionAtStart: function () {
            this.$el.css({
                "left": -this.$el.outerWidth()
            }).off(".colorPickerOut");
        },
        positionByTarget: function () {
            var targetEl = this.target.$el,
                targetElOffset = targetEl.offset(),
                targetElOffsetLeft = targetElOffset.left,
                targetElOffsetTop = targetElOffset.top,
                targetElWidth = targetEl.width(),
                targetElHeight = targetEl.outerHeight(),
                targetOverflowsTop = targetElOffsetTop < 0,
                targetOverflowsBottom = targetElOffsetTop + targetElHeight > $window.height(),
                thisEl = this.$el,
                thisElOffset = thisEl.offset(),
                thisElOffsetTop = thisElOffset.top
                thisElWidth = thisEl.outerWidth(),
                thisElHeight = thisEl.outerHeight(),
                spaceOnLeft = targetElOffsetLeft,
                spaceOnRight = $window.width() - (targetElOffsetLeft + targetElWidth),
                spaceOnTop = targetElOffsetTop,
                spaceOnBottom = $window.height() - (targetElOffsetTop + targetElHeight),
                finalLeft = 0,
                finalTop = Math.round(targetElOffset.top + (targetEl.outerHeight() / 2) - (this.$el.outerHeight() / 2)),
                pickerOverflowsTop = finalTop < 0,
                pickerOverflowsBottom = finalTop + thisElHeight > $window.height(),
                transformOrigin = "transform-left";

            if (spaceOnRight >= spaceOnLeft) {
                // positioned right of target
                finalLeft = Math.round(targetElOffsetLeft + targetElWidth + 10);
            } else {
                // positioned left of the target
                finalLeft = Math.round(targetElOffsetLeft - thisElWidth - 10);
                transformOrigin = "transform-right";
            }

            if (pickerOverflowsTop) {
                if (targetOverflowsTop) {

                } else {
                    finalTop = targetElOffsetTop;
                    transformOrigin = (spaceOnRight >= spaceOnLeft) ? "transform-top-left" : "transform-top-right";
                }
            } else if (pickerOverflowsBottom) {
                if (targetOverflowsBottom) {

                } else {
                    finalTop = targetElOffsetTop + targetElHeight - thisElHeight;
                    transformOrigin = (spaceOnRight >= spaceOnLeft) ? "transform-bottom-left" : "transform-bottom-right";
                }
            }

            this.$el.css({
                "top": finalTop,
                "left": finalLeft
            }).addClass(transformOrigin);
        },
        setColor: function (color) {
            this.color.set(color);
            this.target.setColor(this.color.getRgba());
        },
        getColor: function () {
            return { hsv: [this.hueSlider.hue, this.colorBox.saturation, this.colorBox.brightness] };
        },
        showColor: function (color) {
            this.colorBox.setHandlePosition(color);
            this.colorBox.setHue(color.getHsv()[0]);
            this.hueSlider.setHandlePosition(color);
            this.colorSample.setColor(color.getRgba());
            this.target.setColor(color.getRgba());
        }
    };

    ColorPicker.Target = function (config) {
        this.property = config.property;
        this.$el = config.$el;
        this.init();
    };

    ColorPicker.Target.prototype = {
        init: function () {
            this.$el.addClass("color-picker-target");
        },
        destroy: function () {
            this.$el.removeClass("color-picker-target");
        },
        setColor: function (rgba) {
            this.$el.css(this.property, "rgba(" + rgba.join(",") + ")"); 
        },
        getColor: function () {
            return this.$el.css(this.property);
        }
    };

    ColorPicker.ColorSample = function (config) {
        this.parent = config.parent;
        this.$el = config.$el || null;

        this.setColor(this.parent.color.getRgba());
    } 

    ColorPicker.ColorSample.prototype = {
        setColor: function (rgba) {
            this.$el.css("background-color", "rgba(" + rgba.join(",") + ")");
        }
    };

    ColorPicker.ColorBox = function (config) {
        this.$el = config.$el || null;
        this.$handle = config.$handle || null;
        this.parent = config.parent;
        this.center = [128, 128];
        this.position = [];
        this.maxY = 0;
        this.minY = 0;
        this.maxX = 0;
        this.minX = 0;
        this.centerOffset = 0;
        this.saturation = 0;
        this.brightness = 0;
        this.mouseover = false;

        this.init();
    };

    ColorPicker.ColorBox.prototype = {
        init: function () {
            var that = this,
                elHeight = this.$el.height(),                 
                elWidth = this.$el.width(),                    
                handleHeight = this.$handle.outerHeight(true),
                handleWidth = this.$handle.outerWidth(true);

            this.minX = 0;
            this.minY = 0
            // use height and width - 1 because the height and width are 256, and we want 255
            this.maxY = (elHeight - 1);
            this.maxX = (elWidth - 1);
            this.centerOffset = (handleHeight / 2);

            var hsv = this.parent.color.getHsv();
            this.saturation = hsv[1];
            this.brightness = hsv[2];
            this.setHandlePosition(this.parent.color);
            this.setHue(hsv[0]);
        },
        setHandlePosition: function (x, y) {
            if (y !== undefined) {
                // x and y are coordinates
                var actualY = (y < this.minY ? this.minY : (y > this.maxY ? this.maxY : y)),
                    actualX = (x < this.minX ? this.minX : (x > this.maxX ? this.maxX : x)),
                    colorY = 255 - actualY,
                    colorX = actualX,
                    hue = this.parent.hueSlider.hue,
                    saturation = colorX / 255,
                    brightness = colorY / 255,
                    hsv = this.parent.color.getHsv(),
                    rgba = [];

                this.saturation = saturation;
                this.brightness = brightness;
                this.position = [actualX, actualY];

                this.$handle.css({
                    top: actualY - this.centerOffset,
                    left: actualX - this.centerOffset
                });

                this.parent.colorSample.setColor(new Color({ hsv: [hue, saturation, brightness] }).getRgba());
            } else {
                // x is a Color
                var hsv = x.getHsv(),
                    colorX = hsv[1] * 255,
                    colorY = (1 - hsv[2]) * 255;
                
                this.$handle.css({
                    top: colorY - this.centerOffset,
                    left: colorX - this.centerOffset
                });
            }
        },
        setHue: function (h) {
            var hsv = [h, 1, 1],
                colorBoxRgba = Color.hsvToRgba(hsv);

            this.$el.css("background-color", "rgba(" + colorBoxRgba.join(",") + ")");
        }
    };

    ColorPicker.HueSlider = function (config) {
        this.parent = config.parent;
        this.$el = config.$el || null;
        this.$handle = config.$handle || null;
        this.minX = 0;
        this.maxX = 0;
        this.minY = 0;
        this.maxY = 0;
        this.hue = 0;
        this.position = [];

        this.init();
    };

    ColorPicker.HueSlider.prototype = {
        init: function () {
            var that = this
              , elHeight = this.$el.height()
              , elWidth = this.$el.width()
              , handleHeight = this.$handle.outerHeight(true)
              , handleWidth = this.$handle.outerWidth(true);

            this.minY = 0;
            this.maxY = (elHeight - 1);
            this.minX = elWidth - handleWidth;
            this.maxX = (elWidth - 1);

            this.setHandlePosition(this.parent.color);
        },
        setHandlePosition: function (y) {
            var actualY, // y after it is restricted to the colorbox's area OR after it is converted from a hue
                hsv,
                parentColorHsv = this.parent.color.getHsv();
            
            if (!_.has(y, "rgba")) { // y is the y coordinate
                actualY = (y < this.minY ? this.minY : (y > this.maxY ? this.maxY : y));
                this.hue = 1 - (actualY / this.maxY);
            } else { // y is a Color
                hsv = y.getHsv();
                this.hue = hsv[0];
                actualY = (1 - this.hue) * this.maxY;
            }
            this.position = [actualY];
            this.$handle.css({
                top: actualY - 1 // -1 because 1px top border of handle 
            });

            this.parent.colorBox.setHue(this.hue);
            this.parent.colorSample.setColor((new Color({ hsv: [this.hue, parentColorHsv[1], parentColorHsv[2]] })).getRgba());
        }
    };
}).call(this);