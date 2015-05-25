!function(win, ng, undefined) {
    ng.module("colorpicker.module", [])
        .factory("Helper", function () {
            return {
                closestSlider: function (matches) {
                    var selector = matches.matches
                        || matches.webkitMatchesSelector || matches.mozMatchesSelector || matches.msMatchesSelector;
                    return selector.bind(matches)("I") ? matches.parentNode : matches;
                },
                getOffset: function (element, position) {
                    var left = 0, top = 0, scrollX = 0, scrollY = 0;
                    for (; element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop);) {
                        left += element.offsetLeft;
                        top += element.offsetTop;
                        if (position || "BODY" !== element.tagName) {
                            scrollX += element.scrollLeft;
                            scrollY += element.scrollTop;
                        } else {
                            scrollX += document.documentElement.scrollLeft || element.scrollLeft;
                            scrollY += document.documentElement.scrollTop || element.scrollTop;
                        }
                        element = element.offsetParent;
                    }
                    return {top: top, left: left, scrollX: scrollX, scrollY: scrollY};
                },
                stringParsers: [{
                    //RGB(R,G,B)|RGBA(R,G,B,A) => rgba(45, 78, 32, .5)
                    re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d*(?:\.\d+)?)\s*)?\)/,
                    //[red, green, blue, alpha]
                    parse: function (matchs) {
                        return [matchs[1], matchs[2], matchs[3], matchs[4]];
                    }
                }, {
                    //RGB(R,G,B)|RGBA(R,G,B,A) => rgba(45%, 78%, 32%, .5)
                    re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
                    //[red, green, blue, alpha]
                    parse: function (matchs) {
                        return [2.55 * matchs[1], 2.55 * matchs[2], 2.55 * matchs[3], matchs[4]];
                    }
                }, {
                    //#rrggbb => #ffeecc
                    re: /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,
                    parse: function (matchs) {
                        return [parseInt(matchs[1], 16), parseInt(matchs[2], 16), parseInt(matchs[3], 16)];
                    }
                }, {
                    //#rgb => #cef
                    re: /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/,
                    parse: function (matchs) {
                        return [parseInt(matchs[1] + matchs[1], 16), parseInt(matchs[2] + matchs[2], 16), parseInt(matchs[3] + matchs[3], 16)];
                    }
                }]
            };
        })
        .factory("Color", ["Helper", function (Helper) {
            return {
                value: {hue: 1, saturation: 1, lightness: 1, alpha: 1},
                rgb: function () {
                    var rgb = this.toRGB();
                    return "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
                },
                rgba: function () {
                    var rgba = this.toRGB();
                    return "rgba(" + rgba.r + "," + rgba.g + "," + rgba.b + "," + rgba.a + ")"
                },
                hex: function () {
                    return this.toHex();
                },
                //http://blog.csdn.net/xhhjin/article/details/7020449
                RGBtoHSB: function (r, g, b, a) {
                    r /= 255;
                    g /= 255;
                    b /= 255;
                    var hue, saturation, max, diff;
                    max = Math.max(r, g, b);
                    diff = max - Math.min(r, g, b);
                    if (0 === diff) {
                        hue = null;
                    } else {
                        if (max === r) {
                            hue = (g - b) / diff;
                        } else if (max === g) {
                            hue = (b - r) / diff + 2;
                        } else {
                            hue = (r - g) / diff + 4;
                        }
                    }
                    hue = (hue + 360) % 6 * 60 / 360;
                    saturation = 0 === diff ? 0 : diff / max;
                    return {hue: hue || 1, saturation: saturation, lightness: max, alpha: a || 1};
                },
                setColor: function (color) {
                    color = color.toLowerCase();
                    for (var idx in Helper.stringParsers) {
                        if (Helper.stringParsers.hasOwnProperty(idx)) {
                            var Parser = Helper.stringParsers[idx],
                                matchs = Parser.re.exec(color),
                                result = matchs && Parser.parse(matchs);
                            if (result) {
                                this.value = this.RGBtoHSB.apply(null, result);
                                return false;
                            }
                        }
                    }
                },

                setHue: function (hue) {
                    this.value.hue = 1 - hue;
                },//色调
                setSaturation: function (saturation) {
                    this.value.saturation = saturation;
                },//饱和度
                setLightness: function (lightness) {
                    this.value.lightness = 1 - lightness;
                },//明亮度
                setAlpha: function (alpha) {
                    this.value.alpha = parseInt(100 * (1 - alpha), 10) / 100;
                },//阿尔法

                toRGB: function (hue, saturation, lightness, alpha) {
                    if (!hue) {
                        hue = this.value.hue;
                        saturation = this.value.saturation;
                        lightness = this.value.lightness;
                    }
                    hue *= 360;
                    var r, g, b, h, i;
                    hue = hue % 360 / 60;
                    i = lightness * saturation;
                    h = i * (1 - Math.abs(hue % 2 - 1));

                    r = g = b = lightness - i;
                    hue = ~~hue;
                    r += [i, h, 0, 0, h, i][hue];
                    g += [h, i, i, h, 0, 0][hue];
                    b += [0, 0, h, i, i, h][hue];
                    return {
                        r: Math.round(255 * r),
                        g: Math.round(255 * g),
                        b: Math.round(255 * b),
                        a: alpha || this.value.alpha
                    };
                },
                toHex: function (hue, saturation, lightness, alpha) {
                    var rgb = this.toRGB(hue, saturation, lightness, alpha);
                    return "#" + (1 << 24 | parseInt(rgb.r, 10) << 16 | parseInt(rgb.g, 10) << 8 | parseInt(rgb.b, 10)).toString(16).substr(1);
                }
            }
        }])
        .factory("Slider", ["Helper", function (Helper) {
            var slider = {
                maxLeft: 0,
                maxTop: 0,
                callLeft: null,
                callTop: null,
                knob: {top: 0, left: 0}
            }, offset = {};
            return {
                getSlider: function () {
                    return slider;
                },
                getLeftPosition: function (event) {
                    return Math.max(0, Math.min(slider.maxLeft, slider.left + ((event.pageX || offset.left) - offset.left)))
                },
                getTopPosition: function (event) {
                    return Math.max(0, Math.min(slider.maxTop, slider.top + ((event.pageY || offset.top) - offset.top)))
                },
                setSlider: function (event, position) {
                    var element = Helper.closestSlider(event.target), pageOffset = Helper.getOffset(element, position);
                    slider.knob = element.children[0].style;
                    slider.left = event.pageX - pageOffset.left - win.pageXOffset + pageOffset.scrollX;
                    slider.top = event.pageY - pageOffset.top - win.pageYOffset + pageOffset.scrollY;
                    offset = {left: event.pageX, top: event.pageY};
                },
                setSaturation: function (event, position) {
                    slider = {maxLeft: 100, maxTop: 100, callLeft: "setSaturation", callTop: "setLightness"};
                    this.setSlider(event, position);
                },
                setHue: function (event, position) {
                    slider = {maxLeft: 0, maxTop: 100, callLeft: !1, callTop: "setHue"};
                    this.setSlider(event, position);
                },
                setAlpha: function (event, position) {
                    slider = {maxLeft: 0, maxTop: 100, callLeft: !1, callTop: "setAlpha"};
                    this.setSlider(event, position);
                },
                setKnob: function (top, left) {
                    slider.knob.top = top + "px";
                    slider.knob.left = left + "px"
                }
            };
        }])
        .directive("colorpicker", ["$document", "$compile", "Color", "Slider", "Helper", function ($document, $compile, Color, Slider, Helper) {
            return {
                require: "?ngModel",
                restrict: "A",
                link: function (scope, element, attr, ctrl) {
                    var $alpha,
                        unit = attr.colorpicker ? attr.colorpicker : "hex",
                        position = ng.isDefined(attr.colorpickerPosition) ? attr.colorpickerPosition : "bottom",
                        hasInline = ng.isDefined(attr.colorpickerInline) ? attr.colorpickerInline : false,
                        fixedPosition = ng.isDefined(attr.colorpickerFixedPosition) ? attr.colorpickerFixedPosition : false,
                        $target = ng.isDefined(attr.colorpickerParent) ? element.parent() : ng.element(document.body),
                        hasInput = ng.isDefined(attr.colorpickerWithInput) ? attr.colorpickerWithInput : false,

                        input = hasInput ? '<input type="text" name="colorpicker-input">' : "",
                        button = hasInline ? "" : '<button type="button" class="close close-colorpicker">&times;</button>',
                        dropdown = '<div class="colorpicker dropdown"><div class="dropdown-menu"><colorpicker-saturation><i></i></colorpicker-saturation><colorpicker-hue><i></i></colorpicker-hue><colorpicker-alpha><i></i></colorpicker-alpha><colorpicker-preview></colorpicker-preview>' + input + button + "</div></div>",
                        $dropdown = ng.element(dropdown),

                        $hue = $dropdown.find("colorpicker-hue"),
                        $saturation = $dropdown.find("colorpicker-saturation"),
                        $preview = $dropdown.find("colorpicker-preview"),
                        $i = $dropdown.find("i");
                    $compile($dropdown)(scope);

                    if (hasInput) {
                        var $input = $dropdown.find("input");
                        $input.on("mousedown", function (event) {
                            event.stopPropagation();
                        }).on("keyup", function (event) {
                            var val = this.value;
                            element.val(val);
                            if (ctrl)scope.$apply(ctrl.$setViewValue(val));
                            event.stopPropagation();
                            event.preventDefault();
                        });
                        element.on("keyup", function () {
                            $input.val(element.val());
                        });
                    }
                    var bindMouseHandle = function () {
                        $document.on("mousemove", setVal);
                        $document.on("mouseup", offMouseHandle);
                    };
                    if ("rgba" === unit) {
                        $dropdown.addClass("alpha");
                        $alpha = $dropdown.find("colorpicker-alpha");
                        $alpha.on("click", function (event) {
                            Slider.setAlpha(event, fixedPosition);
                            setVal(event);
                        }).on("mousedown", function (event) {
                            Slider.setAlpha(event, fixedPosition);
                            bindMouseHandle();
                        });
                    }
                    $hue.on("click", function (event) {
                        Slider.setHue(event, fixedPosition);
                        setVal(event);
                    })
                        .on("mousedown", function (event) {
                            Slider.setHue(event, fixedPosition);
                            bindMouseHandle();
                        });
                    $saturation.on("click", function (event) {
                        Slider.setSaturation(event, fixedPosition);
                        setVal(event);
                    })
                        .on("mousedown", function (event) {
                            Slider.setSaturation(event, fixedPosition);
                            bindMouseHandle();
                        });

                    if (fixedPosition)$dropdown.addClass("colorpicker-fixed-position");
                    $dropdown.addClass("colorpicker-position-" + position);
                    if ("true" === hasInline)$dropdown.addClass("colorpicker-inline");
                    $target.append($dropdown);
                    if (ctrl) {
                        ctrl.$render = function () {
                            element.val(ctrl.$viewValue)
                        };
                        scope.$watch(attr.ngModel, function () {
                            caleColor();
                        });
                    }
                    element.on("$destroy", function () {
                        $dropdown.remove();
                    });

                    var setBgColor = function () {
                            try {
                                $preview.css("backgroundColor", Color[unit]());
                            } catch (a) {
                                $preview.css("backgroundColor", Color.toHex())
                            }
                            $saturation.css("backgroundColor", Color.toHex(Color.value.h, 1, 1, 1));
                            if ("rgba" === unit) {
                                $alpha.css.backgroundColor = Color.toHex();
                            }
                        },
                        setVal = function (event) {
                            var left = Slider.getLeftPosition(event),
                                top = Slider.getTopPosition(event),
                                slider = Slider.getSlider();
                            Slider.setKnob(top, left);
                            slider.callLeft && Color[slider.callLeft].call(Color, left / 100);
                            slider.callTop && Color[slider.callTop].call(Color, top / 100);
                            setBgColor();
                            var val = Color[unit]();
                            element.val(val);
                            if (ctrl)scope.$apply(ctrl.$setViewValue(val));
                            if (hasInput)$input.val(val);
                            return false;
                        },
                        offMouseHandle = function () {
                            $document.off("mousemove", setVal);
                            $document.off("mouseup", offMouseHandle);
                        },
                        caleColor = function () {
                            Color.setColor(element.val());
                            $i.eq(0).css({
                                left: 100 * Color.value.saturation + "px",
                                top: 100 - 100 * Color.value.lightness + "px"
                            });
                            $i.eq(1).css("top", 100 * (1 - Color.value.hue) + "px");
                            $i.eq(2).css("top", 100 * (1 - Color.value.alpha) + "px");
                            setBgColor();
                        },
                        caleOffset = function () {
                            var retOffset, offset = Helper.getOffset(element[0]);
                            if (ng.isDefined(attr.colorpickerParent)) {
                                offset.left = 0;
                                offset.top = 0
                            }
                            switch (position) {
                                case "top":
                                    retOffset = {top: offset.top - 147, left: offset.left};
                                    break;
                                case "right":
                                    retOffset = {top: offset.top, left: offset.left + 126};
                                    break;
                                case "bottom":
                                    retOffset = {top: offset.top + element[0].offsetHeight + 2, left: offset.left};
                                    break;
                                case "left":
                                    retOffset = {top: offset.top, left: offset.left - 150};
                                    break;
                            }
                            return {top: retOffset.top + "px", left: retOffset.left + "px"};
                        },
                        close = function () {
                            closeColorPicker();
                        };
                    if (hasInline === false) {
                        element.on("click", function () {
                            caleColor();
                            $dropdown.addClass("colorpicker-visible").css(caleOffset());
                            $document.on("mousedown", close);
                        })
                    } else {
                        caleColor();
                        $dropdown.addClass("colorpicker-visible").css(caleOffset());
                    }
                    $dropdown.on("mousedown", function (event) {
                        event.stopPropagation();
                        event.preventDefault()
                    });
                    var emitEvent = function (eventName) {
                            if (ctrl)scope.$emit(eventName, {name: attr.ngModel, value: ctrl.$modelValue});
                        },
                        closeColorPicker = function () {
                            if ($dropdown.hasClass("colorpicker-visible")) {
                                $dropdown.removeClass("colorpicker-visible");
                                emitEvent("colorpicker-closed");
                                $document.off("mousedown", close);
                            }
                        };
                    $dropdown.find("button").on("click", function () {
                        closeColorPicker();
                    });
                }
            }
        }]);
    ng.module("app.directives.style", []).directive("panelDraggable", function () {
        return {
            restrict: "A",
            link: function (scope, element) {
                scope.$on("$destroy", function () {
                    $(element).draggable();
                    $(element).draggable("destroy");
                    element = null;
                });
                element.on("$destroy", function () {
                    $(element).draggable();
                    $(element).draggable("destroy");
                    element = null;
                });
                $(element).draggable();
            }
        }
    });
    ng.module("app.directives.uislider", []).value("uiSliderConfig", {}).directive("uiSlider", ["uiSliderConfig", "$timeout", function (uiSliderConfig, $timeout) {
        uiSliderConfig = uiSliderConfig || {};
        return {
            require: "ngModel",
            compile: function () {
                return function (scope, element, attr, ctrl) {
                    function parseVal(val, useDecimals) {
                        return useDecimals ? parseFloat(val) : parseInt(val, 10)
                    }

                    var uiSlider = ng.extend(scope.$eval(attr.uiSlider) || {}, uiSliderConfig),
                        range = {min: null, max: null},
                        props = ["min", "max", "step"],
                        useDecimals = ng.isUndefined(attr.useDecimals) ? false : true,
                        _config = function () {
                            if (ng.isArray(ctrl.$viewValue) && uiSlider.range !== true) {
                                console.warn("Change your range option of ui-slider. When assigning ngModel an array of values then the range option should be set to true.");
                                uiSlider.range = true;
                            }
                            ng.forEach(props, function (p) {
                                if (ng.isDefined(attr[p])) {
                                    uiSlider[p] = parseVal(attr[p], useDecimals);
                                }
                            });
                            element.slider(uiSlider);
                            _config = ng.noop;
                        };
                    ng.forEach(props, function (p) {
                        attr.$observe(p, function (val) {
                            if (val) {
                                _config();
                                uiSlider[p] = parseVal(val, useDecimals);
                                element.slider("option", p, parseVal(val, useDecimals));
                                ctrl.$render();
                            }
                        });
                    });
                    attr.$observe("disabled", function (val) {
                        _config();
                        element.slider("option", "disabled", !!val);
                    });
                    scope.$watch(attr.uiSlider, function (val) {
                        _config();
                        if (val !== undefined) {
                            element.slider("option", val);
                        }
                    }, true);
                    $timeout(_config, 0, !0);
                    element.bind("slide", function (event, data) {
                        ctrl.$setViewValue(data.values || data.value);
                        scope.$apply();
                    });
                    ctrl.$render = function () {
                        _config();
                        var flag = uiSlider.range === true ? "values" : "value";
                        if (!uiSlider.range && isNaN(ctrl.$viewValue)) {
                            if (ctrl.$viewValue instanceof Array) {
                                if (uiSlider.range && !ng.isDefined(ctrl.$viewValue))ctrl.$viewValue = [0, 0];
                            } else {
                                ctrl.$viewValue = 0;
                            }
                        }
                        if (uiSlider.range === true) {
                            if (ng.isDefined(uiSlider.min) && uiSlider.min > ctrl.$viewValue[0])ctrl.$viewValue[0] = uiSlider.min;
                            if (ng.isDefined(uiSlider.max) && uiSlider.max < ctrl.$viewValue[1])ctrl.$viewValue[1] = uiSlider.max;
                            if (ctrl.$viewValue[0] > ctrl.$viewValue[1]) {
                                //比最小值大，比最大值小
                                if (range.min >= ctrl.$viewValue[1])ctrl.$viewValue[0] = range.min;
                                if (range.max <= ctrl.$viewValue[0])ctrl.$viewValue[1] = range.max;
                            }
                            range.min = ctrl.$viewValue[0];
                            range.max = ctrl.$viewValue[1];
                        }
                        element.slider(flag, ctrl.$viewValue);
                    };
                    scope.$watch(attr.ngModel, function () {
                        if (uiSlider.range === true)ctrl.$render();
                    }, true);
                    element.bind("$destroy", function () {
                        element.slider("destroy");
                    });
                }
            }
        }
    }]);
    ng.module("app.directives.limitInput", []).directive("limitInput", function () {
        return {
            require: "ngModel",
            link: function (scope, element, attr, ctrl) {
                if ("transform" == attr.cssItem) {
                    scope.$on("updateTransform", function (event, data) {
                        ctrl.$setViewValue(parseInt(data, 10));
                        ctrl.$render();
                    });
                }
                if ("borderRadius" == attr.cssItem) {
                    scope.$on("updateMaxRadius", function (event, val) {
                        scope.maxRadius = parseInt(Math.min($(val).outerWidth(), $(val).outerHeight()) / 2 + 10, 10);
                        if (scope.maxRadius < scope.model.borderRadius) {
                            ctrl.$setViewValue(scope.maxRadius);
                            ctrl.$render();
                        }
                        scope.$apply();
                    })
                }
                scope.$watch(function () {
                    return $(element).val()
                }, function (val) {
                    if (+val > attr.max) {
                        ctrl.$setViewValue(attr.max);
                        attr.$render();
                    }
                    if (+val < attr.min) {
                        ctrl.$setViewValue(attr.min);
                        ctrl.$render();
                    }
                });
            }
        }
    });
    ng.module("scene.create.console.setting.style", ["colorpicker.module", "app.directives.style", "app.directives.uislider", "app.directives.limitInput"]);
    ng.module("scene.create.console.setting.style")
        .controller("StyleConsoleCtrl", ["$scope", "sceneService", function ($scope, sceneService) {
            //TODO: currentElemDef
            var curElementDef = $scope.elemDef = sceneService.currentElemDef;

            delete curElementDef.css.borderTopLeftRadius;
            delete curElementDef.css.borderTopRightRadius;
            delete curElementDef.css.borderBottomLeftRadius;
            delete curElementDef.css.borderBottomRightRadius;
            delete curElementDef.css.border;

            var d = curElementDef.css, $target = $("#inside_" + $scope.elemDef.id + " > .element-box");
            $scope.model = {
                backgroundColor: d.backgroundColor || "",
                opacity: 100 - 100 * d.opacity || 0,
                color: d.color || "#676767",
                borderWidth: parseInt(d.borderWidth, 10) || 0,
                borderStyle: d.borderStyle || "solid",
                borderColor: d.borderColor || "rgba(0,0,0,1)",
                paddingBottom: parseInt(d.paddingBottom, 10) || 0,
                paddingTop: parseInt(d.paddingTop, 10) || 0,
                lineHeight: +d.lineHeight || 1,
                borderRadius: parseInt(d.borderRadius, 10) || 0,
                transform: d.transform && parseInt(d.transform.replace("rotateZ(", "").replace("deg)", ""), 10) || 0
            }
            $scope.maxRadius = Math.min($target.outerWidth(), $target.outerHeight()) / 2 + 10;
            d.borderRadiusPerc
                ? $scope.model.borderRadiusPerc = parseInt(d.borderRadiusPerc, 10)
                : d.borderRadius
                    ? "999px" == d.borderRadius
                        ? $scope.model.borderRadiusPerc = 100
                        : (
                            $scope.model.borderRadiusPerc = parseInt(100 * parseInt(d.borderRadius, 10) * 2 / Math.min($target.outerWidth(), $target.outerHeight()), 10),
                            $scope.model.borderRadiusPerc > 100 && ($scope.model.borderRadiusPerc = 100)
                        )
                    : $scope.model.borderRadiusPerc = 0;
            $scope.tmpModel = {
                boxShadowDirection: 0,
                boxShadowX: 0,
                boxShadowY: 0,
                boxShadowBlur: 0,
                boxShadowSize: 0,
                boxShadowColor: "rgba(0,0,0,0.5)"
            };
            if (d.boxShadow) {
                var f = d.boxShadow.split(" ");
                $scope.tmpModel.boxShadowX = parseInt(f[0], 10);
                $scope.tmpModel.boxShadowY = parseInt(f[1], 10);
                $scope.tmpModel.boxShadowDirection = parseInt(d.boxShadowDirection, 10) || 0;
                $scope.tmpModel.boxShadowBlur = parseInt(f[2], 10);
                $scope.tmpModel.boxShadowColor = f[3];
                $scope.tmpModel.boxShadowSize = parseInt(d.boxShadowSize, 10) || 0;
            }
            $scope.clear = function () {
                $scope.model = {
                    backgroundColor: "",
                    opacity: 0,
                    color: "#676767",
                    borderWidth: 0,
                    borderStyle: "solid",
                    borderColor: "rgba(0,0,0,1)",
                    paddingBottom: 0,
                    paddingTop: 0,
                    lineHeight: 1,
                    borderRadius: 0,
                    transform: 0
                };
                $scope.tmpModel = {
                    boxShadowDirection: 0,
                    boxShadowX: 0,
                    boxShadowY: 0,
                    boxShadowBlur: 0,
                    boxShadowSize: 0,
                    boxShadowColor: "rgba(0,0,0,0.5)"
                };
            };
            $scope.$watch("tmpModel", function () {
                var model = {};
                $.extend(!0, model, $scope.model);
                model.borderRadius += "px";
                model.borderTopLeftRadius = model.borderTopRightRadius = model.borderBottomLeftRadius = model.borderBottomRightRadius = model.borderRadius;
                model.opacity = (100 - $scope.model.opacity) / 100;
                model.boxShadow = Math.round($scope.tmpModel.boxShadowX) + "px " + Math.round($scope.tmpModel.boxShadowY) + "px " + $scope.tmpModel.boxShadowBlur + "px " + $scope.tmpModel.boxShadowColor;
                model.boxShadowDirection = $scope.tmpModel.boxShadowDirection;
                model.boxShadowSize = $scope.tmpModel.boxShadowSize;
                model.transform = "rotateZ(" + $scope.model.transform + "deg)";

                $.extend(!0, curElementDef.css, model);
            }, true);
            $scope.$watch("model", function () {
                var model = {};
                $.extend(!0, model, $scope.model);
                model.borderRadius += "px";
                model.borderTopLeftRadius = model.borderTopRightRadius = model.borderBottomLeftRadius = model.borderBottomRightRadius = model.borderRadius;
                model.opacity = (100 - $scope.model.opacity) / 100;
                model.boxShadow = Math.round($scope.tmpModel.boxShadowX) + "px " + Math.round($scope.tmpModel.boxShadowY) + "px " + $scope.tmpModel.boxShadowBlur + "px " + $scope.tmpModel.boxShadowColor;
                model.boxShadowDirection = $scope.tmpModel.boxShadowDirection;
                model.boxShadowSize = $scope.tmpModel.boxShadowSize;
                model.transform = "rotateZ(" + $scope.model.transform + "deg)";

                $.extend(true, curElementDef.css, model);
            }, true);
        }])
        .directive("styleInput", function () {
            return {
                restrict: "AE",
                link: function (scope, element, attr) {
                    var $target = $("#inside_" + scope.elemDef.id + " > .element-box");
                    scope.$watch(function () {
                        return $(element).val()
                    }, function () {
                        switch (attr.cssItem) {
                            case "borderWidth":
                                $target.css({borderStyle: scope.model.borderStyle, borderWidth: $(element).val()});
                                var dimension = {width: $target.width(), height: $target.height()};
                                if (4 == scope.elemDef.type) {
                                    var $img = $target.find("img"),
                                        rate = $img.width() / $img.height(),
                                        R = dimension.width / dimension.height;
                                    if (rate >= R) {
                                        $img.outerHeight(dimension.height);
                                        $img.outerWidth(dimension.height * rate);
                                        $img.css("marginLeft", -($img.outerWidth() - dimension.width) / 2);
                                        $img.css("marginTop", 0);
                                    } else {
                                        $img.outerWidth(dimension.width);
                                        $img.outerHeight(dimension.width / rate);
                                        $img.css("marginTop", -($img.outerHeight() - dimension.height) / 2);
                                        $img.css("marginLeft", 0);
                                    }
                                    scope.elemDef.properties.imgStyle.marginTop = $img.css("marginTop");
                                    scope.elemDef.properties.imgStyle.marginLeft = $img.css("marginLeft");
                                    scope.elemDef.properties.imgStyle.width = $img.outerWidth();
                                    scope.elemDef.properties.imgStyle.height = $img.outerHeight();
                                }
                                break;
                            case "borderRadius":
                                $target.css({borderRadius: scope.model.borderRadius});
                                break;
                            case "opacity":
                                $target.css({opacity: (100 - $(element).val()) / 100});
                                break;
                            case "backgroundColor":
                                $target.css({backgroundColor: $(element).val()});
                                break;
                            case "color":
                                $target.css({color: $(element).val()})
                                break;
                            case "borderStyle":
                                $target.css({borderStyle: scope.model.borderStyle});
                                break;
                            case "borderColor":
                                $target.css({borderColor: scope.model.borderColor});
                                break;
                            case "padding":
                                $target.css({
                                    paddingTop: scope.model.paddingTop,
                                    marginTop: -scope.model.paddingBottom
                                });
                                break;
                            case "lineHeight":
                                $target.css({lineHeight: scope.model.lineHeight});
                                break;
                            case "transform":
                                $target.parents("li").css({transform: "rotateZ(" + scope.model.transform + "deg)"});
                                break;
                            case "boxShadow":
                                scope.tmpModel.boxShadowX = -Math.sin(scope.tmpModel.boxShadowDirection * Math.PI / 180) * scope.tmpModel.boxShadowSize;
                                scope.tmpModel.boxShadowY = Math.cos(scope.tmpModel.boxShadowDirection * Math.PI / 180) * scope.tmpModel.boxShadowSize;
                                $target.css({
                                    boxShadow: Math.round(scope.tmpModel.boxShadowX) + "px " + Math.round(scope.tmpModel.boxShadowY) + "px " + scope.tmpModel.boxShadowBlur + "px " + scope.tmpModel.boxShadowColor
                                });
                                break;
                        }
                    });
                }
            }
        })
        .directive("angleKnob", function () {
            return {
                restrict: "AE",
                templateUrl: "scene/console/angle-knob.tpl.html",
                link: function (scope, element) {
                    function setTargetStyle(offsetLeft, offsetTop) {
                        var hypotenuse = Math.sqrt((offsetLeft - 28) * (offsetLeft - 28) + (offsetTop - 28) * (offsetTop - 28)) / 28,
                            left = 28 + (offsetLeft - 28) / hypotenuse,
                            top = 28 + (offsetTop - 28) / hypotenuse;
                        $sliderKnob.css({top: Math.round(top), left: Math.round(left)});
                    }

                    function caleBoxShadowDirection(offsetLeft, offsetTop) {
                        var width = offsetLeft - 28,
                            height = 28 - offsetTop,
                            angle = 180 * Math.atan(width / height) / Math.PI;
                        offsetTop > 28 && (angle += 180);
                        28 >= offsetTop && 28 > offsetLeft && (angle += 360);
                        return Math.round(angle);
                    }

                    var $sliderContainer = $(element).find(".sliderContainer"),
                        $sliderKnob = $(element).find(".sliderKnob");

                    scope.$watch(function () {
                        return scope.tmpModel.boxShadowDirection
                    }, function (val) {
                        $sliderKnob.css({
                            top: 28 - 28 * Math.cos(val * Math.PI / 180),
                            left: 28 + 28 * Math.sin(val * Math.PI / 180)
                        });
                    });
                    if (0 !== scope.tmpModel.boxShadowDirection) {
                        $sliderKnob.css({
                            top: 28 - 28 * Math.cos(scope.tmpModel.boxShadowDirection * Math.PI / 180),
                            left: 28 + 28 * Math.sin(scope.tmpModel.boxShadowDirection * Math.PI / 180)
                        });
                    }

                    $sliderContainer.bind("mousedown", function (event) {
                        event.stopPropagation();
                        var left = $sliderContainer.offset().left, top = $sliderContainer.offset().top;
                        setTargetStyle(event.pageX - left, event.pageY - top);
                        var boxShadowDirection = caleBoxShadowDirection(event.pageX - left, event.pageY - top);
                        scope.tmpModel.boxShadowDirection = boxShadowDirection;
                        scope.$apply();

                        $(this).bind("mousemove", function (event) {
                            event.stopPropagation();
                            setTargetStyle(event.pageX - left, event.pageY - top);
                            var boxShadowDirection = caleBoxShadowDirection(event.pageX - left, event.pageY - top);
                            scope.tmpModel.boxShadowDirection = boxShadowDirection;
                            scope.$apply();
                        });

                        $(this).bind("mouseup", function () {
                            $(this).unbind("mousemove");
                            $(this).unbind("mouseup");
                        });
                    });
                }
            }
        });
    ng.module("scene.create.console.setting.anim", ["app.directives.uislider", "app.directives.limitInput"]);
    ng.module("scene.create.console.setting.anim").controller("AnimConsoleCtrl", ["$scope", "sceneService", function ($scope, sceneService) {
        //TODO: currentElemDef ??
        var curElementDef = $scope.elemDef = sceneService.currentElemDef,
            $target = $("#inside_" + $scope.elemDef.id + " .element-box");
        $scope.animTypeEnum = [
            {id: -1, name: "无"},
            {id: 0, name: "淡入"},
            {id: 1, name: "移入"},
            {id: 2, name: "弹入"},
            {id: 3, name: "中心弹入"},
            {id: 4, name: "中心放大"},
            {id: 12, name: "翻滚进入"},
            {id: 13, name: "光速进入"},
            {id: 6, name: "摇摆"},
            {id: 5, name: "抖动"},
            {id: 7, name: "旋转"},
            {id: 8, name: "翻转"},
            {id: 9, name: "悬摆"},
            {id: 10, name: "淡出"},
            {id: 11, name: "翻转消失"}
        ];
        $scope.animDirectionEnum = [
            {id: 0, name: "从左向右"},
            {id: 1, name: "从上到下"},
            {id: 2, name: "从右向左"},
            {id: 3, name: "从下到上"}
        ];
        curElementDef.properties || (curElementDef.properties = {});
        if (curElementDef.properties.anim && null != curElementDef.properties.anim.type) {
            for (var t = 0; t < $scope.animTypeEnum.length; t++) {
                if ($scope.animTypeEnum[t].id == curElementDef.properties.anim.type) {
                    $scope.activeAnim = $scope.animTypeEnum[t];
                }
            }
            $scope.model = {
                type: curElementDef.properties.anim.type,
                direction: curElementDef.properties.anim.direction,
                duration: parseFloat(curElementDef.properties.anim.duration),
                delay: parseFloat(curElementDef.properties.anim.delay),
                countNum: parseInt(curElementDef.properties.anim.countNum, 10) || 1,
                count: curElementDef.properties.anim.count,
                linear: curElementDef.properties.anim.linear
            };
            if (null != curElementDef.properties.anim.direction) {
                $scope.direction = $scope.animDirectionEnum[curElementDef.properties.anim.direction];
            } else {
                $scope.direction = $scope.animDirectionEnum[0];
            }
        } else {
            $scope.activeAnim = $scope.animTypeEnum[0];
            $scope.direction = $scope.animDirectionEnum[0];
            $scope.model = {
                type: null,
                direction: null,
                duration: 2,
                delay: 0,
                countNum: 1,
                count: null
            };
        }
        $scope.$watch("model", function () {
            if ($scope.direction)$scope.model.direction = $scope.direction.id;
            curElementDef.properties.anim = $scope.model;
            renderHandle();
        }, true);
        $scope.$watch("direction", function () {
            if ($scope.direction)$scope.model.direction = $scope.direction.id;
            curElementDef.properties.anim = $scope.model;
            renderHandle();
        }, true);
        var renderHandle = function () {
            $target.css("animation", "");
            $target.css("animation", $scope.animationClass + " " + $scope.model.duration + "s ease 0s");
            $target.css("animation-fill-mode", "backwards");
        };
        $scope.confirm = function () {
            $scope.cancel();
        };
        $scope.changeAnimation = function () {
            $scope.animationClass = "";
            var model = $scope.model;
            if (0 === model.type)$scope.animationClass = "fadeIn";
            if (1 === model.type) {
                if (0 === $scope.direction.id)$scope.animationClass = "fadeInLeft";
                if (1 === $scope.direction.id)$scope.animationClass = "fadeInDown";
                if (2 === $scope.direction.id)$scope.animationClass = "fadeInRight";
                if (3 === $scope.direction.id)$scope.animationClass = "fadeInUp";
            }
            if (2 === model.type) {
                if (0 === $scope.direction.id)$scope.animationClass = "bounceInLeft";
                if (1 === $scope.direction.id)$scope.animationClass = "bounceInDown";
                if (2 === $scope.direction.id)$scope.animationClass = "bounceInRight";
                if (3 === $scope.direction.id)$scope.animationClass = "bounceInUp";
            }
            if (3 === model.type)$scope.animationClass = "bounceIn";
            if (4 === model.type)$scope.animationClass = "zoomIn";
            if (6 === model.type)$scope.animationClass = "wobble";
            if (5 === model.type)$scope.animationClass = "rubberBand";
            if (7 === model.type)$scope.animationClass = "rotateIn";
            if (8 === model.type)$scope.animationClass = "flip";
            if (9 === model.type)$scope.animationClass = "swing";
            if (10 === model.type)$scope.animationClass = "fadeOut";
            if (11 === model.type)$scope.animationClass = "flipOutY";
            if (12 === model.type)$scope.animationClass = "rollIn";
            if (13 === model.type)$scope.animationClass = "lightSpeedIn";
        }
    }]);

    ng.module("scene.create.console.setting", ["scene.create.console.setting.style", "scene.create.console.setting.anim"]);
    ng.module("scene.create.console.setting").directive("styleModal", ["sceneService", "$compile", function () {
        return {
            restrict: "AE",
            replace: !0,
            scope: {},
            templateUrl: "scene/console/setting.tpl.html",
            link: function (scope, element, attr) {
                var defActiveTab = "style";
                scope.$on("showStylePanel", function (event, data) {
                    defActiveTab = scope.activeTab;
                    scope.activeTab = data && data.activeTab ? data.activeTab : defActiveTab;
                    scope.$apply();
                });
                scope.activeTab = attr.activeTab;
                scope.cancel = function () {
                    $(element).hide()
                };
                scope.$on("$locationChangeStart", function () {
                    scope.cancel();
                });
            },
            controller: ["$scope", function () {
            }]
        }
    }]);

    ng.module("scene.create.console.audio", []);
    ng.module("scene.create.console.audio").controller("AudioConsoleCtrl", ["$scope", "$sce", "$timeout", "$modal", "fileService", "obj", function (a, b, c, d, e, f) {
        function g() {
            e.getFileByCategory(1, 30, "1", "2").then(function (b) {
                a.reservedAudios = b.data.list;
                for (var c = 0; c < a.reservedAudios.length; c++) "3" == a.model.bgAudio.type && PREFIX_FILE_HOST + a.reservedAudios[c].path == a.model.type3 && (a.model.selectedAudio = a.reservedAudios[c])
            })
        }

        function h() {
            e.getFileByCategory(1, 10, "0", "2").then(function (b) {
                a.myAudios = b.data.list;
                for (var c = 0; c < a.myAudios.length; c++) "2" == a.model.bgAudio.type && PREFIX_FILE_HOST + a.myAudios[c].path == a.model.type2 && (a.model.selectedMyAudio = a.myAudios[c])
            })
        }

        a.PREFIX_FILE_HOST = PREFIX_FILE_HOST, a.model = {
            bgAudio: {
                url: f.url ? f.url : "",
                type: f.type ? f.type : "3"
            },
            compType: "bgAudio"
        }, c(function () {
            "1" == f.type && f.url && (a.model.type1 = f.url), "2" == f.type && f.url && (a.model.type2 = b.trustAsResourceUrl(PREFIX_FILE_HOST + f.url)), "3" == f.type && f.url && (a.model.type3 = b.trustAsResourceUrl(PREFIX_FILE_HOST + f.url))
        }), a.categoryList = [{
            name: "音乐库",
            value: "3"
        }, {
            name: "外部链接",
            value: "1"
        }, {
            name: "我的音乐",
            value: "2"
        }], a.goUpload = function () {
            d.open({
                windowClass: "upload-console",
                templateUrl: "my/upload.tpl.html",
                controller: "UploadCtrl",
                resolve: {
                    category: function () {
                        return {
                            categoryId: 0,
                            fileType: 2
                        }
                    }
                }
            }).result.then(function () {
                    h()
                })
        }, a.selectAudio = function (c) {
            "3" == c && (a.model.type3 = a.model.selectedAudio ? b.trustAsResourceUrl(PREFIX_FILE_HOST + a.model.selectedAudio.path) : null), "2" == c && (a.model.type2 = a.model.selectedMyAudio ? b.trustAsResourceUrl(PREFIX_FILE_HOST + a.model.selectedMyAudio.path) : null)
        }, a.playAudio = function (a) {
            $("#audition" + a)[0].play()
        }, a.pauseAudio = function (a) {
            $("#audition" + a)[0].pause()
        }, a.confirm = function () {
            "1" == a.model.bgAudio.type && (a.model.bgAudio.url = a.model.type1), "2" == a.model.bgAudio.type && (a.model.bgAudio.url = a.model.selectedMyAudio.path), "3" == a.model.bgAudio.type && (a.model.bgAudio.url = a.model.selectedAudio.path), a.$close(a.model)
        }, a.cancel = function () {
            a.$dismiss()
        }, g(), h()
    }]);
    ng.module("scene.create.console.input", []);
    ng.module("scene.create.console.input").controller("InputConsoleCtrl", ["$scope", "$timeout", "localizedMessages", "obj", function (a, b, c, d) {
        a.model = {
            title: d.title,
            type: d.type,
            required: d.properties.required
        }, a.confirm = function () {
            return a.model.title && 0 !== a.model.title.length ? void a.$close(a.model) : (alert("输入框名称不能为空"), void $('.bg_console input[type="text"]').focus())
        }, a.cancel = function () {
            a.$dismiss()
        }
    }]);
    ng.module("scene.create.console.button", []);
    ng.module("scene.create.console.button").controller("ButtonConsoleCtrl", ["$scope", "$timeout", "localizedMessages", "obj", function (a, b, c, d) {
        a.model = {
            title: d.properties.title
        }, a.confirm = function () {
            return a.model.title && 0 !== a.model.title.length ? void a.$close(a.model) : (alert("按钮名称不能为空"), void $('.bg_console input[type="text"]').focus())
        }, a.cancel = function () {
            a.$dismiss()
        }
    }]);
    ng.module("scene.create.console.tel", ["app.directives.addelement"]);
    ng.module("scene.create.console.tel").controller("TelConsoleCtrl", ["$scope", "$timeout", "localizedMessages", "obj", function (a, c, d, e) {
        a.model = {
            title: e.properties.title,
            number: e.properties.number
        }, a.confirm = function () {
            if (!a.model.title || 0 === a.model.title.length) return alert("按钮名称不能为空"), void $('.bg_console input[type="text"]').focus();
            if (!a.model.number || 0 === a.model.title.number) return alert("电话号码不能为空"), void $('.bg_console input[type="text"]').focus();
            var b = new RegExp(/(\d{11})|^((\d{7,8})|(^400[0-9]\d{6})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/g);
            return b.test(a.model.number) ? void a.$close(a.model) : void alert("手机号码格式错误")
        }, a.cancel = function () {
            a.$dismiss()
        }, a.removePlaceHolder = function () {
            $(".tel-button").attr("placeholder", "")
        }, a.addPlaceHolder = function () {
            $(".tel-button").attr("placeholder", "010-88888888")
        }, a.chooseTelButton = function (b, c, d) {
            a.model.title = b.text, "A" == d.target.nodeName && (a.model.btnStyle = b.btnStyle), a.btnIndex = c
        }, a.buttons = [{
            id: 1,
            text: "一键拨号",
            btnStyle: {
                width: "90px",
                backgroundColor: "rgb(244, 113, 31)",
                height: "30px",
                "text-algn": "center",
                "line-height": "30px",
                color: "rgb(255, 255, 255)",
                "-webkit-border-radius": "5px",
                "-moz-border-radius": "5px",
                "border-radius": "3px"
            }
        }, {
            id: 2,
            text: "热线电话",
            btnStyle: {
                width: "90px",
                backgroundColor: "rgb(253, 175, 7)",
                height: "30px",
                "text-algn": "center",
                "line-height": "30px",
                color: "rgb(255, 255, 255)",
                "-webkit-border-radius": "40px",
                "-moz-border-radius": "40px",
                "border-radius": "3px"
            }
        }, {
            id: 3,
            text: "拨打电话",
            btnStyle: {
                width: "90px",
                backgroundColor: "rgb(121, 196, 80)",
                height: "30px",
                "text-algn": "center",
                "line-height": "30px",
                color: "rgb(255, 255, 255)",
                "-webkit-border-radius": "5px",
                "-moz-border-radius": "5px",
                "border-radius": "3px"
            }
        }, {
            id: 4,
            text: "一键拨号",
            btnStyle: {
                width: "90px",
                height: "30px",
                backgroundColor: "#fff",
                "text-algn": "center",
                border: "1px solid #3FB816",
                "line-height": "30px",
                color: "rgb(0, 0, 0)",
                "-webkit-border-radius": "5px",
                "-moz-border-radius": "5px",
                "border-radius": "3px"
            }
        }],ng.forEach(a.buttons, function (b, c) {
            e.css.background && e.css.background == b.btnStyle.background && (a.btnIndex = c)
        })
    }]);

    ng.module("scene.my.upload", ["angularFileUpload"]);
    ng.module("scene.my.upload").controller("UploadCtrl", ["$scope", "FileUploader", "fileService", "category", "$timeout", "$interval", function (a, b, c, d, e, f) {
        a.category = d;
        var g;
        g = a.uploader = new b(a.category.scratch || a.category.headerImage ? {
            url: PREFIX_URL + "m/base/file/upload?bizType=" + d.categoryId + "&fileType=" + d.fileType,
            withCredentials: !0,
            queueLimit: 1,
            onSuccessItem: function (b, c) {
                function d() {
                    f.cancel(e), alert("上传完毕"), a.$close(c.obj.path)
                }

                a.progressNum = 0;
                var e = f(function () {
                    a.progressNum < 100 ? a.progressNum += 15 : d()
                }, 100)
            }
        } : {
            url: PREFIX_URL + "m/base/file/upload?bizType=" + d.categoryId + "&fileType=" + d.fileType,
            withCredentials: !0,
            queueLimit: 5,
            onCompleteAll: function () {
                function b() {
                    f.cancel(c), alert("上传完毕"), a.$close()
                }

                a.progressNum = 0;
                var c = f(function () {
                    a.progressNum < 100 ? a.progressNum += 15 : b()
                }, 100)
            }
        });
        var h;
        ("0" == d.fileType || "1" == d.fileType) && (h = "|jpg|png|jpeg|bmp|gif|", limitSize = 3145728), "2" == d.fileType && (h = "|mp3|mpeg|", limitSize = 3145728), g.filters.push({
            name: "imageFilter",
            fn: function (a) {
                var b = "|" + a.type.slice(a.type.lastIndexOf("/") + 1) + "|";
                return -1 !== h.indexOf(b)
            }
        }), g.filters.push({
            name: "imageSizeFilter",
            fn: function (a) {
                var b = a.size;
                return b >= limitSize && alert("上传文件大小限制在" + limitSize / 1024 / 1024 + "M以内"), b < limitSize
            }
        }), g.filters.push({
            name: "fileNameFilter",
            fn: function (a) {
                return a.name.length > 50 && alert("文件名应限制在50字符以内"), a.name.length <= 50
            }
        });
        var i = function () {
            c.listFileCategory().then(function (b) {
                a.categoryList = b.data.list, a.categoryList || (a.categoryList = []), a.categoryList.push({
                    name: "我的背景",
                    value: "0"
                })
            })
        };
        i(), a.removeQueue = function () {
        }
    }]);
    ng.module("services.file", []);
    ng.module("services.file").factory("fileService", ["$http", function (a) {
        var b = {};
        return b.listFileCategory = function (b) {
            var c = "base/class/" + ("1" == b ? "tpType" : "bgType"),
                d = new Date;
            return c += "?time=" + d.getTime(), a({
                withCredentials: !0,
                method: "GET",
                url: PREFIX_URL + c
            })
        }, b.deleteFile = function (b) {
            var c = "m/base/file/delete",
                d = {
                    id: b
                };
            return a({
                withCredentials: !0,
                method: "POST",
                url: PREFIX_URL + c,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                data: $.param(d)
            })
        }, b.createCategory = function (b) {
            var c = "m/base/file/tag/create",
                d = {
                    tagName: b
                };
            return a({
                withCredentials: !0,
                method: "POST",
                url: PREFIX_URL + c,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                data: $.param(d)
            })
        }, b.getCustomTags = function () {
            var b = "m/base/file/tag/my?time" + (new Date).getTime();
            return a({
                withCredentials: !0,
                method: "GET",
                url: PREFIX_URL + b
            })
        }, b.deleteTag = function (b) {
            var c = "m/base/file/tag/delete",
                d = {
                    id: b
                };
            return a({
                withCredentials: !0,
                method: "POST",
                url: PREFIX_URL + c,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                data: $.param(d)
            })
        }, b.setCategory = function (b, c) {
            var d = "m/base/file/tag/set",
                e = {
                    tagId: b,
                    fileIds: c
                };
            return a({
                withCredentials: !0,
                method: "POST",
                url: PREFIX_URL + d,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                data: $.param(e)
            })
        }, b.getImagesByTag = function (b, c, d, e) {
            var f = "m/base/file/userList?";
            return f += "fileType=" + c, b && (f += "&tagId=" + b), f += "&pageNo=" + (d ? d : 1), f += "&pageSize=" + (e ? e : 12), f += "&time=" + (new Date).getTime(), a({
                withCredentials: !0,
                method: "GET",
                url: PREFIX_URL + f
            })
        }, b.getImagesBySysTag = function (b, c, d, e, f) {
            var g = "m/base/file/sysList?";
            return g += "tagId=" + b, g += "&fileType=" + c, g += "&bizType=" + f, g += "&pageNo=" + (d ? d : 1), g += "&pageSize=" + (e ? e : 12), g += "&time=" + (new Date).getTime(), a({
                withCredentials: !0,
                method: "GET",
                url: PREFIX_URL + g
            })
        }, b.unsetTag = function (b, c) {
            var d = "m/base/file/tag/unset",
                e = {
                    tagId: b,
                    fileIds: c
                };
            return a({
                withCredentials: !0,
                method: "POST",
                url: PREFIX_URL + d,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                data: $.param(e)
            })
        }, b.getChildCategory = function (b) {
            var c = "m/base/file/tag/sys";
            return b && (c += "?bizType=" + b), c += (/\?/.test(c) ? "&" : "?") + "time=" + (new Date).getTime(), a({
                withCredentials: !0,
                method: "GET",
                url: PREFIX_URL + c
            })
        }, b.getFileByCategory = function (b, c, d, e) {
            var f = "m/base/file/sysList?";
            "0" === d && "2" === e && (f = "m/base/file/list?"), f += "pageNo=" + (b ? b : 1), f += "&pageSize=" + (c ? c : 12), d && "all" != d && (f += "&bizType=" + (d ? d : -1)), f += "&fileType=" + (e ? e : -1);
            var g = new Date;
            return f += "&time=" + g.getTime(), a({
                withCredentials: !0,
                method: "GET",
                url: PREFIX_URL + f
            })
        }, b.cropImage = function (b) {
            var c = "m/base/file/crop";
            return a({
                withCredentials: !0,
                method: "POST",
                url: PREFIX_URL + c,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                data: $.param(b)
            })
        }, b
    }]);
    ng.module("app.directives.responsiveImage", []).directive("responsiveImage", ["$compile", function () {
        return {
            restrict: "EA",
            link: function (a, b) {
                "0" != a.fileType && $(b).bind("load", function () {
                    $(this).removeAttr("style");
                    var a = $(this).parent().width(),
                        b = $(this).parent().height();
                    this.width > this.height ? (this.style.width = a + "px", this.style.height = this.height * a / this.width + "px", this.style.top = "50%", this.style.marginTop = "-" + this.height / 2 + "px") : (this.style.height = b + "px", this.style.width = this.width * b / this.height + "px", this.style.left = "50%", this.style.marginLeft = "-" + this.width / 2 + "px")
                })
            }
        }
    }]);
    ng.module("app.directives.rightclick", []).directive("rightClick", ["$compile", function (a) {
        return {
            restrict: "EA",
            link: function (b, c) {
                var d;
                $(c).on("contextmenu", function (e) {
                    if (e.preventDefault(), d && d[0] && d.remove(), "0" == b.categoryId) {
                        d = $('<ul class="right-menu dropdown-menu"></ul>'), d.appendTo($(c)), d.css({
                            left: e.pageX - $(c).offset().left,
                            top: e.pageY - $(c).offset().top
                        }).show();
                        for (var f in b.myTags) {
                            var g = '<li class="tag_list" ng-class="{selected: dropTagIndex == ' + f + '}" ng-click="selectTag(' + b.myTags[f].id + "," + f + ')">' + b.myTags[f].name + "</li>",
                                h = a(g)(b);
                            d.append(h)
                        }
                        var i = a('<li class="tag_list add_cate clearfix" style="border-top:1px solid #ccc;margin-bottom:0px;" ng-click="createCategory()"><em>+</em><span>创建分类</span></li>')(b);
                        d.append(i);
                        var j = a('<li class="btn-main" style="width:100%; padding:0px; border: 0;margin:0px;height:25px; line-height:25px;"><a style="height:25px;line-height:25px;text-indent:0;color:#FFF;padding:0px;text-align:center;" ng-click="setCategory(' + b.dropTagIndex + "," + b.img.id + ')">确定</a></li>')(b);
                        d.append(j), $(j).on("click", function () {
                            d.hide()
                        }), $(document).mousemove(function (a) {
                            (a.pageX < d.offset().left - 20 || a.pageX > d.offset().left + d.width() + 20 || a.pageY < d.offset().top - 20 || a.pageY > d.offset().top + d.height() + 20) && (d.hide(), $(this).unbind("mousemove"))
                        })
                    }
                })
            }
        }
    }]);
    ng.module("scene.create.console.category", ["services.file"]);
    ng.module("scene.create.console.category").controller("CategoryConsoleCtrl", ["$scope", "$timeout", "localizedMessages", "fileService", function (a, c, d, e) {
        a.category = {}, a.confirm = function () {
            return a.category.name && a.category.name.trim() ? i(a.category.name) > 16 ? void alert("类别字数不能超过16个字符！") : void e.createCategory(b.copy(a.category.name)).then(function (c) {
                a.category.id = c.data.obj, a.$close(b.copy(a.category))
            }, function () {
                alert("创建失败")
            }) : void alert("类别不能为空！")
        }, a.cancel = function () {
            a.$dismiss()
        }
    }]);
    ng.module("scene.create.console.cropImage", ["services.file"]).directive("cropImage", ["sceneService", "fileService", "$compile", function (a, b) {
        return {
            restrict: "EAC",
            scope: {},
            replace: !0,
            templateUrl: "scene/console/cropimage.tpl.html",
            link: function (c, d) {
                c.PREFIX_FILE_HOST = PREFIX_FILE_HOST;
                var e, f = a.currentElemDef,
                    g = a.currentElemDef.properties.src;
                c.$on("changeElemDef", function (b, d) {
                    d = a.currentElemDef, g = a.currentElemDef.properties.src, c.preSelectImage(g)
                }), c.preSelectImage = function (a) {
                    var b = $("#target");
                    e ? (b.attr("src", PREFIX_FILE_HOST + a), e.setImage(PREFIX_FILE_HOST + a), e.setSelect([0, 0, 100, 100])) : b.attr("src", PREFIX_FILE_HOST + a).load(function () {
                        b.Jcrop({
                            keySupport: !1,
                            setSelect: [0, 0, 100, 100],
                            boxHeight: 200,
                            boxWidth: 300
                        }, function () {
                            e = this
                        }), a && b.Jcrop({
                            keySupport: !1,
                            aspectRatio: f.css.width / f.css.height,
                            setSelect: [-f.properties.imgStyle.marginLeft.split("px")[0], -f.properties.imgStyle.marginTop.split("px")[0], f.css.width, f.css.height]
                        })
                    })
                }, c.preSelectImage(g), c.crop = function () {
                    var c = a.currentElemDef,
                        f = e.tellSelect();
                    f.x = parseInt(f.x, 10), f.y = parseInt(f.y, 10), f.w = parseInt(f.w, 10), f.h = parseInt(f.h, 10), f.x2 = parseInt(f.x2, 10), f.y2 = parseInt(f.y2, 10), f.src = $("#target").attr("src").split(PREFIX_FILE_HOST)[1], b.cropImage(f).then(function (a) {
                        var b = {
                            type: "imgSrc",
                            data: a.data.obj,
                            width: f.w,
                            height: f.h
                        };
                        c.properties.src = b.data;
                        var e = b.width / b.height,
                            g = $("#" + c.id),
                            h = $("#inside_" + c.id).width(),
                            i = $("#inside_" + c.id).height(),
                            j = h / i;
                        e >= j ? (g.outerHeight(i), g.outerWidth(i * e), g.css("marginLeft", -(g.outerWidth() - h) / 2), g.css("marginTop", 0)) : (g.outerWidth(h), g.outerHeight(h / e), g.css("marginTop", -(g.outerHeight() - i) / 2), g.css("marginLeft", 0)), g.attr("src", PREFIX_FILE_HOST + b.data), c.properties.imgStyle = {}, c.properties.imgStyle.width = g.outerWidth(), c.properties.imgStyle.height = g.outerHeight(), c.properties.imgStyle.marginTop = g.css("marginTop"), c.properties.imgStyle.marginLeft = g.css("marginLeft"), $(d).hide()
                    }, function () {
                        c.properties.src || (elements.splice(elements.indexOf(elementsMap[c.id]), 1), delete elementsMap[c.id])
                    })
                }, c.cancel = function () {
                    $(d).hide()
                }
            }
        }
    }]);
    ng.module("scene.create.console.bg", ["services.file", "scene.my.upload", "app.directives.responsiveImage", "app.directives.rightclick"]);
    ng.module("scene.create.console.bg").controller("BgConsoleCtrl", ["$scope", "$timeout", "$rootScope", "$modal", "ModalService", "sceneService", "fileService", "localizedMessages", "obj", function (a, b, c, d, e, f, g, h, i) {
        a.PREFIX_FILE_HOST = PREFIX_FILE_HOST, a.first = !0, a.categoryList = [], a.imgList = [], a.otherCategory = [], a.categoryId = "1", a.fileType = i.fileType, a.pageSize = h.get("file.bg.pageSize"), a.myTags = [], a.selectedImgs = [], a.selectedImages = [], a.toPage = 1, a.isEditor = c.isEditor;
        var j = function () {
            g.listFileCategory(a.fileType).then(function (b) {
                a.categoryList = b.data.list, a.changeCategory("0", 1)
            })
        };
        a.totalItems = 0, a.currentPage = 1;
        var k = function (b, c) {
            if ("c" == b) {
                a.numPages = 2, a.totalItems = 35;
                var d = [{
                    color: "#6366C3"
                }, {
                    color: "#29A1D6"
                }, {
                    color: "#332E42"
                }, {
                    color: "#DBF3FF"
                }, {
                    color: "#434A54"
                }, {
                    color: "#000000"
                }, {
                    color: "#F1F03E"
                }, {
                    color: "#FCF08E"
                }, {
                    color: "#972D53"
                }, {
                    color: "#724192"
                }, {
                    color: "#967BDC"
                }, {
                    color: "#EC87C1"
                }, {
                    color: "#D870AF"
                }, {
                    color: "#F6F7FB"
                }, {
                    color: "#666C78"
                }, {
                    color: "#ABB1BD"
                }, {
                    color: "#CCD0D9"
                }, {
                    color: "#E6E9EE"
                }, {
                    color: "#48CFAE"
                }, {
                    color: "#36BC9B"
                }, {
                    color: "#3BAEDA"
                }, {
                    color: "#50C1E9"
                }, {
                    color: "#AC92ED"
                }, {
                    color: "#4B89DC"
                }, {
                    color: "#4B89DC"
                }, {
                    color: "#5D9CEC"
                }, {
                    color: "#8DC153"
                }, {
                    color: "#ED5564"
                }, {
                    color: "#DB4453"
                }, {
                    color: "#FB6E52"
                }, {
                    color: "#FFCE55"
                }, {
                    color: "#F6BB43"
                }, {
                    color: "#E9573E"
                }, {
                    color: "#9FF592"
                }, {
                    color: "#A0D468"
                }];
                a.toPage = c, a.imgList = c && 1 != c ? d.slice(18) : d.slice(0, 18), a.currentPage = c
            } else "all" == b && (b = ""), g.getFileByCategory(c ? c : 1, a.pageSize, b, a.fileType).then(function (b) {
                a.imgList = b.data.list, a.totalItems = b.data.map.count, a.currentPage = b.data.map.pageNo, a.allPageCount = b.data.map.count, a.toPage = b.data.map.pageNo, a.numPages = Math.ceil(a.totalItems / a.pageSize)
            })
        };
        a.replaceImage = function () {
            if (a.selectedImages.length > 1) return alert("只能选择一张图片进行替换！"), !1;
            if (!a.selectedImages.length) return alert("还没有选择替换图片"), !1;
            if ("c" != a.categoryId) {
                var b = a.selectedImages[0].path,
                    c = $(".hovercolor").children("img")[0];
                a.$close({
                    type: "imgSrc",
                    data: b,
                    width: c.width,
                    height: c.height
                })
            } else {
                var d = a.selectedImages[0].color;
                a.$close({
                    type: "backgroundColor",
                    color: d
                })
            }
        }, a.getImagesByPage = function (b, c) {
            a.currentPage = c, 0 === b ? isNaN(a.tagIndex) || -1 == a.tagIndex ? a.changeCategory(b, c) : a.getImagesByTag(a.myTags[a.tagIndex].id, a.tagIndex, c) : isNaN(a.sysTagIndex) || -1 == a.sysTagIndex ? a.changeCategory(b, c) : a.getImagesBySysTag(a.childCatrgoryList[a.sysTagIndex].id, a.sysTagIndex, c, b)
        }, a.replaceBgImage = function (b, c) {
            var d, e = c.target;
            d = "IMG" == e.nodeName.toUpperCase() ? e : $("img", e)[0], a.$close({
                type: "imgSrc",
                data: b,
                width: d.width,
                height: d.height
            })
        }, a.replaceBgColor = function (b) {
            a.$close({
                type: "backgroundColor",
                color: b
            })
        }, a.changeCategory = function (b, c) {
            return ("c" == b || "all" == b || "0" == b) && (a.allImages.checked = !1, a.sysTagIndex = -1), a.selectedImages = [], 1 > c || c > a.totalItems / a.pageSize + 1 ? void alert("此页超出范围") : (a.imgList = [], b || (b = "0"), a.categoryId = b, void("0" === b ? (a.pageSize = h.get("file.bg.pageSize") - 1, a.getImagesByTag("", a.tagIndex, c), a.tagIndex = -1) : (a.pageSize = h.get("file.bg.pageSize"), k(b, c))))
        };
        var l = null;
        a.createCategory = function () {
            return a.myTags.length >= 8 ? void alert("最多能创建8个自定义标签！") : void(l = d.open({
                windowClass: "console",
                templateUrl: "scene/console/category.tpl.html",
                controller: "CategoryConsoleCtrl"
            }).result.then(function (b) {
                    a.myTags.push(b)
                }, function () {
                }))
        }, a.getCustomTags = function () {
            g.getCustomTags().then(function (b) {
                a.myTags = b.data.list
            }, function () {
                alert("服务器异常")
            })
        }, a.getCustomTags(), a.deleteTag = function (b, c) {
            g.deleteTag(b).then(function () {
                a.myTags.splice(c, 1)
            }, function () {
                alert("服务器异常")
            })
        }, a.hover = function (a) {
            a.showOp = !a.showOp
        }, a.switchSelect = function (b, c) {
            if (c.target.id != b.id)
                if (b.selected = !b.selected, b.selected) a.selectedImages.push(b);
                else
                    for (var d in a.selectedImages) a.selectedImages[d] == b && a.selectedImages.splice(d, 1)
        }, a.selectTag = function (b, c) {
            a.dropTagIndex = c, a.id = a.myTags[c].id
        }, a.setCategory = function (b, c) {
            a.dropTagIndex = -1;
            var d = [];
            if (!c)
                for (var e in a.selectedImages) d.push(a.selectedImages[e].id);
            var f = c ? c : d.join(",");
            g.setCategory(a.id, f).then(function () {
            }, function () {
            })
        }, a.hoverTag = function (a) {
            a.hovered = !a.hovered
        }, a.prevent = function (b) {
            b.selected || (b.selected = !0, a.selectedImages.push(b))
        }, a.prevent = function () {
        }, a.unsetTag = function () {
            var b = [];
            for (var c in a.selectedImages) b.push(a.selectedImages[c].id);
            g.unsetTag(a.myTags[a.tagIndex].id, b.join(",")).then(function () {
                a.getImagesByTag(a.myTags[a.tagIndex].id, a.tagIndex, a.currentPage)
            }, function () {
            })
        }, a.setIndex = function (b) {
            a.dropTagIndex = -1, a.selectedImages.length || (alert("请您选中图片再进行分类！"), b.stopPropagation())
        }, a.getChildCategory = function (b) {
            g.getChildCategory(b).then(function (b) {
                a.sysTagIndex = -1, 200 == b.data.code && (a.childCatrgoryList = b.data.list)
            }, function () {
            })
        }, a.goUpload = function () {
            d.open({
                windowClass: "upload-console",
                templateUrl: "my/upload.tpl.html",
                controller: "UploadCtrl",
                resolve: {
                    category: function () {
                        return {
                            categoryId: a.categoryId,
                            fileType: a.fileType,
                            coverImage: i.coverImage
                        }
                    }
                }
            }).result.then(function () {
                    a.changeCategory(a.categoryId)
                }, function () {
                })
        }, a.allImages = {
            checked: !1
        }, a.selectAll = function () {
            for (var b in a.imgList) a.allImages.checked ? (a.imgList[b].selected = !0, a.selectedImages.push(a.imgList[b])) : (a.imgList[b].selected = !1, a.selectedImages = [])
        }, a.getImagesByTag = function (b, c, d) {
            return 1 > d || d > a.totalItems / a.pageSize + 1 ? void alert("此页超出范围") : (a.allImages.checked = !1, a.selectedImages = [], a.tagIndex = c, void g.getImagesByTag(b, a.fileType, d, a.pageSize).then(function (b) {
                a.imgList = b.data.list, a.totalItems = b.data.map.count, a.currentPage = b.data.map.pageNo, a.allPageCount = b.data.map.count, a.toPage = b.data.map.pageNo, a.numPages = Math.ceil(a.totalItems / a.pageSize)
            }, function () {
                alert("服务器异常")
            }))
        }, a.getImagesBySysTag = function (b, c, d, e) {
            return 1 > d || d > a.totalItems / a.pageSize + 1 ? void alert("此页超出范围") : (a.allImages.checked = !1, a.selectedImages = [], a.sysTagIndex = c, void g.getImagesBySysTag(b, a.fileType, d, a.pageSize, e).then(function (b) {
                a.imgList = b.data.list, a.totalItems = b.data.map.count, a.currentPage = b.data.map.pageNo, a.allPageCount = b.data.map.count, a.toPage = b.data.map.pageNo, a.numPages = Math.ceil(a.totalItems / a.pageSize)
            }, function () {
                alert("服务器异常")
            }))
        }, a.deleteImage = function (b, c) {
            var d = [];
            if (!b && 0 === a.selectedImages.length) return void alert("请您选中图片后再进行删除操作！");
            c && c.stopPropagation();
            var f = b ? "确定删除此图片？" : "确定删除所选图片？";
            if (!b)
                for (var h in a.imgList) a.imgList[h].selected && d.push(a.imgList[h].id);
            var i = b ? b : d.join(",");
            e.openConfirmDialog({
                msg: f
            }, function () {
                g.deleteFile(i).then(function () {
                    isNaN(a.tagIndex) || -1 == a.tagIndex ? a.changeCategory("0", a.currentPage) : a.getImagesByTag(a.myTags[a.tagIndex].id, a.tagIndex, a.currentPage)
                })
            })
        }, j()
    }]);
    ng.module("scene.create.console.pic_lunbo", ["scene.my.upload"]);
    ng.module("scene.create.console.pic_lunbo").controller("picsCtrl", ["$scope", "$timeout", "$rootScope", "$modal", "ModalService", "sceneService", "fileService", "obj", function (a, b, d, e, f, g, h, i) {
        var j = {
                lunBo: 1,
                jiuGongGe: 2
            },
            k = {
                autoPlay: i.properties.autoPlay === c ? !0 : i.properties.autoPlay,
                interval: i.properties.interval === c ? 3e3 : i.properties.interval,
                picStyle: i.properties.picStyle === c ? j.lunBo : i.properties.picStyle,
                children: []
            },
            l = i.properties.children;
        if (l && l.length > 0)
            for (var m in l) k.children.push(l[m]);
        a.imgList = k.children, a.isAutoPlay = k.autoPlay, a.fileDomain = PREFIX_FILE_HOST, a.autoPlay = function (b) {
            a.isAutoPlay = k.autoPlay = b
        }, a.choosePic = function () {
            return k.children.length >= 6 ? void alert("最多选择6张图片") : void e.open({
                windowClass: "console img_console",
                templateUrl: "scene/console/bg.tpl.html",
                controller: "BgConsoleCtrl",
                resolve: {
                    obj: function () {
                        return {
                            fileType: 1,
                            elemDef: i
                        }
                    }
                }
            }).result.then(function (b) {
                    a.imgList.push({
                        src: b.data,
                        desc: "",
                        height: b.height,
                        width: b.width
                    })
                }, function () {
                })
        }, a.remove = function (b) {
            a.imgList.splice(b, 1)
        }, a.ok = function () {
            return 0 === k.children.length ? void alert("请选择图片") : (i.properties = k, void a.$close(k))
        }, a.cancel = function () {
            a.$dismiss()
        }
    }]);
    ng.module("scene.create.console.video", []);
    ng.module("scene.create.console.video").controller("VideoCtrl", ["$scope", "$timeout", "obj", function (a, b, c) {
        a.model || (a.model = {}), a.model.src = c.properties.src, a.confirm = function () {
            return a.model.src ? void a.$close(a.model.src) : void alert("请输入视频地址")
        }, a.cancel = function () {
            a.$dismiss()
        }
    }]);
    ng.module("scene.create.console.link", ["services.scene"]);
    ng.module("scene.create.console.link").controller("LinkConsoleCtrl", ["$scope", "$timeout", "obj", "sceneService", function (a, c, d, e) {
        a.url = {}, a.url.externalLink = "http://";
        var f;
        a.confirm = function () {
            "external" == a.url.link ? f = a.url.externalLink : "internal" == a.url.link && (f = a.url.internalLink.id), a.$close(f)
        }, a.cancel = function () {
            a.$dismiss()
        }, a.removeLink = function (b) {
            "external" == b ? a.url.externalLink = "http://" : "internal" == b && (a.url.internalLink = a.pageList[0]), a.url.link = ""
        }, a.changed = function () {
            "external" == a.url.link ? a.url.internalLink = a.pageList[0] : a.url.externalLink = "http://"
        }, a.selectRadio = function (b) {
            a.url.link || ("external" == b ? a.url.link = "external" : "internal" == b && (a.url.link = "internal"))
        }, a.getPageNames = function () {
            var c = d.sceneId;
            e.getPageNames(c).then(function (c) {
                a.pageList = c.data.list, a.pageList.unshift({
                    id: 0,
                    name: "无"
                }), a.url.internalLink = a.pageList[0], b.forEach(a.pageList, function (b) {
                    b.name || (b.name = "第" + b.num + "页"), d.properties.url && d.properties.url == b.id && (a.url.link = "internal", a.url.internalLink = b)
                }), d.properties.url && isNaN(d.properties.url) && (a.url.link = "external", a.url.externalLink = decodeURIComponent(d.properties.url.split("=")[2]))
            })
        }, a.getPageNames()
    }]);
    ng.module("scene.create.console.micro", ["app.directives.addelement", "services.scene"]);
    ng.module("scene.create.console.micro").controller("MicroConsoleCtrl", ["$scope", "$timeout", "localizedMessages", "obj", "sceneService", function (a, c, d, e, f) {
        a.model || (a.model = {});
        var g = [];
        a.isSelected = [], a.backgroundColors = [{
            backgroundColor: "#D34141"
        }, {
            backgroundColor: "#000"
        }, {
            backgroundColor: "#23A3D3"
        }, {
            backgroundColor: "#79C450"
        }, {
            backgroundColor: "#fafafa"
        }], a.labelNames = [{
            id: 1,
            title: "栏目一",
            color: {
                backgroundColor: ""
            }
        }, {
            id: 2,
            title: "栏目二",
            color: {
                backgroundColor: ""
            }
        }, {
            id: 3,
            title: "栏目三",
            color: {
                backgroundColor: ""
            }
        }, {
            id: 4,
            title: "栏目四",
            color: {
                backgroundColor: ""
            }
        }], a.model.color = e.properties.labels[0].color.backgroundColor, a.selectColor = function (c) {
            a.model.color = c.backgroundColor, b.forEach(a.labelNames, function (a) {
                a.color.backgroundColor && (a.color.backgroundColor = c.backgroundColor)
            })
        }, b.forEach(e.properties.labels, function (c) {
            b.forEach(a.labelNames, function (a) {
                c.id == a.id && (a.title = c.title, a.color.backgroundColor = c.color.backgroundColor, a.link = c.link, a.selected = !0, c.mousedown = !1)
            })
        }), a.confirm = function () {
            g = [];
            var c = 0,
                d = 0;
            b.forEach(a.labelNames, function (a) {
                a.selected && (a.link ? g.push(a) : d++, c++)
            }), 2 > c ? alert("导航标签不能少于两个！") : d > 0 ? alert("每个导航必须有链接页面！") : a.$close(g)
        }, a.cancel = function () {
            a.$dismiss()
        }, a.switchLabel = function (b, c) {
            a.label = b, b.selected ? a.labelIndex == c ? (b.color.backgroundColor = "", b.selected = !1, b.mousedown = !1) : (a.labelIndex = c, b.mousedown = !0) : (b.color.backgroundColor = a.model.color, a.labelIndex = c, b.selected = !0, b.mousedown = !0), b.mousedown ? (a.model.title = b.title, a.model.link = b.link ? a.pageList[b.link] : a.pageList[0]) : (a.model.title = "", a.model.link = a.pageList[0])
        }, a.selectLink = function (b) {
            a.label.mousedown && (a.label.link = b.num, console.log(a.labelNames))
        }, a.changeLabelName = function () {
            a.label.mousedown && (a.label.title = a.model.title)
        }, a.getPageNames = function () {
            var c = e.sceneId;
            f.getPageNames(c).then(function (c) {
                a.pageList = c.data.list, a.pageList.unshift({
                    id: 0,
                    name: "无"
                }), b.forEach(a.pageList, function (a) {
                    a.name || (a.name = "第" + a.num + "页")
                }), a.model.link = a.pageList[0]
            })
        }, a.getPageNames()
    }]);

    ng.module("app.directives.comp.editor", []).directive("mapEditor", function () {
        return {
            restrict: "AE",
            templateUrl: "directives/mapeditor.tpl.html",
            link: function (a) {
                var b = new BMap.Map("l-map");
                b.centerAndZoom(new BMap.Point(116.404, 39.915), 15);
                var c = {
                        onSearchComplete: function (a) {
                            if (d.getStatus() == BMAP_STATUS_SUCCESS) {
                                for (var b = [], c = 0; c < a.getCurrentNumPois(); c++) b.push(a.getPoi(c).title + ", " + a.getPoi(c).address);
                                document.getElementById("r-result").innerHTML = b.join("<br/>")
                            }
                        }
                    },
                    d = new BMap.LocalSearch(b, c);
                a.searchAddress = function () {
                    d.search(a.address)
                }
            }
        }
    });
    ng.module("scene.create.console.map", ["app.directives.comp.editor"]);
    ng.module("scene.create.console.map").controller("MapConsoleCtrl", ["$scope", "sceneService", "$timeout", function (a, b, c) {
        var d = null,
            e = null;
        a.address = {
            address: "",
            lat: "",
            lng: ""
        }, a.search = {
            address: ""
        }, a.searchResult = [], c(function () {
            d = new BMap.Map("l-map"), d.addControl(new BMap.NavigationControl), d.centerAndZoom(new BMap.Point(116.404, 39.915), 12);
            var b = {
                onSearchComplete: function (b) {
                    e.getStatus() == BMAP_STATUS_SUCCESS && (a.searchResult = b.Fn, a.$apply())
                }
            };
            e = new BMap.LocalSearch(d, b)
        }), a.searchAddress = function () {
            e.search(a.search.address)
        }, a.setPoint = function (b, c, e) {
            a.address.address = e, a.address.lat = b, a.address.lng = c, d.clearOverlays();
            var f = new BMap.Point(c, b),
                g = new BMap.Marker(f);
            d.addOverlay(g);
            var h = new BMap.Label(e, {
                offset: new BMap.Size(20, -10)
            });
            g.setLabel(h), d.centerAndZoom(f, 12)
        }, a.resetAddress = function () {
            a.$close(a.address)
        }, a.cancel = function () {
            a.$dismiss()
        }
    }]);
    ng.module("scene.create.console", [
        "scene.create.console.setting"
        , "scene.create.console.audio"
        , "scene.create.console.input"
        , "scene.create.console.button"
        , "scene.create.console.tel"
        , "scene.create.console.pic_lunbo"
        , "scene.create.console.video"
        , "scene.create.console.link"
        , "scene.create.console.micro"
        , "scene.create.console.map"
        , "scene.create.console.bg"
    ]);
    ng.module("scene.create.console").controller("ConsoleCtrl", ["$scope", function () {}]);

    ng.module("app.directives.editor", []).directive("toolbar", ["$compile", function ($compile) {
        return {
            restrict: "EA",
            replace: !0,
            templateUrl: "directives/toolbar.tpl.html",
            link: function (scope) {
                scope.internalLinks = ng.copy(scope.pages);
                if (!(scope.internalLink || scope.externalLink)) {
                    scope.internalLink = scope.internalLinks[0];
                    scope.externalLink = "http://";
                }
                var colors = ["#000000", "#7e2412", "#ff5400", "#225801", "#0c529e", "#333333", "#b61b52", "#f4711f", "#3bbc1e", "#23a3d3", "#888888", "#d34141", "#f7951e", "#29b16a", "#97daf3", "#cccccc", "#ec7c7c", "#fdea02", "#79c450", "#563679", "#ffffff", "#ffcccc", "#d9ef7f", "#c3f649"],
                    $colorMenu = $(".color-menu"),
                    $bgcolorMenu = $(".bgcolor-menu");
                $.each(colors, function (key, value) {
                    $colorMenu.append($('<li><a dropdown-toggle class="btn" data-edit="foreColor ' + value + '" style="background-color: ' + value + '"></a></li>'));
                });
                $compile($colorMenu.append($('<li><a dropdown-toggle class="btn glyphicon glyphicon-remove" data-edit="foreColor transparent" style="background-color: transparent"></a></li>')))(scope);

                var toRGB = function (color) {
                    var colorReg = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                    color = color.replace(colorReg, function (a, b, c, d) {
                        return b + b + c + c + d + d
                    });
                    var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
                    return rgb ? {
                        r: parseInt(rgb[1], 16),
                        g: parseInt(rgb[2], 16),
                        b: parseInt(rgb[3], 16)
                    } : null;
                };
                $.each(colors, function (key, value) {
                    var color = toRGB(value);
                    $bgcolorMenu.append($('<li><a dropdown-toggle class="btn" data-edit="backColor rgba(' + color.r + "," + color.g + "," + color.b + ', 0.3)" style="background-color: rgba(' + color.r + "," + color.g + "," + color.b + ', 0.3)"></a></li>'))
                });
                $compile($bgcolorMenu.append($('<li><a dropdown-toggle class="btn glyphicon glyphicon-remove" data-edit="backColor transparent" style="background-color: transparent"></a></li>')))(scope);
            }
        }
    }]);
    ng.module("app.directives.addelement", [])
        .directive("addElement", ["$compile", function ($compile) {
            return {
                restrict: "EA",
                link: function (scope, element, attr) {
                    var $elem = $("#emailAddress"), cnt = $("#emailAddress").size() + 1;
                    element.bind("click", function () {
                        var $p_scnt = ng.element('<div><input type="text" id="p_scnt" style="width:100%; height: 30px; margin-top: 15px;" ng-model="attrs.addElement" name="p_scnt_' + cnt + '" placeholder="Input Value" /></div>');
                        $elem.append($p_scnt);
                        var $input = element.find("input");
                        console.log(attr.addElement);
                        $compile($input)(scope);
                        cnt++;
                    });
                }
            };
        }])
        .directive("showIcon", ["$compile", function ($compile) {
            return {
                restrict: "EA",
                require: "ngModel",
                scope: {
                    check: "&callbackFn"
                },
                link: function (scope, element, attr, ctrl) {
                    var originVal, finalVal,
                        $icon = $compile('<a><span class = "glyphicon glyphicon-ok-circle" ng-show="enabled" style = "margin-top: 8px; color: #9ad64b; font-size: 15px;"></span></a>')(scope);
                    scope.update = function () {
                        element[0].blur();
                        scope.check({
                            arg1: {
                                name: ctrl.$name
                            }
                        });
                    };
                    element.bind("focus", function () {
                        originVal = ctrl.$viewValue;
                        element.parent().after($icon);
                        scope.enabled = !0;
                        if ("email" === attr.name || "mobile" === attr.name || "tel" === attr.name)scope.enabled = !1;
                        scope.$apply();
                    })
                        .bind("blur", function () {
                            scope.enabled = !1;
                            finalVal = ctrl.$viewValue;
                            var mobileReg = new RegExp(/(\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/g);
                            if ("mobile" === attr.name && g && !mobileReg.test(element.val())) return void alert("手机号码格式错误");
                            if ("email" === attr.name && g) {
                                var emailReg = new RegExp(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/g);
                                if (!emailReg.test(element.val())) return void alert("邮箱格式错误")
                            }
                            if ((finalVal || originVal) && originVal !== finalVal)scope.update();
                            scope.$apply();
                        });
                }
            };
        }])
        .directive("ngHover", function () {
            return {
                restrict: "EA",
                link: function (scope, element) {
                    $(element).hover(function () {
                        $(element.children()[0]).css("display", "block");
                        $(element.children()[3]).css("display", "block");
                        $(element.children()[4]).css("display", "block")
                    }, function () {
                        $(element.children()[0]).css("display", "none");
                        $(element.children()[3]).css("display", "none");
                        $(element.children()[4]).css("display", "none")
                    });
                }
            };
        })
        .directive("imgClick", function () {
            return {
                restrict: "EA",
                link: function (scope, element) {
                    $(element).bind("click", function () {
                        $(element).find("img").css("border", "4px solid #F60");
                        $(element).siblings().find("img").css("border", 0);
                    });
                }
            };
        })
        .directive("customFocus", function () {
            return {
                restrict: "EA",
                link: function (scope, element) {
                    $(element).siblings().bind("click", function () {
                        element[0].focus()
                    });
                }
            }
        })
        .directive("blurChildren", function () {
            return {
                restrict: "EA",
                link: function (scope, element) {
                    $(element).on("click", function (event) {
                        if (event.target == element[0] || $(event.target).hasClass("badge")) {
                            $(".blurClass").find("input:visible").blur();
                        }
                    });
                }
            };
        })
        .directive("forbiddenClose", function () {
            return {
                restrict: "EA",
                link: function (scope, element) {
                    $(element).on("click", function (event) {
                        event.stopPropagation();
                    });
                }
            };
        })
        .directive("customeImage", function () {
            return {
                restrict: "EA",
                link: function (scope, element) {
                    $(element).hover(function () {
                        $("<div><a></a></div>");
                    }, function () {
                    });
                }
            };
        })
        .directive("slides", function () {
            return {
                restrict: "EA",
                link: function (scope, element) {
                    $(element).slides({
                        preload: !0,
                        play: 5e3,
                        pause: 2500,
                        hoverPause: !0
                    });
                }
            };
        })
        .directive("addClass", function () {
            return {
                restrict: "EA",
                link: function (scope, element) {
                    $(element).closest(".textbox-wrap").find("[autofocus]").focus();
                    $(element).on("blur", function () {
                        $(element).closest(".textbox-wrap").removeClass("focused");
                    })
                        .on("focus", function () {
                            $(element).closest(".textbox-wrap").addClass("focused");
                        });
                }
            };
        })
        .directive("loadScript", ["$http", function ($http) {
            return {
                link: function (scope, element) {
                    var callback = function () {
                        scope.captchaLoaded = !0
                    };
                    scope.$watch(function () {
                        return element[0].getAttribute("src");
                    }, function (src) {
                        src && $http.jsonp(element[0].getAttribute("src")).success(callback).error(callback);
                    });
                    scope.$on("$destroy", function () {
                        ng.element(".gt_widget").remove();
                    });
                }
            }
        }]);
    ng.module("app.directives.component", ["services.scene"])
        .directive("compDraggable", function () {
            return {
                restrict: "A",
                link: function (scope, element, attr) {
                    scope.$on("$destroy", function () {
                        $(element).draggable();
                        $(element).draggable("destroy");
                        element = null;
                    });
                    element.on("$destroy", function () {
                        $(element).draggable();
                        $(element).draggable("destroy");
                        element = null;
                    });
                    $(element).draggable({
                        revert: !1,
                        stack: ".comp-draggable",
                        helper: "panel" == attr.compDraggable || "page" == attr.compDraggable ? "clone" : "",
                        appendTo: "parent",
                        containment: "panel" == attr.compDraggable || "page" == attr.compDraggable ? "" : "parent",
                        zIndex: 1049,
                        opacity: .35,
                        stop: function (event) {
                            $(event.toElement).one("click", function (event) {
                                event.stopImmediatePropagation()
                            });
                        }
                    });
                }
            };
        })
        .directive("compDroppable", function () {
            return {
                restrict: "A",
                link: function (scope, element) {
                    scope.$on("$destroy", function () {
                        $(element).droppable();
                        $(element).droppable("destroy");
                        element = null;
                    });
                    element.on("$destroy", function () {
                        $(element).droppable();
                        $(element).droppable("destroy");
                        element = null;
                    });
                    $(element).droppable({
                        accept: ".comp-draggable",
                        hoverClass: "drop-hover",
                        drop: function (event, ui) {
                            //TODO:http://www.css88.com/jquery-ui-api/droppable/index.html#event-drop
                            if (3 != ui.draggable.attr("ctype")) {
                                var offset = {
                                    left: ui.offset.left - $(this).offset().left + "px",
                                    top: ui.offset.top - $(this).offset().top + "px"
                                };
                                "panel" == ui.draggable.attr("comp-draggable")
                                    ? scope.createComp(ui.draggable.attr("ctype"), offset)
                                    : scope.updateCompPosition(ui.draggable.attr("id"), offset);
                            } else {
                                scope.createComp(3);
                            }
                        }
                    });
                }
            };
        })
        .directive("compSortable", function () {
            return {
                restrict: "A",
                link: function (scope, element) {
                    $(element).sortable({
                        axis: "y", update: function () {
                        }
                    });
                }
            };
        })
        .directive("compResizable", function () {
            return {
                restrict: "A",
                link: function (scope, element) {
                    $(element).resizable({
                        autoHide: !1,
                        containment: "parent",
                        stop: function (event, ui) {
                            if ("4" == $(ui.element).attr("ctype").charAt(0)) {
                                var props = {
                                    width: ui.size.width,
                                    height: ui.size.height,
                                    imgStyle: {
                                        width: ui.element.find("img").width(),
                                        height: ui.element.find("img").height(),
                                        marginTop: ui.element.find("img").css("marginTop"),
                                        marginLeft: ui.element.find("img").css("marginLeft")
                                    }
                                };
                                scope.updateCompSize(ui.element.attr("id"), props)
                            } else {
                                scope.updateCompSize(ui.element.attr("id"), ui.size);
                            }
                            $(event.toElement).one("click", function (event) {
                                event.stopImmediatePropagation()
                            });
                        },
                        resize: function (event, ui) {
                            var rate = $(element).find("img").width() / $(element).find("img").height();
                            if ("4" == $(ui.element).attr("ctype").charAt(0)) {
                                var aspect = ui.size.width / ui.size.height,
                                    img = ui.element.find("img");
                                if (rate >= aspect) {
                                    img.outerHeight(c.size.height);
                                    img.outerWidth(ui.size.height * rate);
                                    img.css("marginLeft", -(img.outerWidth() - ui.size.width) / 2);
                                    img.css("marginTop", 0);
                                } else {
                                    img.outerWidth(ui.size.width);
                                    img.outerHeight(ui.size.width / rate);
                                    img.css("marginTop", -(img.outerHeight() - ui.size.height) / 2);
                                    img.css("marginLeft", 0);
                                }
                            } else {
                                ui.element.find(".element").outerWidth(ui.size.width);
                                ui.element.find(".element").outerHeight(ui.size.height);
                            }
                        }
                    });
                }
            };
        })
        .directive("photoDraggable", function () {
            return {
                restrict: "A",
                link: function (scope, element) {
                    scope.$on("$destroy", function () {
                        $(element).draggable();
                        $(element).draggable("destroy");
                        element = null
                    });
                    element.on("$destroy", function () {
                        $(element).draggable();
                        $(element).draggable("destroy");
                        element = null;
                    });
                    $(element).draggable({
                        revert: !1,
                        helper: "clone",
                        appendTo: ".img_list",
                        zIndex: 1049,
                        opacity: .35,
                        stop: function (event) {
                            $(event.toElement).one("click", function (event) {
                                event.stopImmediatePropagation()
                            });
                        }
                    });
                }
            }
        })
        .directive("cropDroppable", function () {
            return {
                restrict: "A",
                link: function (scope, element) {
                    scope.$on("$destroy", function () {
                        $(element).droppable();
                        $(element).droppable("destroy");
                        element = null
                    });
                    element.on("$destroy", function () {
                        $(element).droppable();
                        $(element).droppable("destroy");
                        element = null;
                    });
                    $(element).droppable({
                        accept: "li",
                        hoverClass: "drop-hover",
                        drop: function (event, ui) {
                            scope.preSelectImage(ui.draggable.attr("photo-draggable"));
                        }
                    });
                }
            }
        })
        .directive("compRotate", function () {
            return {
                restrict: "A",
                link: function (scope, element) {
                    var $element = $(element),
                        $bar = $('<div class="bar bar-rotate bar-radius">');
                    $element.append($bar).append('<div class="bar bar-line">');
                    var rotate, offset = {}, hammer = new Hammer($bar.get(0));
                    hammer.get("pan").set({threshold: 0});
                    hammer.on("panstart", function () {
                        $element.addClass("no-drag");
                        $("body").css({
                            "user-select": "none",
                            cursor: 'url("/assets/images/mouserotate.ico"), default'
                        });
                        var parent = $element.parent();
                        offset = {
                            x: parseFloat($element.css("left")) + parent.offset().left + $element.width() / 2,
                            y: parseFloat($element.css("top")) + parent.offset().top + $element.height() / 2
                        };
                    });
                    hammer.on("panmove", function (event) {
                        var center = event.center,
                            offsetX = center.x - offset.x,
                            offsetY = center.y - offset.y,
                            xy = Math.abs(offsetX / offsetY);
                        rotate = Math.atan(xy) / (2 * Math.PI) * 360;
                        offsetX > 0 && 0 > offsetY
                            ? rotate = 360 + rotate
                            : offsetX > 0 && offsetY > 0
                            ? rotate = 180 - rotate
                            : 0 > offsetX && offsetY > 0
                            ? rotate = 180 + rotate
                            : 0 > offsetX && 0 > offsetY && (rotate = 360 - rotate);
                        rotate > 360 && (rotate -= 360);
                        $element.css({transform: "rotateZ(" + rotate + "deg)"});
                    });
                    hammer.on("panend", function () {
                        $("body").css({"user-select": "initial", cursor: "default"});
                        scope.updateCompAngle($element.attr("id"), rotate);
                        scope.$broadcast("updateTransform", rotate)
                    })
                }
            }
        })
        .directive("compDrag", function () {
            return {
                restrict: "A",
                link: function (scope, element) {
                    var pOffset, transform = 0, angle = 0,

                        caleOffset = {},//f
                        center = {},//g
                        offset = {},//h
                        caleDimension = {},//i

                        $element = $(element),//j
                        $parent = $element.parent(),//k

                        pDimension = {width: $parent.width(), height: $parent.height()},
                        hammer = new Hammer($element.get(0));
                    hammer.get("pan").set({threshold: 0});
                    hammer.on("panstart", function (event) {
                        event.preventDefault();
                        event.srcEvent.preventDefault();
                        if (!$element.hasClass("no-drag")) {
                            $element.css("opacity", .35);
                            $("body").css({"user-select": "none", cursor: "default"});
                            pOffset = $parent.offset();
                            var dimension = {width: $element.width(), height: $element.height()};
                            transform = $element.get(0).style.transform || $element.get(0).style.webkitTransform || 0;
                            transform = transform && transform.replace("rotateZ(", "").replace("deg)", "");
                            transform = transform && parseFloat(transform);
                            if (transform >= 90 && 180 > transform) {
                                transform = 180 - transform;
                            } else if (transform >= 180 && 270 > transform) {
                                transform = 270 - transform;
                            } else if (transform >= 270 && 360 > transform) {
                                transform = 360 - transform;
                            }
                            angle = 2 * transform * Math.PI / 360;

                            var caleHeight, caleWidth;
                            if (0 === angle) {
                                caleHeight = dimension.height;
                                caleWidth = dimension.width;
                            } else {
                                caleHeight = (dimension.width / 2 + dimension.height / 2 / Math.tan(angle)) * Math.sin(angle) * 2;
                                caleWidth = (dimension.width / 2 + dimension.height / 2 / Math.tan(Math.PI / 2 - angle)) * Math.sin(Math.PI / 2 - angle) * 2;
                            }
                            caleDimension = {"height": caleHeight, "width": caleWidth};
                            offset = $element.offset();
                            var position = $element.position();
                            center = event.center;
                            center.top = center.y - position.top;
                            center.bottom = center.y + pDimension.height - (position.top + caleDimension.height);
                            center.left = center.x - position.left;
                            center.right = center.x + pDimension.width - (position.left + caleDimension.width);

                            caleOffset.x = event.center.x - (parseFloat($element.css("left")) + pOffset.left);
                            caleOffset.y = event.center.y - (parseFloat($element.css("top")) + pOffset.top);
                        }
                    });
                    hammer.on("panmove", function (event) {
                        event.preventDefault();
                        if ("img" == event.target.tagName.toLowerCase()) {
                            event.target.ondragstart = function () {
                                return !1;
                            };
                        }
                        if (!$element.hasClass("no-drag")) {
                            if (event.center.y >= center.top && event.center.y <= center.bottom) {
                                $element.css("top", event.center.y - pOffset.top - caleOffset.y);
                            }
                            if (event.center.x >= center.left && event.center.x <= center.right) {
                                $element.css("left", event.center.x - pOffset.left - caleOffset.x);
                            }
                        }
                    });
                    hammer.on("panend", function (event) {
                        if ($element.hasClass("no-drag")) return void $element.removeClass("no-drag");
                        $element.css("opacity", 1);
                        $("body").css({"user-select": "initial", cursor: "default"});

                        $element.position();
                        var offset = {top: $element.css("top"), left: $element.css("left")};
                        scope.updateCompPosition($element.attr("id"), offset);
                        $(event.srcEvent.target).one("click", function (event) {
                            event.stopImmediatePropagation();
                            event.stopPropagation();
                            event.preventDefault();
                            return !1;
                        });
                    });
                }
            }
        })
        .directive("compResize", function () {
            function calculate(width, height, w, h) {
                var dimension = {},
                    rate = width / height,
                    pRate = w / h;
                rate > pRate
                    ? (dimension.width = w, dimension.height = w / rate )
                    : (dimension.height = h, dimension.width = h * rate);
                return dimension;
            }

            function caleDimension(element) {
                var box = element.children(".element-box"),
                    dimension = {width: box.width(), height: box.height()};
                if ("4" == element.attr("ctype").charAt(0)) {
                    var img = element.find("img"),
                        rate = img.width() / img.height(),
                        r = dimension.width / dimension.height;
                    if (rate >= r) {
                        img.outerHeight(dimension.height);
                        img.outerWidth(dimension.height * rate);
                        img.css("marginLeft", -(img.outerWidth() - dimension.width) / 2);
                        img.css("marginTop", 0);
                    } else {
                        img.outerWidth(dimension.width);
                        img.outerHeight(dimension.width / rate);
                        img.css("marginTop", -(img.outerHeight() - dimension.height) / 2);
                        img.css("marginLeft", 0)
                    }
                } else if ("p" == element.attr("ctype").charAt(0)) {
                    var li = element.find("li"),
                        img = element.find("img");
                    img.each(function (index) {
                        var self = $(this),
                            cale = calculate(self.width(), self.height(), dimension.width, dimension.height);
                        self.css({width: cale.width, height: cale.height});
                        li.eq(index).css({lineHeight: dimension.height + "px"});
                    });
                } else {
                    element.find(".element").css({width: dimension.width, height: dimension.height});
                }
            }

            function updateDimension(scope, element) {
                var dimension = {width: element.width(), height: element.height()};
                if ("4" == element.attr("ctype").charAt(0)) {
                    var img = element.find("img"),
                        props = {
                            width: dimension.width,
                            height: dimension.height,
                            imgStyle: {
                                width: img.width(),
                                height: img.height(),
                                marginTop: img.css("marginTop"),
                                marginLeft: img.css("marginLeft")
                            }
                        };
                    scope.updateCompSize(element.attr("id"), props);
                } else if ("p" == element.attr("ctype").charAt(0)) {
                    var slide = element.find(".slide"),
                        dot = slide.find(".dot"),
                        id = slide.attr("id"),
                        length = slide.attr("length");
                    INTERVAL_OBJ[id] && (clearInterval(INTERVAL_OBJ[id]), delete INTERVAL_OBJ[id]);
                    f.swipeSlide({
                        autoSwipe: "true" == slide.attr("autoscroll"),
                        continuousScroll: !0,
                        speed: slide.attr("interval"),
                        transitionType: "cubic-bezier(0.22, 0.69, 0.72, 0.88)",
                        lazyLoad: !0,
                        clone: !1,
                        length: i
                    }, function (index, callback) {
                        --index < 0 && (index = length - 1);
                        dot.children().eq(index).addClass("cur").siblings().removeClass("cur");
                        callback && (INTERVAL_OBJ[id] = callback);
                    });
                    scope.updateCompSize(element.attr("id"), dimension);
                } else {
                    scope.updateCompSize(element.attr("id"), dimension);
                }
            }

            function resizeHandler(scope, element, target, resize) {
                var width, height, left, top,
                    $element = $(element),
                    ul = $element.closest("ul"),
                    transform = 0,
                    angle = 0,
                    minWidth = parseFloat($element.css("min-width") || 50),
                    minHeight = parseFloat($element.css("min-height") || 30),
                    hammer = new Hammer($(target).get(0));
                hammer.get("pan").set({threshold: 0, direction: Hammer.DIRECTION_ALL});
                hammer.on("panstart", function () {
                    $element.addClass("no-drag");

                    width = $element.width();
                    height = $element.height();
                    left = parseFloat($element.css("left"));
                    top = parseFloat($element.css("top"));

                    ul.css("cursor", resize);
                    $("body").css({"user-select": "none", cursor: "default"});

                    transform = $element.get(0).style.transform;
                    transform = transform && transform.replace("rotateZ(", "").replace("deg)", "");
                    transform = transform && parseFloat(transform);
                    angle = 2 * transform * Math.PI / 360
                });
                hammer.on("panmove", function (event) {
                    switch (resize) {
                        case RESIZE.RESIZE_W:
                            if (width - event.deltaX <= minWidth) break;
                            $element.css({left: left + event.deltaX, width: width - event.deltaX});
                            break;
                        case RESIZE.RESIZE_E:
                            $element.css({width: width + event.deltaX});
                            break;
                        case RESIZE.RESIZE_N:
                            if (height - event.deltaY <= minHeight) break;
                            $element.css({top: top + event.deltaY, height: height - event.deltaY});
                            break;
                        case RESIZE.RESIZE_S:
                            $element.css({height: top + event.deltaY});
                            break;
                        case RESIZE.RESIZE_SE:
                            $element.css({height: height + event.deltaY, width: width + event.deltaX});
                            break;
                        case RESIZE.RESIZE_SW:
                            if (width - event.deltaX <= minWidth) break;
                            $element.css({
                                left: left + event.deltaX,
                                height: height + event.deltaY,
                                width: width - event.deltaX
                            });
                            break;
                        case RESIZE.RESIZE_NE:
                            if (height - event.deltaY <= minHeight) break;
                            $element.css({
                                top: top + event.deltaY,
                                height: height - event.deltaY,
                                width: width + event.deltaX
                            });
                            break;
                        case RESIZE.RESIZE_NW:
                            height - event.deltaY > minHeight && $element.css("top", top + event.deltaY);
                            width - event.deltaX > minWidth && $element.css("left", left + event.deltaX);
                            $element.css({
                                height: height - event.deltaY,
                                width: width - event.deltaX
                            });
                            break;
                    }
                    if (event.deltaX > 0 && $element.width() > 320 - parseFloat($element.css("left"))) {
                        $element.width(320 - parseFloat($element.css("left")));
                    }
                    if (event.deltaX < 0 && $element.width() > left + width) {
                        $element.width(left + width);
                        $element.css("left", 0);
                    }
                    if (event.deltaY > 0
                        && $element.height() > 486 - parseFloat($element.css("top"))) {
                        $element.height(486 - parseFloat($element.css("top")));
                    }
                    if (event.deltaY < 0 && $element.height() > top + height) {
                        $element.height(top + height);
                        $element.css("top", 0);
                    }
                    caleDimension($element);
                });
                hammer.on("panend", function () {
                    ul.css("cursor", "default");
                    $("body").css({"user-select": "initial", cursor: "default"});
                    updateDimension(scope, $element);
                    scope.$broadcast("updateMaxRadius", $element);
                });
            }

            var RESIZE = {
                RESIZE_W: "w-resize",
                RESIZE_E: "e-resize",
                RESIZE_N: "n-resize",
                RESIZE_S: "s-resize",
                RESIZE_SE: "se-resize",
                RESIZE_SW: "sw-resize",
                RESIZE_NE: "ne-resize",
                RESIZE_NW: "nw-resize"
            };
            return {
                restrict: "A",
                link: function (scope, element) {
                    var $bar_n = $('<div class="bar bar-n" >'),
                        $bar_s = $('<div class="bar bar-s" >'),
                        $bar_e = $('<div class="bar bar-e" >'),
                        $bar_w = $('<div class="bar bar-w" >'),
                        $bar_ne = $('<div class="bar bar-ne bar-radius">'),
                        $bar_nw = $('<div class="bar bar-nw bar-radius">'),
                        $bar_se = $('<div class="bar bar-se bar-radius">'),
                        $bar_sw = $('<div class="bar bar-sw bar-radius">');
                    element.append($bar_n).append($bar_s).append($bar_e).append($bar_w)
                        .append($bar_ne).append($bar_nw).append($bar_se).append($bar_sw)
                        .unbind("mousedown").mousedown(function () {
                            $(this).children(".bar").show().end()
                                .siblings().children(".bar").hide();
                        });
                    element.parent().unbind("mousedown").mousedown(function (event) {
                        if (!$(event.target).closest("li").length) {
                            $(this).children("li").find(".bar").hide();
                            scope.$emit("hideStylePanel");
                        }
                    });
                    resizeHandler(scope, element, $bar_n, RESIZE.RESIZE_N);
                    resizeHandler(scope, element, $bar_s, RESIZE.RESIZE_S);
                    resizeHandler(scope, element, $bar_e, RESIZE.RESIZE_E);
                    resizeHandler(scope, element, $bar_w, RESIZE.RESIZE_W);
                    resizeHandler(scope, element, $bar_ne, RESIZE.RESIZE_NE);
                    resizeHandler(scope, element, $bar_nw, RESIZE.RESIZE_NW);
                    resizeHandler(scope, element, $bar_se, RESIZE.RESIZE_SE);
                    resizeHandler(scope, element, $bar_sw, RESIZE.RESIZE_SW);
                }
            }
        })
        .directive("pasteElement", ["sceneService", function (sceneService) {
            function generateMenu() {
                var element = $('<ul id="pasteMenu" class="dropdown-menu" style="min-width: 100px; display: block;" role="menu" aria-labelledby="dropdownMenu1"><li class="paste" role="presentation"><a role="menuitem" tabindex="-1"><div class="fa fa-paste" style="color: #08a1ef;"></div>&nbsp;&nbsp;粘贴</a></li></ul>')
                    .css({position: "absolute", "user-select": "none"});
                element.find(".paste").on("click", function () {
                    sceneService.pasteElement(sceneService.originalElemDef, sceneService.copyElemDef, sceneService.sameCopyCount);
                    element.hide();
                });
                return element;
            }

            return {
                restrict: "EA",
                link: function (scope, element) {
                    var $element = $(element);
                    $element.on("contextmenu", function (events) {
                        if (q) {
                            var menu = generateMenu(), element = $("#pasteMenu");
                            if (element.length > 0)element.remove();
                            $("#eq_main").append(menu);
                            menu.css({
                                left: events.pageX + $("#eq_main").scrollLeft() + 15,
                                top: events.pageY + $("#eq_main").scrollTop()
                            }).show();
                            $("#eq_main").mousemove(function (events) {
                                if (
                                    events.pageX < $("#pasteMenu").offset().left - 20
                                    || events.pageX > $("#pasteMenu").offset().left + $("#pasteMenu").width() + 20
                                    || events.pageY < $("#pasteMenu").offset().top - 20
                                    || events.pageY > $("#pasteMenu").offset().top + $("#pasteMenu").height() + 20) {
                                    $("#pasteMenu").hide();
                                    $(this).unbind("mousemove");
                                }
                            });
                        }
                        return false;
                    });
                }
            }
        }]);
}(window, window.angular);