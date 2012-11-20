 /*!
 * Color.js
 * Javascript class for working with colors.
 *
 * by Adam Drago
 */

(function () {   
    this.Color = function (color) {
        this.set(color);
    };

    Color.prototype = {
        hsv: [],
        getRgb: function () {
            var hsv = this.getHsv();
            return hsv === null ? null : hsvToRgba(hsv).slice(0, 3);
        },
        getRgba: function () {
            var hsv = this.getHsv();
            return hsv === null ? null : hsvToRgba(hsv);
        },
        getHex: function (withHash) {
            var hsv = this.getHsv();
            return hsv === null ? null : hsvToHex(hsv);
        },
        getHsv: function () {
            return this.hsv || null;
        },
        set: function (obj) {
            /*
            /   Method that saves the passed color as hsv, rgb, rgba, and hex.
            /   hsv:  [0.0-1.0, 0.0-1.0, 0.0-1.0]
            /   rgb:  [0-255, 0-255, 0-255]
            /   rgba: [0-255, 0-255, 0-255, 0.0-1.0]
            /   hex:  "#aaa", "#aaaaaa", "aaa", or "aaaaaa"
            */
            if (obj && (obj.hsv || obj.rgb || obj.rgba || obj.hex)) {
                if (obj.hsv) {
                    this.hsv = obj.hsv;
                } else if (obj.rgb) {
                    this.hsv = rgbToHsv(obj.rgb);
                } else if (obj.rgba) {
                    this.hsv = rgbToHsv(obj.rgba);
                } else if (obj.hex) {
                    this.hsv = hexToHsv(obj.hex);
                }
            } else if (isArray(obj)) {
                // if obj is an array, we treat it as rgb or rgba
                this.hsv = rgbToHsv(obj);
            } else if (isString(obj)) {
                // if obj is a string, we treat it as hex unless in the format rgb(#,#,#) or rgba(#,#,#,#)
                if (obj[0] == "r") {
                    // this is an rgb(a) string
                    if (obj[3] != "a") {
                        this.hsv = rgbToHsv(map(rgbToRgba(obj.substring(4, obj.length - 1).split(",")), function (v) { return +v; }));
                    } else {
                        this.hsv = rgbToHsv(map(obj.substring(5, obj.length - 1).split(","), function (v) { return +v; }));
                    }
                } else {
                    // this is a hex string
                    this.hsv = hexToHsv(obj);
                }
            } else {
                this.hsv = [0, 0, 0]; // if nothing is specified, return transparent black
            }
            return this;
        }
    };

    // Local helper functions
    var toString = function (o) {
            return Object.prototype.toString.call(o);
        },
        isArray = function (o) {
            return toString(o) === '[object Array]';
        },
        isString = function (o) {
            return toString(o) === '[object String]';
        },
        map = function (arr, fn) {
            for (var i = 0; i < arr.length; i++) {
                arr[i] = fn(arr[i]);
            }
            return arr;
        },
        pad = function (str, length, padding) {
            while (str.length < length) {
                str = padding + str;
            }
            return str;
        },
        hsvToRgba = function (hsv) {
            var r, g, b,
                h = hsv[0],
                s = hsv[1],
                v = hsv[2],
                i = Math.floor(h * 6),
                f = h * 6 - i,
                p = v * (1 - s),
                q = v * (1 - f * s),
                t = v * (1 - (1 - f) * s);

            switch (i % 6) {
                case 0: r = v, g = t, b = p; break;
                case 1: r = q, g = v, b = p; break;
                case 2: r = p, g = v, b = t; break;
                case 3: r = p, g = q, b = v; break;
                case 4: r = t, g = p, b = v; break;
                case 5: r = v, g = p, b = q; break;
            }

            return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255), 1];
        },
        rgbToHsv = function (rgb) {
            var r = rgb[0]/255,
                g = rgb[1]/255,
                b = rgb[2]/255,
                max = Math.max(r, g, b),
                min = Math.min(r, g, b),
                h = 0,
                v = max,
                d = max - min,
                s = max == 0 ? 0 : d / max;

            if (max == min) {
                h = 0;
            } else {
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }

            return [h, s, v];
        },
        rgbToHex = function (rgb) {
            return pad(rgb[0].toString(16), 2, "0") + 
                   pad(rgb[1].toString(16), 2, "0") +
                   pad(rgb[2].toString(16), 2, "0");
        },
        hexToRgba = function (hex) {
            hex = fixHex(hex);
            return [parseInt(hex.substr(0, 2), 16), 
                    parseInt(hex.substr(2, 2), 16), 
                    parseInt(hex.substr(4, 2), 16)];
        },
        hexToHsv = function (hex) {
            return rgbToHsv(hexToRgba(fixHex(hex)));
        },
        hsvToHex = function (hsv) {
            return rgbToHex(hsvToRgba(hsv));
        },
        rgbaToRgb = function (rgba) {
            rgba.pop();
            return rgba;
        },
        rgbToRgba = function (rgb) {
            if (rgb.length == 3) {
                rgb.push(1.0);
            }
            return rgb;
        },
        fixHex = function (hex) {
            hex = (hex[0] == "#" ? hex.substring(1) : hex); // remove # if it's there

            // if the length is 3 (e.g., ABA), return the 6 digit form (e.g., AABBAA)
            return hex.length == 3 ? (hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]) : hex;
        };

    // Color Static methods
    Color.hsvToRgba = hsvToRgba;
    Color.rgbToHsv = rgbToHsv;
    Color.rgbToHex = rgbToHex;
    Color.hexToRgba = hexToRgba;
    Color.hexToHsv = hexToHsv;
    Color.hsvToHex = hsvToHex;
    Color.rgbaToRgb = rgbaToRgb;
    Color.rgbToRgba = rgbToRgba;
    Color.fixHex = fixHex;
}).call(this);