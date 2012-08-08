(function () {
    var rgbaWhite = [255, 255, 255, 1.0],
        $window = $(this),
        $document = $(document),
        counter = this.colorPickerCounter || 0,
        template = '<div class="color-picker-overlay hide"></div>' + 
                    '<div class="color-picker hide">' +
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
        this.lastColor = new Color(config.rgba);
        this.color = new Color(config.rgba);

        counter++;

        this.init(config);
    };

    ColorPicker.prototype = {
        init: function (config) {
            this.colorBox.parent = this.hueSlider.parent = this;

            this.target = {
                parent: this,
                $el: config.target || null,
                init: function () {
                    this.$el.addClass("color-picker-target");
                },
                destroy: function () {
                    this.$el.removeClass("color-picker-target");
                },
                setColor: function (rgba) {
                    this.$el.css(this.parent.property, "rgba(" + rgba.join(",") + ")"); 
                }
            }

            var that = this;
                $template = $(template),
                $target = this.target.$el;

            if (config.trigger) {
                $target.on(config.trigger, function () { that.show.call(that) });
            }

            this.$el = $template.filter(".color-picker");
            this.$el.appendTo($("body"));

            this.colorSample.$el = this.$el.find(".color-sample");

            this.positionAtStart();

            this.$overlay = $template.filter(".color-picker-overlay");
            this.$overlay.appendTo($("body"));

            this.$cancel = this.$el.find(".btn-cancel");
            this.$save = this.$el.find(".btn-save");
            this.$close = this.$el.find(".close");

            this.lastColor.set($target.css(this.property));
            this.color.set($target.css(this.property));

            this.colorBox.$el = this.$el.find(".color-box");
            this.colorBox.$handle = this.$el.find(".color-box-handle");
            this.colorBox.init();

            this.hueSlider.$el = this.$el.find(".hue-slider");
            this.hueSlider.$handle = this.$el.find(".hue-slider-handle");
            this.hueSlider.init();
        },
        setupEvents: function () {
            var that = this,
                colorBox = this.colorBox,
                hueSlider = this.hueSlider;

            $window.on({
                "mousedown.colorPicker": function (event) {
                    var colorBoxRelativeX = event.pageX - colorBox.$el.offset().left,
                        colorBoxRelativeY = event.pageY - colorBox.$el.offset().top,
                        hueSliderRelativeX = event.pageX - hueSlider.$el.offset().left,
                        hueSliderRelativeY = event.pageY - hueSlider.$el.offset().top;

                    // setup the events only if the first click is within the colorbox region
                    if (colorBoxRelativeX > colorBox.minX && colorBoxRelativeX < colorBox.maxX && colorBoxRelativeY > colorBox.minY && colorBoxRelativeY < colorBox.maxY) {
                        colorBox.setHandlePosition(colorBoxRelativeX, colorBoxRelativeY);

                        $window.on("mousemove.colorPicker", function (event) {
                            var relativeX = event.pageX - colorBox.$el.offset().left,
                                relativeY = event.pageY - colorBox.$el.offset().top;

                            colorBox.setHandlePosition(relativeX, relativeY);
                        });
                    } else if (hueSliderRelativeY > hueSlider.minY && hueSliderRelativeY < hueSlider.maxY && hueSliderRelativeX > hueSlider.minX && hueSliderRelativeX < hueSlider.maxX) {
                        hueSlider.setHandlePosition(hueSliderRelativeY);

                        $window.on("mousemove.colorPicker", function (event) {
                            var relativeX = event.pageX - hueSlider.$el.offset().left,
                                relativeY = event.pageY - hueSlider.$el.offset().top;

                            hueSlider.setHandlePosition(relativeY);
                        });
                    }
                },
                "mouseup.colorPicker": function () {
                    $window.off("mousemove.colorPicker");
                }
            });
            
            $document.on("selectstart.colorPicker", function () { return false; });

            this.$cancel.on({
                "click.colorPicker": function () { that.hide(); return false; },
                "mouseenter.colorPicker": function () { that.showColor(that.lastColor); },
                "mouseleave.colorPicker": function () { that.showColor(that.color); }
            });
            this.$close.on("click.colorPicker", function () { that.hide(); return false; });
            this.$overlay.on("click.colorPicker", function () { that.hide(); return false; });
        },
        teardownEvents: function () {
            $window.off(".colorPicker");
            $document.off(".colorPicker");
            this.$cancel.off(".colorPicker");
            this.$close.off(".colorPicker");
            this.$overlay.off(".colorPicker");
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

            // this.$el.on({
            //     "webkitTransitionEnd.colorPickerOut": function () { that.positionAtStart(); }, // webkit
            //     "oTransitionEnd.colorPickerOut": function () { that.positionAtStart(); },      // opera
            //     "MSTransitionEnd.colorPickerOut": function () { that.positionAtStart(); },     // ie
            //     "transitionend.colorPickerOut": function () { that.positionAtStart(); }        // firefox
            // });
        },
        positionAtStart: function () {
            this.$el.css({
                "left": -this.$el.outerWidth(true)
            }).off(".colorPickerOut");
        },
        positionByTarget: function () {
            var targetEl = this.target.$el,
                targetElOffset = targetEl.offset();
            this.$el.css({
                "top": Math.ceil(targetElOffset.top - ((this.$el.outerHeight(true) / 2) - (targetEl.outerHeight(true) / 2))),
                "left": Math.ceil(targetElOffset.left + targetEl.width() + 10)
            });
        },
        setColor: function () {

        },
        showColor: function (color) {
            this.colorBox.setHandlePosition(color);
            this.hueSlider.setHandlePosition(color);
            this.colorSample.setColor(color.getRgba());
        },
        colorSample: {
            parent: null,
            $el: null,
            setColor: function (rgba) {
                this.$el.css("background-color", "rgba(" + rgba.join(",") + ")");
            }
        },
        colorBox: {
            parent: null,
            $el: null,
            $handle: null,
            center: [128, 128],
            position: [],
            maxY: 0,
            minY: 0,
            maxX: 0,
            minX: 0,
            centerOffset: 0,
            saturation: 0,
            brightness: 0,
            mouseover: false,
            init: function () {
                var that = this
                  , elHeight = this.$el.height()                    
                  , elWidth = this.$el.width()                      
                  , handleHeight = this.$handle.outerHeight(true)
                  , handleWidth = this.$handle.outerWidth(true);

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
            },
            setHandlePosition: function (x, y) {
                if (y !== undefined) {
                    // x and y are coordinates
                    var actualY = (y < this.minY ? this.minY : (y > this.maxY ? this.maxY : y))
                      , actualX = (x < this.minX ? this.minX : (x > this.maxX ? this.maxX : x))
                      , colorY = 255 - actualY
                      , colorX = actualX
                      , hue = this.parent.hueSlider.hue
                      , saturation = colorX / 255
                      , brightness = colorY / 255
                      , hsv = this.parent.color.getHsv()
                      , rgba = [];

                    this.saturation = saturation;
                    this.brightness = brightness;
                    this.position = [actualX, actualY];

                    this.$handle.css({
                        top: actualY - this.centerOffset,
                        left: actualX - this.centerOffset
                    });

                    if (!_.isEqual(hsv, [hue, saturation, brightness])) {
                        rgba = this.parent.color.set({ hsv: [hue, saturation, brightness] }).getRgba();
                        this.parent.target.setColor(rgba);
                        this.parent.colorSample.setColor(rgba);
                    }
                } else {
                    // x is a Color
                    var hsv = x.getHsv()
                      , colorX = hsv[1] * 255
                      , colorY = (1 - hsv[2]) * 255;

                    this.$handle.css({
                        top: colorY - this.centerOffset,
                        left: colorX - this.centerOffset
                    });
                }
            },
            setHue: function (h) {
                var hsv = [h, this.saturation, this.brightness];

                if (!_.isEqual(this.parent.color.getHsv(), hsv)) {
                    var colorBoxRgba = this.parent.color.hsvToRgba([h, 1, 1])
                      , targetRgba = this.parent.color.set({ hsv: hsv }).getRgba();
                    this.$el.css("background-color", "rgba(" + colorBoxRgba.join(",") + ")");
                    this.parent.target.setColor(targetRgba);
                    this.parent.colorSample.setColor(targetRgba);
                }
            }
        },
        hueSlider: {
            parent: null,
            $el: null,
            $handle: null,
            minX: 0,
            maxX: 0,
            minY: 0,
            maxY: 0,
            hue: 0,
            position: [],
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
                    hsv;
                
                if (!_.has(y, "rgba")) { // y is the y coordinate
                    actualY = (y < this.minY ? this.minY : (y > this.maxY ? this.maxY : y));
                    this.hue = 1 - (actualY / this.maxY);
                } else { // y is a Color
                    hsv = y.getHsv();
                    this.hue = hsv[0];
                    actualY = (1 - this.hue) * this.maxX;
                    this.parent.color.set({ hsv: y.getHsv() });
                }
                this.position = [actualY];
                this.$handle.css({
                    top: actualY - 1 // -1 because 1px top border of handle 
                });
                this.parent.colorBox.setHue(this.hue);
            }
        }
    };
}).call(this);