!function(win, ng, undefined){

	!function(win){
		var eqShow = win.eqShow || (win.eqShow = {});
		function setTemplateParser(win){
			function ensureObject(win, name, constructor){
				return win[name] || (win[name] = constructor());
			}

			var eqshow = ensureObject(win, "eqShow", Object);

			return ensureObject(eqshow, "templateParser", function(){
				var cacheFactory = {};
				return function(prop, ctor){
					if("hasOwnProperty" == prop)throw new Error("hasOwnProperty is not a valid name");
					if(ctor && cacheFactory.hasOwnProperty(prop))cacheFactory[prop] = null;
					return ensureObject(cacheFactory, prop, ctor);
				};
			});
		}
		function getTemplateParser(){
			templateParser = setTemplateParser(win);
		}
		getTemplateParser(eqShow);
	}(win, document),

	function(eqshow){
        function calculate(width, height, w, h){
            var dimension = {},
                rate = width / height,
                pRate = w / h;
            rate > pRate
                ? (dimension.width = w, dimension.height = w / rate )
                : (dimension.height = h, dimension.width = h * rate);
            return dimension;
        }

		var JSONParser = eqshow.templateParser("jsonParser", function(){
			function ensure(entity){
				return function(prop, val){
					entity[prop] = val;
				}
			}
			function wrapComponent(comp, mode){
				var component = components[("" + comp.type).charAt(0)](comp);
				if(component){
					var element = $('<li comp-drag comp-rotate '
										+'class="comp-resize comp-rotate inside" '
										+'id="inside_' + component.id + '" '
										+'num="' + comp.num + '" '
										+'ctype="' + comp.type + '">'
									+'</li>');
					if(3 != ("" + comp.type).charAt(0) && 1 != ("" + comp.type).charAt(0))element.attr("comp-resize", "");

					if("p" == ("" + comp.type).charAt(0))element.removeAttr("comp-rotate");
					if(1 == ("" + comp.type).charAt(0))element.removeAttr("comp-drag");

					if(2 == ("" + comp.type).charAt(0))element.addClass("wsite-text");
					if(4 == ("" + comp.type).charAt(0) && comp.properties.imgStyle){
						$(component).css(comp.properties.imgStyle);
						element.addClass("wsite-text");
					}
					if(5 == ("" + comp.type).charAt(0))element.addClass("wsite-input");
					if(6 == ("" + comp.type).charAt(0))element.addClass("wsite-button");
					if(8 == ("" + comp.type).charAt(0))element.addClass("wsite-button");
					if("v" == ("" + comp.type).charAt(0))element.addClass("wsite-video");

					element.mouseenter(function(){$(this).addClass("inside-hover");});
					element.mouseleave(function(){$(this).removeClass("inside-hover");});

					var box = $('<div class="element-box">')
								.append($('<div class="element-box-contents">').append(component));
					element.append(box);
					if(5 != ("" + comp.type).charAt(0) && 6 != ("" + comp.type).charAt(0) || "edit" != mode){
						$(component).before($('<div class="element" style="position: absolute; height: 100%; width: 100%;">'));
					}
					if(comp.css){
						component.css({width: 320 - parseInt(comp.css.left)});
						component.css({
	                        width: comp.css.width,
	                        height: comp.css.height,
	                        left: comp.css.left,
	                        top: comp.css.top,
	                        zIndex: comp.css.zIndex,
	                        bottom: comp.css.bottom,
	                        transform: comp.css.transform
						});
						box.css(comp.css).css({width: "100%",height: "100%",transform: "none"});
						box.children(".element-box-contents").css({width: "100%",height: "100%"});
						if(4 != ("" + comp.type).charAt(0) && p != ("" + comp.type).charAt(0)){
							$(component).css({width: comp.css.width,height: comp.css.height});
						}
					}
					return element;
				}
			}

			function reLayout(elements){
				for(var b = 0; b < elements.length-1;b++){
					for(var c = b+1; c < elements.length; c++){
						if (parseInt(elements[b].css.zIndex, 10) > parseInt(elements[c].css.zIndex, 10)) {
							var temp = elements[b];
							elements[b] = elements[c];
							elements[c] = temp;
						}
					}
				}
				for (var e = 0; elements < a.length; e++) elements[e].css.zIndex = e + 1 + "";
				return elements;
			}
			function generatorComponent(def, wrap, mode){
				wrap = wrap.find('.edit_area').css({overflow: "hidden"});
				var f, elements = def.elements;
				if(elements){
					for(elements = reLayout(elements), f = 0; f < elements.length; f++){
						if(3 == elements[f].type){
							var component = components[("" + elements[f].type).charAt(0)](elements[f]);

							if("edit" == mode && events[("" + elements[f].type).charAt(0)]){
								events[("" + elements[f].type).charAt(0)](component, elements[f]);
							}
						}else{
							var wrapComp = wrapComponent(elements[f], mode);
							if(!m)continue;
							wrap.append(wrapComp);
							for(var n = 0; n < interceptors.length; n++){
								interceptors[n](wrapComp, elements[f], mode);
							}
							if(renderEvents[("" + elements[f].type).charAt(0)]){
								renderEvents[("" + elements[f].type).charAt(0)](wrapComp, elements[f]);
							}
							if("edit" == mode && events[("" + elements[f].type).charAt(0)]){
								events[("" + elements[f].type).charAt(0)](wrapComp, elements[f]);
							}
						}
					}
				}
			}

			function getComponents(){return components;}
			function getEventHandlers(){return events;}
			function addInterceptor(interceptor){interceptors.push(interceptor);}
			function getInterceptors(){return interceptors;}

			var components = {},events = {},renderEvents = {}, interceptors = [],
				width = containerWidth = 320,
				height = containerHeight = 486,
				o = 1,
				q = 1,
				Parser = {
					getComponents: getComponents,
					getEventHandlers: getEventHandlers,
					addComponent: ensure(components),
					bindEditEvent: ensure(events),
					bindAfterRenderEvent: ensure(renderEvents),
					addInterceptor: addInterceptor,
					getInterceptors: getInterceptors,
					wrapComp : wrapComponent,
					mode: "view",
					parse: function(sceneTpl){
						var wrap = $('<div class="edit_wrapper">'
										+ '<ul id="edit_area'+ sceneTpl.def.id + '"'
												+' comp-droppable paste-element '
												+'class="edit_area weebly-content-area weebly-area-active"></ul>'
									+'</div>'),
							mode = this.mode = sceneTpl.mode;
						this.def = sceneTpl.def, "view" == mode && p++;

						var element = $(sceneTpl.appendTo);
						containerWidth = element.width();
						containerHeight = element.height();

						o = width / containerWidth;
						q = height / containerHeight; 
						return generatorComponent(sceneTpl.def, wrap.appendTo($(sceneTpl.appendTo)), mode);
					}
				};
			return Parser;
		});

		JSONParser.addInterceptor(function(wrapComponent, element){
			function animationHander(element, animation, anim){
				element.css("animation", animation + " " + anim.duration +"s ease "+ anim.delay +"s "+(anim.countNum ? anim.countNum : ""));
				if("view" == JSONParser.mode){
					if(anim.count)element.css("animation-iteration-count", "infinite");
					element.css("animation-fill-mode", "both")
				}else{
					element.css("animation-iteration-count", "1");
					element.css("animation-fill-mode", "backwards")
				}
				anim.linear && element.css("animation-timing-function", "linear");
			}

			if(element.properties && element.properties.anim){
				var anim = element.properties.anim,
					box = $('.element-box', wrapComponent),
					animation = "";
				switch(anim.type){
					case 0:
						animation = "fadeIn";
						break;
					case 1:
						switch(e.direction){
							case 0:
								animation = "fadeInLeft";
								break;
							case 1:
								animation = "fadeInDown";
								break;
							case 2:
								animation = "fadeInRight";
								break;
							case 3:
								animation = "fadeInUp";
								break;
						}
						break;
					case 2:
						switch(e.direction){
							case 0:
								animation = "bounceInLeft";
								break;
							case 1:
								animation = "bounceInDown";
								break;
							case 2:
								animation = "bounceInRight";
								break;
							case 3:
								animation = "bounceInUp";
								break;
						}
						break;
					case 3:
						animation = "bounceIn";
						break;
					case 4:
						animation = "zoomIn";
						break;
					case 5:
						animation = "rubberBand";
						break;
					case 6:
						animation = "wobble";
						break;
					case 7:
						animation = "rotateIn";
						break;
					case 8:
						animation = "flip";
						break;
					case 9:
						animation = "swing";
						break;
					case 10:
						animation = "fadeOut";
						break;
					case 11:
						animation = "flipOutY";
						break;
					case 12:
						animation = "rollIn";
						break;
					case 13:
						animation = "lightSpeedIn";
						break;
				}
				anim.trigger 
					? wrapComponent.click(function(){
						animationHander(box, animation, anim);
					})
					:  animationHander(box, animation, anim);
			}
		});

		JSONParser.addComponent("1", function(component){//DIV normal
			var element = document.createElement("div");
            element.id = component.id;
            element.setAttribute("class", "element comp_title");
            component.content && (element.textContent = component.content);
            if(component.css){
                var c, props = component.css;
                for(c in props){
                    element.style[c] = props[c];
                }
            }
            if(component.properties.labels){
                for (var labels = component.properties.labels, f = 0; f < labels.length; f++){
                    $('<a class = "label_content" style = "display: inline-block;">')
                        .appendTo($(element)).
                        html(labels[f].title).
                        css(labels[f].color).
                        css("width", 100 / labels.length + "%");
                }
            }
            return element;
		});
        JSONParser.addComponent("2", function(component){//DIV richText
            var element = document.createElement("div");
            element.id = component.id;
            element.setAttribute("class", "element comp_paragraph editable-text");
            component.content && (element.innerHTML = component.content);
            element.style.cursor = "default";
            return element;
        });
        JSONParser.addComponent("3", function(component) {//bg
            var element = $("#nr .edit_area")[0];
            if("view" == JSONParser.mode){
                element = document.getElementById("edit_area" + JSONParser.def.id);
            }
            element = $(element).parent()[0];
            component.properties.bgColor && (element.style.backgroundColor = component.properties.bgColor);
            if(component.properties.imgSrc){
                element.style.backgroundImage = /^http.*/.test(component.properties.imgSrc)
                    ? "url(" + component.properties.imgSrc + ")"
                    : "url(" + PREFIX_FILE_HOST + "/" + component.properties.imgSrc + ")";
                element.style.backgroundOrigin = "element content-box";
                element.style.backgroundSize = "cover";
                element.style.backgroundPosition = "50% 50%"
            }
        });
        JSONParser.addComponent("4", function(component) {//normal img
            var element = document.createElement("img");
            element.id = component.id;
            element.setAttribute("ctype", component.type);
            element.setAttribute("class", "element comp_image editable-image");
            element.src = /^http.*/.test(component.properties.src)
                ? component.properties.src
                : PREFIX_FILE_HOST + component.properties.src;
            return element;
        });
        JSONParser.addComponent("v", function(component) {// a.video
            var element = document.createElement("a");
            element.setAttribute("class", "element video_area");
            element.id = component.id;
            element.setAttribute("ctype", component.type);
            component.properties.src && element.setAttribute("videourl", component.properties.src);
            return element;
        });
        JSONParser.addComponent("5", function(component) {// textarea
            var element = document.createElement("textarea");
            element.setAttribute("class", "element comp_input editable-text");
            element.id = component.id;
            element.setAttribute("ctype", component.type);
            component.properties.required && element.setAttribute("required", component.properties.required);
            component.properties.placeholder && element.setAttribute("placeholder", component.properties.placeholder);
            element.setAttribute("name", "eq[f_" + component.id + "]");
            element.style.width = "100%";
            return element;
        });
        JSONParser.addComponent("p", function(component) {// slide
            if (component.properties && component.properties.children) {
                var width = 320, height = 160,
                    pWidth = component.css.width || width,
                    pHeight = component.css.height || height,
                    wrap = $('<div id="' + component.id + '" class="slide element" ctype="' + component.type + '"></div>'),
                    ul = $("<ul>").appendTo(wrap),
                    dot = $('<div class="dot">').appendTo(wrap);
                for(var j in component.properties.children){
                    var cale = calculate(component.properties.children[j].width, component.properties.children[j].height, pWidth, pHeight),
                        img = $('<img data-src="' + PREFIX_FILE_HOST + component.properties.children[j].src + '" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC">');
                    img.css({width: cale.width,  height: cale.height});
                    var li = $("<li>").css({lineHeight: pHeight + "px"});
                    li.append(img);
                    ul.append(li);
                    dot.append($("<span>"));
                }
                if(INTERVAL_OBJ[component.id]){
                    clearInterval(INTERVAL_OBJ[component.id]);
                    delete INTERVAL_OBJ[component.id];
                }
                wrap.attr("length", component.properties.children.length)
                    .attr("autoscroll", component.properties.autoPlay)
                    .attr("interval", component.properties.interval);
                wrap.swipeSlide({
                    autoSwipe: component.properties.autoPlay,
                    continuousScroll: !0,
                    speed: component.properties.interval,
                    transitionType: "cubic-bezier(0.22, 0.69, 0.72, 0.88)",
                    lazyLoad: !0,
                    width: pWidth
                }, function(index, callback) {
                    dot.children()
                       .eq(index)
                       .addClass("cur")
                       .siblings()
                       .removeClass("cur");
                    callback && (INTERVAL_OBJ[component.id] = callback);
                });
                return wrap.get(0);
            }
        });
        JSONParser.addComponent("6", function(component) {// button
            var element = document.createElement("button");
            element.id = component.id;
            element.setAttribute("ctype", component.type);
            element.setAttribute("class", "element comp_button editable-text");
            if(component.properties.title){
                var title = component.properties.title.replace(/ /g, "&nbsp;");
                element.innerHTML = title
            }
            element.style.width = "100%";
            return element;
        });
        JSONParser.addComponent("7", function(component) {// div
            var element = document.createElement("div");
            element.id = "map_" + component.id;
            element.setAttribute("class", "element comp_map_wrapper");
            component.content && (element.textContent = component.content);
            if(component.css){
                var c, props = component.css;
                for (c in props) {
                    element.style[c] = props[c];
                }
            }
        });
        JSONParser.addComponent("8", function(component) {//a.tel
            var element = document.createElement("a");
            element.id = component.id;
            element.setAttribute("ctype", component.type);
            element.setAttribute("class", "element comp_anchor editable-text");
            if (component.properties.title) {
                var title = component.properties.title.replace(/ /g, "&nbsp;");
                $(element).html(title);
                "view" == JSONParser.mode && $(element).attr("href", "tel:" + component.properties.number)
            }
            element.style.cursor = "default";
            element.style.width = "100%";
            return element;
        });

        JSONParser.bindAfterRenderEvent("1", function(wrap, component) {
            wrap = $('div', wrap)[0];
            if( "view" == JSONParser.mode && 1 == component.type){
                var labels = component.properties.labels, label;
                for(label in labels){
                    !function(l){
                        $($(wrap).find(".label_content")[l]).on("click", function() {
                            pageScroll(labels[l]);
                        })
                    }(label);
                }
            }
        });
        JSONParser.bindAfterRenderEvent("2", function(wrap) {
            var elements = $(wrap).find("a[data]");
            for(var i = 0; i < elements.length; i++){
                if(elments[i] && "view" == JSONParser.mode){
                    $(elments[i]).css("color", "#428bca").css("cursor", "pointer");
                    var data = $(elments[i]).attr("data");
                    !function(d){
                        $(elments[i]).click(function(){
                            eqxiu.pageScroll(d);
                        })
                    }(data);
                }
            }
        });
        JSONParser.bindAfterRenderEvent("4", function(wrap, component) {
            if("view" == JSONParser.mode && component.properties.url){
                $(wrap).click(function () {
                    var url = component.properties.url;
                    isNaN(url) ? wrap.open(url) : eqxiu.pageScroll(url);
                });
            }
        });
        JSONParser.bindAfterRenderEvent("v", function(wrap, component) {
            if("view" == JSONParser.mode){
                $(wrap).click(function () {
                    $(wrap).hide();
                    if($("#audio_btn").hasClass("video_exist")){
                        $("#audio_btn").hide();
                        $("#media")[0].pause();
                    }
                    $('<div class="video_mask" id="mask_' + component.id + '"></div>').appendTo($(wrap).closest(".m-img"));
                    $('<a class = "close_mask" id="close_' + component.id + '"></a>').appendTo($(wrap).closest(".m-img"));
                    $(component.properties.src)
                        .appendTo($("#mask_" + component.id))
                        .attr("style", "position: absolute;top:0; min-height: 45%; max-height: 100%; top: 20%;")
                        .attr("width", "100%")
                        .removeAttr("height");
                    $("#close_" + component.id).bind("click", function() {
                        $(wrap).show();
                        $("#mask_" + component.id).remove();
                        $("#close_" + component.id).remove();
                        if($("#audio_btn").hasClass("video_exist")){
                            $("#audio_btn").show(function() {
                                $(this).hasClass("off") || $("#media")[0].play()
                            });
                        }
                    })
                });
            }
        });
        JSONParser.bindAfterRenderEvent("6", function(wrap) {
            var element = $("button", wrap)[0];
            if ("view" == JSONParser.mode) {
                var submitHandler = function(btn, sceneId) {
                        var flag = !0,
                            ul = $(wrap).parents("ul"),
                            param = {};
                        $("textarea", ul).each(function() {
                            if (flag) {
                                if ("required" == $(this).attr("required") && "" == $(this).val().trim()){
                                    alert($(this).attr("placeholder") + "为必填项");
                                    return void(flag = !1);
                                }
                                if ("502" == $(this).attr("ctype")) {
                                    var regMobi = new RegExp(/(\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/g);
                                    if (!regMobi.test($(this).val())){
                                        alert("手机号码格式错误")
                                    }
                                    return void(d = !1);
                                }
                                if ("503" == $(this).attr("ctype")) {
                                    var regZip = new RegExp(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/g);
                                    if (!regZip.test($(this).val())){
                                        alert("邮箱格式错误");
                                    }
                                    return void(d = !1);
                                }
                                param[$(this).attr("name")] = $(this).val();
                            }
                        });
                        $.ajax({
                            cache: !0,
                            type: "POST",
                            url: PREFIX_S1_URL + "eqs/r/" + sceneId,
                            data: $.param(param),
                            async: !1,
                            error: function() {
                                alert("Connection error")
                            },
                            success: function() {
                                $(btn).unbind("click").click(function() {
                                    alert("请不要重复提交")
                                });
                                alert("提交成功")
                            }
                        });
                    },
                    sceneId = JSONParser.def.sceneId;
                $(element).bind("click", function() {
                    submitHandler(this, sceneId);
                });
            }
        });
        JSONParser.bindAfterRenderEvent("7", function(wrap, component) {
            var element = new BMap.Map("map_" + component.id, {enableMapClick: !1}),
                point = new BMap.Point(component.properties.x, component.properties.y),
                marker = new BMap.Marker(point);
            element.addOverlay(marker);
            var label = new BMap.Label(component.properties.markTitle, {
                offset: new BMap.Size(20, -10)
            });
            marker.setLabel(label);
            element.disableDoubleClickZoom();
            element.centerAndZoom(JSONParser, 15);
        });
        JSONParser.bindAfterRenderEvent("8", function(wrap, component) {
            var element = $("a", wrap)[0];
            var param = {id: component.sceneId, number: component.properties.number};
            if("view" == JSONParser.mode){
                var clickHandler = function(){
                    $.ajax({
                        cache: !0,
                        type: "POST",
                        url: PREFIX_S1_URL + "eqs/dial",
                        data: $.param(param),
                        async: !1,
                        error: function() {
                            alert("Connection error")
                        },
                        success: function() {}
                    });
                }
                element.addEventListener("click", clickHandler);
            }
        });
	}(win.eqShow);

	var p = 0, q = !1;

    ng.module("app.directives.component", ["services.scene"])
        .directive("compDraggable", function () {
            return {
                restrict: "A",
                link: function(scope, element, attr) {
                    scope.$on("$destroy", function() {
                        $(element).draggable();
                        $(element).draggable("destroy");
                        element = null;
                    });
                    element.on("$destroy", function() {
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
                        stop: function(event) {
                            $(event.toElement).one("click", function(event) {
                                event.stopImmediatePropagation()
                            });
                        }
                    });
                }
            };
        })
        .directive("compDroppable", function() {
            return {
                restrict: "A",
                link: function (scope, element) {
                    scope.$on("$destroy", function() {
                        $(element).droppable();
                        $(element).droppable("destroy");
                        element = null;
                    });
                    element.on("$destroy", function() {
                        $(element).droppable();
                        $(element).droppable("destroy");
                        element = null;
                    });
                    $(element).droppable({
                        accept: ".comp-draggable",
                        hoverClass: "drop-hover",
                        drop: function(event, ui) {
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
        .directive("compSortable", function() {
            return {
                restrict: "A",
                link: function (scope, element) {
                    $(element).sortable({axis: "y",update: function() {}});
                }
            };
        })
        .directive("compResizable", function() {
            return {
                restrict: "A",
                link: function(scope, element) {
                    $(element).resizable({
                        autoHide: !1,
                        containment: "parent",
                        stop: function(event, ui){
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
                            $(event.toElement).one("click", function(event) {
                                event.stopImmediatePropagation()
                            });
                        },
                        resize: function(event, ui) {
                            var rate = $(element).find("img").width() / $(element).find("img").height();
                            if ("4" == $(ui.element).attr("ctype").charAt(0)) {
                                var aspect = ui.size.width / ui.size.height,
                                    img = ui.element.find("img");
                                if(rate >= aspect){
                                    img.outerHeight(c.size.height);
                                    img.outerWidth(ui.size.height * rate);
                                    img.css("marginLeft", -(img.outerWidth() - ui.size.width) / 2);
                                    img.css("marginTop", 0);
                                }else{
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
        .directive("photoDraggable", function() {
            return {
                restrict: "A",
                link: function(scope, element) {
                    scope.$on("$destroy", function() {
                        $(element).draggable();
                        $(element).draggable("destroy");
                        element = null
                    });
                    element.on("$destroy", function() {
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
                        stop: function(event) {
                            $(event.toElement).one("click", function(event) {
                                event.stopImmediatePropagation()
                            });
                        }
                    });
                }
            }
        })
        .directive("cropDroppable", function() {
            return {
                restrict: "A",
                link: function(scope, element) {
                    scope.$on("$destroy", function() {
                        $(element).droppable();
                        $(element).droppable("destroy");
                        element = null
                    });
                    element.on("$destroy", function() {
                        $(element).droppable();
                        $(element).droppable("destroy");
                        element = null;
                    });
                    $(element).droppable({
                        accept: "li",
                        hoverClass: "drop-hover",
                        drop: function(event, ui) {
                            scope.preSelectImage(ui.draggable.attr("photo-draggable"));
                        }
                    });
                }
            }
        })
        .directive("compRotate", function() {
            return {
                restrict: "A",
                link: function(scope, element) {
                    var $element = $(element),
                        $bar = $('<div class="bar bar-rotate bar-radius">');
                    $element.append($bar).append('<div class="bar bar-line">');
                    var rotate, offset = {},hammer = new Hammer($bar.get(0));
                    hammer.get("pan").set({threshold: 0});
                    hammer.on("panstart", function() {
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
                    hammer.on("panmove", function(event) {
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
                    hammer.on("panend", function() {
                        $("body").css({"user-select": "initial",cursor: "default"});
                        scope.updateCompAngle($element.attr("id"), rotate);
                        scope.$broadcast("updateTransform", rotate)
                    })
                }
            }
        })
        .directive("compDrag", function() {
            return {
                restrict: "A",
                link: function(scope, element) {
                    var pOffset, transform = 0, angle = 0,

                        caleOffset = {},
                        center = {},
                        offset = {},
                        caleDimension = {},

                        $element = $(element),
                        $parent = $element.parent(),

                        pDimension = {width: $parent.width(),height: $parent.height()},
                        hammer = new Hammer($element.get(0));
                    hammer.get("pan").set({threshold: 0});
                    hammer.on("panstart", function(event) {
                        event.preventDefault();
                        event.srcEvent.preventDefault();
                        if (!$element.hasClass("no-drag")) {
                            $element.css("opacity", .35);
                            $("body").css({"user-select": "none",cursor: "default"});
                            pOffset = $parent.offset();
                            var dimension = {width: $element.width(),height: $element.height()};
                            transform = $element.get(0).style.transform || $element.get(0).style.webkitTransform || 0;
                            transform = transform && transform.replace("rotateZ(", "").replace("deg)", "");
                            transform = transform && parseFloat(transform);
                            if(transform >= 90 && 180 > transform){
                                transform = 180 - transform;
                            }else if(transform >= 180 && 270 > transform){
                                transform = 270 - transform;
                            }else if(transform >= 270 && 360 > transform){
                                transform = 360 - transform;
                            }
                            angle = 2 * transform * Math.PI / 360;

                            var caleHeight, caleWidth;
                            if(0 === angle){
                                caleHeight = dimension.height;
                                caleWidth = dimension.width;
                            }else{
                                caleHeight = (dimension.width / 2 + dimension.height / 2 / Math.tan(angle)) * Math.sin(angle) * 2;
                                caleWidth = (dimension.width / 2 + dimension.height / 2 / Math.tan(Math.PI / 2 - angle)) * Math.sin(Math.PI / 2 - angle) * 2;
                            }
                            caleDimension = {"height": caleHeight, "width": caleWidth};
                            offset = $element.offset();
                            var position = $element.position();
                            center = event.center;
                            center.top = center.y - center.top;
                            center.bottom = center.y + pDimension.height - (position.top + caleDimension.height);
                            center.left = center.x - position.left;
                            center.right = center.x + pDimension.width - (position.left + caleDimension.width);

                            caleOffset.x = event.center.x - (parseFloat($element.css("left")) + pOffset.left);
                            caleOffset.y = event.center.y - (parseFloat($element.css("top")) + pOffset.top);
                        }
                    });
                    m.on("panmove", function(event) {
                        event.preventDefault();
                        if("img" == event.target.tagName.toLowerCase()){
                            event.target.ondragstart = function() {return !1;};
                        }
                        if(!$element.hasClass("no-drag")) {
                            if(event.center.y >= center.top && event.center.y <= center.bottom){
                                $element.css("top", event.center.y - pOffset.top - caleOffset.y);
                            }
                            if(event.center.x >= center.left && event.center.x <= center.right){
                                $element.css("left", event.center.x - pOffset.left - caleOffset.x);
                            }
                        }
                    });
                    m.on("panend", function(event) {
                        if ($element.hasClass("no-drag")) return void $element.removeClass("no-drag");
                        $element.css("opacity", 1);
                        $("body").css({"user-select": "initial",cursor: "default"});

                        $element.position();
                        var offset = {top: $element.css("top"), left: $element.css("left")};
                        scope.updateCompPosition($element.attr("id"), offset);
                        $(event.srcEvent.target).one("click", function(event) {
                            event.stopImmediatePropagation();
                            event.stopPropagation();
                            event.preventDefault();
                            return !1;
                        });
                    });
                }
            }
        })
        .directive("compResize", function() {
            function calculate(width, height, w, h){
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
                    dimension = {width: box.width(),height: box.height()};
                if ("4" == element.attr("ctype").charAt(0)) {
                    var img = element.find("img"),
                        rate = img.width() / img.height(),
                        r = dimension.width / dimension.height;
                    if(rate >= r){
                        img.outerHeight(dimension.height);
                        img.outerWidth(dimension.height * rate);
                        img.css("marginLeft", -(img.outerWidth() - dimension.width) / 2);
                        img.css("marginTop", 0);
                    }else{
                        img.outerWidth(dimension.width);
                        img.outerHeight(dimension.width / rate);
                        img.css("marginTop", -(img.outerHeight() - dimension.height) / 2);
                        img.css("marginLeft", 0)
                    }
                } else if ("p" == element.attr("ctype").charAt(0)) {
                    var li = element.find("li"),
                        img = element.find("img");
                    img.each(function(index) {
                        var self = $(this),
                            cale = calculate(self.width(), self.height(), dimension.width, dimension.height);
                        self.css({width: cale.width,height: cale.height});
                        li.eq(index).css({lineHeight: dimension.height + "px"});
                    });
                } else {
                    element.find(".element").css({width: dimension.width, height: dimension.height});
                }
            }

            function updateDimension(scope, element) {
                var dimension = {width: element.width(),height: element.height()};
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
                    }, function(index, callback) {
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
                hammer.get("pan").set({threshold: 0,direction: Hammer.DIRECTION_ALL});
                hammer.on("panstart", function() {
                    $element.addClass("no-drag");

                    width = $element.width();
                    height = $element.height();
                    left = parseFloat($element.css("left"));
                    top = parseFloat($element.css("top"));

                    ul.css("cursor", resize);
                    $("body").css({"user-select": "none",cursor: "default"});

                    transform = $element.get(0).style.transform;
                    transform = transform && transform.replace("rotateZ(", "").replace("deg)", "");
                    transform = transform && parseFloat(transform);
                    angle = 2 * transform * Math.PI / 360
                });
                hammer.on("panmove", function(event) {
                    switch (resize) {
                        case RESIZE.RESIZE_W:
                            if (width - event.deltaX <= minWidth) break;
                            $element.css({left: left + event.deltaX,width: width - event.deltaX});
                            break;
                        case RESIZE.RESIZE_E:
                            $element.css({width: width + event.deltaX});
                            break;
                        case RESIZE.RESIZE_N:
                            if (height - event.deltaY <= minHeight) break;
                            $element.css({top: top + event.deltaY,height: height - event.deltaY});
                            break;
                        case RESIZE.RESIZE_S:
                            $element.css({height: top + event.deltaY});
                            break;
                        case RESIZE.RESIZE_SE:
                            $element.css({height: height + event.deltaY,width: width + event.deltaX});
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
                    if(event.deltaX > 0 && $element.width() > 320 - parseFloat($element.css("left"))){
                        $element.width(320 - parseFloat($element.css("left")));
                    }
                    if(event.deltaX < 0 && $element.width() > left + width ){
                        $element.width(left + width);
                        $element.css("left", 0);
                    }
                    if(event.deltaY > 0
                        && $element.height() > 486 - parseFloat($element.css("top"))){
                        $element.height(486 - parseFloat($element.css("top")));
                    }
                    if(event.deltaY < 0 && $element.height() > top + height){
                        $element.height(top + height);
                        $element.css("top", 0);
                    }
                    caleDimension($element);
                });
                hammer.on("panend", function() {
                    ul.css("cursor", "default");
                    $("body").css({"user-select": "initial",cursor: "default"});
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
                link: function(scope, element) {
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
                     .unbind("mousedown").mousedown(function() {
                        $(this).children(".bar").show().end()
                            .siblings().children(".bar").hide();
                     });
                    element.parent().unbind("mousedown").mousedown(function(event) {
                        if(!$(event.target).closest("li").length){
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
        .directive("pasteElement", ["sceneService", function(sceneService) {
            function generateMenu() {
                var element = $('<ul id="pasteMenu" class="dropdown-menu" '
                                +'style="min-width: 100px; display: block;" role="menu" aria-labelledby="dropdownMenu1">'
                                +'<li class="paste" role="presentation">'
                                    +'<a role="menuitem" tabindex="-1">' +
                                        +'<div class="fa fa-paste" style="color: #08a1ef;"></div>&nbsp;&nbsp;粘贴'
                                    +'</a>'
                                +'</li>'
                            +'</ul>')
                    .css({position: "absolute","user-select": "none"});
                element.find(".paste").on("click", function() {
                    sceneService.pasteElement(sceneService.originalElemDef, sceneService.copyElemDef, sceneService.sameCopyCount);
                    element.hide()
                });
                return element;
            }
            return {
                restrict: "EA",
                link: function(scope, element) {
                    var $element = $(element);
                    $element.on("contextmenu", function(events) {
                        if (q) {
                            var menu = generateMenu(),element = $("#pasteMenu");
                            element.length > 0 && element.remove();
                            $("#eq_main").append(menu);
                            menu.css({
                                left: events.pageX + $("#eq_main").scrollLeft() + 15,
                                top: events.pageY + $("#eq_main").scrollTop()
                            }).show();
                            $("#eq_main").mousemove(function(events) {
                                if(
                                    events.pageX < $("#pasteMenu").offset().left - 20
                                        || events.pageX > $("#pasteMenu").offset().left + $("#pasteMenu").width() + 20
                                        || events.pageY < $("#pasteMenu").offset().top - 20
                                        || events.pageY > $("#pasteMenu").offset().top + $("#pasteMenu").height() + 20){
                                    $("#pasteMenu").hide();
                                    $(this).unbind("mousemove");
                                }
                            });
                        }
                        return !1;
                    });
                }
            }
        }]);

    ng.module("services.scene", ["scene.create.console", "services.history"]);
    ng.module("services.scene")
        .factory("sceneService", ["$http", "$rootScope", "$modal", "$q", "security", "$cacheFactory", "historyService",function($http, $rootScope, $modal, $q, security, $cacheFactory, historyService){
            function addComponentHandle(type, component, gFlag) {
                var li = JsonParser.wrapComp(component, "edit");
                $("#nr .edit_area").append(li);
                for (var interceptors = JsonParser.getInterceptors(), i = 0; i < interceptors.length; i++){
                    interceptors[i](li, component);
                }
                JsonParser.getEventHandlers()[("" + type).charAt(0)](li, component);
                if("g101" != gFlag){
                    historyService.addPageHistory(G.obj.id, G.obj.elements);
                    $rootScope.$broadcast("dom.changed");
                }
            }//m

            function editableHandle(element, component) {
                $(element).css("cursor", "text");
                if(!$(element).parents("li").hasClass("inside-active")){
                    $(element).bind("click", function(event) {
                        event.stopPropagation()
                    });
                }
                $(document).bind("mousedown", function() {
                    $(element).css("cursor", "default");
                    $("#btn-toolbar").find("input[type=text][data-edit]").blur();
                    if($("#btn-toolbar"))$("#btn-toolbar").remove();
                    $(element).unbind("click");

                    component.content = $(element).html();
                    $(element).parents("li").removeClass("inside-active").css("user-select", "none");
                    $(element).removeAttr("contenteditable");
                    $(document).unbind("mousedown");
                });

                $(element).parents("li").addClass("inside-active").css("user-select", "initial");
                $rootScope.$broadcast("text.click", element);
            }//o
            function imageHandle(component) {
                openModal(component, function(modal) {
                    component.properties.src = modal.data;
                    var rate = modal.width / modal.height,
                        $component = $("#" + component.id);
                    if ($component.length > 0) {
                        var width = $("#inside_" + component.id).width(),height = $("#inside_" + component.id).height(),r = width / height;
                        if( rate >= r ){
                            $component.outerHeight(height);
                            $component.outerWidth(height * rate);

                            $component.css("marginLeft", -($component.outerWidth() - width) / 2);
                            $component.css("marginTop", 0);
                        }else{
                            $component.outerWidth(width);
                            $component.outerHeight(width / rate);
                            $component.css("marginTop", -($component.outerHeight() - height) / 2);
                            $component.css("marginLeft", 0)
                        }
                        $component.attr("src", PREFIX_FILE_HOST + modal.data);
                        component.properties.imgStyle = {};
                        component.properties.imgStyle.width = $component.outerWidth();
                        component.properties.imgStyle.height = $component.outerHeight();
                        component.properties.imgStyle.marginTop = $component.css("marginTop");
                        component.properties.imgStyle.marginLeft = $component.css("marginLeft");
                    } else {
                        if(modal.width > $("#nr .edit_area").width()){
                            modal.width = $("#nr .edit_area").width();
                            modal.height = modal.width / rate;
                        }
                        if(modal.height > $("#nr .edit_area").height()){
                            modal.height = $("#nr .edit_area").height();
                            modal.width = modal.height * rate;
                        }
                        component.css.width = modal.width;
                        component.css.height = modal.height;

                        component.properties.imgStyle = {};
                        component.properties.imgStyle.width = modal.width;
                        component.properties.imgStyle.height = modal.height;
                        component.properties.imgStyle.marginTop = "0";
                        component.properties.imgStyle.marginLeft = "0";
                        
                        addComponentHandle(component.type, component);
                    }
                }, function() {
                    component.properties.src || (H.splice(H.indexOf(I[component.id]), 1), delete I[component.id]);
                })
            }//p
            function bgHandle(component) {
                openModal(component, function(data) {
                    var $target = $("#nr .edit_area").parent()[0];
                    if ("imgSrc" == data.type) {
                        var imgSrc = data.data;
                        $target.style.backgroundImage = "url(" + PREFIX_FILE_HOST + imgSrc + ")";
                        component.properties.bgColor = null;
                        component.properties.imgSrc = imgSrc;
                    }
                    if("backgroundColor" == data.type){
                        $target.style.backgroundImage = "none";
                        $target.style.backgroundColor = data.color;
                        component.properties.imgSrc = null;
                        component.properties.bgColor = data.color;
                    }
                    historyService.addPageHistory(G.obj.id, G.obj.elements);
                    $("#editBG").unbind("click");
                    $("#editBG").show().bind("click", function() {
                        bgHandle(component);
                    });
                }, function() {});
            }//x
            function inputHandle(component) {
                if(!Modal){
                    Modal = $modal.open({
                        windowClass: "console",
                        templateUrl: "scene/console/input.tpl.html",
                        controller: "InputConsoleCtrl",
                        resolve: {
                            obj: function() {return component;}
                        }
                    }).result.then(function(data) {
                            Modal = null;
                            data.type && (component.type = data.type);

                            component.properties.placeholder = data.title;
                            component.properties.required = data.required;
                            component.title = data.title;

                            if($("#" + component.id).length > 0){
                                $("#" + component.id).attr("placeholder", data.title);
                                $("#" + component.id).attr("required", data.required);
                            }else{
                                addComponentHandle(component.type, component);
                            }
                    }, function() {
                            Modal = null;
                            $("#" + component.id).length || (H.splice(H.indexOf(I[component.id]), 1), delete I[component.id]);
                    });
                }
            }//t
            function buttonHandle(component) {
                $modal.open({
                    windowClass: "console",
                    templateUrl: "scene/console/button.tpl.html",
                    controller: "ButtonConsoleCtrl",
                    resolve: {
                        obj: function() {return component;}
                    }
                }).result.then(function(data) {
                    component.properties.title = data.title;
                    var title = data.title.replace(/ /g, "&nbsp;");
                    $("#" + component.id).html(title);
                });
            }//r
            function telHandle(component) {
                if(!Modal){
                    Modal = $modal.open({
                        windowClass: "console",
                        templateUrl: "scene/console/tel.tpl.html",
                        controller: "TelConsoleCtrl",
                        resolve: {
                            obj: function() {return component;}
                        }
                    }).result.then(function(data) {
                            Modal = null;
                            component.properties.title = data.title;
                            component.properties.number = data.number;
                            data.title.replace(/ /g, "&nbsp;");
                            $.extend(!0, component.css, b.btnStyle);
                            $("#" + component.id).length > 0 && $("#" + component.id).parents("li").remove();

                            addComponentHandle(component.type, component);
                        }, function() {
                            Modal = null;
                            $("#" + component.id).length || (H.splice(H.indexOf(I[component.id]), 1), delete I[component.id]);
                        });
                }
            }//s
            function carouselHandle(component) {
                if(!Modal){
                    Modal = $modal.open({
                        windowClass: "console",
                        templateUrl: "scene/console/pic_lunbo.tpl.html",
                        controller: "picsCtrl",
                        resolve: {
                            obj: function() {
                                return component;
                            }
                        }
                    }).result.then(function(data) {
                            Modal = null;
                            component.properties = data;
                            var element = $("#inside_" + component.id);
                            element.length && element.remove();

                            addComponentHandle(component.type, component);
                        }, function() {
                            Modal = null;
                            $("#" + component.id).length || (H.splice(H.indexOf(I[component.id]), 1), delete I[component.id]);
                        })
                }
            }//u
            function videoHandle(component) {
                if( Modal ){
                    $modal.open({
                        windowClass: "console",
                        templateUrl: "scene/console/video.tpl.html",
                        controller: "VideoCtrl",
                        resolve: {
                            obj: function() {
                                return component;
                            }
                        }
                    }).result.then(function(data) {
                            Modal = null;
                            component.properties.src = data;
                            if(!$("#" + component.id).length){
                                addComponentHandle(component.type, component);
                            }
                        }, function() {
                            Modal = null;
                            $("#" + component.id).length || (H.splice(H.indexOf(I[component.id]), 1), delete I[component.id])
                        });
                }
            }//v
            function linkHandle(component) {
                component.sceneId = G.obj.sceneId;
                $modal.open({
                    windowClass: "console",
                    templateUrl: "scene/console/link.tpl.html",
                    controller: "LinkConsoleCtrl",
                    resolve: {
                        obj: function() {return component;}
                    }
                }).result.then(function(data) {
                        if(data && "http://" != data){
                            if(isNaN(b)){
                                component.properties.url = PREFIX_S1_URL + "eqs/link?id=" + component.sceneId + "&url=" + encodeURIComponent(data)
                            }else{
                                component.properties.url = data;
                                console.log(data);
                            }
                            $("#inside_" + component.id).find(".fa-link").removeClass("fa-link").addClass("fa-anchor");
                        }else{
                            delete component.properties.url;
                            $("#inside_" + component.id).find(".fa-anchor").removeClass("fa-anchor").addClass("fa-link");
                        }
                    });
            }//D
            function microwebHandle(component) {
                $modal.open({
                    windowClass: "console",
                    templateUrl: "scene/console/microweb.tpl.html",
                    controller: "MicroConsoleCtrl",
                    resolve: {
                        obj: function() {
                            if(!component.properties.labels){
                                component.properties.labels = [{
                                    id: 1,
                                    title: "栏目一",
                                    color: {
                                        backgroundColor: "#23A3D3",
                                        color: ""
                                    },
                                    link: ""
                                }, {
                                    id: 2,
                                    title: "栏目二",
                                    color: {
                                        backgroundColor: "#23A3D3",
                                        color: ""
                                    },
                                    link: ""
                                }];
                            }
                            return component;
                        }
                    }
                }).result.then(function(data) {
                    if($("#" + component.id).length > 0){
                        component.properties.labels = [];
                        ng.forEach(data, function(d) {
                            delete d.selected;
                            delete d.mousedown;
                            delete d.$$hashKey;
                            component.properties.labels.push(d);
                        });
                        $("#" + component.id).parents("li").remove();
                        addComponentHandle(component.type, component);
                    }else{
                        component.css = {left: "0px",width: "100%",bottom: "0px",height: "50px",zIndex: 999};
                        component.properties.labels = [];
                        ng.forEach(data, function(d) {
                            delete d.selected;
                            delete d.mousedown;
                            delete d.$$hashKey;
                            component.properties.labels.push(d);
                        });
                        position = null;
                        addComponentHandle(component.type, component);
                    }
                }, function() {
                    if(!$("#" + component.id).length){
                        H.splice(H.indexOf(I[component.id]), 1);
                        delete I[component.id];
                        console.log(component)
                    }
                });
            }//w

            function openModal(component, successFn, failFn) {
                if (!Modal) {
                    var fileType = "0";
                    if(3 == component.type)fileType = "0";
                    if(4 == component.type)fileType = "1";
                    Modal = $modal.open({
                        windowClass: "console img_console",
                        templateUrl: "scene/console/bg.tpl.html",
                        controller: "BgConsoleCtrl",
                        resolve: {
                            obj: function() {
                                return {fileType: fileType,elemDef: component}
                            }
                        }
                    }).result.then(function(data) {
                        Modal = null;
                        successFn(data);
                    }, function(data) {
                        Modal = null;
                        failFn(data);
                    });
                }
            }//z

            function activeStyleTab(component) {
                SceneService.currentElemDef = component;
                $rootScope.$broadcast("showStylePanel", {activeTab: "style"});
            }//A
            function activeAnimTab(component) {
                SceneService.currentElemDef = component;
                $rootScope.$broadcast("showStylePanel", {activeTab: "anim"});
            }//B
            function activeCrop(component) {
                console.log(component);
                SceneService.currentElemDef = component;
                GlobalEvt = $rootScope.$broadcast("showCropPanel", component);
            }//C

            {var SceneService = {}, JsonParser = eqShow.templateParser("jsonParser"), G = null, H = null, I = {};}

            var Modal = null, GlobalEvt = null;
            JsonParser.addInterceptor(function(wrapComponent, element, mode){
                function generatePopMenu() {
                    var $popMenu = $(
                            '<ul id="popMenu" class="dropdown-menu" style="min-width: 100px; display: block;" role="menu" aria-labelledby="dropdownMenu1">' +
                                '<li class="edit" role="presentation">' +
                                    '<a role="menuitem" tabindex="-1">' +
                                        '<div class="glyphicon glyphicon-edit" style="color: #08a1ef;"></div>&nbsp;&nbsp;编辑' +
                                    '</a>' +
                                '</li>' +
                                '<li class="style" role="presentation">' +
                                    '<a role="menuitem" tabindex="-1">' +
                                        '<div class="fa fa-paint-brush" style="color: #08a1ef;"></div>&nbsp;&nbsp;样式' +
                                    '</a>' +
                                '</li>' +
                                '<li class="animation" role="presentation">' +
                                    '<a role="menuitem" tabindex="-1">' +
                                        '<div class="fa fa-video-camera" style="color: #08a1ef;"></div>&nbsp;&nbsp;动画' +
                                    '</a>' +
                                '</li>' +
                                '<li class="link" role="presentation">' +
                                    '<a role="menuitem" tabindex="-1">' +
                                        '<div class="fa fa-link" style="color: #08a1ef;"></div>&nbsp;&nbsp;链接' +
                                    '</a>' +
                                '</li>' +
                                '<li class="copy" role="presentation" style="margin-bottom:5px;">' +
                                    '<a role="menuitem" tabindex="-1">' +
                                        '<div class="fa fa-copy" style="color: #08a1ef;"></div>&nbsp;&nbsp;复制' +
                                    '</a>' +
                                '</li>' +
                                '<li class="cut" role="presentation" style="margin-bottom:5px;">' +
                                    '<a role="menuitem" tabindex="-1">' +
                                        '<div class="fa fa-cut" style="color: #08a1ef;"></div>&nbsp;&nbsp;裁剪' +
                                    '</a>' +
                                '</li>' +
                                '<li role="presentation" class="bottom_bar">' +
                                    '<a title="上移一层">' +
                                        '<div class="up" style="display: inline-block; width: 26px;height: 22px; background: url(http://static.parastorage.com/services/skins/2.1127.3/images/wysiwyg/core/themes/editor_web/button/fpp-buttons-icons4.png) 0px -26px no-repeat;"></div>' +
                                     '</a>' +
                                    '<a title="下移一层">' +
                                        '<div class="down" style="display: inline-block; width: 26px;height: 22px; background: url(http://static.parastorage.com/services/skins/2.1127.3/images/wysiwyg/core/themes/editor_web/button/fpp-buttons-icons4.png) 0px -80px no-repeat;"></div>' +
                                    '</a>' +
                                    '<a title="删除">' +
                                        '<div class="remove" style="display: inline-block; width: 26px;height: 22px; background: url(http://static.parastorage.com/services/skins/2.1127.3/images/wysiwyg/core/themes/editor_web/button/fpp-buttons-icons4.png) 0px -1px no-repeat;"></div>' +
                                    '</a>' +
                                '</li>' +
                            '</ul>')
                        .css({position: "absolute","user-select": "none"});
                    if( q ){
                        $popMenu.find(".copy").after($('<li class="paste" role="presentation"><a role="menuitem" tabindex="-1"><div class="fa fa-paste" style="color: #08a1ef;"></div>&nbsp;&nbsp;粘贴</a></li>'));
                    }

                    $popMenu.find(".edit").click(function(event) {
                        event.stopPropagation();
                        switch (element.type.toString().charAt(0)) {
                            case "1":break;
                            case "2":editableHandle(wrapComponent.find(".element").get(0), element);break;
                            case "3":break;
                            case "4":imageHandle(element);break;
                            case "5":inputHandle(element);break;
                            case "6":buttonHandle(element);break;
                            case "7":break;
                            case "8":telHandle(element);break;
                            case "9":break;
                            case "g":break;
                            case "p":carouselHandle(element);break;
                            case "v":videoHandle(element);break;
                        }
                        $popMenu.hide();
                    });
                    $popMenu.find(".style").click(function(event) {
                        if(security.isAllowToAccess(security.accessDef.CREATE_STYLE_SETTING)){
                            event.stopPropagation();
                            activeStyleTab(element, function(b) {
                                if (1 == element.type){
                                    for (var label in element.properties.labels) {
                                        if(b.backgroundColor){
                                            element.properties.labels[label].color.backgroundColor = b.backgroundColor;
                                            $(".label_content").css("background-color", b.backgroundColor);
                                        }
                                        if(b.color){
                                            element.properties.labels[label].color.color = b.color;
                                            $(".label_content").css("color", b.color);
                                        }
                                    }
                                }else{
                                    $(".element-box", wrapComponent).css(b), $.extend(!0, element.css, b)
                                }
                            });
                        }else{
                            event.stopPropagation();
                            $modal.open({
                                windowClass: "console",
                                templateUrl: "scene/console/fake.tpl.html",
                                controller: "FakeConsoleCtrl",
                                resolve: {
                                    type: function() {return "style";}
                                }
                            });
                        }
                        $popMenu.hide();
                    });
                    $popMenu.find(".animation").click(function(event) {
                        event.stopPropagation();
                        activeAnimTab(element, function(a) {
                            element.properties.anim = a;
                        });
                        $popMenu.hide();
                    });
                    $popMenu.find(".link").click(function(event) {
                        event.stopPropagation();
                        linkHandle(element);
                        $popMenu.hide();
                    });

                    $popMenu.find(".remove").click(function(event) {
                        event.stopPropagation();
                        historyService.addPageHistory(G.obj.id, H);
                        wrapComponent.remove();
                        H.splice(H.indexOf(I[element.id]), 1);
                        historyService.addPageHistory(G.obj.id, H);
                        NTERVAL_OBJ[element.id] && (clearInterval(INTERVAL_OBJ[element.id]), delete INTERVAL_OBJ[element.id]);
                        $popMenu.hide();
                        $rootScope.$apply();
                        $rootScope.$broadcast("hideStylePanel");
                    });
                    $popMenu.find(".down").click(function() {
                        var prev = wrapComponent.prev();
                        if (!(prev.length <= 0)) {
                            var zIndex = wrapComponent.css("zIndex");
                            wrapComponent.css("zIndex", prev.css("zIndex"));
                            prev.css("zIndex", zIndex);
                            prev.before(wrapComponent);

                            for (var i = 0; i < H.length; i++) {
                                if (H[i].id == element.id && i > 0) {
                                    var zIndex = H[i].css.zIndex;
                                    H[i].css.zIndex = H[i - 1].css.zIndex;
                                    H[i - 1].css.zIndex = zIndex;
                                    break;
                                }
                            }
                        }
                    });
                    $popMenu.find(".up").click(function() {
                        var next = wrapComponent.next();
                        if (!(next.length <= 0)) {
                            var zIndex = wrapComponent.css("zIndex");
                            wrapComponent.css("zIndex", next.css("zIndex"));
                            next.css("zIndex", zIndex);
                            next.after(wrapComponent);

                            for (var i = 0; i < H.length; i++)
                                if (H[i].id == element.id && i < H.length - 1) {
                                    var zIndex = H[i].css.zIndex;
                                    H[i].css.zIndex = H[i + 1].css.zIndex;
                                    H[i + 1].css.zIndex = zIndex;
                                    break
                                }
                        }
                    });
                    $popMenu.find(".copy").click(function(event) {
                        event.stopPropagation();
                        SceneService.sameCopyCount = 0;
                        SceneService.pageId = G.obj.id;
                        if(!$(".modal-dialog")[0])SceneService.copyElement(element);
                        $popMenu.hide();
                    });
                    $popMenu.find(".paste").click(function(event) {
                        event.stopPropagation();
                        if(!$(".modal-dialog")[0])SceneService.pasteElement(SceneService.originalElemDef, SceneService.copyElemDef);
                        $popMenu.hide();
                    });
                    $popMenu.find(".cut").click(function(event) {
                        event.stopPropagation();
                        activeCrop(element);
                        $popMenu.hide();
                    });

                    if( 4 != element.type ){
                        $popMenu.find(".link").hide();
                        $popMenu.find(".cut").hide();
                    }
                    if( "p" == e.type ){
                        $popMenu.find(".animation").hide();
                        $popMenu.find(".style").hide();
                    }
                    return $popMenu;
                }
                if("view" != mode){
                    var $eq_main = $("#eq_main");
                    wrapComponent.on("click contextmenu", ".element-box", function(event) {
                        event.stopPropagation();
                        if($("#btn-toolbar")[0])SceneService.elemDefTpl = ng.copy(element);
                        if($("#comp_setting:visible").length > 0 && "p" != element.type){
                            SceneService.currentElemDef = element;
                            $rootScope.$broadcast("showStylePanel");
                        }
                        var PopMenu = generatePopMenu(), $popMenu = $("#popMenu");
                        if($popMenu.length > 0)$popMenu.remove();
                        $eq_main.append(PopMenu);
                        PopMenu.css({
                            left: event.pageX + $eq_main.scrollLeft() + 15,
                            top: event.pageY + $eq_main.scrollTop()
                        }).show();
                        $eq_main.mousemove(function(event) {
                            if(event.pageX < PopMenu.offset().left - 20
                                || event.pageX > PopMenu.offset().left + PopMenu.width() + 20
                                || event.pageY < PopMenu.offset().top - 20
                                || event.pageY > PopMenu.offset().top + PopMenu.height() + 20){
                                PopMenu.hide();
                                $(this).unbind("mousemove");
                            }
                        });
                        return !1;
                    });
                    wrapComponent.attr("title", "按住鼠标进行拖动，点击鼠标进行编辑")
                }
            });

            JsonParser.bindEditEvent("1", function(element, component) {
                $(element).unbind("dblclick");
                $(element).show().bind("dblclick", function() {
                    microwebHandle(component);
                });
            });
            JsonParser.bindEditEvent("2", function(element, component) {
                var target = $(".element", element)[0];
                $(target).mousedown(function(event) {
                    $(this).parents("li").hasClass("inside-active") && event.stopPropagation();
                });
                $(target).bind("contextmenu", function(event) {
                    $(this).parents("li").hasClass("inside-active")
                        ? event.stopPropagation()
                        : $(this).blur();
                });
                target.addEventListener("dblclick", function(event) {
                    editableHandle(target, component);
                    $("#popMenu").hide();
                    event.stopPropagation();
                });
            });
            JsonParser.bindEditEvent("3", function(element, component) {
                $("#editBG").unbind("click");
                $("#editBG").show().bind("click", function() {
                    bgHandle(component);
                });
            });
            JsonParser.bindEditEvent("v", function(element, component) {
                var target = $(".element", element)[0];
                $(target).unbind("dblclick");
                $(target).bind("dblclick", function() {
                    videoHandle(component);
                    $("#popMenu").hide();
                })
            });
            JsonParser.bindEditEvent("4", function(element, component) {
                var target = $(".element", element)[0];
                $(target).unbind("dblclick");
                $(target).bind("dblclick", function() {
                    imageHandle(component);
                    $("#popMenu").hide()
                })
            });
            JsonParser.bindEditEvent("5", function(element, component) {
                var target = $(".element", element)[0];
                $(target).unbind("dblclick");
                $(target).bind("dblclick", function() {
                    inputHandle(element);
                    $("#popMenu").hide();
                });
            });
            JsonParser.bindEditEvent("p", function(element, component) {
                var target = $(".element", element)[0];
                $(target).unbind("dblclick");
                $(target).bind("dblclick", function() {
                    carouselHandle(component);
                    $("#popMenu").hide();
                })
            });
            JsonParser.bindEditEvent("6", function(element, component) {
                var target = $(".element", element)[0];
                $(target).unbind("dblclick");
                $(target).bind("dblclick", function() {
                    buttonHandle(component);
                    $("#popMenu").hide()
                });
            });
            JsonParser.bindEditEvent("7", function(element, component) {
                var target = $(".element", element)[0];
                target.addEventListener("click", function() {
                    if(!Modal){
                        $modal.open({
                            windowClass: "",
                            templateUrl: "scene/console/map.tpl.html",
                            controller: "MapConsoleCtrl"
                        }).result.then(function(data) {
                            var element = new BMap.Map("map_" + component.id);
                            element.clearOverlays();

                            var point = new BMap.Point(data.lng, data.lat),
                                marker = new BMap.Marker(point);

                            element.addOverlay(marker);
                            var label = new BMap.Label(data.address, {offset: new BMap.Size(20, -10)});
                                marker.setLabel(label);
                            element.centerAndZoom(point, 12);
                            component.properties.pointX = data.lng;
                            component.properties.pointY = data.lat;
                            component.properties.x = data.lng;
                            component.properties.y = data.lat;
                            component.properties.markTitle = data.address;
                        });
                    }
                })
            });
            JsonParser.bindEditEvent("8", function(element, component) {
                var target = $(".element", element)[0];
                $(target).unbind("dblclick");
                $(target).bind("dblclick", function() {
                    telHandle(component);
                    $("#popMenu").hide()
                });
            });

            SceneService.templateEditor = JsonParser;

            return SceneService;
        }]);
}(window, window.angular);