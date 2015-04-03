﻿!function(win, ng, undefined){

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

                    5 != ("" + comp.type).charAt(0) && 6 != ("" + comp.type).charAt(0)
                        || "edit" != mode
                        || $(component).before($('<div class="element" style="position: absolute; height: 100%; width: 100%;">'));

					if(comp.css){
                        element.css({width: 320 - parseInt(comp.css.left)});
                        element.css({
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
				for (var e = 0; e < elements.length; e++) elements[e].css.zIndex = e + 1 + "";
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
							if(!wrapComp)continue;
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
						switch(anim.direction){
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
						switch(anim.direction){
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
    ng.module("app", ['ngRoute', 'scene', 'ui.bootstrap',"templates-app", "templates-common"]);
    ng.module("app").config(["$routeProvider", function($routeProvider) {
        //d.theme = "bootstrap";
        $routeProvider.when("/scene/create/:sceneId", {
            templateUrl: "scene/create.tpl.html",
            controller: "CreateSceneCtrl",
            reloadOnSearch: !1,
            resolve: {
                //authenticatedUser: c.requireAuthenticatedUser
            }
        });
    }]);
    ng.module("app").controller("AppCtrl", ["$window", "$scope", "$rootScope", "$location", "$modal","sceneService", "$routeParams", "$timeout",
        function($window, $scope, $rootScope, $location, $modal,sceneService, $routeParams, $timeout) {
/*            $scope.$watch(function() {
                return security.currentUser
            }, function(User) {
                if( User ){
                    $scope.user = User;
                    $rootScope.user = User;

                    $scope.isEditor = security.isEditor();
                    $rootScope.isEditor = security.isEditor();

                    $scope.isAdvancedUser = security.isAdvancedUser();
                    $rootScope.isAdvancedUser = security.isAdvancedUser();

                    $scope.isVendorUser = security.isVendorUser();
                    $rootScope.isVendorUser = security.isVendorUser();
                }
            }, !0);*/
            $scope.showToolBar = function() {return $location.$$path.indexOf("/scene/create") >= 0 ? !1 : !0};
            $scope.showPanel = function() {
                $("#helpPanel").stop().animate({right: "0"}, 500)
            };
            $scope.hidePanel = function() {
                $("#helpPanel").stop().animate({right: "-120"}, 500)
            };

            $location.path('/scene/create/2915210');
    }]).filter("fixnum", function() {
        return function(num) {
            var fixnum = num;
            num >= 1e4 && 1e8 > num
                ? fixnum = (num / 1e4).toFixed(1) + "万"
                : num >= 1e8 && (fixnum = (num / 1e8).toFixed(1) + "亿");
            return fixnum;
        }
    });

    ng.module("scene", ["scene.create", "services.scene"]);
    ng.module("scene").controller("SceneCtrl", ["$window", "$scope", "$location", "sceneService", "$modal",
        function(b, c, d, e, f) {
            c.PREFIX_FILE_HOST = PREFIX_FILE_HOST,
                c.PREFIX_CLIENT_HOST = PREFIX_HOST,
                c.isActive = "scene",
                c.scene = {type: null},
                c.totalItems = 0,
                c.currentPage = 1,
                c.toPage = "",
                c.tabindex = 0,
                c.childcat = 0,
                c.order = "new";
            var g = 12,
                h = 0;
            c.pageChanged = function(a) {
                return i.targetPage = a, 1 > a || a > c.totalItems / 11 + 1 ? void alert("此页超出范围") : void c.getPageTpls(1, i.sceneType, i.tagId, a, g, c.order)
            },
                c.preview = function(b) {
                    var c = PREFIX_HOST + "/view.html?sceneId=" + b;
                    a.open(c, "_blank")
                },
                c.createScene = function(a) {
                    f.open({
                        windowClass: "login-container",
                        templateUrl: "scene/createNew.tpl.html",
                        controller: "SceneNewCtrl",
                        resolve: {
                            items: function() {
                                return a
                            }
                        }
                    })
                },
                c.getStyle = function(a) {
                    return {
                        "background-image": "url(" + PREFIX_FILE_HOST + a + ")"
                    }
                },
                c.show = function(a) {
                    console.log(a.target), $(a.target).children(".cc").css("display", "block")
                },
                e.getSceneType().then(function(a) {
                    c.pageTplTypes = a.data.list && a.data.list.length > 0 ? a.data.list : []
                }).then(function() {}),
                c.tplnew = function(a) {
                    c.order = a, i.orderby = a, i.tagId ? c.getPageTpls(null, i.sceneType, i.tagId, h, g, a) : c.getPageTpls(1)
                };
            var i = {
                    sceneType: null,
                    tagId: "",
                    orderby: "new",
                    pageNo: "0",
                    targetPage: ""
                },
                j = {};
            c.getPageTplsByType = function(a) {
                i.sceneType = a, c.childcat = a, c.categoryId = 0, j[a] ? (c.childCatrgoryList = j[a], c.getPageTpls(1, i.sceneType, c.childCatrgoryList[0].id, h, g, c.order)) : e.getPageTplTypesTwo(a, a).then(function(b) {
                    c.childCatrgoryList = j[a] = b.data.list, c.getPageTpls(1, i.sceneType, c.childCatrgoryList[0].id, h, g, c.order)
                })
            },
                c.allpage = function(a) {
                    i.sceneType = a, c.childcat = 0, c.getPageTpls(1), c.childCatrgoryList = []
                },
                c.getPageTpls = function(a, b, d, f) {
                    var g = 11;
                    c.categoryId = d, i.tagId = d, e.getPageTpls(a, b, d, f, g, i.orderby).then(function(a) {
                        a.data.list && a.data.list.length > 0 ? (c.tpls = a.data.list, c.totalItems = a.data.map.count, c.currentPage = a.data.map.pageNo, c.allPageCount = a.data.map.count, c.toPage = "") : c.tpls = []
                    })
                },
                c.getPageTpls(1)
        }]);

    ng.module("scene.create", [
        "app.directives.editor",
        "services.scene",
        "confirm-dialog",
        "services.modal",
        "app.directives.component",
        "services.pagetpl",
        "app.directives.addelement",
        "services.history",
        "scene.create.console"
    ]);
    ng.module("scene.create")
        .controller("CreateSceneCtrl", ["$timeout", "$compile", "$rootScope", "$scope", "$routeParams", "$route", "$location", "sceneService", "pageTplService", "$modal", "ModalService", "$window","historyService",
            function($timeout, $compile, $rootScope, $scope, $routeParams, $route, $location, sceneService, pageTplService, $modal, ModalService, $window, historyService) {
                //TODO: 根据指定的场景的指定 pageIdx，加载场景页面信息并解析执行
                function loadPageInfo(pageIdx, isNewPage, d) {
                    $scope.loading = !0;
                    $("#editBG").hide();
                    $scope.pageId = $scope.pages[pageIdx - 1].id;
                    sceneService.getSceneByPage($scope.pageId, isNewPage, d).then(function(data) {
                        $scope.loading = !1;
                        $scope.tpl = data.data;

                        curPageTpl = JSON.stringify($scope.tpl);
                        $scope.sceneId = $scope.tpl.obj.sceneId;

                        if($scope.tpl.obj.properties && ($scope.tpl.obj.properties.image || $scope.tpl.obj.properties.scratch)){
                            if($scope.tpl.obj.properties.scratch){
                                $scope.scratch = $scope.tpl.obj.properties.scratch;
                            }else{
                                if($scope.tpl.obj.properties.image){
                                    $scope.scratch.image = $scope.tpl.obj.properties.image;
                                    $scope.scratch.percentage = $scope.tpl.obj.properties.percentage;
                                    $scope.tpl.obj.properties.tip && ($scope.scratch.tip = $scope.tpl.obj.properties.tip);
                                }
                            }
                            $scope.effectName = "涂抹";
                            ng.forEach($scope.scratches, function(value) {
                                if(value.path == $scope.scratch.image.path)$scope.scratch.image = value;
                            });
                            ng.forEach($scope.percentages, function(value) {
                                if(value.value == $scope.scratch.percentage.value)$scope.scratch.percentage = value;
                            });
                        }else{
                            $scope.scratch = {};
                            $scope.scratch.image = $scope.scratches[0];
                            $scope.scratch.percentage = $scope.percentages[0];
                        }
                        if($scope.tpl.obj.properties && $scope.tpl.obj.properties.finger){
                            $scope.finger = $scope.tpl.obj.properties.finger;
                            $scope.effectName = "指纹";
                            ng.forEach($scope.fingerZws, function(value) {
                                if(value.path == $scope.finger.zwImage.path)$scope.finger.zwImage = value;
                            });
                            ng.forEach($scope.fingerBackgrounds, function(value) {
                                if(value.path == $scope.finger.bgImage.path)$scope.finger.bgImage = value;
                            });
                        }else{
                            $scope.finger = {};
                            $scope.finger.zwImage = $scope.fingerZws[0];
                            $scope.finger.bgImage = $scope.fingerBackgrounds[0];
                        }

                        if($scope.tpl.obj.properties
                            && $scope.tpl.obj.properties.effect
                            && "money" == $scope.tpl.obj.properties.effect.name){
                            $scope.effectName = "数钱";
                            $scope.money = {
                                tip: $scope.tpl.obj.properties.effect.tip
                            }
                        }
                        if($scope.tpl.obj.properties && $scope.tpl.obj.properties.fallingObject){
                            $scope.falling = $scope.tpl.obj.properties.fallingObject;
                            ng.forEach($scope.fallings, function(value) {
                                if(value.path == $scope.falling.src.path)$scope.falling.src = value;
                            });
                            $scope.effectName = "环境";
                        }else{
                            $scope.falling = {src: $scope.fallings[0],density: 2};
                        }

                        if(isNewPage || d){
                            $location.$$search = {};
                            $location.search("pageIdx", ++pageIdx);
                            $scope.getScenePages();
                        }
                        $scope.pageNum = pageIdx;
                        curSceneName = $scope.tpl.obj.scene.name;
                        $("#nr").empty();

                        var pageTpl = ng.copy($scope.tpl.obj);
                        pageTpl.elements = historyService.addPage(pageTpl.id, pageTpl.elements);
                        sceneService.templateEditor.parse({
                            def: $scope.tpl.obj,
                            appendTo: "#nr",
                            mode: "edit"
                        });
                        $rootScope.$broadcast("dom.changed");
                    }, function() {
                        $scope.loading = !1
                    });
                }

                function emitRoute() {
                    //r.pushForCurrentRoute("scene.save.success.nopublish", "notify.success");
                }
                $scope.loading = !1;
                $scope.PREFIX_FILE_HOST = PREFIX_FILE_HOST;
                $scope.tpl = {};

                var curPageTplId, curSceneName = "",curPageTpl = "",originPageName = "";

                $scope.templateType = 1;
                $scope.categoryId = -1;
                $scope.isEditor = $rootScope.isEditor;

                $scope.createComp = sceneService.createComp;
                $scope.createCompGroup = sceneService.createCompGroup;
                $scope.updateCompPosition = sceneService.updateCompPosition;
                $scope.updateCompAngle = sceneService.updateCompAngle;
                $scope.updateCompSize = sceneService.updateCompSize;
                $scope.openAudioModal = sceneService.openAudioModal;
                //$scope.isAllowToAccessScrollImage = o.isAllowToAccess(4);

                $scope.scratch || ($scope.scratch = {});
                $scope.finger || ($scope.finger = {});

                $scope.effectList = [{
                    type: "scratch",
                    name: "涂抹",
                    src: CLIENT_CDN + "assets/images/create/waterdrop.jpg"
                }, {
                    type: "finger",
                    name: "指纹",
                    src: CLIENT_CDN + "assets/images/create/fingers/zhiwen1.png"
                }, {
                    type: "money",
                    name: "数钱",
                    src: CLIENT_CDN + "assets/images/create/money_thumb1.jpg"
                }, {
                    type: "fallingObject",
                    name: "环境",
                    src: CLIENT_CDN + "assets/images/create/falling.png"
                }];
                $scope.scratches = [{
                    name: "水滴",
                    path: CLIENT_CDN + "assets/images/create/waterdrop.jpg"
                }, {
                    name: "细沙",
                    path: CLIENT_CDN + "assets/images/create/sand.jpg"
                }, {
                    name: "花瓣",
                    path: CLIENT_CDN + "assets/images/create/flowers.jpg"
                }, {
                    name: "金沙",
                    path: CLIENT_CDN + "assets/images/create/goldsand.jpg"
                }, {
                    name: "白雪",
                    path: CLIENT_CDN + "assets/images/create/snowground.jpg"
                }, {
                    name: "模糊",
                    path: CLIENT_CDN + "assets/images/create/mohu.jpg"
                }, {
                    name: "落叶",
                    path: CLIENT_CDN + "assets/images/create/leaves.jpg"
                }, {
                    name: "薄雾",
                    path: CLIENT_CDN + "assets/images/create/smoke.png"
                }];
                $scope.percentages = [{
                        id: 1,
                        value: .15,
                        name: "15%"
                    }, {
                        id: 2,
                        value: .3,
                        name: "30%"
                    }, {
                        id: 3,
                        value: .6,
                        name: "60%"
                    }];

                $scope.fingerZws = [{
                        name: "粉色指纹",
                        path: CLIENT_CDN + "assets/images/create/fingers/zhiwen1.png"
                    }, {
                        name: "白色指纹",
                        path: CLIENT_CDN + "assets/images/create/fingers/zhiwen2.png"
                    }, {
                        name: "蓝色指纹",
                        path: CLIENT_CDN + "assets/images/create/fingers/zhiwen3.png"
                    }];
                $scope.fingerBackgrounds = [{
                    name: "粉红回忆",
                    path: CLIENT_CDN + "assets/images/create/fingers/bg1.jpg"
                }, {
                    name: "深蓝花纹",
                    path: CLIENT_CDN + "assets/images/create/fingers/bg2.jpg"
                }, {
                    name: "淡绿清新",
                    path: CLIENT_CDN + "assets/images/create/fingers/bg3.jpg"
                }, {
                    name: "深紫典雅",
                    path: CLIENT_CDN + "assets/images/create/fingers/bg4.jpg"
                }, {
                    name: "淡紫水滴",
                    path: CLIENT_CDN + "assets/images/create/fingers/bg5.jpg"
                }, {
                    name: "蓝白晶格",
                    path: CLIENT_CDN + "assets/images/create/fingers/bg6.jpg"
                }, {
                    name: "蓝色水滴",
                    path: CLIENT_CDN + "assets/images/create/fingers/bg7.jpg"
                }, {
                    name: "朦胧绿光",
                    path: CLIENT_CDN + "assets/images/create/fingers/bg8.jpg"
                }, {
                    name: "灰色金属",
                    path: CLIENT_CDN + "assets/images/create/fingers/bg9.jpg"
                }];
                $scope.fallings = [{
                    name: "福字",
                    path: CLIENT_CDN + "assets/images/create/fallings/fuzi1.png",
                    rotate: 180,
                    vy: 3
                }, {
                    name: "红包",
                    path: CLIENT_CDN + "assets/images/create/fallings/hongbao2.png",
                    rotate: 180,
                    vy: 3
                }, {
                    name: "绿枫叶",
                    path: CLIENT_CDN + "assets/images/create/fallings/lvfengye.png",
                    rotate: 180,
                    vy: 3
                }, {
                    name: "星星",
                    path: CLIENT_CDN + "assets/images/create/fallings/xing.png",
                    rotate: 180,
                    vy: 3
                }, {
                    name: "雪花",
                    path: CLIENT_CDN + "assets/images/create/fallings/snow.png",
                    rotate: 0,
                    vy: 1
                }];

                $scope.scratch.image = $scope.scratches[0];
                $scope.scratch.percentage = $scope.percentages[0];
                $scope.finger.zwImage = $scope.fingerZws[0];
                $scope.finger.bgImage = $scope.fingerBackgrounds[0];

                $scope.showPageEffect = !1;
                $scope.openPageSetPanel = function() {
                    f.showPageEffect || (f.showPageEffect = !0, $('<div id="modalBackdrop" class="modal-backdrop fade in" ng-class="{in: animate}" ng-style="{\'z-index\': 1040 + (index &amp;&amp; 1 || 0) + index*10}" modal-backdrop="" style="z-index: 1040;"></div>').appendTo("body").click(function() {
                        f.showPageEffect = !1, f.$apply(), $(this).remove()
                    }))
                };
                $scope.openOneEffectPanel = function(a) {
                    f.showPageEffect = !1, $("#modalBackdrop").remove(), f.effectType = a.type ? a.type : a.image || a.scratch ? "scratch" : a.finger ? "finger" : a.fallingObject ? "fallingObject" : a.effect.name, $('<div id="modalBackdrop1" class="modal-backdrop fade in" ng-class="{in: animate}" ng-style="{\'z-index\': 1040 + (index &amp;&amp; 1 || 0) + index*10}" modal-backdrop="" style="z-index: 1040;"></div>').appendTo("body").click(function() {
                        f.effectType = "", f.$apply(), $(this).remove()
                    })
                };

                var uploadModal = null;
                $scope.openUploadModal = function() {
                    if(!uploadModal){
                        uploadModal = $modal.open({
                            windowClass: "upload-console",
                            templateUrl: "my/upload.tpl.html",
                            controller: "UploadCtrl",
                            resolve: {
                                category: function() {
                                    return {
                                        categoryId: "0",
                                        fileType: "1",
                                        scratch: "scratch"
                                    }
                                }
                            }
                        }).result.then(function(data) {
                            $scope.scratch.image.path = $scope.PREFIX_FILE_HOST + data;
                            $scope.scratch.image.name = "";
                            uploadModal = null;
                        }, function() {
                            uploadModal = null;
                        });
                    }
                };
                $scope.cancel = function() {};
                $scope.cancelEffect = function() {
                    $scope.effectType = "";
                    $("#modalBackdrop1").remove()
                };
                $scope.saveEffect = function(a) {
                        if (f.tpl.obj.properties = {}, "scratch" == f.effectType) f.tpl.obj.properties.scratch = a, f.effectName = "涂抹";
                        else if ("finger" == f.effectType) f.tpl.obj.properties.finger = a, f.effectName = "指纹";
                        else if ("money" == f.effectType) {
                            if (a && a.tip && i(a.tip) > 24) return alert("提示文字不能超过24个字符！"), void(f.tpl.obj.properties = null);
                            a || (a = {
                                tip: "握紧钱币，数到手抽筋吧！"
                            }), f.tpl.obj.properties.effect = {
                                name: "money",
                                tip: a.tip
                            }, f.effectName = "数钱"
                        }
                        "fallingObject" == f.effectType && (f.tpl.obj.properties.fallingObject = a, f.effectName = "环境"), f.cancelEffect()
                    };

                var $stylePanel = null, $cropPanel = null;
                $scope.$on("showCropPanel", function(event, data) {
                    var $element = $(".content").eq(0);
                    if($cropPanel){
                        $rootScope.$broadcast("changeElemDef", data);
                        $cropPanel.show();
                    }else{
                        $compile("<div crop-image></div>")($scope);
                    }
                    $element.append($cropPanel);
                });
                $scope.$on("showStylePanel", function(event, data) {
                    var $element = $(".content").eq(0);
                    if($stylePanel){
                        $stylePanel.show();
                    }else{
                        if("style" == data.activeTab){
                            $stylePanel = $compile('<div style-modal active-tab="style"></div>')($scope);
                        }else if("anim" == data.activeTab){
                            $stylePanel = $compile('<div style-modal active-tab="anim"></div>')($scope);
                        }
                        $element.append($stylePanel);
                    }
                });
                $scope.$on("hideStylePanel", function() {
                    $stylePanel && $stylePanel.hide()
                });

                $scope.$on("dom.changed", function() {
                    $compile($("#nr"))($scope);
                });
                $scope.$on("text.click", function(event, element) {
                    $("#btn-toolbar").remove();
                    $("body").append($compile("<toolbar></toolbar>")($scope));
                    var top = $(element).offset().top;
                    $timeout(function() {
                        $("#btn-toolbar").css("top", top - 50);
                        $("#btn-toolbar").show();
                        $("#btn-toolbar").bind("click mousedown", function(event) {
                            event.stopPropagation();
                        });
                        $(element).wysiwyg_destroy();
                        $(element).wysiwyg();
                        element.focus();
                    });
                });

                $scope.getScenePages = function() {
                    var sceneId = $routeParams.sceneId;
                    //根据指定sceneId，获取该场景的所有页面信息
                    sceneService.getScenePages(sceneId).then(function(data) {
                        $scope.pages = data.data.list;
                        ng.forEach($scope.pages, function(value, key) {
                            value.name || (value.name = "第" + (key + 1) + "页");
                        });
                        var pageIdx = $location.search().pageIdx ? $location.search().pageIdx : $scope.pages[0].num;
                        loadPageInfo(pageIdx);
                    });
                };
                //TODO: 获取指定场景的所有页面
                $scope.getScenePages();
                $scope.editableStatus = [];
                $scope.removeScratch = function(event) {
                    event.stopPropagation();
                    $scope.tpl.obj.properties = null;
                };
                $scope.updatePosition = function(a) {
                    var b, c, d = f.tpl.obj.elements,
                        e = [];
                    for (c = 0; c < d.length; c++)
                        if ("3" == d[c].type) {
                            d[c].num = 0, e.push(d[c]), d.splice(c, 1);
                            break
                        }
                    for (b = 0; b < a.length; b++)
                        for (c = 0; c < d.length; c++)
                            if (d[c].num == a[b]) {
                                d[c].num = b + 1, e.push(d[c]), d.splice(c, 1);
                                break
                            }
                    f.tpl.obj.elements = e
                };
                $scope.updateEditor = function() {
                    $("#nr").empty();
                    sceneService.templateEditor.parse({
                        def: $scope.tpl.obj,
                        appendTo: "#nr",
                        mode: "edit"
                    });
                    $compile($("#nr"))($scope);
                };

                $scope.stopCopy = function() {q = !1;};
                $scope.getOriginPageName = function(page) {originPageName = page.name;};
                var C = !1;
                $scope.saveScene = function(save, callback) {
                    if (!C) {
                        C = !0;
                        if (curPageTpl == JSON.stringify($scope.tpl)){
                            callback && callback();
                            if(save){
                                if(!$scope.tpl.obj.scene.publishTime || $scope.tpl.obj.scene.updateTime > $scope.tpl.obj.scene.publishTime){
                                    emitRoute();
                                }else{
                                    //r.pushForCurrentRoute("scene.save.success.published", "notify.success");
                                }
                            }
                            return void(C = !1);
                        }
                        if("" === $scope.tpl.obj.scene.name)$scope.tpl.obj.scene.name = curSceneName;
                        $scope.tpl.obj.scene.name = $scope.tpl.obj.scene.name.replace(/(<([^>]+)>)/gi, "");

                        if(sceneService.getSceneObj().obj.scene.image
                            && sceneService.getSceneObj().obj.scene.image.bgAudio){
                            if(!$scope.tpl.obj.scene.image)$scope.tpl.obj.scene.image = {};
                            $scope.tpl.obj.scene.image.bgAudio = sceneService.getSceneObj().obj.scene.image.bgAudio
                        }
                        sceneService.resetCss();
                        $scope.tpl.obj.scene.image.isAdvancedUser = $rootScope.isAdvancedUser || $rootScope.isVendorUser ? !0 : !1;
                        sceneService.saveScene($scope.tpl.obj).then(function() {
                            C = !1;
                            $scope.tpl.obj.scene.updateTime = (new Date).getTime();
                            curPageTpl = ng.toJson($scope.tpl);
                            curPageTplId && (sceneService.recordTplUsage(curPageTplId), curPageTplId = null);
                            callback && callback();
                            save && emitRoute();
                        }, function() {
                            C = !1;
                        });
                    }
                };
                $scope.publishScene = function() {
                        return f.tpl.obj.scene.publishTime && f.tpl.obj.scene.updateTime <= f.tpl.obj.scene.publishTime && curPageTpl == b.toJson(f.tpl) ? void j.path("my/scene/" + f.sceneId) : void f.saveScene(null, function() {
                            k.publishScene(f.tpl.obj.sceneId).then(function(a) {
                                a.data.success && (r.pushForNextRoute("scene.publish.success", "notify.success"), q = !1, j.path(f.tpl.obj.scene.publishTime ? "my/scene/" + f.sceneId : "my/sceneSetting/" + f.sceneId))
                            })
                        })
                    };
                $scope.exitScene = function() {
                    q = !1;
                    JSON.parse(curPageTpl);
                    if(curPageTpl == ng.toJson($scope.tpl)){
                        $window.history.back();
                    }else{
                        ModalService.openConfirmDialog({
                            msg: "是否保存更改内容？",
                            confirmName: "保存",
                            cancelName: "不保存"
                        }, function() {
                            $scope.saveScene();
                            $window.history.back();
                        }, function() {
                            $window.history.back();
                        });
                    }
                };
                $scope.duplicatePage = function() {
                    f.saveScene(null, function() {
                        loadPageInfo(f.pageNum, !1, !0)
                    })
                };
                $scope.deletePage = function(a) {
                        a.stopPropagation(), f.loading || (f.loading = !0, k.deletePage(f.tpl.obj.id).then(function() {
                            f.loading = !1, j.$$search = {}, f.pages.length == f.pageNum ? (f.pages.pop(), j.search("pageIdx", --f.pageNum), loadPageInfo(f.pageNum, !1, !1)) : (f.pages.splice(f.pageNum - 1, 1), j.search("pageIdx", f.pageNum), loadPageInfo(f.pageNum, !1, !1))
                        }, function() {
                            f.loading = !1
                        }))
                    };
                $scope.removeBG = function(a) {
                        a.stopPropagation();
                        var b, c = f.tpl.obj.elements;
                        for (b = 0; b < c.length; b++)
                            if (3 == c[b].type) {
                                c.splice(b, 1);
                                var d;
                                for (d = b; d < c.length; d++) c[d].num--;
                                break
                            }
                        $("#nr .edit_area").parent().css({
                            backgroundColor: "transparent",
                            backgroundImage: "none"
                        }), $("#editBG").hide()
                    };
                $scope.removeBGAudio = function(a) {
                        a.stopPropagation(), delete f.tpl.obj.scene.image.bgAudio
                    };
                $scope.exitPageTplPreview = function() {
                    $("#nr").empty();
                    sceneService.templateEditor.parse({
                        def: $scope.tpl.obj,
                        appendTo: "#nr",
                        mode: "edit"
                    });
                    $rootScope.$broadcast("dom.changed");
                };
                $scope.chooseThumb = function() {
                    $modal.open({
                        windowClass: "console",
                        templateUrl: "scene/console/bg.tpl.html",
                        controller: "BgConsoleCtrl",
                        resolve: {
                            obj: function() {
                                return {
                                    fileType: "0"
                                }
                            }
                        }
                    }).result.then(function(data) {
                            if(!$scope.tpl.obj.properties)$scope.tpl.obj.properties = {};
                            $scope.tpl.obj.properties.thumbSrc = data.data
                        }, function() {
                            $scope.tpl.obj.properties.thumbSrc = null;
                        });
                };
                $scope.sortableOptions = {
                    placeholder: "ui-state-highlight ui-sort-position",
                    containment: "#containment",
                    update: function(a, b) {
                        var c = b.item.sortable.dropindex + 1,
                            d = f.pages[b.item.sortable.index].id;
                        f.saveScene(null, function() {
                            k.changePageSort(c, d).then(function() {
                                loadPageInfo(c, !1, !1, !0), j.$$search = {}, j.search("pageIdx", c), f.pageNum = c
                            })
                        })
                    }
                };
                $scope.pageChildLabel = function() {
                    var a, b = [];
                    for (a = 0; a < $scope.pageLabelAll.length; a++){
                        if($scope.pageLabelAll[a].ischecked)b.push($scope.pageLabelAll[a].id);
                    }
                    pageTplService.updataChildLabel(b, $scope.pageIdTag).then(function() {
                        alert("分配成功！");
                        $route.reload();
                    }, function() {});
                };

                $scope.myName = [{name: "我的"}];
                //$scope.$watch(function() {return o.currentUser}, function(a) {a && (f.userProperty = a)}, !0);
                $(".scene_title").on("paste", function(event) {
                    event.preventDefault();
                    var pasteEvent = (event.originalEvent || event).clipboardData.getData("text/plain") || prompt("Paste something..");
                    document.execCommand("insertText", !1, pasteEvent);
                });

                var generateTemplate = function() {
                    if(!$rootScope.mySceneId && $scope.userProperty.property){
                        $scope.userPropertyObj = JSON.parse($scope.userProperty.property);
                        $rootScope.mySceneId = $scope.userPropertyObj.myTplId;
                    }
                    var tplInfo = $.extend(!0, {}, $scope.tpl.obj);
                    tplInfo.sceneId = $rootScope.mySceneId ? $rootScope.mySceneId : null;

                    sceneService.saveMyTpl(tplInfo).then(function(data) {
                        alert("成功生成我的模板");
                        $rootScope.mySceneId = data.data.obj;

                        sceneService.previewScene($rootScope.mySceneId).then(function(info) {
                            $scope.myName[0].active = !0;
                            $scope.myPageTpls = mySceneOrTplInfo[$rootScope.mySceneId] = info.data.list
                        })
                    })
                },mySceneOrTplInfo = {};
                $scope.creatMyTemplate = function() {generateTemplate();};

                /**
                 * 根据指定的 tplPageType， 获取该类型下的所有TagLabel
                 * @param tplPageType
                 */
                $scope.getPageTagLabel = function(tplPageType) {
                    if(PageLabels[tplPageType]){
                        $scope.pageLabel = PageLabels[tplPageType];
                        K();
                    }else{
                        pageTplService.getPageTagLabel(tplPageType).then(function(data) {
                            $scope.pageLabel = PageLabels[tplPageType] = data.data.list;
                            K();
                        });
                    }
                };
                $scope.pageLabelAll = [];
                var J, K = function() {
                    //TODO: $scope.pageIdTag ??
                    console.log("$scope.pageIdTag: "+$scope.pageIdTag);
                    //获取指定 pageIdTag 下的所有pageTpl
                    pageTplService.getPageTagLabelCheck($scope.pageIdTag).then(function(data) {
                        J = data.data.list;
                        for (var b = 0; b < $scope.pageLabel.length; b++) {
                            var c = {
                                id: $scope.pageLabel[b].id,
                                name: $scope.pageLabel[b].name
                            };
                            for (var d = 0; d < J.length; d++) {
                                if (J[d].id === $scope.pageLabel[b].id) {
                                    c.ischecked = !0;
                                    break;
                                }
                                c.ischecked = !1
                            }
                            $scope.pageLabelAll.push(c);
                        }
                    });
                };

                /**
                 * 获取指定的 TagLabelId 和 tplPageType， 获取满足的所有PageTpl
                 * @param id
                 * @param bizType
                 */
                $scope.getPageTplTypestemp = function(id, bizType) {
                    pageTplService.getPageTplTypestemp(id, bizType).then(function(data) {
                        $scope.categoryId = id;
                        $scope.pageTpls = data.data.list && data.data.list.length > 0 ? data.data.list : [];

                        if ($scope.otherCategory.length > 0) {
                            var c = $scope.childCatrgoryList[0];
                            for (var d = 0; d < $scope.otherCategory.length; d++){
                                if($scope.categoryId == $scope.otherCategory[d].id){
                                    $scope.childCatrgoryList[0] = $scope.otherCategory[d];
                                    $scope.otherCategory[d] = c;
                                }
                            }
                        }
                    });
                };
                var ensureCatrgory = function() {
                        //TODO: $scope.type??
                        console.log("$scope.type: "+$scope.type);
                        var catrgory = "1" == $scope.type ? 3 : 4;
                        if($scope.childCatrgoryList && $scope.childCatrgoryList.length > catrgory){
                            $scope.otherCategory = $scope.childCatrgoryList.slice(catrgory);
                            $scope.childCatrgoryList = $scope.childCatrgoryList.slice(0, catrgory);
                        }else{
                            $scope.otherCategory = [];
                        }
                    },
                    PageTpls = {},//当前已缓存的PageTpls
                    /**
                     * 获取指定类型下的所有PageTpl
                     * @param tplPageType
                     */
                    getPageTpls = function(tplPageType) {
                        if(PageTpls[tplPageType]){
                            $scope.childCatrgoryList = PageTpls[tplPageType];
                            $scope.getPageTplTypestemp($scope.childCatrgoryList[0].id, tplPageType);
                            ensureCatrgory();
                        }else{
                            //获取指定的 tplPageType 类型下的TagLabel
                            pageTplService.getPageTagLabel(tplPageType).then(function(data) {
                                $scope.childCatrgoryList = PageTpls[tplPageType] = data.data.list;
                                $scope.getPageTplTypestemp($scope.childCatrgoryList[0].id, tplPageType);
                                ensureCatrgory();
                            });
                        }
                    },
                    PageLabels = {};
                $scope.getPageTplsByMyType = function() {
                    $scope.userPropertyObj = JSON.parse($scope.userProperty.property);
                    var property = $rootScope.mySceneId || $scope.userPropertyObj;
                    if (property) {
                        var mySceneOrTplId = $rootScope.mySceneId || $scope.userPropertyObj.myTplId;

                        sceneService.previewScene(mySceneOrTplId).then(function(data) {
                            $scope.myPageTpls = mySceneOrTplInfo[mySceneOrTplId] = data.data.list
                        });
                    } else {
                        $scope.myPageTpls = [];
                    }
                };
                /**
                 * 根据指定的 tplPageType， 获取该类型下的所有页面
                 * @param tplPageType
                 */
                $scope.getPageTplsByType = function(tplPageType) {getPageTpls(tplPageType);};
                //TODO:获取所有页面的类型
                pageTplService.getPageTplTypes().then(function(data) {
                    $scope.pageTplTypes = data.data.list && data.data.list.length > 0
                        ? data.data.list.splice(0, 3)
                        : [];
                }).then(function() {
                    //获取指定类型下的所有模板页面
                    $scope.getPageTplsByType($scope.pageTplTypes[0].value);
                });
                /**
                 * 选择并插入模板页
                 * @param pageTplId
                 */
                $scope.insertPageTpl = function(pageTplId) {
                    $scope.loading = !0;
                    var loadPageTpl = function(pageTplId) {
                        //获取指定的场景模板页
                        sceneService.getSceneTpl(pageTplId).then(function(data) {
                            $scope.loading = !1;
                            //TODO: 当前使用的PageTplId
                            curPageTplId = data.data.obj.id;
                            console.log("curPageTplId: "+curPageTplId);
                            $scope.tpl.obj.elements = sceneService.getElements();
                            $("#nr").empty();
                            historyService.addPageHistory($scope.tpl.obj.id, $scope.tpl.obj.elements);
                            sceneService.templateEditor.parse({
                                def: $scope.tpl.obj,
                                appendTo: "#nr",
                                mode: "edit"
                            });
                            $rootScope.$broadcast("dom.changed");
                        }, function() {
                            $scope.loading = !1;
                        });
                    };
                    if($scope.tpl.obj.elements && $scope.tpl.obj.elements.length > 0){
                        ModalService.openConfirmDialog({
                            msg: "页面模板会覆盖编辑区域已有组件，是否继续？",
                            confirmName: "是",
                            cancelName: "取消"
                        }, function() {
                            loadPageTpl(pageTplId);
                        });
                    }else{
                        loadPageTpl(pageTplId);
                    }
                };
                //增加一页
                $scope.insertPage = function() {
                    $scope.saveScene(null, function() {
                        loadPageInfo($scope.pageNum, !0, !1);
                    });
                    if($("#pageList").height() >= 360){
                        $timeout(function() {
                            var $pageList = document.getElementById("pageList");
                            $pageList.scrollTop = $pageList.scrollHeight;
                        }, 200);
                    }
                };
                //切换上下或指定页
                $scope.navTo = function(page, index) {
                    $scope.pageList = !0;
                    if($scope.isEditor && (1101 === $scope.sceneId || 1102 === $scope.sceneId || 1103 === $scope.sceneId)){
                        $scope.pageLabelAll.length = 0;
                        $scope.pageIdTag = page.id;
                        $scope.getPageTagLabel();
                    }

                    if(page.id != $scope.tpl.obj.id){
                        $scope.saveScene(null, function() {
                            loadPageInfo(index + 1);
                            $location.$$search = {};
                            $location.search("pageIdx", page.num);
                        });
                    }
                };
                //保存指定页名称
                $scope.savePageNames = function(page, index) {
                    if(!page.name)page.name = "第" + (index + 1) + "页";
                    $scope.tpl.obj.name = page.name;

                    if(originPageName != page.name){
                        sceneService.savePageNames($scope.tpl.obj).then(function() {});
                    }
                };

                $(win).bind("beforeunload", function() {return "请确认您的场景已保存";});
                $scope.$on("$destroy", function() {
                    $(win).unbind("beforeunload");
                    historyService.clearHistory();
                });

                $scope.$on("history.changed", function() {
                    $scope.canBack = historyService.canBack($scope.tpl.obj.id);
                    $scope.canForward = historyService.canForward($scope.tpl.obj.id);
                });
                $scope.back = function() {sceneService.historyBack();};
                $scope.forward = function() {sceneService.historyForward();}
            }])
        .directive("changeColor", function() {
            return {
                link: function(a, b) {
                    b.bind("click", function() {
                        $(b).addClass("current")
                    })
                }
            }
        })
        .directive("thumbTpl", ["sceneService", function(a) {
            return {
                scope: {
                    localModel: "=myAttr"
                },
                link: function(b, c) {
                    $(c).empty(), a.templateEditor.parse({
                        def: b.localModel,
                        appendTo: c,
                        mode: "view"
                    }), $(".edit_area", c).css("transform", "scale(0.25) translateX(-480px) translateY(-729px)")
                }
            }
        }]);
    ng.module("services.history", []).factory("historyService", ["$rootScope", function($rootScope) {
        var HistoryService = {}, PageHistorys = {},PageHistory = {};
        HistoryService.addPage = function(tplPageId, elements) {
            if(!PageHistorys[tplPageId]){
                PageHistorys[tplPageId] = {currentPos: 0,inHistory: !1,pageHistory: []};
                HistoryService.addPageHistory(tplPageId, elements);
            }
            $rootScope.$broadcast("history.changed");
            return JSON.parse(PageHistorys[tplPageId].pageHistory[PageHistorys[tplPageId].currentPos]);
        };
        HistoryService.addPageHistory = function(tplPageId, elements) {
            PageHistory = PageHistorys[tplPageId];
            if(PageHistory.inHistory){
                PageHistory.inHistory = !1;
                PageHistory.pageHistory.length = PageHistory.currentPos + 1
            }
            var elementTpl = JSON.stringify(elements);
            if(elementTpl != PageHistory.pageHistory[PageHistory.pageHistory.length - 1]){
                PageHistory.pageHistory.push(elementTpl);
            }
            PageHistory.currentPos = PageHistory.pageHistory.length - 1;
            $rootScope.$broadcast("history.changed");
        };
        HistoryService.clearHistory = function() {PageHistorys = {};};
        HistoryService.canBack = function(tplPageId) {
            PageHistory = PageHistorys[tplPageId];
            return PageHistory.currentPos > 0;
        };
        HistoryService.canForward = function(tplPageId) {
            PageHistory = PageHistorys[tplPageId];
            return PageHistory.currentPos < PageHistory.pageHistory.length - 1;
        };
        HistoryService.back = function(tplPageId) {
            PageHistory = PageHistorys[tplPageId];
            if (PageHistory.pageHistory.length) {
                PageHistory.inHistory = !0;
                var elementTpl = 0 === PageHistory.currentPos
                        ? PageHistory.pageHistory[0]
                        : PageHistory.pageHistory[--PageHistory.currentPos];
                $rootScope.$broadcast("history.changed");
                return JSON.parse(elementTpl);
            }
        };
        HistoryService.forward = function(tplPageId) {
            PageHistory = PageHistorys[tplPageId];
            if (PageHistory.pageHistory.length) {
                PageHistory.inHistory = !0;
                var elementTpl = PageHistory.currentPos == PageHistory.pageHistory.length - 1
                        ? PageHistory.pageHistory[PageHistory.currentPos]
                        : PageHistory.pageHistory[++PageHistory.currentPos];
                $rootScope.$broadcast("history.changed");
                return JSON.parse(elementTpl);
            }
        };
        return HistoryService;
    }]);
    ng.module("services.scene", ["services.history"]);
    ng.module("services.scene").factory("sceneService", ["$http", "$rootScope", "$modal", "$q","$cacheFactory", "historyService", function($http, $rootScope, $modal, $q, $cacheFactory, historyService){
        function addComponentHandle(type, component, gFlag) {
            var li = JsonParser.wrapComp(component, "edit");
            $("#nr .edit_area").append(li);
            for (var interceptors = JsonParser.getInterceptors(), i = 0; i < interceptors.length; i++){
                interceptors[i](li, component);
            }
            JsonParser.getEventHandlers()[("" + type).charAt(0)](li, component);
            if("g101" != gFlag){
                historyService.addPageHistory(CurPageTplInfo.obj.id, CurPageTplInfo.obj.elements);
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
                component.properties.src || (CurPageElementInfo.splice(CurPageElementInfo.indexOf(I[component.id]), 1), delete I[component.id]);
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
                historyService.addPageHistory(CurPageTplInfo.obj.id, CurPageTplInfo.obj.elements);
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
                    $("#" + component.id).length || (CurPageElementInfo.splice(CurPageElementInfo.indexOf(I[component.id]), 1), delete I[component.id]);
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
                        $("#" + component.id).length || (CurPageElementInfo.splice(CurPageElementInfo.indexOf(I[component.id]), 1), delete I[component.id]);
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
                    $("#" + component.id).length || (CurPageElementInfo.splice(CurPageElementInfo.indexOf(I[component.id]), 1), delete I[component.id]);
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
                    $("#" + component.id).length || (CurPageElementInfo.splice(CurPageElementInfo.indexOf(I[component.id]), 1), delete I[component.id])
                });
            }
        }//v
        function linkHandle(component) {
            component.sceneId = CurPageTplInfo.obj.sceneId;
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
                        CurPageElementInfo.splice(CurPageElementInfo.indexOf(I[component.id]), 1);
                        delete I[component.id];
                        console.log(component)
                    }
                });
        }//w
        function audioHandle() {
            if(!Modal){
                Modal = $modal.open({
                    windowClass: "console",
                    templateUrl: "scene/console/audio.tpl.html",
                    controller: "AudioConsoleCtrl",
                    resolve: {
                        obj: function() {
                            return CurPageTplInfo.obj.scene.image && CurPageTplInfo.obj.scene.image.bgAudio ? CurPageTplInfo.obj.scene.image.bgAudio : {};
                        }
                    }
                }).result.then(function(data) {
                        Modal = null;
                        if("bgAudio" == data.compType){
                            if(!CurPageTplInfo.obj.scene.image)CurPageTplInfo.obj.scene.image = {};
                            CurPageTplInfo.obj.scene.image.bgAudio = data.bgAudio;
                        }
                    }, function() {
                        Modal = null;
                    });
            }
        }//y

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

        function reParseElements(elements){
            CurPageTplInfo.obj.elements = elements;
            $("#nr").empty();
            JsonParser.parse({
                def: CurPageTplInfo.obj,
                appendTo: "#nr",
                mode: "edit"
            });
            $("#editBG").hide();
            for (var elem in elements){
                if (3 == elements[elem].type) {
                    $("#editBG").show();
                    break;
                }
            }
            $rootScope.$broadcast("dom.changed");
        }//i
        function revisePosition(originalElemDef, copyElemDef){
            var top = parseInt(originalElemDef.css.top.substring(0, originalElemDef.css.top.length - 2), 10) + 34 * SceneService.sameCopyCount,
                left = parseInt(originalElemDef.css.left.substring(0, originalElemDef.css.left.length - 2), 10);
            if(top + 34 > $("#nr .edit_area").outerHeight()){
                copyElemDef.css.top = top + "px";
                copyElemDef.css.left = left + 10 + "px"
            }else{
                copyElemDef.css.top = top + 34 + "px";
                copyElemDef.css.left = originalElemDef.css.left;
                SceneService.sameCopyCount++;
            }
        }//k
        function setCssProps(type, b) {
            var cssProps = {},
                $target = $("#nr .edit_area"),
                $last = $target.children().last(),
                $maxIndex = $target.children(".maxIndex"),
                curIndex = 0;
            if($maxIndex.length > 0){
                curIndex = parseInt($maxIndex.css("z-index"), 10) + 1;
            }else{
                if($last.length > 0){
                    curIndex = parseInt($last.css("z-index"), 10) + 1;
                }else{
                    curIndex = 101;
                }
            }
            if (b){b.zIndex = curIndex;return b;}
            if($last.length <= 0){
                cssProps = {top: "30px",left: "0px"};
            }else{
                if($last.position().top + $last.outerHeight() > $("#nr .edit_area").outerHeight() - 10){
                    cssProps = {top: $last.position().top,  left: $last.position().left + 10 + "px"};
                }else{
                    cssProps = {
                        top: $last.position().top + $last.outerHeight() + 10 + "px",
                        left: $last.position().left + "px"
                    };
                }
            }
            cssProps.zIndex = curIndex;
            return cssProps;
        }//j
        function setElementData(type, b, c) {
            var cssProps,
                getRandomUId = function() {
                    for (var uid = Math.ceil(1e3 * Math.random()), b = 0; b < CurPageElementInfo.length; b++){
                        if (CurPageElementInfo[b].id == uid) return getRandomUId();
                    }
                    return uid;
                },
                rndUid = getRandomUId(),
                elemData = {};
            switch (("" + type).charAt(0)){
                case "1"://submit
                    elemData = {
                        id: Math.ceil(100 * Math.random()),
                        properties: {title: "提交"},
                        type: 1,
                        pageId: CurPageTplInfo.obj.id,
                        sceneId: CurPageTplInfo.obj.sceneId
                    };
                    break;
                case "2"://文本
                    cssProps = setCssProps(type, b);
                    elemData = {
                        content: "点击此处进行编辑",
                        css: cssProps,
                        id: rndUid,
                        num: 1,
                        pageId: CurPageTplInfo.obj.id,
                        properties: {},
                        sceneId: CurPageTplInfo.obj.sceneId,
                        title: null,
                        type: 2
                    };
                    break;
                case "3"://背景
                    if ($("#editBG:visible").length > 0) {
                        for (var h = 0; h < CurPageElementInfo.length; h++){
                            if (3 == CurPageElementInfo[h].type) {
                                elemData = CurPageElementInfo[h];
                                break
                            }
                        }
                        return elemData;
                    }
                    elemData = {
                        content: null,
                        css: {},
                        id: rndUid,
                        num: 0,
                        pageId: CurPageTplInfo.obj.id,
                        properties: { bgColor: null, imgSrc: null},
                        sceneId: CurPageTplInfo.obj.sceneId,
                        title: null,
                        type: 3
                    }
                    break;
                case "4"://图片
                    cssProps = setCssProps(type, b);
                    cssProps.width = "100px";
                    cssProps.height = "100px";
                    elemData = {
                        content: "",
                        css: cssProps,
                        id: rndUid,
                        num: 1,
                        pageId: CurPageTplInfo.obj.id,
                        properties: {width: "100px",height: "100px",src: ""},
                        sceneId: CurPageTplInfo.obj.sceneId,
                        title: null,
                        type: 4
                    };
                    break;
                case "5"://输入框
                    cssProps = setCssProps(type, b);
                    $.extend(true, cssProps, {
                        color: "#676767",
                        borderWidth: "1",
                        borderStyle: "solid",
                        borderColor: "#ccc",
                        borderRadius: "5",
                        backgroundColor: "#f9f9f9"
                    });
                    elemData = {
                        content: "",
                        css: cssProps,
                        id: rndUid,
                        num: 1,
                        pageId: CurPageTplInfo.obj.id,
                        properties: {placeholder: "请命名"},
                        isInput: 1,
                        sceneId: CurPageTplInfo.obj.sceneId,
                        title: "请命名",
                        type: 5
                    };
                    break;
                case "6"://button
                    cssProps = setCssProps(type, b);
                    $.extend(true, cssProps, {
                        color: "#676767",
                        borderWidth: "1",
                        borderStyle: "solid",
                        borderColor: "#ccc",
                        borderRadius: "5",
                        backgroundColor: "#f9f9f9"
                    });
                    elemData = {
                        content: "",
                        css: cssProps,
                        id: rndUid,
                        num: 1,
                        pageId: CurPageTplInfo.obj.id,
                        properties: {title: "提交"},
                        sceneId: CurPageTplInfo.obj.sceneId,
                        title: null,
                        type: 6
                    };
                    break;
                case "8"://电话
                    cssProps = setCssProps(type, b);
                    $.extend(true, cssProps, {
                        color: "#676767",
                        borderWidth: "1",
                        borderStyle: "solid",
                        borderColor: "#ccc",
                        borderRadius: "5",
                        backgroundColor: "#f9f9f9"
                    });
                    elemData = {
                        content: "",
                        css: cssProps,
                        id: rndUid,
                        num: 1,
                        pageId: CurPageTplInfo.obj.id,
                        properties: {title: "一键拨号",number: ""},
                        sceneId: CurPageTplInfo.obj.sceneId,
                        title: null,
                        type: 8
                    };
                    break;
                case "p"://图集
                    cssProps = setCssProps(type, b);
                    elemData = {
                        content: "",
                        css: cssProps,
                        id: rndUid,
                        num: 1,
                        pageId: CurPageTplInfo.obj.id,
                        properties: {title: "图集"},
                        sceneId: CurPageTplInfo.obj.sceneId,
                        title: null,
                        type: "p"
                    };
                    break;
                case "v"://视频
                    cssProps = setCssProps(type, b);
                    cssProps.width = "48px";
                    cssProps.height = "48px";
                    elemData = {
                        content: "",
                        css: cssProps,
                        id: rndUid,
                        num: 1,
                        pageId: CurPageTplInfo.obj.id,
                        properties: {src: ""},
                        sceneId: CurPageTplInfo.obj.sceneId,
                        title: null,
                        type: "v"
                    };
                    break;
            }
            c && $.extend(!0, elemData, c);
            CurPageElementInfo.push(elemData);
            I[elemData.id] = elemData;
            return elemData;
        }//l
        function setInputData(type) {
            var elementData;
            switch (type){
                case "501":
                    elementData = {
                        properties: {placeholder: "姓名"},
                        title: "姓名",
                        type: 501
                    };
                    break;
                case "502":
                    elementData = {
                        properties: {placeholder: "手机"},
                        title: "手机",
                        type: 502
                    };
                    break;
                case "503":
                    elementData = {
                        properties: {placeholder: "邮箱"},
                        title: "邮箱",
                        type: 503
                    };
                    break;
                case "601":
                    elementData = {
                        properties: {title: "提交"},
                        type: 601
                    };
                    break;
            }
            return elementData;
        };//K
        function setG101Data(type) {
            var inputData = [];
            if("g101" == type){
                inputData.push(setInputData("501"));
                inputData.push(setInputData("502"));
                inputData.push(setInputData("503"));
                inputData.push(setInputData("601"));
            }
            return inputData;
        }//n

        {var SceneService = {}, JsonParser = eqShow.templateParser("jsonParser"), CurPageTplInfo = null, CurPageElementInfo = null, I = {};}

        SceneService.historyBack = function() {
            if(historyService.canBack(CurPageTplInfo.obj.id)){
                CurPageElementInfo = historyService.back(CurPageTplInfo.obj.id);
                reParseElements(CurPageElementInfo);
            }
        };
        SceneService.historyForward = function() {
            if(historyService.canForward(CurPageTplInfo.obj.id)){
                CurPageElementInfo = historyService.forward(CurPageTplInfo.obj.id);
                reParseElements(CurPageElementInfo);
            }
        };
        SceneService.copyElement = function(elemDefTpl) {
            var copyElemDef = ng.copy(elemDefTpl);
            q = !0;
            SceneService.originalElemDef = elemDefTpl;
            SceneService.copyElemDef = copyElemDef;
        };
        SceneService.pasteElement = function(originalElemDef, copyElemDef) {
            copyElemDef.id = Math.ceil(100 * Math.random());
            copyElemDef.pageId = CurPageTplInfo.obj.id;
            if(SceneService.pageId == copyElemDef.pageId){
                revisePosition(originalElemDef, copyElemDef);
            }else{
                SceneService.sameCopyCount = 0;
                copyElemDef.css = ng.copy(originalElemDef.css);
            }
            var finalElem = ng.copy(copyElemDef);
            CurPageElementInfo.push(finalElem);
            I[finalElem.id] = finalElem;
            addComponentHandle(finalElem.type, finalElem);
            SceneService.pageId = CurPageTplInfo.obj.id;
        };
        $(document).keydown(function(event) {
            if($("#nr .edit_area").length){
                if((event.ctrlKey || event.metaKey) && 90 == event.keyCode)SceneService.historyBack();//z
                if((event.ctrlKey || event.metaKey) && 89 == event.keyCode)SceneService.historyForward();//y
                if((event.ctrlKey || event.metaKey)
                    && SceneService.elemDefTpl
                    && !$("#btn-toolbar")[0]
                    && !$(".modal-dialog")[0]){
                    if(86 == event.keyCode){//v
                        event.preventDefault();
                        if(q)SceneService.pasteElement(SceneService.originalElemDef, SceneService.copyElemDef);
                    }
                    if(67 == event.keyCode){//c
                        event.preventDefault();
                        SceneService.pageId = CurPageTplInfo.obj.id;
                        SceneService.sameCopyCount = 0;
                        SceneService.copyElement(SceneService.elemDefTpl);
                    }
                }
                $rootScope.$apply();
            }
        });
        SceneService.resetCss = function() {
            $("#nr .edit_area li").each(function(key, value) {
                var component = I[value.id.replace(/inside_/g, "")];
                if(component){
                    if(!component.css)component.css = {};
                    component.css.zIndex = value.style.zIndex ? value.style.zIndex : "0";
                }
            });
        };
        var createCompGroup = SceneService.createCompGroup = function(type, b){
            for (var inputData = setG101Data(type), e = 0; e < inputData.length; e++) {
                var elementData = setElementData(inputData[e].type, b, inputData[e]);
                b = null;
                addComponentHandle(inputData[e].type, elementData, "g101");
            }
            historyService.addPageHistory(CurPageTplInfo.obj.id, CurPageTplInfo.obj.elements);
            $rootScope.$broadcast("dom.changed");
        }
        SceneService.createComp = function(type, b) {
            var elementData;
            switch (("" + type).charAt(0)){
                case "1":
                    if($(".comp_title").length > 0){
                        alert("已存在一个标签");
                    }else{
                        elementData = setElementData(type, b);
                        microwebHandle(elementData);
                    }
                    break;
                case "3":
                    elementData = setElementData(type, b);
                    bgHandle(elementData);
                    break;
                case "4":
                    elementData = setElementData(type, b);
                    imageHandle(elementData);
                    break;
                case "5":
                    elementData = setElementData(type, b);
                    inputHandle(elementData);
                    break;
                case "8":
                    elementData = setElementData(type, b);
                    telHandle(elementData);
                    break;
                case "9":
                    audioHandle();
                    break;
                case "g":
                    createCompGroup(type, b);
                    break;
                case "v":
                    elementData = setElementData(type, b);
                    videoHandle(elementData);
                    break;
                case "p":
                    elementData = setElementData(type, b);
                    carouselHandle(elementData);
                    break;
                default :
                    elementData = setElementData(type, b);
                    addComponentHandle(type, elementData);
            }
        };
        SceneService.updateCompSize = function(elementId, props) {
            for (var d = 0; d < CurPageElementInfo.length; d++) {
                if("inside_" + CurPageElementInfo[d].id == elementId){
                    if(!CurPageElementInfo[d].css)CurPageElementInfo[d].css = {};
                    CurPageElementInfo[d].css.width = props.width;
                    CurPageElementInfo[d].css.height = props.height;

                    CurPageElementInfo[d].properties.width = props.width;
                    CurPageElementInfo[d].properties.height = props.height;
                    if(props.imgStyle)CurPageElementInfo[d].properties.imgStyle = props.imgStyle;
                    //h.addPageHistory(CurPageTplInfo.obj.id, CurPageElementInfo)
                }
            }
            $rootScope.$apply();
        };
        SceneService.updateCompPosition = function(elementId, props) {
            for (var d = 0; d < CurPageElementInfo.length; d++) {
                if ("inside_" + CurPageElementInfo[d].id == elementId) {
                    if(CurPageElementInfo[d].css){
                        CurPageElementInfo[d].css.left = props.left;
                        CurPageElementInfo[d].css.top = props.top;
                        //h.addPageHistory(CurPageTplInfo.obj.id, CurPageElementInfo);
                    }else{
                        CurPageElementInfo[d].css = props;
                        //h.addPageHistory(CurPageTplInfo.obj.id, CurPageElementInfo);
                    }
                }
            }
            $rootScope.$apply();
        };
        SceneService.updateCompAngle = function(elementId, angle) {
            for (var d = 0; d < CurPageElementInfo.length; d++){
                if("inside_" + CurPageElementInfo[d].id == elementId){
                    if(CurPageElementInfo[d].css){
                        CurPageElementInfo[d].css.transform = "rotateZ(" + angle + "deg)"
                    }else{
                        CurPageElementInfo[d].css = {};
                    }
                    //h.addPageHistory(CurPageTplInfo.obj.id, CurPageElementInfo);
                }
            }
            $rootScope.$apply();
        };


        var Modal = null, GlobalEvt = null;
        JsonParser.addInterceptor(function(wrapComponent, element, mode){
            function generatePopMenu() {
                var $popMenu = $('<ul id="popMenu" class="dropdown-menu" style="min-width: 100px; display: block;" role="menu" aria-labelledby="dropdownMenu1"><li class="edit" role="presentation"><a role="menuitem" tabindex="-1"><div class="glyphicon glyphicon-edit" style="color: #08a1ef;"></div>&nbsp;&nbsp;编辑</a></li><li class="style" role="presentation"><a role="menuitem" tabindex="-1"><div class="fa fa-paint-brush" style="color: #08a1ef;"></div>&nbsp;&nbsp;样式</a></li><li class="animation" role="presentation"><a role="menuitem" tabindex="-1"><div class="fa fa-video-camera" style="color: #08a1ef;"></div>&nbsp;&nbsp;动画</a></li><li class="link" role="presentation"><a role="menuitem" tabindex="-1"><div class="fa fa-link" style="color: #08a1ef;"></div>&nbsp;&nbsp;链接</a></li><li class="copy" role="presentation" style="margin-bottom:5px;"><a role="menuitem" tabindex="-1"><div class="fa fa-copy" style="color: #08a1ef;"></div>&nbsp;&nbsp;复制</a></li><li class="cut" role="presentation" style="margin-bottom:5px;"><a role="menuitem" tabindex="-1"><div class="fa fa-cut" style="color: #08a1ef;"></div>&nbsp;&nbsp;裁剪</a></li><li role="presentation" class="bottom_bar"><a title="上移一层"><div class="up" style="display: inline-block; width: 26px;height: 22px; background: url(http://static.parastorage.com/services/skins/2.1127.3/images/wysiwyg/core/themes/editor_web/button/fpp-buttons-icons4.png) 0px -26px no-repeat;"></div></a><a title="下移一层"><div class="down" style="display: inline-block; width: 26px;height: 22px; background: url(http://static.parastorage.com/services/skins/2.1127.3/images/wysiwyg/core/themes/editor_web/button/fpp-buttons-icons4.png) 0px -80px no-repeat;"></div></a><a title="删除"><div class="remove" style="display: inline-block; width: 26px;height: 22px; background: url(http://static.parastorage.com/services/skins/2.1127.3/images/wysiwyg/core/themes/editor_web/button/fpp-buttons-icons4.png) 0px -1px no-repeat;"></div></a></li></ul>')
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
                    if(true){
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
                                $(".element-box", wrapComponent).css(b);
                                $.extend(!0, element.css, b);
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
                    historyService.addPageHistory(CurPageTplInfo.obj.id, CurPageElementInfo);
                    wrapComponent.remove();
                    CurPageElementInfo.splice(CurPageElementInfo.indexOf(I[element.id]), 1);
                    historyService.addPageHistory(CurPageTplInfo.obj.id, CurPageElementInfo);
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

                        for (var i = 0; i < CurPageElementInfo.length; i++) {
                            if (CurPageElementInfo[i].id == element.id && i > 0) {
                                var zIndex = CurPageElementInfo[i].css.zIndex;
                                CurPageElementInfo[i].css.zIndex = CurPageElementInfo[i - 1].css.zIndex;
                                CurPageElementInfo[i - 1].css.zIndex = zIndex;
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

                        for (var i = 0; i < CurPageElementInfo.length; i++)
                            if (CurPageElementInfo[i].id == element.id && i < CurPageElementInfo.length - 1) {
                                var zIndex = CurPageElementInfo[i].css.zIndex;
                                CurPageElementInfo[i].css.zIndex = CurPageElementInfo[i + 1].css.zIndex;
                                CurPageElementInfo[i + 1].css.zIndex = zIndex;
                                break
                            }
                    }
                });
                $popMenu.find(".copy").click(function(event) {
                    event.stopPropagation();
                    SceneService.sameCopyCount = 0;
                    SceneService.pageId = CurPageTplInfo.obj.id;
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
                if( "p" == element.type ){
                    $popMenu.find(".animation").hide();
                    $popMenu.find(".style").hide();
                }
                return $popMenu;
            }
            if("view" != mode){
                var $eq_main = $("#eq_main");
                wrapComponent.on("click contextmenu", ".element-box", function(event) {
                    event.stopPropagation();
                    //TODO: SceneService.elemDefTpl
                    if(!$("#btn-toolbar")[0])SceneService.elemDefTpl = ng.copy(element);
                    if($("#comp_setting:visible").length > 0 && "p" != element.type){
                        console.log("-----$rootScope.showStylePanel-------");
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

        SceneService.getScenePages = function(sceneId) {
            var url = "m/scene/pageList/" + sceneId + "?date=" + (new Date).getTime();
            return $http({
                withCredentials: !0,
                method: "GET",
                url: PREFIX_URL + url
            });
        };
        SceneService.getSceneByPage = function(pageId, isNewPage, d) {
            var url = "";
            if(isNewPage || d){
                url = "m/scene/createPage/" + pageId;
                if(d)url += "?copy=true";
            }else{
                url = "m/scene/design/" + pageId;
            }
            var defer = $q.defer(),tt = new Date;
            url += (/\?/.test(url) ? "&" : "?") + "time=" + tt.getTime();
            $http({
                withCredentials: !0,
                method: "GET",
                url: PREFIX_URL + url
            }).then(function(a) {
                defer.resolve(a);
                CurPageTplInfo = a.data;
                CurPageTplInfo.obj.elements || (CurPageTplInfo.obj.elements = []);
                CurPageElementInfo = CurPageTplInfo.obj.elements;
                for (var b = 0; CurPageElementInfo && b < CurPageElementInfo.length; b++) I[CurPageElementInfo[b].id] = CurPageElementInfo[b];
            }, function(a) {
                defer.reject(a)
            });
            return defer.promise;
        };
        SceneService.getSceneTpl = function(pageTplId) {
            var tplCache = $cacheFactory.get("tplCache") ? $cacheFactory.get("tplCache") : $cacheFactory("tplCache"),
                defer = $q.defer();

            if (tplCache.get(pageTplId)) {
                var pageTplInfo = $.extend(!0, {}, tplCache.get(pageTplId));
                if(pageTplInfo.data.obj.scene
                    && pageTplInfo.data.obj.scene.image
                    && pageTplInfo.data.obj.scene.image.bgAudio){
                    if(!CurPageTplInfo.obj.scene.image)CurPageTplInfo.obj.scene.image = {};
                    CurPageTplInfo.obj.scene.image.bgAudio = pageTplInfo.data.obj.scene.image.bgAudio
                }
                for (var h = 0; h < pageTplInfo.data.obj.elements.length; h++) {
                    var element = pageTplInfo.data.obj.elements[h];
                    element.id = Math.ceil(100 * Math.random());
                    element.sceneId = CurPageTplInfo.obj.sceneId;
                    element.pageId = CurPageTplInfo.obj.id;
                }
                CurPageElementInfo = pageTplInfo.data.obj.elements;
                for (var j = 0; j < CurPageElementInfo.length; j++) I[CurPageElementInfo[j].id] = CurPageElementInfo[j];
                defer.resolve(pageTplInfo);
            } else {
                var url = "m/scene/pageTpl/" + b, tt = new Date;
                url += (/\?/.test(url) ? "&" : "?") + "time=" + tt.getTime();
                $http({
                    withCredentials: !0,
                    method: "GET",
                    url: PREFIX_URL + url
                }).then(function(data) {
                    tplCache.put(data.data.obj.id, $.extend(!0, {}, data));

                    if(data.data.obj.scene
                        && data.data.obj.scene.image
                        && data.data.obj.scene.image.bgAudio){
                        if(!CurPageTplInfo.obj.scene.image)CurPageTplInfo.obj.scene.image = {};
                        CurPageTplInfo.obj.scene.image.bgAudio = data.data.obj.scene.image.bgAudio
                    }
                    for (var b = 0; b < data.data.obj.elements.length; b++) {
                        var element = data.data.obj.elements[b];
                        element.id = Math.ceil(100 * Math.random());
                        element.sceneId = CurPageTplInfo.obj.sceneId;
                        element.pageId = CurPageTplInfo.obj.id;
                    }
                    CurPageElementInfo = data.data.obj.elements;
                    for (var f = 0; f < CurPageElementInfo.length; f++){
                        I[CurPageElementInfo[f].id] = CurPageElementInfo[f];
                    }
                    defer.resolve(data)
                }, function(data) {
                    defer.reject(data);
                });
            }
            return defer.promise;
        };
        SceneService.getElements = function() {
            return CurPageElementInfo;
        };
        SceneService.getSceneObj = function() {
            return CurPageTplInfo;
        };
        SceneService.savePageNames = function(info) {
            var url = "m/scene/savePage",
                pageInfo = {
                    id: info.id,
                    sceneId: info.sceneId,
                    name: info.name
                };
            return $http({
                withCredentials: !0,
                method: "POST",
                url: PREFIX_URL + url,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                data: $.param(pageInfo)
            });
        };

        SceneService.saveScene = function(json) {
            console.log(JSON.stringify(json));
            var url = "m/scene/save";
            return $http({
                withCredentials: !0,
                method: "POST",
                url: PREFIX_URL + url,
                headers: {
                    "Content-Type": "text/plain; charset=UTF-8"
                },
                data: JSON.stringify(json)
            });
        };

        return SceneService;
    }]);

    ng.module("confirm-dialog", []).controller("ConfirmDialogCtrl", ["$scope", "confirmObj", function(a, b) {
            a.confirmObj = b, a.ok = function() {
                a.$close()
            }, a.cancel = function() {
                a.$dismiss()
            }
        }]);
    ng.module("message-dialog", []).controller("MessageDialogCtrl", ["$scope", "msgObj", function(a, b) {
            a.msgObj = b, a.close = function() {
                a.$close()
            }, a.cancel = function() {
                a.$dismiss()
            }
        }]);
    ng.module("services.modal", ["confirm-dialog", "message-dialog"]).factory("ModalService", ["$modal", function(a) {
        var b = {};
        return b.openConfirmDialog = function(b, c, d) {
            a.open({
                backdrop: "static",
                keyboard: !1,
                backdropClick: !1,
                windowClass: "confirm-dialog",
                templateUrl: "dialog/confirm.tpl.html",
                controller: "ConfirmDialogCtrl",
                resolve: {
                    confirmObj: function() {
                        return b
                    }
                }
            }).result.then(c, d)
        },
            b.openMsgDialog = function(b, c, d) {
                a.open({
                    backdrop: "static",
                    keyboard: !1,
                    backdropClick: !1,
                    windowClass: "message-dialog",
                    templateUrl: "dialog/message.tpl.html",
                    controller: "MessageDialogCtrl",
                    resolve: {
                        msgObj: function() {
                            return b
                        }
                    }
                }).result.then(c, d)
            }, b
    }]);
    ng.module("services.pagetpl", []);
    ng.module("services.pagetpl").factory("pageTplService", ["$http", "$rootScope", "$modal", "$q", function(a) {
        var PageTplService = {};
        PageTplService.getPageTpls = function(b) {
            var c = "m/scene/pageTplList/" + b,
                d = new Date;
            return c += (/\?/.test(c) ? "&" : "?") + "time=" + d.getTime(), a({
                withCredentials: !0,
                method: "GET",
                url: PREFIX_URL + c
            })
        };
        PageTplService.getMyTplList = function(b) {
            var c = "/m/scene/pageList/" + b,
                d = new Date;
            return c += (/\?/.test(c) ? "&" : "?") + "time=" + d.getTime(), a({
                withCredentials: !0,
                method: "GET",
                url: PREFIX_URL + c
            })
        };
        PageTplService.getPageTplTypes = function() {
            var b = "base/class/tpl_page",
                c = new Date;
            return b += (/\?/.test(b) ? "&" : "?") + "time=" + c.getTime(), a({
                withCredentials: !0,
                method: "GET",
                url: PREFIX_URL + b
            })
        };
        PageTplService.getPageTagLabel = function(b) {
            var c = "m/scene/tag/sys/list?type=1";
            null != b && (c += (/\?/.test(c) ? "&" : "?") + "bizType=" + b);
            var d = new Date;
            return c += (/\?/.test(c) ? "&" : "?") + "time=" + d.getTime(), a({
                withCredentials: !0,
                method: "GET",
                url: PREFIX_URL + c
            })
        };
        PageTplService.getPageTagLabelCheck = function(b) {
            var c = "/m/scene/tag/page/list?id=" + b,
                d = new Date;
            return c += (/\?/.test(c) ? "&" : "?") + "time=" + d.getTime(), a({
                withCredentials: !0,
                method: "GET",
                url: PREFIX_URL + c
            })
        };
        PageTplService.getPageTplTypestemp = function(b, c) {
            var d = "m/scene/tpl/page/list/",
                e = new Date;
            return null != b && (d += (/\?/.test(d) ? "&" : "?") + "tagId=" + b), null != c && (d += (/\?/.test(d) ? "&" : "?") + "bizType=" + c), d += (/\?/.test(d) ? "&" : "?") + "time=" + e.getTime(), a({
                withCredentials: !0,
                method: "GET",
                url: PREFIX_URL + d
            })
        };
        PageTplService.updataChildLabel = function(b, c) {
            var d = "/m/eqs/tag/page/set/?ids=" + b;
            null != c && (d += (/\?/.test(d) ? "&" : "?") + "pageId=" + c);
            var e = new Date;
            return d += (/\?/.test(d) ? "&" : "?") + "time=" + e.getTime(), a({
                withCredentials: !0,
                method: "POST",
                url: PREFIX_URL + d
            })
        };
        return  PageTplService;
    }]);

    ng.module("colorpicker.module", [])
        .factory("Helper", function() {
            return {
                closestSlider: function(matches) {
                    var selector = matches.matches
                                    || matches.webkitMatchesSelector || matches.mozMatchesSelector || matches.msMatchesSelector;
                    return selector.bind(matches)("I") ? matches.parentNode : matches;
                },
                getOffset: function(element, position) {
                    var left = 0, top = 0, scrollX = 0, scrollY = 0;
                    for (;element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop);) {
                        left += element.offsetLeft;
                        top += element.offsetTop;
                        if(position || "BODY" !== element.tagName){
                            scrollX += element.scrollLeft;
                            scrollY += element.scrollTop;
                        }else{
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
                    parse: function(matchs) {return [matchs[1], matchs[2], matchs[3], matchs[4]];}
                }, {
                    //RGB(R,G,B)|RGBA(R,G,B,A) => rgba(45%, 78%, 32%, .5)
                    re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
                    //[red, green, blue, alpha]
                    parse: function(matchs) {return [2.55 * matchs[1], 2.55 * matchs[2], 2.55 * matchs[3], matchs[4]];}
                }, {
                    //#rrggbb => #ffeecc
                    re: /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,
                    parse: function(matchs) {return [parseInt(matchs[1], 16), parseInt(matchs[2], 16), parseInt(matchs[3], 16)];}
                }, {
                    //#rgb => #cef
                    re: /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/,
                    parse: function(matchs) {return [parseInt(matchs[1] + matchs[1], 16), parseInt(matchs[2] + matchs[2], 16), parseInt(matchs[3] + matchs[3], 16)];}
                }]
            };
        })
        .factory("Color", ["Helper", function(Helper) {
            return {
                value: {hue: 1, saturation: 1, lightness: 1, alpha: 1},
                rgb: function() {
                    var rgb = this.toRGB();
                    return "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
                },
                rgba: function() {
                    var rgba = this.toRGB();
                    return "rgba(" + rgba.r + "," + rgba.g + "," + rgba.b + "," + rgba.a + ")"
                },
                hex: function() {return this.toHex();},
                //http://blog.csdn.net/xhhjin/article/details/7020449
                RGBtoHSB: function(r, g, b, a) {
                    r /= 255;
                    g /= 255;
                    b /= 255;
                    var hue, saturation, max, diff;
                    max = Math.max(r, g, b);
                    diff = max - Math.min(r, g, b);
                    if(0 === diff){
                        hue = null;
                    }else{
                        if(max === r){
                            hue = (g - b) / diff;
                        }else if(max === g){
                            hue = (b - r) / diff + 2;
                        }else{
                            hue = (r - g) / diff + 4;
                        }
                    }
                    hue = (hue + 360) % 6 * 60 / 360;
                    saturation = 0 === diff ? 0 : diff / max;
                    return{hue: hue || 1, saturation: saturation, lightness: max, alpha: a || 1};
                },
                setColor: function(color) {
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

                setHue: function(hue) {this.value.hue = 1 - hue;},//色调
                setSaturation: function(saturation) {this.value.saturation = saturation;},//饱和度
                setLightness: function(lightness) {this.value.lightness = 1 - lightness;},//明亮度
                setAlpha: function(alpha) {this.value.alpha = parseInt(100 * (1 - alpha), 10) / 100;},//阿尔法

                toRGB: function(hue, saturation, lightness, alpha) {
                    if(!hue){
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
                    return  {r: Math.round(255 * r),g: Math.round(255 * g),b: Math.round(255 * b),a: alpha || this.value.alpha};
                },
                toHex: function(hue, saturation, lightness, alpha) {
                    var rgb = this.toRGB(hue, saturation, lightness, alpha);
                    return "#" + (1 << 24 | parseInt(rgb.r, 10) << 16 | parseInt(rgb.g, 10) << 8 | parseInt(rgb.b, 10)).toString(16).substr(1);
                }
            }
        }])
        .factory("Slider", ["Helper", function(Helper) {
        var slider = {
                maxLeft: 0,
                maxTop: 0,
                callLeft: null,
                callTop: null,
                knob: {top: 0, left: 0}
            },offset = {};
        return {
            getSlider: function() {return slider;},
            getLeftPosition: function(event) {
                return Math.max(0, Math.min(slider.maxLeft, slider.left + ((event.pageX || offset.left) - offset.left)))
            },
            getTopPosition: function(event) {
                return Math.max(0, Math.min(slider.maxTop, slider.top + ((event.pageY || offset.top) - offset.top)))
            },
            setSlider: function(event, position) {
                var element = Helper.closestSlider(event.target),pageOffset = Helper.getOffset(element, position);
                slider.knob = element.children[0].style;
                slider.left = event.pageX - pageOffset.left - win.pageXOffset + pageOffset.scrollX;
                slider.top = event.pageY - pageOffset.top - win.pageYOffset + pageOffset.scrollY;
                offset = {left: event.pageX,top: event.pageY};
            },
            setSaturation: function(event, position) {
                slider = {maxLeft: 100,maxTop: 100,callLeft: "setSaturation",callTop: "setLightness"};
                this.setSlider(event, position);
            },
            setHue: function(event, position) {
                slider = {maxLeft: 0,maxTop: 100,callLeft: !1,callTop: "setHue"};
                this.setSlider(event, position);
            },
            setAlpha: function(event, position) {
                slider = {maxLeft: 0,maxTop: 100,callLeft: !1,callTop: "setAlpha"};
                this.setSlider(event, position);
            },
            setKnob: function(top, left) {
                slider.knob.top = top + "px";
                slider.knob.left = left + "px"
            }
        };
    }])
        .directive("colorpicker", ["$document", "$compile", "Color", "Slider", "Helper", function($document, $compile, Color, Slider, Helper) {
        return {
            require: "?ngModel",
            restrict: "A",
            link: function(scope, element, attr, ctrl) {
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
                    $input.on("mousedown", function(event) {
                        event.stopPropagation();
                    }).on("keyup", function(event) {
                        var val = this.value;
                        element.val(val);
                        if(ctrl)scope.$apply(ctrl.$setViewValue(val));
                        event.stopPropagation();
                        event.preventDefault();
                    });
                    element.on("keyup", function() {
                        $input.val(element.val());
                    });
                }
                var bindMouseHandle = function() {
                    $document.on("mousemove", setVal);
                    $document.on("mouseup", offMouseHandle);
                };
                if("rgba" === unit){
                    $dropdown.addClass("alpha");
                    $alpha = $dropdown.find("colorpicker-alpha");
                    $alpha.on("click", function(event) {
                        Slider.setAlpha(event, fixedPosition);
                        setVal(event);
                    }).on("mousedown", function(event) {
                        Slider.setAlpha(event, fixedPosition);
                        bindMouseHandle();
                    });
                }
                $hue.on("click", function(event) {
                    Slider.setHue(event, fixedPosition);
                    setVal(event);
                })
                .on("mousedown", function(event) {
                    Slider.setHue(event, fixedPosition);
                    bindMouseHandle();
                });
                $saturation.on("click", function(event) {
                    Slider.setSaturation(event, fixedPosition);
                    setVal(event);
                })
                .on("mousedown", function(event) {
                    Slider.setSaturation(event, fixedPosition);
                    bindMouseHandle();
                });

                if(fixedPosition)$dropdown.addClass("colorpicker-fixed-position");
                $dropdown.addClass("colorpicker-position-" + position);
                if("true" === hasInline)$dropdown.addClass("colorpicker-inline");
                $target.append($dropdown);
                if(ctrl){
                    ctrl.$render = function() {element.val(ctrl.$viewValue)};
                    scope.$watch(attr.ngModel, function() {caleColor();});
                }
                element.on("$destroy", function() {$dropdown.remove();});

                var setBgColor = function() {
                        try {
                            $preview.css("backgroundColor", Color[unit]());
                        } catch (a) {
                            $preview.css("backgroundColor", Color.toHex())
                        }
                        $saturation.css("backgroundColor", Color.toHex(Color.value.h, 1, 1, 1));
                        if("rgba" === unit){$alpha.css.backgroundColor = Color.toHex();}
                    },
                    setVal = function(event) {
                        var left = Slider.getLeftPosition(event),
                            top = Slider.getTopPosition(event),
                            slider = Slider.getSlider();
                        Slider.setKnob(top, left);
                        slider.callLeft && Color[slider.callLeft].call(Color, left / 100);
                        slider.callTop && Color[slider.callTop].call(Color, top / 100);
                        setBgColor();
                        var val = Color[unit]();
                        element.val(val);
                        if(ctrl)scope.$apply(ctrl.$setViewValue(val));
                        if(hasInput)$input.val(val);
                        return false;
                    },
                    offMouseHandle = function() {
                        $document.off("mousemove", setVal);
                        $document.off("mouseup", offMouseHandle);
                    },
                    caleColor = function() {
                        Color.setColor(element.val());
                        $i.eq(0).css({
                            left: 100 * Color.value.saturation + "px",
                            top: 100 - 100 * Color.value.lightness + "px"
                        });
                        $i.eq(1).css("top", 100 * (1 - Color.value.hue) + "px");
                        $i.eq(2).css("top", 100 * (1 - Color.value.alpha) + "px");
                        setBgColor();
                    },
                    caleOffset = function() {
                        var retOffset, offset = Helper.getOffset(element[0]);
                        if(ng.isDefined(attr.colorpickerParent)){
                            offset.left = 0;
                            offset.top = 0
                        }
                        switch (position){
                            case "top":
                                retOffset = {top: offset.top - 147, left: offset.left};
                                break;
                            case "right":
                                retOffset = {top: offset.top, left: offset.left + 126};
                                break;
                            case "bottom":
                                retOffset = {top: offset.top + element[0].offsetHeight + 2,left: offset.left};
                                break;
                            case "left":
                                retOffset = {top: offset.top,left: offset.left - 150};
                                break;
                        }
                        return {top: retOffset.top + "px", left: retOffset.left + "px"};
                    },
                    close = function() {closeColorPicker();};
                if(hasInline === false){
                    element.on("click", function() {
                        caleColor();
                        $dropdown.addClass("colorpicker-visible").css(caleOffset());
                        $document.on("mousedown", close);
                    })
                }else{
                    caleColor();
                    $dropdown.addClass("colorpicker-visible").css(caleOffset());
                }
                $dropdown.on("mousedown", function(event) {
                    event.stopPropagation();
                    event.preventDefault()
                });
                var emitEvent = function(eventName) {
                        if(ctrl)scope.$emit(eventName, {name: attr.ngModel,value: ctrl.$modelValue});
                    },
                    closeColorPicker = function() {
                        if($dropdown.hasClass("colorpicker-visible")){
                            $dropdown.removeClass("colorpicker-visible");
                            emitEvent("colorpicker-closed");
                            $document.off("mousedown", close);
                        }
                    };
                $dropdown.find("button").on("click", function() {
                    closeColorPicker();
                });
            }
        }
    }]);
    ng.module("app.directives.style", []).directive("panelDraggable", function() {
        return {
            restrict: "A",
            link: function(scope, element) {
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
                $(element).draggable();
            }
        }
    });
    ng.module("app.directives.uislider", []).value("uiSliderConfig", {}).directive("uiSlider", ["uiSliderConfig", "$timeout", function(uiSliderConfig, $timeout) {
        uiSliderConfig = uiSliderConfig || {};
        return {
            require: "ngModel",
            compile: function() {
                return function(scope, element, attr, ctrl) {
                    function parseVal(val, useDecimals) {return useDecimals ? parseFloat(val) : parseInt(val, 10)}
                    var uiSlider = ng.extend(scope.$eval(attr.uiSlider) || {}, uiSliderConfig),
                        range = {min: null,max: null},
                        props = ["min", "max", "step"],
                        useDecimals = ng.isUndefined(attr.useDecimals) ? false : true,
                        _config = function() {
                            if(ng.isArray(ctrl.$viewValue) && uiSlider.range !== true){
                                console.warn("Change your range option of ui-slider. When assigning ngModel an array of values then the range option should be set to true.");
                                uiSlider.range = true;
                            }
                            ng.forEach(props, function(p) {
                                if(ng.isDefined(attr[p])){
                                    uiSlider[p] = parseVal(attr[p], useDecimals);
                                }
                            });
                            element.slider(uiSlider);
                            _config = ng.noop;
                        };
                    ng.forEach(props, function(p) {
                        attr.$observe(p, function(val) {
                            if(val){
                                _config();
                                uiSlider[p] = parseVal(val, useDecimals);
                                element.slider("option", p, parseVal(val, useDecimals));
                                ctrl.$render();
                            }
                        });
                    });
                    attr.$observe("disabled", function(val) {
                        _config();
                        element.slider("option", "disabled", !!val);
                    });
                    scope.$watch(attr.uiSlider, function(val) {
                        _config();
                        if(val !== undefined){element.slider("option", val);}
                    }, true);
                    $timeout(_config, 0, !0);
                    element.bind("slide", function(event, data) {
                        ctrl.$setViewValue(data.values || data.value);
                        scope.$apply();
                    });
                    ctrl.$render = function() {
                        _config();
                        var flag = uiSlider.range === true ? "values" : "value";
                        if(!uiSlider.range && isNaN(ctrl.$viewValue)){
                            if(ctrl.$viewValue instanceof Array){
                                if(uiSlider.range && !ng.isDefined(ctrl.$viewValue))ctrl.$viewValue = [0, 0];
                            }else{
                                ctrl.$viewValue = 0;
                            }
                        }
                        if(uiSlider.range === true){
                            if(ng.isDefined(uiSlider.min) && uiSlider.min > ctrl.$viewValue[0])ctrl.$viewValue[0] = uiSlider.min;
                            if(ng.isDefined(uiSlider.max) && uiSlider.max < ctrl.$viewValue[1])ctrl.$viewValue[1] = uiSlider.max;
                            if(ctrl.$viewValue[0] > ctrl.$viewValue[1]){
                                //比最小值大，比最大值小
                                if(range.min >= ctrl.$viewValue[1])ctrl.$viewValue[0] = range.min;
                                if(range.max <= ctrl.$viewValue[0])ctrl.$viewValue[1] = range.max;
                            }
                            range.min = ctrl.$viewValue[0];
                            range.max = ctrl.$viewValue[1];
                        }
                        element.slider(flag, ctrl.$viewValue);
                    };
                    scope.$watch(attr.ngModel, function() {
                        if(uiSlider.range === true)ctrl.$render();
                    }, true);
                    element.bind("$destroy", function() {element.slider("destroy");});
                }
            }
        }
    }]);
    ng.module("app.directives.limitInput", []).directive("limitInput", function() {
        return {
            require: "ngModel",
            link: function(scope, element, attr, ctrl) {
                if("transform" == attr.cssItem){
                    scope.$on("updateTransform", function(event, data) {
                        ctrl.$setViewValue(parseInt(data, 10));
                        ctrl.$render();
                    });
                }
                if("borderRadius" == attr.cssItem){
                    scope.$on("updateMaxRadius", function(event, val) {
                        scope.maxRadius = parseInt(Math.min($(val).outerWidth(), $(val).outerHeight()) / 2 + 10, 10);
                        if(scope.maxRadius < scope.model.borderRadius){
                            ctrl.$setViewValue(scope.maxRadius);
                            ctrl.$render();
                        }
                        scope.$apply();
                    })
                }
                scope.$watch(function() {
                    return $(element).val()
                }, function(val) {
                    if(+val > attr.max){ctrl.$setViewValue(attr.max);attr.$render();}
                    if(+val < attr.min){ctrl.$setViewValue(attr.min);ctrl.$render();}
                });
            }
        }
    });
    ng.module("scene.create.console.setting.style", ["colorpicker.module", "app.directives.style", "app.directives.uislider", "app.directives.limitInput"]);
    ng.module("scene.create.console.setting.style")
        .controller("StyleConsoleCtrl", ["$scope", "sceneService", function($scope, sceneService) {
            //TODO: currentElemDef
            var curElementDef = $scope.elemDef = sceneService.currentElemDef;

            delete curElementDef.css.borderTopLeftRadius;
            delete curElementDef.css.borderTopRightRadius;
            delete curElementDef.css.borderBottomLeftRadius;
            delete curElementDef.css.borderBottomRightRadius;
            delete curElementDef.css.border;

            var d = curElementDef.css, $target = $("#inside_" + $scope.elemDef.id + " > .element-box");
            if (a.model = {
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
            }, a.maxRadius = Math.min(e.outerWidth(), e.outerHeight()) / 2 + 10, d.borderRadiusPerc ? a.model.borderRadiusPerc = parseInt(d.borderRadiusPerc, 10) : d.borderRadius ? "999px" == d.borderRadius ? a.model.borderRadiusPerc = 100 : (a.model.borderRadiusPerc = parseInt(100 * parseInt(d.borderRadius, 10) * 2 / Math.min(e.outerWidth(), e.outerHeight()), 10), a.model.borderRadiusPerc > 100 && (a.model.borderRadiusPerc = 100)) : a.model.borderRadiusPerc = 0, a.tmpModel = {
                boxShadowDirection: 0,
                boxShadowX: 0,
                boxShadowY: 0,
                boxShadowBlur: 0,
                boxShadowSize: 0,
                boxShadowColor: "rgba(0,0,0,0.5)"
            }, d.boxShadow) {
                var f = d.boxShadow.split(" ");
                a.tmpModel.boxShadowX = parseInt(f[0], 10), a.tmpModel.boxShadowY = parseInt(f[1], 10), a.tmpModel.boxShadowDirection = parseInt(d.boxShadowDirection, 10) || 0, a.tmpModel.boxShadowBlur = parseInt(f[2], 10), a.tmpModel.boxShadowColor = f[3], a.tmpModel.boxShadowSize = parseInt(d.boxShadowSize, 10) || 0
            }
            $scope.clear = function() {
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
            $scope.$watch("tmpModel", function() {
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
            $scope.$watch("model", function() {
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
        .directive("styleInput", function() {
            return {
                restrict: "AE",
                link: function(scope, element, attr) {
                    var $target = $("#inside_" + scope.elemDef.id + " > .element-box");
                    scope.$watch(function() {
                        return $(element).val()
                    }, function() {
                        switch (attr.cssItem){
                            case "borderWidth":
                                $target.css({borderStyle: scope.model.borderStyle, borderWidth: $(element).val()});
                                var dimension = {width: $target.width(), height: $target.height()};
                                if (4 == scope.elemDef.type) {
                                    var $img = $target.find("img"),
                                        rate = $img.width() / $img.height(),
                                        R = dimension.width / dimension.height;
                                    if(rate >= R){
                                        $img.outerHeight(dimension.height);
                                        $img.outerWidth(dimension.height * rate);
                                        $img.css("marginLeft", -($img.outerWidth() - dimension.width) / 2);
                                        $img.css("marginTop", 0);
                                    }else {
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
        .directive("angleKnob", function() {
            return {
                restrict: "AE",
                templateUrl: "scene/console/angle-knob.tpl.html",
                link: function(scope, element) {
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

                    scope.$watch(function() {
                        return scope.tmpModel.boxShadowDirection
                    }, function(val) {
                        $sliderKnob.css({
                            top: 28 - 28 * Math.cos(val * Math.PI / 180),
                            left: 28 + 28 * Math.sin(val * Math.PI / 180)
                        });
                    });
                    if(0 !== scope.tmpModel.boxShadowDirection){
                        $sliderKnob.css({
                            top: 28 - 28 * Math.cos(scope.tmpModel.boxShadowDirection * Math.PI / 180),
                            left: 28 + 28 * Math.sin(scope.tmpModel.boxShadowDirection * Math.PI / 180)
                        });
                    }

                    $sliderContainer.bind("mousedown", function(event) {
                        event.stopPropagation();
                        var left = $sliderContainer.offset().left, top = $sliderContainer.offset().top;
                        setTargetStyle(event.pageX - left, event.pageY - top);
                        var boxShadowDirection = caleBoxShadowDirection(event.pageX - left, event.pageY - top);
                        scope.tmpModel.boxShadowDirection = boxShadowDirection;
                        scope.$apply();

                        $(this).bind("mousemove", function(event) {
                            event.stopPropagation();
                            setTargetStyle(event.pageX - left, event.pageY - top);
                            var boxShadowDirection = caleBoxShadowDirection(event.pageX - left, event.pageY - top);
                            scope.tmpModel.boxShadowDirection = boxShadowDirection;
                            scope.$apply();
                        });

                        $(this).bind("mouseup", function() {
                            $(this).unbind("mousemove");
                            $(this).unbind("mouseup");
                        });
                    });
                }
            }
        });
    ng.module("scene.create.console.setting.anim", ["app.directives.uislider", "app.directives.limitInput"]);
    ng.module("scene.create.console.setting.anim").controller("AnimConsoleCtrl", ["$scope", "sceneService", function($scope, sceneService) {
        //TODO: currentElemDef ??
        var curElementDef = $scope.elemDef = sceneService.currentElemDef,
            $target = $("#inside_" + $scope.elemDef.id + " .element-box");
        $scope.animTypeEnum = [
            {id: -1,name: "无"},
            {id: 0,name: "淡入"},
            {id: 1,name: "移入"},
            {id: 2,name: "弹入"},
            {id: 3,name: "中心弹入"},
            {id: 4,name: "中心放大"},
            {id: 12,name: "翻滚进入"},
            {id: 13,name: "光速进入"},
            {id: 6,name: "摇摆"},
            {id: 5,name: "抖动"},
            {id: 7,name: "旋转"},
            {id: 8,name: "翻转"},
            {id: 9,name: "悬摆"},
            {id: 10,name: "淡出"},
            {id: 11,name: "翻转消失"}
        ];
        $scope.animDirectionEnum = [
            {id: 0,name: "从左向右"},
            {id: 1,name: "从上到下"},
            {id: 2,name: "从右向左"},
            {id: 3,name: "从下到上"}
        ];
        curElementDef.properties || (curElementDef.properties = {});
        if (curElementDef.properties.anim && null != curElementDef.properties.anim.type) {
            for (var t = 0; t < $scope.animTypeEnum.length; t++){
                if($scope.animTypeEnum[t].id == curElementDef.properties.anim.type){
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
            if(null != curElementDef.properties.anim.direction){
                $scope.direction = $scope.animDirectionEnum[curElementDef.properties.anim.direction];
            }else{
                $scope.direction = $scope.animDirectionEnum[0];
            }
        } else{
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
        $scope.$watch("model", function() {
            if($scope.direction)$scope.model.direction = $scope.direction.id;
            curElementDef.properties.anim = $scope.model;
            renderHandle();
        }, true);
        $scope.$watch("direction", function() {
            if($scope.direction)$scope.model.direction = $scope.direction.id;
            curElementDef.properties.anim = $scope.model;
            renderHandle();
        }, true);
        var renderHandle = function() {
            $target.css("animation", "");
            $target.css("animation", $scope.animationClass + " " + $scope.model.duration + "s ease 0s");
            $target.css("animation-fill-mode", "backwards");
        };
        $scope.confirm = function() {$scope.cancel();};
        $scope.changeAnimation = function() {
            $scope.animationClass = "";
            var model = $scope.model;
            if(0 === model.type)$scope.animationClass = "fadeIn";
            if(1 === model.type) {
                if (0 === $scope.direction.id)$scope.animationClass = "fadeInLeft";
                if (1 === $scope.direction.id)$scope.animationClass = "fadeInDown";
                if (2 === $scope.direction.id)$scope.animationClass = "fadeInRight";
                if (3 === $scope.direction.id)$scope.animationClass = "fadeInUp";
            }
            if(2 === model.type){
                if(0 === $scope.direction.id)$scope.animationClass = "bounceInLeft";
                if(1 === $scope.direction.id)$scope.animationClass = "bounceInDown";
                if(2 === $scope.direction.id)$scope.animationClass = "bounceInRight";
                if(3 === $scope.direction.id)$scope.animationClass = "bounceInUp";
            }
            if(3 === model.type)$scope.animationClass = "bounceIn";
            if(4 === model.type)$scope.animationClass = "zoomIn";
            if(6 === model.type)$scope.animationClass = "wobble";
            if(5 === model.type)$scope.animationClass = "rubberBand";
            if(7 === model.type)$scope.animationClass = "rotateIn";
            if(8 === model.type)$scope.animationClass = "flip";
            if(9 === model.type)$scope.animationClass = "swing";
            if(10 === model.type)$scope.animationClass = "fadeOut";
            if(11 === model.type)$scope.animationClass = "flipOutY";
            if(12 === model.type)$scope.animationClass = "rollIn";
            if(13 === model.type)$scope.animationClass = "lightSpeedIn";
        }
    }]);

    ng.module("scene.create.console.setting", ["scene.create.console.setting.style", "scene.create.console.setting.anim"]);
    ng.module("scene.create.console.setting").directive("styleModal", ["sceneService", "$compile", function() {
        return {
            restrict: "AE",
            replace: !0,
            scope: {},
            templateUrl: "scene/console/setting.tpl.html",
            link: function(scope, element, attr) {
                var  defActiveTab = "style";
                scope.$on("showStylePanel", function(event, data) {
                    defActiveTab = scope.activeTab;
                    scope.activeTab = data && data.activeTab ? data.activeTab : defActiveTab;
                    scope.$apply();
                });
                scope.activeTab = attr.activeTab;
                scope.cancel = function() {$(element).hide()};
                scope.$on("$locationChangeStart", function() {scope.cancel();});
            },
            controller: ["$scope", function() {}]
        }
    }]);

    ng.module("scene.create.console.audio", []);
    ng.module("scene.create.console.audio").controller("AudioConsoleCtrl", ["$scope", "$sce", "$timeout", "$modal", "fileService", "obj", function(a, b, c, d, e, f) {
            function g() {
                e.getFileByCategory(1, 30, "1", "2").then(function(b) {
                    a.reservedAudios = b.data.list;
                    for (var c = 0; c < a.reservedAudios.length; c++) "3" == a.model.bgAudio.type && PREFIX_FILE_HOST + a.reservedAudios[c].path == a.model.type3 && (a.model.selectedAudio = a.reservedAudios[c])
                })
            }

            function h() {
                e.getFileByCategory(1, 10, "0", "2").then(function(b) {
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
            }, c(function() {
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
            }], a.goUpload = function() {
                d.open({
                    windowClass: "upload-console",
                    templateUrl: "my/upload.tpl.html",
                    controller: "UploadCtrl",
                    resolve: {
                        category: function() {
                            return {
                                categoryId: 0,
                                fileType: 2
                            }
                        }
                    }
                }).result.then(function() {
                        h()
                    })
            }, a.selectAudio = function(c) {
                "3" == c && (a.model.type3 = a.model.selectedAudio ? b.trustAsResourceUrl(PREFIX_FILE_HOST + a.model.selectedAudio.path) : null), "2" == c && (a.model.type2 = a.model.selectedMyAudio ? b.trustAsResourceUrl(PREFIX_FILE_HOST + a.model.selectedMyAudio.path) : null)
            }, a.playAudio = function(a) {
                $("#audition" + a)[0].play()
            }, a.pauseAudio = function(a) {
                $("#audition" + a)[0].pause()
            }, a.confirm = function() {
                "1" == a.model.bgAudio.type && (a.model.bgAudio.url = a.model.type1), "2" == a.model.bgAudio.type && (a.model.bgAudio.url = a.model.selectedMyAudio.path), "3" == a.model.bgAudio.type && (a.model.bgAudio.url = a.model.selectedAudio.path), a.$close(a.model)
            }, a.cancel = function() {
                a.$dismiss()
            }, g(), h()
        }]);
    ng.module("scene.create.console.input", []);
    ng.module("scene.create.console.input").controller("InputConsoleCtrl", ["$scope", "$timeout", "localizedMessages", "obj", function(a, b, c, d) {
        a.model = {
            title: d.title,
            type: d.type,
            required: d.properties.required
        }, a.confirm = function() {
            return a.model.title && 0 !== a.model.title.length ? void a.$close(a.model) : (alert("输入框名称不能为空"), void $('.bg_console input[type="text"]').focus())
        }, a.cancel = function() {
            a.$dismiss()
        }
    }]);
    ng.module("scene.create.console.button", []);
    ng.module("scene.create.console.button").controller("ButtonConsoleCtrl", ["$scope", "$timeout", "localizedMessages", "obj", function(a, b, c, d) {
        a.model = {
            title: d.properties.title
        }, a.confirm = function() {
            return a.model.title && 0 !== a.model.title.length ? void a.$close(a.model) : (alert("按钮名称不能为空"), void $('.bg_console input[type="text"]').focus())
        }, a.cancel = function() {
            a.$dismiss()
        }
    }]);
    ng.module("scene.create.console.tel", ["app.directives.addelement"]);
    ng.module("scene.create.console.tel").controller("TelConsoleCtrl", ["$scope", "$timeout", "localizedMessages", "obj", function(a, c, d, e) {
            a.model = {
                title: e.properties.title,
                number: e.properties.number
            }, a.confirm = function() {
                if (!a.model.title || 0 === a.model.title.length) return alert("按钮名称不能为空"), void $('.bg_console input[type="text"]').focus();
                if (!a.model.number || 0 === a.model.title.number) return alert("电话号码不能为空"), void $('.bg_console input[type="text"]').focus();
                var b = new RegExp(/(\d{11})|^((\d{7,8})|(^400[0-9]\d{6})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/g);
                return b.test(a.model.number) ? void a.$close(a.model) : void alert("手机号码格式错误")
            }, a.cancel = function() {
                a.$dismiss()
            }, a.removePlaceHolder = function() {
                $(".tel-button").attr("placeholder", "")
            }, a.addPlaceHolder = function() {
                $(".tel-button").attr("placeholder", "010-88888888")
            }, a.chooseTelButton = function(b, c, d) {
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
            }], b.forEach(a.buttons, function(b, c) {
                e.css.background && e.css.background == b.btnStyle.background && (a.btnIndex = c)
            })
        }]);

    ng.module("scene.my.upload", ["angularFileUpload"]);
    ng.module("scene.my.upload").controller("UploadCtrl", ["$scope", "FileUploader", "fileService", "category", "$timeout", "$interval", function(a, b, c, d, e, f) {
            a.category = d;
            var g;
            g = a.uploader = new b(a.category.scratch || a.category.headerImage ? {
                url: PREFIX_URL + "m/base/file/upload?bizType=" + d.categoryId + "&fileType=" + d.fileType,
                withCredentials: !0,
                queueLimit: 1,
                onSuccessItem: function(b, c) {
                    function d() {
                        f.cancel(e), alert("上传完毕"), a.$close(c.obj.path)
                    }
                    a.progressNum = 0;
                    var e = f(function() {
                        a.progressNum < 100 ? a.progressNum += 15 : d()
                    }, 100)
                }
            } : {
                url: PREFIX_URL + "m/base/file/upload?bizType=" + d.categoryId + "&fileType=" + d.fileType,
                withCredentials: !0,
                queueLimit: 5,
                onCompleteAll: function() {
                    function b() {
                        f.cancel(c), alert("上传完毕"), a.$close()
                    }
                    a.progressNum = 0;
                    var c = f(function() {
                        a.progressNum < 100 ? a.progressNum += 15 : b()
                    }, 100)
                }
            });
            var h;
            ("0" == d.fileType || "1" == d.fileType) && (h = "|jpg|png|jpeg|bmp|gif|", limitSize = 3145728), "2" == d.fileType && (h = "|mp3|mpeg|", limitSize = 3145728), g.filters.push({
                name: "imageFilter",
                fn: function(a) {
                    var b = "|" + a.type.slice(a.type.lastIndexOf("/") + 1) + "|";
                    return -1 !== h.indexOf(b)
                }
            }), g.filters.push({
                name: "imageSizeFilter",
                fn: function(a) {
                    var b = a.size;
                    return b >= limitSize && alert("上传文件大小限制在" + limitSize / 1024 / 1024 + "M以内"), b < limitSize
                }
            }), g.filters.push({
                name: "fileNameFilter",
                fn: function(a) {
                    return a.name.length > 50 && alert("文件名应限制在50字符以内"), a.name.length <= 50
                }
            });
            var i = function() {
                c.listFileCategory().then(function(b) {
                    a.categoryList = b.data.list, a.categoryList || (a.categoryList = []), a.categoryList.push({
                        name: "我的背景",
                        value: "0"
                    })
                })
            };
            i(), a.removeQueue = function() {}
        }]);
    ng.module("services.file", []);
    ng.module("services.file").factory("fileService", ["$http", function(a) {
            var b = {};
            return b.listFileCategory = function(b) {
                var c = "base/class/" + ("1" == b ? "tpType" : "bgType"),
                    d = new Date;
                return c += "?time=" + d.getTime(), a({
                    withCredentials: !0,
                    method: "GET",
                    url: PREFIX_URL + c
                })
            }, b.deleteFile = function(b) {
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
            }, b.createCategory = function(b) {
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
            }, b.getCustomTags = function() {
                var b = "m/base/file/tag/my?time" + (new Date).getTime();
                return a({
                    withCredentials: !0,
                    method: "GET",
                    url: PREFIX_URL + b
                })
            }, b.deleteTag = function(b) {
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
            }, b.setCategory = function(b, c) {
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
            }, b.getImagesByTag = function(b, c, d, e) {
                var f = "m/base/file/userList?";
                return f += "fileType=" + c, b && (f += "&tagId=" + b), f += "&pageNo=" + (d ? d : 1), f += "&pageSize=" + (e ? e : 12), f += "&time=" + (new Date).getTime(), a({
                    withCredentials: !0,
                    method: "GET",
                    url: PREFIX_URL + f
                })
            }, b.getImagesBySysTag = function(b, c, d, e, f) {
                var g = "m/base/file/sysList?";
                return g += "tagId=" + b, g += "&fileType=" + c, g += "&bizType=" + f, g += "&pageNo=" + (d ? d : 1), g += "&pageSize=" + (e ? e : 12), g += "&time=" + (new Date).getTime(), a({
                    withCredentials: !0,
                    method: "GET",
                    url: PREFIX_URL + g
                })
            }, b.unsetTag = function(b, c) {
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
            }, b.getChildCategory = function(b) {
                var c = "m/base/file/tag/sys";
                return b && (c += "?bizType=" + b), c += (/\?/.test(c) ? "&" : "?") + "time=" + (new Date).getTime(), a({
                    withCredentials: !0,
                    method: "GET",
                    url: PREFIX_URL + c
                })
            }, b.getFileByCategory = function(b, c, d, e) {
                var f = "m/base/file/sysList?";
                "0" === d && "2" === e && (f = "m/base/file/list?"), f += "pageNo=" + (b ? b : 1), f += "&pageSize=" + (c ? c : 12), d && "all" != d && (f += "&bizType=" + (d ? d : -1)), f += "&fileType=" + (e ? e : -1);
                var g = new Date;
                return f += "&time=" + g.getTime(), a({
                    withCredentials: !0,
                    method: "GET",
                    url: PREFIX_URL + f
                })
            }, b.cropImage = function(b) {
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
    ng.module("app.directives.responsiveImage", []).directive("responsiveImage", ["$compile", function() {
        return {
            restrict: "EA",
            link: function(a, b) {
                "0" != a.fileType && $(b).bind("load", function() {
                    $(this).removeAttr("style");
                    var a = $(this).parent().width(),
                        b = $(this).parent().height();
                    this.width > this.height ? (this.style.width = a + "px", this.style.height = this.height * a / this.width + "px", this.style.top = "50%", this.style.marginTop = "-" + this.height / 2 + "px") : (this.style.height = b + "px", this.style.width = this.width * b / this.height + "px", this.style.left = "50%", this.style.marginLeft = "-" + this.width / 2 + "px")
                })
            }
        }
    }]);
    ng.module("app.directives.rightclick", []).directive("rightClick", ["$compile", function(a) {
        return {
            restrict: "EA",
            link: function(b, c) {
                var d;
                $(c).on("contextmenu", function(e) {
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
                        d.append(j), $(j).on("click", function() {
                            d.hide()
                        }), $(document).mousemove(function(a) {
                            (a.pageX < d.offset().left - 20 || a.pageX > d.offset().left + d.width() + 20 || a.pageY < d.offset().top - 20 || a.pageY > d.offset().top + d.height() + 20) && (d.hide(), $(this).unbind("mousemove"))
                        })
                    }
                })
            }
        }
    }]);
    ng.module("scene.create.console.category", ["services.file"]);
    ng.module("scene.create.console.category").controller("CategoryConsoleCtrl", ["$scope", "$timeout", "localizedMessages", "fileService", function(a, c, d, e) {
        a.category = {}, a.confirm = function() {
            return a.category.name && a.category.name.trim() ? i(a.category.name) > 16 ? void alert("类别字数不能超过16个字符！") : void e.createCategory(b.copy(a.category.name)).then(function(c) {
                a.category.id = c.data.obj, a.$close(b.copy(a.category))
            }, function() {
                alert("创建失败")
            }) : void alert("类别不能为空！")
        }, a.cancel = function() {
            a.$dismiss()
        }
    }]);
    ng.module("scene.create.console.cropImage", ["services.file"]).directive("cropImage", ["sceneService", "fileService", "$compile", function(a, b) {
        return {
            restrict: "EAC",
            scope: {},
            replace: !0,
            templateUrl: "scene/console/cropimage.tpl.html",
            link: function(c, d) {
                c.PREFIX_FILE_HOST = PREFIX_FILE_HOST;
                var e, f = a.currentElemDef,
                    g = a.currentElemDef.properties.src;
                c.$on("changeElemDef", function(b, d) {
                    d = a.currentElemDef, g = a.currentElemDef.properties.src, c.preSelectImage(g)
                }), c.preSelectImage = function(a) {
                    var b = $("#target");
                    e ? (b.attr("src", PREFIX_FILE_HOST + a), e.setImage(PREFIX_FILE_HOST + a), e.setSelect([0, 0, 100, 100])) : b.attr("src", PREFIX_FILE_HOST + a).load(function() {
                        b.Jcrop({
                            keySupport: !1,
                            setSelect: [0, 0, 100, 100],
                            boxHeight: 200,
                            boxWidth: 300
                        }, function() {
                            e = this
                        }), a && b.Jcrop({
                            keySupport: !1,
                            aspectRatio: f.css.width / f.css.height,
                            setSelect: [-f.properties.imgStyle.marginLeft.split("px")[0], -f.properties.imgStyle.marginTop.split("px")[0], f.css.width, f.css.height]
                        })
                    })
                }, c.preSelectImage(g), c.crop = function() {
                    var c = a.currentElemDef,
                        f = e.tellSelect();
                    f.x = parseInt(f.x, 10), f.y = parseInt(f.y, 10), f.w = parseInt(f.w, 10), f.h = parseInt(f.h, 10), f.x2 = parseInt(f.x2, 10), f.y2 = parseInt(f.y2, 10), f.src = $("#target").attr("src").split(PREFIX_FILE_HOST)[1], b.cropImage(f).then(function(a) {
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
                    }, function() {
                        c.properties.src || (elements.splice(elements.indexOf(elementsMap[c.id]), 1), delete elementsMap[c.id])
                    })
                }, c.cancel = function() {
                    $(d).hide()
                }
            }
        }
    }]);
    ng.module("scene.create.console.bg", ["services.file", "scene.my.upload", "app.directives.responsiveImage", "app.directives.rightclick"]);
    ng.module("scene.create.console.bg").controller("BgConsoleCtrl", ["$scope", "$timeout", "$rootScope", "$modal", "ModalService", "sceneService", "fileService", "localizedMessages", "obj", function(a, b, c, d, e, f, g, h, i) {
            a.PREFIX_FILE_HOST = PREFIX_FILE_HOST, a.first = !0, a.categoryList = [], a.imgList = [], a.otherCategory = [], a.categoryId = "1", a.fileType = i.fileType, a.pageSize = h.get("file.bg.pageSize"), a.myTags = [], a.selectedImgs = [], a.selectedImages = [], a.toPage = 1, a.isEditor = c.isEditor;
            var j = function() {
                g.listFileCategory(a.fileType).then(function(b) {
                    a.categoryList = b.data.list, a.changeCategory("0", 1)
                })
            };
            a.totalItems = 0, a.currentPage = 1;
            var k = function(b, c) {
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
                } else "all" == b && (b = ""), g.getFileByCategory(c ? c : 1, a.pageSize, b, a.fileType).then(function(b) {
                    a.imgList = b.data.list, a.totalItems = b.data.map.count, a.currentPage = b.data.map.pageNo, a.allPageCount = b.data.map.count, a.toPage = b.data.map.pageNo, a.numPages = Math.ceil(a.totalItems / a.pageSize)
                })
            };
            a.replaceImage = function() {
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
            }, a.getImagesByPage = function(b, c) {
                a.currentPage = c, 0 === b ? isNaN(a.tagIndex) || -1 == a.tagIndex ? a.changeCategory(b, c) : a.getImagesByTag(a.myTags[a.tagIndex].id, a.tagIndex, c) : isNaN(a.sysTagIndex) || -1 == a.sysTagIndex ? a.changeCategory(b, c) : a.getImagesBySysTag(a.childCatrgoryList[a.sysTagIndex].id, a.sysTagIndex, c, b)
            }, a.replaceBgImage = function(b, c) {
                var d, e = c.target;
                d = "IMG" == e.nodeName.toUpperCase() ? e : $("img", e)[0], a.$close({
                    type: "imgSrc",
                    data: b,
                    width: d.width,
                    height: d.height
                })
            }, a.replaceBgColor = function(b) {
                a.$close({
                    type: "backgroundColor",
                    color: b
                })
            }, a.changeCategory = function(b, c) {
                return ("c" == b || "all" == b || "0" == b) && (a.allImages.checked = !1, a.sysTagIndex = -1), a.selectedImages = [], 1 > c || c > a.totalItems / a.pageSize + 1 ? void alert("此页超出范围") : (a.imgList = [], b || (b = "0"), a.categoryId = b, void("0" === b ? (a.pageSize = h.get("file.bg.pageSize") - 1, a.getImagesByTag("", a.tagIndex, c), a.tagIndex = -1) : (a.pageSize = h.get("file.bg.pageSize"), k(b, c))))
            };
            var l = null;
            a.createCategory = function() {
                return a.myTags.length >= 8 ? void alert("最多能创建8个自定义标签！") : void(l = d.open({
                    windowClass: "console",
                    templateUrl: "scene/console/category.tpl.html",
                    controller: "CategoryConsoleCtrl"
                }).result.then(function(b) {
                        a.myTags.push(b)
                    }, function() {}))
            }, a.getCustomTags = function() {
                g.getCustomTags().then(function(b) {
                    a.myTags = b.data.list
                }, function() {
                    alert("服务器异常")
                })
            }, a.getCustomTags(), a.deleteTag = function(b, c) {
                g.deleteTag(b).then(function() {
                    a.myTags.splice(c, 1)
                }, function() {
                    alert("服务器异常")
                })
            }, a.hover = function(a) {
                a.showOp = !a.showOp
            }, a.switchSelect = function(b, c) {
                if (c.target.id != b.id)
                    if (b.selected = !b.selected, b.selected) a.selectedImages.push(b);
                    else
                        for (var d in a.selectedImages) a.selectedImages[d] == b && a.selectedImages.splice(d, 1)
            }, a.selectTag = function(b, c) {
                a.dropTagIndex = c, a.id = a.myTags[c].id
            }, a.setCategory = function(b, c) {
                a.dropTagIndex = -1;
                var d = [];
                if (!c)
                    for (var e in a.selectedImages) d.push(a.selectedImages[e].id);
                var f = c ? c : d.join(",");
                g.setCategory(a.id, f).then(function() {}, function() {})
            }, a.hoverTag = function(a) {
                a.hovered = !a.hovered
            }, a.prevent = function(b) {
                b.selected || (b.selected = !0, a.selectedImages.push(b))
            }, a.prevent = function() {}, a.unsetTag = function() {
                var b = [];
                for (var c in a.selectedImages) b.push(a.selectedImages[c].id);
                g.unsetTag(a.myTags[a.tagIndex].id, b.join(",")).then(function() {
                    a.getImagesByTag(a.myTags[a.tagIndex].id, a.tagIndex, a.currentPage)
                }, function() {})
            }, a.setIndex = function(b) {
                a.dropTagIndex = -1, a.selectedImages.length || (alert("请您选中图片再进行分类！"), b.stopPropagation())
            }, a.getChildCategory = function(b) {
                g.getChildCategory(b).then(function(b) {
                    a.sysTagIndex = -1, 200 == b.data.code && (a.childCatrgoryList = b.data.list)
                }, function() {})
            }, a.goUpload = function() {
                d.open({
                    windowClass: "upload-console",
                    templateUrl: "my/upload.tpl.html",
                    controller: "UploadCtrl",
                    resolve: {
                        category: function() {
                            return {
                                categoryId: a.categoryId,
                                fileType: a.fileType,
                                coverImage: i.coverImage
                            }
                        }
                    }
                }).result.then(function() {
                        a.changeCategory(a.categoryId)
                    }, function() {})
            }, a.allImages = {
                checked: !1
            }, a.selectAll = function() {
                for (var b in a.imgList) a.allImages.checked ? (a.imgList[b].selected = !0, a.selectedImages.push(a.imgList[b])) : (a.imgList[b].selected = !1, a.selectedImages = [])
            }, a.getImagesByTag = function(b, c, d) {
                return 1 > d || d > a.totalItems / a.pageSize + 1 ? void alert("此页超出范围") : (a.allImages.checked = !1, a.selectedImages = [], a.tagIndex = c, void g.getImagesByTag(b, a.fileType, d, a.pageSize).then(function(b) {
                    a.imgList = b.data.list, a.totalItems = b.data.map.count, a.currentPage = b.data.map.pageNo, a.allPageCount = b.data.map.count, a.toPage = b.data.map.pageNo, a.numPages = Math.ceil(a.totalItems / a.pageSize)
                }, function() {
                    alert("服务器异常")
                }))
            }, a.getImagesBySysTag = function(b, c, d, e) {
                return 1 > d || d > a.totalItems / a.pageSize + 1 ? void alert("此页超出范围") : (a.allImages.checked = !1, a.selectedImages = [], a.sysTagIndex = c, void g.getImagesBySysTag(b, a.fileType, d, a.pageSize, e).then(function(b) {
                    a.imgList = b.data.list, a.totalItems = b.data.map.count, a.currentPage = b.data.map.pageNo, a.allPageCount = b.data.map.count, a.toPage = b.data.map.pageNo, a.numPages = Math.ceil(a.totalItems / a.pageSize)
                }, function() {
                    alert("服务器异常")
                }))
            }, a.deleteImage = function(b, c) {
                var d = [];
                if (!b && 0 === a.selectedImages.length) return void alert("请您选中图片后再进行删除操作！");
                c && c.stopPropagation();
                var f = b ? "确定删除此图片？" : "确定删除所选图片？";
                if (!b)
                    for (var h in a.imgList) a.imgList[h].selected && d.push(a.imgList[h].id);
                var i = b ? b : d.join(",");
                e.openConfirmDialog({
                    msg: f
                }, function() {
                    g.deleteFile(i).then(function() {
                        isNaN(a.tagIndex) || -1 == a.tagIndex ? a.changeCategory("0", a.currentPage) : a.getImagesByTag(a.myTags[a.tagIndex].id, a.tagIndex, a.currentPage)
                    })
                })
            }, j()
        }]);
    ng.module("scene.create.console.pic_lunbo", ["scene.my.upload"]);
    ng.module("scene.create.console.pic_lunbo").controller("picsCtrl", ["$scope", "$timeout", "$rootScope", "$modal", "ModalService", "sceneService", "fileService", "obj", function(a, b, d, e, f, g, h, i) {
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
            a.imgList = k.children, a.isAutoPlay = k.autoPlay, a.fileDomain = PREFIX_FILE_HOST, a.autoPlay = function(b) {
                a.isAutoPlay = k.autoPlay = b
            }, a.choosePic = function() {
                return k.children.length >= 6 ? void alert("最多选择6张图片") : void e.open({
                    windowClass: "console img_console",
                    templateUrl: "scene/console/bg.tpl.html",
                    controller: "BgConsoleCtrl",
                    resolve: {
                        obj: function() {
                            return {
                                fileType: 1,
                                elemDef: i
                            }
                        }
                    }
                }).result.then(function(b) {
                        a.imgList.push({
                            src: b.data,
                            desc: "",
                            height: b.height,
                            width: b.width
                        })
                    }, function() {})
            }, a.remove = function(b) {
                a.imgList.splice(b, 1)
            }, a.ok = function() {
                return 0 === k.children.length ? void alert("请选择图片") : (i.properties = k, void a.$close(k))
            }, a.cancel = function() {
                a.$dismiss()
            }
        }]);
    ng.module("scene.create.console.video", []);
    ng.module("scene.create.console.video").controller("VideoCtrl", ["$scope", "$timeout", "obj", function(a, b, c) {
        a.model || (a.model = {}), a.model.src = c.properties.src, a.confirm = function() {
            return a.model.src ? void a.$close(a.model.src) : void alert("请输入视频地址")
        }, a.cancel = function() {
            a.$dismiss()
        }
    }]);
    ng.module("scene.create.console.link", ["services.scene"]);
    ng.module("scene.create.console.link").controller("LinkConsoleCtrl", ["$scope", "$timeout", "obj", "sceneService", function(a, c, d, e) {
            a.url = {}, a.url.externalLink = "http://";
            var f;
            a.confirm = function() {
                "external" == a.url.link ? f = a.url.externalLink : "internal" == a.url.link && (f = a.url.internalLink.id), a.$close(f)
            }, a.cancel = function() {
                a.$dismiss()
            }, a.removeLink = function(b) {
                "external" == b ? a.url.externalLink = "http://" : "internal" == b && (a.url.internalLink = a.pageList[0]), a.url.link = ""
            }, a.changed = function() {
                "external" == a.url.link ? a.url.internalLink = a.pageList[0] : a.url.externalLink = "http://"
            }, a.selectRadio = function(b) {
                a.url.link || ("external" == b ? a.url.link = "external" : "internal" == b && (a.url.link = "internal"))
            }, a.getPageNames = function() {
                var c = d.sceneId;
                e.getPageNames(c).then(function(c) {
                    a.pageList = c.data.list, a.pageList.unshift({
                        id: 0,
                        name: "无"
                    }), a.url.internalLink = a.pageList[0], b.forEach(a.pageList, function(b) {
                        b.name || (b.name = "第" + b.num + "页"), d.properties.url && d.properties.url == b.id && (a.url.link = "internal", a.url.internalLink = b)
                    }), d.properties.url && isNaN(d.properties.url) && (a.url.link = "external", a.url.externalLink = decodeURIComponent(d.properties.url.split("=")[2]))
                })
            }, a.getPageNames()
        }]);
    ng.module("scene.create.console.micro", ["app.directives.addelement", "services.scene"]);
    ng.module("scene.create.console.micro").controller("MicroConsoleCtrl", ["$scope", "$timeout", "localizedMessages", "obj", "sceneService", function(a, c, d, e, f) {
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
            }], a.model.color = e.properties.labels[0].color.backgroundColor, a.selectColor = function(c) {
                a.model.color = c.backgroundColor, b.forEach(a.labelNames, function(a) {
                    a.color.backgroundColor && (a.color.backgroundColor = c.backgroundColor)
                })
            }, b.forEach(e.properties.labels, function(c) {
                b.forEach(a.labelNames, function(a) {
                    c.id == a.id && (a.title = c.title, a.color.backgroundColor = c.color.backgroundColor, a.link = c.link, a.selected = !0, c.mousedown = !1)
                })
            }), a.confirm = function() {
                g = [];
                var c = 0,
                    d = 0;
                b.forEach(a.labelNames, function(a) {
                    a.selected && (a.link ? g.push(a) : d++, c++)
                }), 2 > c ? alert("导航标签不能少于两个！") : d > 0 ? alert("每个导航必须有链接页面！") : a.$close(g)
            }, a.cancel = function() {
                a.$dismiss()
            }, a.switchLabel = function(b, c) {
                a.label = b, b.selected ? a.labelIndex == c ? (b.color.backgroundColor = "", b.selected = !1, b.mousedown = !1) : (a.labelIndex = c, b.mousedown = !0) : (b.color.backgroundColor = a.model.color, a.labelIndex = c, b.selected = !0, b.mousedown = !0), b.mousedown ? (a.model.title = b.title, a.model.link = b.link ? a.pageList[b.link] : a.pageList[0]) : (a.model.title = "", a.model.link = a.pageList[0])
            }, a.selectLink = function(b) {
                a.label.mousedown && (a.label.link = b.num, console.log(a.labelNames))
            }, a.changeLabelName = function() {
                a.label.mousedown && (a.label.title = a.model.title)
            }, a.getPageNames = function() {
                var c = e.sceneId;
                f.getPageNames(c).then(function(c) {
                    a.pageList = c.data.list, a.pageList.unshift({
                        id: 0,
                        name: "无"
                    }), b.forEach(a.pageList, function(a) {
                        a.name || (a.name = "第" + a.num + "页")
                    }), a.model.link = a.pageList[0]
                })
            }, a.getPageNames()
        }]);

    ng.module("app.directives.comp.editor", []).directive("mapEditor", function() {
        return {
            restrict: "AE",
            templateUrl: "directives/mapeditor.tpl.html",
            link: function(a) {
                var b = new BMap.Map("l-map");
                b.centerAndZoom(new BMap.Point(116.404, 39.915), 15);
                var c = {
                        onSearchComplete: function(a) {
                            if (d.getStatus() == BMAP_STATUS_SUCCESS) {
                                for (var b = [], c = 0; c < a.getCurrentNumPois(); c++) b.push(a.getPoi(c).title + ", " + a.getPoi(c).address);
                                document.getElementById("r-result").innerHTML = b.join("<br/>")
                            }
                        }
                    },
                    d = new BMap.LocalSearch(b, c);
                a.searchAddress = function() {
                    d.search(a.address)
                }
            }
        }
    });
    ng.module("scene.create.console.map", ["app.directives.comp.editor"]);
    ng.module("scene.create.console.map").controller("MapConsoleCtrl", ["$scope", "sceneService", "$timeout", function(a, b, c) {
            var d = null,
                e = null;
            a.address = {
                address: "",
                lat: "",
                lng: ""
            }, a.search = {
                address: ""
            }, a.searchResult = [], c(function() {
                d = new BMap.Map("l-map"), d.addControl(new BMap.NavigationControl), d.centerAndZoom(new BMap.Point(116.404, 39.915), 12);
                var b = {
                    onSearchComplete: function(b) {
                        e.getStatus() == BMAP_STATUS_SUCCESS && (a.searchResult = b.Fn, a.$apply())
                    }
                };
                e = new BMap.LocalSearch(d, b)
            }), a.searchAddress = function() {
                e.search(a.search.address)
            }, a.setPoint = function(b, c, e) {
                a.address.address = e, a.address.lat = b, a.address.lng = c, d.clearOverlays();
                var f = new BMap.Point(c, b),
                    g = new BMap.Marker(f);
                d.addOverlay(g);
                var h = new BMap.Label(e, {
                    offset: new BMap.Size(20, -10)
                });
                g.setLabel(h), d.centerAndZoom(f, 12)
            }, a.resetAddress = function() {
                a.$close(a.address)
            }, a.cancel = function() {
                a.$dismiss()
            }
        }]);
    ng.module("scene.create.console", [
        "scene.create.console.setting"
        ,"scene.create.console.audio"
        ,"scene.create.console.input"
        ,"scene.create.console.button"
        ,"scene.create.console.tel"
        ,"scene.create.console.pic_lunbo"
        ,"scene.create.console.video"
        ,"scene.create.console.link"
        ,"scene.create.console.micro"
        ,"scene.create.console.map"
    ]);
    ng.module("scene.create.console").controller("ConsoleCtrl", ["$scope", function() {}]);

    ng.module("app.directives.editor", []).directive("toolbar", ["$compile", function($compile) {
        return {
            restrict: "EA",
            replace: !0,
            templateUrl: "directives/toolbar.tpl.html",
            link: function(scope) {
                scope.internalLinks = ng.copy(scope.pages);
                if(!(scope.internalLink || scope.externalLink)){
                    scope.internalLink = scope.internalLinks[0];
                    scope.externalLink = "http://";
                }
                var colors = ["#000000", "#7e2412", "#ff5400", "#225801", "#0c529e", "#333333", "#b61b52", "#f4711f", "#3bbc1e", "#23a3d3", "#888888", "#d34141", "#f7951e", "#29b16a", "#97daf3", "#cccccc", "#ec7c7c", "#fdea02", "#79c450", "#563679", "#ffffff", "#ffcccc", "#d9ef7f", "#c3f649"],
                    $colorMenu = $(".color-menu"),
                    $bgcolorMenu = $(".bgcolor-menu");
                $.each(colors, function(key, value) {
                    $colorMenu.append($('<li><a dropdown-toggle class="btn" data-edit="foreColor ' + value + '" style="background-color: ' + value + '"></a></li>'));
                });
                $compile($colorMenu.append($('<li><a dropdown-toggle class="btn glyphicon glyphicon-remove" data-edit="foreColor transparent" style="background-color: transparent"></a></li>')))(scope);

                var toRGB = function(color) {
                    var colorReg = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                    color = color.replace(colorReg, function(a, b, c, d) {
                        return b + b + c + c + d + d
                    });
                    var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
                    return rgb ? {
                        r: parseInt(rgb[1], 16),
                        g: parseInt(rgb[2], 16),
                        b: parseInt(rgb[3], 16)
                    } : null;
                };
                $.each(colors, function(key, value) {
                    var color = toRGB(value);
                    $bgcolorMenu.append($('<li><a dropdown-toggle class="btn" data-edit="backColor rgba(' + color.r + "," + color.g + "," + color.b + ', 0.3)" style="background-color: rgba(' + color.r + "," + color.g + "," + color.b + ', 0.3)"></a></li>'))
                });
                $compile($bgcolorMenu.append($('<li><a dropdown-toggle class="btn glyphicon glyphicon-remove" data-edit="backColor transparent" style="background-color: transparent"></a></li>')))(scope);
            }
        }
    }]);
    ng.module("app.directives.addelement", [])
        .directive("addElement", ["$compile", function($compile) {
            return {
                restrict: "EA",
                link: function(scope, element, attr) {
                    var $elem = $("#emailAddress"),cnt = $("#emailAddress").size() + 1;
                    element.bind("click", function() {
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
        .directive("showIcon", ["$compile", function($compile) {
            return {
                restrict: "EA",
                require: "ngModel",
                scope: {
                    check: "&callbackFn"
                },
                link: function(scope, element, attr, ctrl) {
                    var originVal, finalVal,
                        $icon = $compile('<a><span class = "glyphicon glyphicon-ok-circle" ng-show="enabled" style = "margin-top: 8px; color: #9ad64b; font-size: 15px;"></span></a>')(scope);
                    scope.update = function() {
                        element[0].blur();
                        scope.check({
                            arg1: {
                                name: ctrl.$name
                            }
                        });
                    };
                    element.bind("focus", function() {
                        originVal = ctrl.$viewValue;
                        element.parent().after($icon);
                        scope.enabled = !0;
                        if("email" === attr.name || "mobile" === attr.name || "tel" === attr.name)scope.enabled = !1;
                        scope.$apply();
                    })
                    .bind("blur", function() {
                        scope.enabled = !1;
                        finalVal = ctrl.$viewValue;
                        var mobileReg = new RegExp(/(\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/g);
                        if ("mobile" === attr.name && g && !mobileReg.test(element.val())) return void alert("手机号码格式错误");
                        if ("email" === attr.name && g) {
                            var emailReg = new RegExp(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/g);
                            if (!emailReg.test(element.val())) return void alert("邮箱格式错误")
                        }
                        if((finalVal || originVal) && originVal !== finalVal)scope.update();
                        scope.$apply();
                    });
                }
            };
        }])
        .directive("ngHover", function() {
            return {
                restrict: "EA",
                link: function(scope, element) {
                    $(element).hover(function() {
                        $(element.children()[0]).css("display", "block");
                        $(element.children()[3]).css("display", "block");
                        $(element.children()[4]).css("display", "block")
                    }, function() {
                        $(element.children()[0]).css("display", "none");
                        $(element.children()[3]).css("display", "none");
                        $(element.children()[4]).css("display", "none")
                    });
                }
            };
        })
        .directive("imgClick", function() {
            return {
                restrict: "EA",
                link: function(scope, element) {
                    $(element).bind("click", function() {
                        $(element).find("img").css("border", "4px solid #F60");
                        $(element).siblings().find("img").css("border", 0);
                    });
                }
            };
        })
        .directive("customFocus", function() {
            return {
                restrict: "EA",
                link: function(scope, element) {
                    $(element).siblings().bind("click", function() {element[0].focus()});
                }
            }
        })
        .directive("blurChildren", function() {
            return {
                restrict: "EA",
                link: function(scope, element) {
                    $(element).on("click", function(event) {
                        if(event.target == element[0] || $(event.target).hasClass("badge")){
                            $(".blurClass").find("input:visible").blur();
                        }
                    });
                }
            };
        })
        .directive("forbiddenClose", function() {
            return {
                restrict: "EA",
                link: function(scope, element) {
                    $(element).on("click", function(event) {event.stopPropagation();});
                }
            };
        })
        .directive("customeImage", function() {
            return {
                restrict: "EA",
                link: function(scope, element) {
                    $(element).hover(function() {
                        $("<div><a></a></div>");
                    }, function() {});
                }
            };
        })
        .directive("slides", function() {
            return {
                restrict: "EA",
                link: function(scope, element) {
                    $(element).slides({
                        preload: !0,
                        play: 5e3,
                        pause: 2500,
                        hoverPause: !0
                    });
                }
            };
        })
        .directive("addClass", function() {
            return {
                restrict: "EA",
                link: function(scope, element) {
                    $(element).closest(".textbox-wrap").find("[autofocus]").focus();
                    $(element).on("blur", function() {
                        $(element).closest(".textbox-wrap").removeClass("focused");
                    })
                    .on("focus", function() {
                        $(element).closest(".textbox-wrap").addClass("focused");
                    });
                }
            };
        })
        .directive("loadScript", ["$http",function($http) {
            return {
                link: function(scope, element) {
                    var callback = function() {
                        scope.captchaLoaded = !0
                    };
                    scope.$watch(function() {
                        return element[0].getAttribute("src");
                    }, function(src) {
                        src && $http.jsonp(element[0].getAttribute("src")).success(callback).error(callback);
                    });
                    scope.$on("$destroy", function() {
                        ng.element(".gt_widget").remove();
                    });
                }
            }
        }]);
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

                        caleOffset = {},//f
                        center = {},//g
                        offset = {},//h
                        caleDimension = {},//i

                        $element = $(element),//j
                        $parent = $element.parent(),//k

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
                            center.top = center.y - position.top;
                            center.bottom = center.y + pDimension.height - (position.top + caleDimension.height);
                            center.left = center.x - position.left;
                            center.right = center.x + pDimension.width - (position.left + caleDimension.width);

                            caleOffset.x = event.center.x - (parseFloat($element.css("left")) + pOffset.left);
                            caleOffset.y = event.center.y - (parseFloat($element.css("top")) + pOffset.top);
                        }
                    });
                    hammer.on("panmove", function(event) {
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
                    hammer.on("panend", function(event) {
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
                var element = $('<ul id="pasteMenu" class="dropdown-menu" style="min-width: 100px; display: block;" role="menu" aria-labelledby="dropdownMenu1"><li class="paste" role="presentation"><a role="menuitem" tabindex="-1"><div class="fa fa-paste" style="color: #08a1ef;"></div>&nbsp;&nbsp;粘贴</a></li></ul>')
                    .css({position: "absolute","user-select": "none"});
                element.find(".paste").on("click", function() {
                    sceneService.pasteElement(sceneService.originalElemDef, sceneService.copyElemDef, sceneService.sameCopyCount);
                    element.hide();
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
                            if(element.length > 0)element.remove();
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
                        return false;
                    });
                }
            }
        }]);

    ng.module("templates-app", [
        "dialog/confirm.tpl.html"
        ,"scene/create.tpl.html"
        ,"scene/effect/falling.tpl.html"
        ,"scene/console/bg.tpl.html"
        ,"scene/console/style.tpl.html"
        ,"scene/console/angle-knob.tpl.html"
        ,"scene/console/anim.tpl.html"
        ,"scene/console/setting.tpl.html"
        ,"scene/console/audio.tpl.html"
        ,"scene/console/input.tpl.html"
        ,"scene/console/button.tpl.html"
        ,"scene/console/tel.tpl.html"
        ,"scene/console/pic_lunbo.tpl.html"
        ,"scene/console/video.tpl.html"
        ,"scene/console/link.tpl.html"
        ,"scene/console/microweb.tpl.html"
        ,"scene/console/map.tpl.html"
        ,"scene/console/category.tpl.html"
        ,"scene/console/cropimage.tpl.html"
    ]);
    ng.module("dialog/confirm.tpl.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("dialog/confirm.tpl.html", '<div class="modal-header">\n    <span class="glyphicon glyphicon-exclamation-sign"></span>\n    <span>提示</span>\n</div>\n<div class="modal-body" ng-if="confirmObj.msg">\n <!-- confirm message -->\n  <div class="confirm-msg">{{confirmObj.msg}}</div>\n</div>\n<div class="modal-footer">\n    <a ng-click="ok();" class="btn-main"\n    style="width: 88px;">\n        {{confirmObj.confirmName || \'是\'}}\n    </a>\n    <a ng-click="cancel();" class="btn-grey0"\n    style="width: 88px;margin-left: 15px;">\n        {{confirmObj.cancelName || \'取消\'}}\n    </a>\n</div>')
    }]);
    ng.module("scene/create.tpl.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("scene/create.tpl.html", '<div class="creat_head">\n  <div class="creat_head_con clearfix">\n    <div class="creat_logo"><a href="#/main" ng-click="stopCopy()"><img ng-src="{{CLIENT_CDN}}assets/images/logo.png" /></a></div>\n    <div class="creat_con clearfix">\n        <ul class="comp_panel clearfix">\n          <li comp-draggable="panel" ctype="2" class="comp-draggable text" title="请拖动到编辑区域" ng-click="createComp(\'2\');">\n            <span>文本</span>\n          </li>\n          <li comp-draggable="panel" ctype="3" class="comp-draggable bg" title="请拖动到编辑区域" ng-click="createComp(\'3\');">\n            <span>背景</span>\n          </li>\n          <li comp-draggable="panel" ctype="9" class="comp-draggable music" title="请拖动到编辑区域" ng-click="createComp(\'9\');">\n            <span>音乐</span>\n          </li>  \n          <li ng-if="isAllowToAccessScrollImage" comp-draggable="panel" ctype="v" class="comp-draggable vedio" title="请拖动到编辑区域" ng-click="createComp(\'v\');">\n            <span>视频</span>\n          </li>        \n          <li comp-draggable="panel" ctype="4" class="comp-draggable image" title="请拖动到编辑区域" ng-click="createComp(\'4\');">\n            <span>图片</span>\n          </li>\n          <li comp-draggable="panel" ctype="5" class="comp-draggable textarea" title="请拖动到编辑区域" ng-click="createComp(\'5\');">\n            <span>输入框</span>\n          </li>\n          <li comp-draggable="panel" ctype="6" class="comp-draggable button" title="请拖动到编辑区域" ng-click="createComp(\'6\');">\n            <span>按钮</span>\n          </li>\n          <li ng-if="isAllowToAccessScrollImage" comp-draggable="panel" ctype="p" class="comp-draggable images" title="请拖动到编辑区域" ng-click="createComp(\'p\');">\n            <span>图集</span>\n          </li>\n          <li comp-draggable="panel" ctype="8" class="comp-draggable phone" title="请拖动到编辑区域" ng-click="createComp(\'8\');">\n            <span>电话</span>\n          </li>          \n          <li comp-draggable="panel" ctype="g101" class="comp-draggable contact" title="请拖动到编辑区域" ng-click="createCompGroup(\'g101\');">\n            <span>联系人</span>\n          </li>          \n          <li ng-click="openPageSetPanel()" class="texiao">\n            <span><a id = "toggle_button" class="page_effect" >特效</a></span></li>\n        </ul>\n  </div>\n    <div class="create-action">\n        <ul>\n            <li class="act-border save"><span class="create-save" ng-click="saveScene(true)">保存</span></li>\n            <li class="publish"><span class="create-publish" ng-click="publishScene()">发布</span></li>\n            <li class="act-border quit"><span class="create-quit" ng-click="exitScene()">退出</span></li> \n        </ul>\n    </div>\n    <div ng-hide="showToolBar();">\n        <div ng-show="isEditor" style="position: absolute;right: -200px;top: 20px;">\n            <select ng-model="tpl.obj.scene.isTpl">\n                <option value="0">非模板</option>\n                <option value="1">保存为pc模板</option>\n                <option value="2">保存为移动端模板</option>\n            </select>\n        </div>\n    </div>\n</div>\n</div>\n<div class="create_scene">\n  <div class="main clearfix">\n      <div class="content">\n          <div class="create_left">\n            <tabset justified="true">\n              <tab heading="页面模版" class="hint--bottom hint--rounded" style = "width: 290px;">\n                  <tabset justified="true" class="tpl_tab">\n                    <tab ng-repeat="pageTplType in pageTplTypes" heading="{{pageTplType.name}}" ng-click="getPageTplsByType(pageTplType.value)">\n                      <div class="nav2 clearfix" dropdown >\n                        <div class="others dropdown-toggle" ng-show="otherCategory.length > 0"><span></span></div>\n                        <ul class="clearfix nav2_list">\n                          <li ng-class="{active:childCat.id == categoryId}" ng-click="getPageTplTypestemp(childCat.id ,bizType)" ng-repeat="childCat in childCatrgoryList">{{childCat.name}}</li>\n                        </ul>\n                        <ul class="clearfix nav2_other dropdown-menu">\n                          <li ng-class="{active:othercat.id == categoryId}" ng-click="getPageTplTypestemp(othercat.id ,bizType)" ng-repeat="othercat in otherCategory">{{othercat.name}}</li>\n                        </ul>                        \n                      </div>\n                      <ul id="tpl_panel" class="page_tpl_container clearfix">\n                        <li class="page_tpl_item" ng-repeat="pageTpl in pageTpls" class="comp-draggable" title="点击插入编辑区域" ng-click="insertPageTpl(pageTpl.id);">\n                          <img ng-src="{{PREFIX_FILE_HOST + pageTpl.properties.thumbSrc}}" />\n                        </li>\n                      </ul>\n                    </tab>\n                    <tab ng-repeat="myname in myName" heading="{{myName[0].name}}" active="myname.active" ng-if = "pageTplTypes" ng-click = "getPageTplsByMyType()">\n                      <div style="padding:10px;" ng-hide="myPageTpls">在页面管理中选中页面，点击生成模板，即可生成我的页面模板！</div>\n                      <ul id="tpl_panel" class="page_tpl_container clearfix">\n                        <li thumb-tpl my-attr="pageTpl" style="position: relative;" id="my-tpl" class="nr page_tpl_item comp-draggable" ng-repeat="pageTpl in myPageTpls" title="点击插入编辑区域" ng-click="insertPageTpl(pageTpl.id);">\n                        </li>\n                      </ul>\n                    </tab>\n                  </tabset>\n              </tab>\n            </tabset>\n          </div> \n          <div class="phoneBox">\n            <div >\n                <div class="top"></div>\n                <div class = "phone_menubar"></div>\n                <div class="scene_title_baner">\n                  <div ng-bind="tpl.obj.scene.name" class="scene_title"></div>\n                </div>\n                <div class="nr sortable" id="nr"></div>\n                <div class="bottom"></div>\n                <div class = "tips">为了获得更好的使用，建议使用谷歌浏览器（chrome）、360浏览器、IE11浏览器。</div>\n            </div>\n            <div class="phone_texiao">\n                <div id="editBG" style="display: none;"><span class="hint--right hint--rounded" data-hint="选择新背景">背景</span><div style="margin:10px 0;border-bottom: 2px solid #666;"></div><a style = "color: #666;" class="hint--bottom hint--rounded" data-hint="删除当前页面的背景"><span ng-click="removeBG($event)" class="glyphicon glyphicon-remove"></span></a></div>\n                <div id="editBGAudio" ng-click="openAudioModal()" ng-show="tpl.obj.scene.image.bgAudio"><span class="hint--right hint--rounded" data-hint="选择新音乐">音乐</span><div style="margin:10px 0;border-bottom: 2px solid #666;"></div><a style = "color: #666;" class="hint--bottom hint--rounded" data-hint="删除当前页面的音乐"><span ng-click="removeBGAudio($event)" class="glyphicon glyphicon-remove"></span></a></div>\n                <div id="editScratch" ng-click="openOneEffectPanel(tpl.obj.properties)" ng-show="tpl.obj.properties"><span class="hint--right hint--rounded" data-hint="选择新特效">{{effectName}}</span><div style="margin:10px 0;border-bottom: 2px solid #666;"></div><a style = "color: #666;" class="hint--bottom hint--rounded" data-hint="删除当前页面特效"><span ng-click="removeScratch($event)" class="glyphicon glyphicon-remove"></span></a></div>\n            </div>\n              <div class="history">\n                  <a title="撤销(ctrl+z)" ng-click="back()"><i class="fa fa-reply" ng-class="{active: canBack}"></i></a>\n                  <a title="恢复(ctrl+y)" ng-click="forward()"><i class="fa fa-share" ng-class="{active: canForward}"></i></a>\n              </div>\n          </div>\n\n          <div id = "containment" class="create_right"> \n            <div class="guanli">页面管理</div>\n            <div class = "nav_top">\n              <div class="nav_top_list">\n                <a ng-click="duplicatePage()" class="">复制</a>\n                <a class="" ng-click = "deletePage($event)" ng-show = "pages.length != 1">删除</a>\n                <a ng-click = "creatMyTemplate()">生成模版</a>\n              </div>\n             \n              <div class = "btn-group">\n                <div class="dropdown">\n                  <div id = "page_panel" ng-show="showPageEffect" class="dropdown-menu1 panel panel-default">\n                    <ul class = "effect_list">\n                      <li class = "effect" ng-repeat = "effect in effectList" ng-click = "openOneEffectPanel(effect)">\n                        <div class = "effect_img"><img ng-src="{{effect.src}}"></div>\n                        <div class = "effect_info">{{effect.name}}</div>\n                      </li>\n                    </ul>\n                  </div>\n\n                  <div id = "page_panel" ng-if="effectType == \'scratch\'" class="dropdown-menu1 panel panel-default">\n\n                    <div class="panel-heading">涂抹设置</div>\n                    <div class="panel-body">\n                      <form class="form-horizontal" role="form">\n                        <div class="form-group form-group-sm clearfix" style="margin-bottom:0;">\n                          <label class="col-sm-5 control-label">覆盖特效</label>\n                          <div class="col-sm-7">\n                            <select ng-model = "scratch.image" ng-options = "scracthImage.name for scracthImage in scratches"  style="width:115px;">\n                            </select>\n                          </div>\n                        </div>\n                        <div class="form-group form-group-sm" style="margin-bottom:0px;margin-top:5px;">\n                          <label class="col-sm-5 control-label" style="padding-top:6px;">覆盖图片</label>\n                          <div class="col-sm-7">\n                            <a ng-click = "openUploadModal()" class = "auto_img btn-main btn-success ">自定义图片</a>\n                          </div>\n                        </div>\n                        <div class = "divider" style="margin-top:6px;"></div>\n                        <div class = "well" style="margin-bottom:0px;">\n                          <img class = "scratch" ng-src="{{scratch.image.path}}"/>\n                        </div>\n                        <div class = "divider"></div>\n                        <div class="form-group form-group-sm" style="margin-bottom:10px;">\n                          <label for="inputEmail3" class="col-sm-5 control-label">涂抹比例</label>\n                          <div class="col-sm-7">\n                            <select ng-model = "scratch.percentage" ng-options = "percentage.name for percentage in percentages">\n                            </select>\n                          </div>\n                        </div>\n                         <div class="form-group form-group-sm" style="margin-bottom:10px;">\n                          <label for="inputEmail3" class="col-sm-5 control-label">提示文字</label>\n                          <div class="col-sm-7">\n                            <input type="text" ng-model = "scratch.tip" id="inputEmail3" placeholder="提示文字" maxlength = "15">\n                          </div>\n                        </div>\n                        <div class="form-group form-group-sm" style="margin-bottom:0px;">\n                          <div class="modal-footer" style="padding-bottom:0px;padding-top:0px;">\n                            <a dropdown-toggle type="button" ng-click = "saveEffect(scratch)" class="btn-main" style="width:88px;border:none;">保存</a>\n                            <a dropdown-toggle type="button" ng-click = "cancelEffect()" class="btn-grey0" style="width:88px;">取消</a>\n                          </div>\n                        </div>\n                      </form>\n                    </div>\n                  </div>\n\n                  <div id = "page_panel" ng-if="effectType==\'finger\'" class="dropdown-menu1 panel panel-default">\n\n                    <div class="panel-heading">指纹设置</div>\n                    <div class="panel-body">\n                      <form class="form-horizontal" role="form">\n                        <div class="form-group form-group-sm" style="margin-bottom:10px;">\n                          <label class="col-sm-5 control-label">背景图片</label>\n                          <div class="col-sm-7">\n                            <select ng-model = "finger.bgImage" ng-options = "bgImage.name for bgImage in fingerBackgrounds">\n                            </select>\n                          </div>\n                        </div>\n                        <div class="form-group form-group-sm" style="margin-bottom:10px;">\n                          <label class="col-sm-5 control-label">指纹图片</label>\n                          <div class="col-sm-7">\n                            <select ng-model = "finger.zwImage" ng-options = "zwImage.name for zwImage in fingerZws">\n                            </select>\n                          </div>\n                        </div>\n                        <div class = "divider"></div>\n                        <div class = "well" style="margin-bottom:15px;">\n                          <img class = "finger_bg" ng-src="{{finger.bgImage.path}}"/>\n                        \n                            <img class = "finger_zw" ng-src="{{finger.zwImage.path}}"/>\n                          \n                        </div>\n                        <div class="form-group form-group-sm" style="margin-bottom:0px;">\n                          <div class="modal-footer" style="padding-bottom:0px;padding-top:0px;">\n                            <a class="btn-main" dropdown-toggle type="button" ng-click = "saveEffect(finger)" class="btn btn-success btn-sm btn-main login" style="width:88px;">保存</a>\n                            <a dropdown-toggle type="button" ng-click = "cancelEffect()" class="btn-grey0" style="width:88px;">取消</a>\n                          </div>\n                        </div>\n                      </form>\n                    </div>\n                  </div>\n                  <div id = "page_panel" ng-show="effectType == \'money\'" class="dropdown-menu1 panel panel-default">\n                    <div class="panel-heading">数钱设置</div>\n                    <div class="panel-body">\n                      <div class = "well" style="margin-bottom:15px;">\n                          <img ng-src="{{CLIENT_CDN + \'assets/images/create/money_thumb2.jpg\'}}"/>      \n                      </div>\n                      <div>\n                        <span>文字提示：</span>\n                        <span class="fr" style="width: 140px;"><input type="text" ng-model="money.tip" placeholder="让你数到手抽筋"></span>\n                      </div>\n                      <div class="form-group form-group-sm" style="margin-bottom:0px;">\n                        <div class="modal-footer" style="padding-bottom:0px;padding-top:0px;">\n                          <a class="btn-main" dropdown-toggle type="button" ng-click = "saveEffect(money)" class="btn btn-success btn-sm btn-main login" style="width:88px;">保存</a>\n                          <a dropdown-toggle type="button" ng-click = "cancelEffect()" class="btn-grey0" style="width:88px;">取消</a>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n                  <div ng-include="\'scene/effect/falling.tpl.html\'"></div>\n                </div>\n              </div>\n            </div>\n\n            <div class="nav_content">\n              <ul id = "pageList" ui-sortable = "sortableOptions" ng-model="pages">\n                <li class = "blurClass" ng-repeat="page in pages track by $index" ng-click="navTo(page, $index, $event)" ng-init = "editableStatus[$index] = false" ng-class="{current: pageNum-1 == $index}" blur-children>\n                    <span style = "float: left; margin-top: 17px; background: #fff; color: #666; font-weight: 200;border-radius:9px;width:18px;height:18px;padding:0px;text-align:center;line-height:18px;" class = "badge">{{$index+1}}</span>\n                    <span style = "margin-left: 17px;font-size:14px;" ng-click = "editableStatus[$index] = true" ng-show = "!editableStatus[$index]">{{page.name}}</span>\n                    <input style = "width: 80px; height: 25px; margin-top: 8px; margin-left: 10px; color: #999;" type = "text" ng-model = "page.name" ng-show = "editableStatus[$index]" ng-blur = "editableStatus[$index] = false;savePageNames(page, $index)" ng-focus = "getOriginPageName(page)" maxlength = "7" custom-focus/>                   \n                </li>\n              </ul>\n              <div class = "page-list-label" ng-show="isEditor && pageList == true">  \n                  <label ng-repeat = "allchild in pageLabelAll">\n                      <input type="checkbox" name="" value="" ng-model = "allchild.ischecked">{{allchild.name}}\n                  </label>                                                 \n                  <div class="select-labels">\n                      <a ng-click="pageChildLabel()">确定</a>\n                  </div>\n              </div>               \n            </div>\n            <div class="nav_bottom">\n              <a ng-click="insertPage()" class="" title="增加一页">+</a>\n             <!--  <a ng-click="duplicatePage()" class="duplicate_page">复制一页</a> -->\n            </div>\n\n            <div ng-show="isEditor">\n              <div class="btn-main" ng-click="chooseThumb()">选择本页缩略图</div>\n              <img width="100" ng-src="{{PREFIX_FILE_HOST + tpl.obj.properties.thumbSrc}}"></img>\n            </div>\n          </div>\n      </div>\n  </div>\n</div>\n</div>\n');
    }]);
    ng.module("scene/effect/falling.tpl.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("scene/effect/falling.tpl.html", '<div id = "page_panel" ng-if="effectType == \'fallingObject\'" class="dropdown-menu1 panel panel-default">\n    <div class="panel-heading">落物设置</div>\n    <div class="panel-body">\n      <form class="form-horizontal" role="form">\n        <div class="form-group form-group-sm" style="margin-bottom:10px;">\n          <label class="col-sm-5 control-label">环境图片</label>\n          <div class="col-sm-7">\n            <select ng-model = "falling.src" ng-options = "fallingObj.name for fallingObj in fallings">\n            </select>\n          </div>\n        </div>\n        <div class = "divider"></div>\n        <div class = "well" style="margin-bottom:15px;text-align: center;background-color: #ddd">\n          <img ng-src="{{falling.src.path}}"/>\n        </div>\n        <div class = "divider"></div>\n        <div class="form-group form-group-sm" style="margin-bottom:10px;">\n          <label class="col-sm-5 control-label">环境氛围</label>\n          <div class="col-sm-7">\n           <div style="line-height: 24px;font-size: 12px;"><span style="margin-right:39px;">弱</span><span style="margin-right:37px;">中</span><span>强</span></div>\n            <div style="width: 100px;" ui-slider min="1" max="3" ng-model="falling.density"></div>\n\n          </div>\n        </div>\n        \n        <div class="form-group form-group-sm" style="margin-bottom:0px;">\n          <div class="modal-footer" style="padding-bottom:0px;padding-top:0px;">\n            <a class="btn-main" dropdown-toggle type="button" ng-click = "saveEffect(falling)" class="btn btn-success btn-sm btn-main login" style="width:88px;">保存</a>\n            <a dropdown-toggle type="button" ng-click = "cancelEffect()" class="btn-grey0" style="width:88px;">取消</a>\n          </div>\n        </div>\n      </form>\n    </div>\n  </div>')
    }]);
    ng.module("scene/console/bg.tpl.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("scene/console/bg.tpl.html", '<!-- <div class="bg_console">\n  <div class="img_list">\n        <div class="category_list">\n           <div ng-show="fileType == \'0\'" class="category_item" ng-click="changeCategory(\'c\')" ng-class="{active: \'c\' == categoryId}">\n             <span>纯色背景</span>\n         </div>\n            <ul class="category_list_container">\n              <li ng-class="{active: category.value == categoryId}" class="category_item" ng-repeat="category in categoryList" ng-click="changeCategory(category.value)">\n                   {{category.name}}\n             </li>\n         </ul>\n         <div class="btn-group fl" dropdown ng-show="otherCategory.length > 0">\n              <span class="dropdown-toggle" ng-disabled="disabled">\n               其它 <span class="caret"></span>\n              </span>\n           <ul class="dropdown-menu">\n              <li ng-repeat="category in otherCategory">\n                  <a href ng-click="changeCategory(category.value)">{{category.name}}</a>\n             </li>\n           </ul>\n           </div>\n            <div class="category_item" ng-click="changeCategory(\'0\')" ng-class="{active: \'0\' == categoryId}">\n             <span ng-show="fileType == \'0\'">我的背景</span>\n             <span ng-show="fileType == \'1\'">我的图片</span>\n         </div>\n        </div>\n        <div class="img_list_container" ng-class="{photo_list: fileType == \'1\', bg_list: fileType == \'0\'}">\n           <ul class="img_box">\n              <li ng-show="isEditor || categoryId == \'0\'" class="upload" title="上传图片" ng-click="goUpload(img.path)">\n                  <span class="glyphicon glyphicon-upload"></span>\n              </li>\n             <li ng-show="fileType == \'0\' && \'c\' != categoryId" ng-repeat="img in imgList track by $index" ng-click="replaceBgImage(img.path, $event)">\n                    <span ng-click="deleteImage(img.id, $event)" ng-show="isEditor || categoryId == \'0\'" class="del_icon glyphicon glyphicon-remove-circle"></span>\n                 <img responsive-image ng-src="{{PREFIX_FILE_HOST + img.tmbPath}}"></img>\n              </li>\n             <li class="photo_item" photo-draggable="{{img.path}}" ng-show="fileType == \'1\'"  ng-repeat="img in imgList track by $index" ng-click="replaceBgImage(img.path, $event)">\n                    <span ng-click="deleteImage(img.id, $event)" ng-show="isEditor || categoryId == \'0\'" class="del_icon glyphicon glyphicon-remove-circle"></span>\n                 <img responsive-image ng-src="{{PREFIX_FILE_HOST + img.tmbPath}}"></img>\n              </li>\n             <li class="photo_item" style="background-color: {{img.color}}" ng-show="fileType == \'0\' && \'c\' == categoryId"  ng-repeat="img in imgList track by $index" ng-click="replaceBgColor(img.color, $event)">\n               </li>\n         </ul>\n         \n      </div>\n        <div class="pagination_container" ng-show="numPages>1">\n           <pagination style="float: left" class="pagination-sm" previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;" max-size="10" items-per-page="pageSize" total-items="totalItems" ng-model="currentPage" ng-change="changeCategory(categoryId, currentPage)" boundary-links="true" rotate="true" num-pages="numPages"></pagination>\n           <div class="current_page">\n                <input type="text" ng-model="toPage" ng-keyup="$event.keyCode == 13 ? changeCategory(categoryId, toPage) : null">\n             <a ng-click="changeCategory(categoryId,toPage)" class="go">GO</a>\n             <span>当前: {{currentPage}} / {{numPages}} 页</span>\n         </div>\n        </div>\n        <div ng-show="fileType == \'1\'" class="bottom_area" style="position: relative; min-height: 80px;">\n           <div class="crop_drop" crop-droppable style = "min-height: 80px;">\n                <p ng-hide="cropMode" class="">拖动图片到此区域剪裁</p>\n             <div class="image_crop">\n                  <img id="target"></img>\n               </div>\n            </div>\n            <div class="fr" style="width: 180px;">\n                <p>*单击图片替换</p>\n                <p>*或拖动图片到左侧区域剪裁</p>\n              <a ng-show="cropMode" class="btn-main" style="width: 105px;position: absolute;bottom: 0;" ng-click="crop()">剪裁并替换</a>\n         </div>\n        </div>\n    </div>\n</div> -->\n<div class="bg_console clearfix" style="background-color:#E7E7E7;">\n   <div class="fl" style="width:188px;">\n      <ul class="nav nav-tabs tabs-left" style="padding-top:0px;"><!-- \'tabs-right\' for right tabs -->\n           <li class="active" ng-click="changeCategory(\'0\')">\n              <a href="" ng-show="fileType == \'0\'" ng-click="systemImages = false;" data-toggle="tab">我的背景</a>\n                <a href="" ng-show="fileType == \'1\'" ng-click="systemImages = false;" data-toggle="tab">我的图片</a>\n            </li>\n         <li>\n              <a href="" ng-show="fileType == \'0\'" ng-click="systemImages = true; changeCategory(\'all\')" data-toggle="tab">背景库</a>\n              <a href="" ng-show="fileType == \'1\'" ng-click="systemImages = true; changeCategory(\'all\')" data-toggle="tab">图片库</a>\n          </li>\n       </ul>\n   </div>\n    <div class="fl" style="width:710px;padding:0 10px;background-color:#FFF;">\n        <div class="tab-content" id="bg_contain">\n         <div class="tab-pane active" ng-show="!systemImages">\n             <div class="img_list" style="padding-bottom: 0px;">\n                   <div class="category_list clearfix">\n                      <ul class="category_list_container clearfix" style="width:610px;float:left;">\n                         <li ng-class="{active: tagIndex == -1}" class="category_item" ng-click="changeCategory(\'0\');">\n                              全部\n                            </li>\n                         <li ng-class="{active: tagIndex == $index}" class="category_item" ng-repeat="myTag in myTags" ng-mouseenter="hoverTag(myTag)" ng-mouseleave="hoverTag(myTag)" ng-click="getImagesByTag(myTag.id, $index)">\n                                {{myTag.name}}<span ng-if="myTag.hovered" ng-click="deleteTag(myTag.id, $index, $event)">x</span>\n                         </li>                       \n                      </ul>\n                     <div class="category_item active" ng-click="createCategory();" style="float:right;">\n                          创建分类\n                      </div>                      \n                  </div>\n                    <div class="edit">\n                        <input type="checkbox" ng-model="allImages.checked" ng-change="selectAll()"/>&nbsp;&nbsp;<span ng-click="deleteImage()"><a href="">删除</a></span>\n                      <div class="btn-group">\n                           <div class="dropdown-toggle"  data-toggle="dropdown" ng-click="setIndex($event);">分类到</div>\n                           <div class="dropdown-menu" role="menu">\n                               <ul forbidden-close>\n                                  <li ng-class="{selecttag: dropTagIndex == $index}" ng-repeat="myTag in myTags" ng-click="selectTag(myTag, $index)"><span>{{myTag.name}}</span></li>\n                                   <li ng-click="createCategory();" class="add_cate clearfix"><em>+</em><span>添加分类</span></li>\n                               </ul>\n                             <div class="fl btn-main" style="width:100%;" ng-click="setCategory(dropTagIndex)"><a href="" style="color:#FFF;">确定</a></div>\n                         </div>\n                        </div>\n                        <div ng-if="tagIndex > -1" style="display: inline-block; margin-left: 20px;"><a href="" ng-click="unsetTag()">取消分类</a></div>\n                  </div>\n                </div>\n            </div>\n            <div class="tab-pane" ng-class="{active: systemImages}" ng-show="systemImages">\n               <div class="img_list">\n                    <div class="category_list">             \n                      <ul class="category_list_container clearfix">\n                         <li class="category_item"  ng-click="changeCategory(\'all\')" ng-class="{active: \'all\' == categoryId}">\n                         最新\n                            </li>\n                         <li ng-class="{active: category.value == categoryId}" class="category_item" ng-repeat="category in categoryList" ng-click="changeCategory(category.value); getChildCategory(category.value);sysTagIndex = -1;">\n                               {{category.name}}\n                         </li>\n                         <li ng-show="fileType == \'0\'" class="category_item"  ng-click="changeCategory(\'c\');numPages=2;" ng-class="{active: \'c\' == categoryId}">\n                         纯色背景\n                          </li>\n                     </ul>   \n                  </div>\n                    <div class="cat_two_list clearfix" ng-if="\'c\' != categoryId && \'all\' != categoryId">\n                      <ul>\n                          <li ng-class="{active: sysTagIndex == $index}" ng-repeat = "childCatrgory in childCatrgoryList" ng-click="getImagesBySysTag(childCatrgory.id, $index, 1, categoryId)" style="cursor:pointer;">\n                                {{childCatrgory.name}}\n                            </li>\n                     </ul>\n                 </div>\n                </div>\n            </div>\n        </div>\n        <div class="img_list" style="padding-top:0px;">\n           <div class="img_list_container" ng-class="{photo_list: fileType == \'1\', bg_list: fileType == \'0\'}">\n               <ul class="img_box clearfix">\n                 <li ng-show="categoryId == \'0\'" class="upload" title="上传图片" ng-click="goUpload(img.path)">\n                      <span class=""><img ng-src="{{CLIENT_CDN}}assets/images/bg_15.jpg" alt="" /></span>\n                   </li>\n                 <li class="imageList" ng-show="fileType == \'0\' && \'c\' != categoryId" ng-repeat="img in imgList track by $index" ng-click="switchSelect(img, $event)" ng-mouseenter="hover(img)" ng-mouseleave="hover(img)" ng-class="{hovercolor: img.showOp || img.selected}" right-click>\n                       <img ng-src="{{PREFIX_FILE_HOST + img.tmbPath}}" />\n                       <div class="edit_content" ng-if="(img.showOp || img.selected) && categoryId == \'0\'">\n                            <div class="select" ng-if="!img.selected && categoryId == \'0\'"><img ng-src="{{CLIENT_CDN}}assets/images/nocheck.jpg"/></div>\n                            <div class="select" ng-if="img.selected && categoryId == \'0\'"><img ng-src="{{CLIENT_CDN}}assets/images/checked.png"/></div>\n                         <div class="del" ng-click="deleteImage(img.id, $event)"><img ng-src="{{CLIENT_CDN}}assets/images/bg_07.png" /></div>\n                          <div ng-if="categoryId == \'0\'" class="set btn-group" class="dropdown-toggle"  data-toggle="dropdown" ng-click="prevent(img, $event)">\n                               <img id="{{img.id}}" ng-src="{{CLIENT_CDN}}assets/images/bg_19.png" />\n                            </div>  \n                          <div class="dropdown-menu set_category" id="{{img.id}}" role="menu">\n                              <ul forbidden-close id="cat_tab">\n                                 <li ng-class="{selecttag: dropTagIndex == $index}" ng-repeat="myTag in myTags" ng-click="selectTag(myTag, $index)"><span>{{myTag.name}}</span></li>\n                                   <li ng-click="createCategory();" class="add_cate clearfix"><em>+</em><span>添加分类</span></li>\n                               </ul>\n                             <div class="fl btn-main" style="width:100%;"><a href="" style="color:#FFF;" ng-click="setCategory(dropTagIndex, img.id)">确定</a></div>\n                         </div>\n                                \n                      </div>\n                    </li>\n                 <li class="imageList" ng-show="fileType == \'1\'"  ng-repeat="img in imgList track by $index" ng-click="switchSelect(img, $event)" ng-mouseenter="hover(img)" ng-mouseleave="hover(img)" ng-class="{hovercolor: img.showOp || img.selected}" right-click>\n                     <img ng-src="{{PREFIX_FILE_HOST + img.tmbPath}}"/>\n                        <div class="edit_content" ng-show="(img.showOp || img.selected) && categoryId == \'0\'">\n                          <div class="select" ng-if="!img.selected && categoryId == \'0\'"><img ng-src="{{CLIENT_CDN}}assets/images/nocheck.jpg"/></div>\n                            <div class="select" ng-if="img.selected && categoryId == \'0\'"><img ng-src="{{CLIENT_CDN}}assets/images/checked.png"/></div>\n                         <div class="del" ng-click="deleteImage(img.id, $event)" ng-click="deleteImg()"><img ng-src="{{CLIENT_CDN}}assets/images/bg_07.png" /></div>\n                           <div class="set btn-group" ng-if="categoryId == \'0\'" class="dropdown-toggle" ng-click="prevent(img, $event)" data-toggle="dropdown">\n                                <img id="{{img.id}}" ng-src="{{CLIENT_CDN}}assets/images/bg_19.png" />\n                            </div>\n                            <div class="dropdown-menu set_category" role="menu">\n                              <ul forbidden-close id="cat_tab">\n                                 <li ng-class="{selecttag: dropTagIndex == $index}" ng-repeat="myTag in myTags" ng-click="selectTag(myTag, $index)"><span>{{myTag.name}}</span></li>\n                                   <li ng-click="createCategory()" class="add_cate clearfix"><em>+</em><span>添加分类</span></li>\n                                </ul>\n                             <div class="fl btn-main" ng-click="setCategory(dropTagIndex, img.id)" style="width:100%;"><a href="" style="color:#FFF;">确定</a></div>\n                         </div>\n                        </div>\n                    </li>\n                 <li class="photo_item" style="background-color: {{img.color}}" ng-show="fileType == \'0\' && \'c\' == categoryId" ng-mouseenter="hover(img)" ng-mouseleave="hover(img)" ng-class="{hovercolor: img.showOp || img.selected, mr0: $index%9 == 8}" ng-click="switchSelect(img, $event)"  ng-repeat="img in imgList track by $index">\n                 </li>\n             </ul>\n         </div>\n            <div class="fanye_foot clearfix" style="margin-top: 20px;">\n               <div class="fr btn-main" ng-click="replaceImage();"><a href="" style="color:#FFF;">确定</a></div>\n               <div class="pagination_container fl">\n                 <pagination style="float: left" class="pagination-sm" previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;" max-size="5" items-per-page="pageSize" total-items="totalItems" ng-model="currentPage" ng-change="getImagesByPage(categoryId, currentPage)" boundary-links="true" rotate="true" num-pages="numPages"></pagination>\n                   <div class="current_page">\n                        <input type="text" ng-model="toPage" ng-keyup="$event.keyCode == 13 ? getImagesByPage(categoryId, toPage) : null">\n                        <a ng-click="getImagesByPage(categoryId,toPage)" class="go">GO</a>\n                        <span>当前: {{currentPage}} / {{numPages}} 页</span>\n                 </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>')
    }]);

    ng.module("scene/console/fake.tpl.html", []).run(["$templateCache", function($templateCache) {
        a.put("scene/console/fake.tpl.html", '<div class="modal-footer">\n  <div class="alert alert-info" role="alert">此功能为高级账号功能，点击按钮免费申请成为高级账号！</div>\n    <a class="btn-main login" target="_blank" style="width: 188px;" ng-href="http://eqxiu.hjtmt.com/forum.php?mod=viewthread&tid=77">免费成为高级账号</a>\n</div>\n<div class="anim_area" style="padding: 0 20px 20px;">\n <img title="点击上方按钮成为高级账号" ng-show="type==\'style\'" src="{{CLIENT_CDN}}assets/images/create/fakestyle.png"/>\n  <img title="点击上方按钮成为高级账号" ng-show="type==\'anim\'" src="{{CLIENT_CDN}}assets/images/create/fakeanim.png"/>\n</div>')
    }]);

    ng.module("scene/console/style.tpl.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("scene/console/style.tpl.html", '<div ng-if="activeTab == \'style\'" ng-controller="StyleConsoleCtrl">\n   <div class="yangshi">\n     <section>\n         <div class="style_list" ng-init="showBasic=true" ng-click="showBasic = !showBasic; showBorder = false; showShadow = false;">\n              <b class="caret" ng-show="showBasic"></b><b class="caret off" ng-show="!showBasic"></b>基础样式\n           </div>\n            <div ng-show="showBasic"  class="style_con_hei">\n              <div class="style_list_angel clearfix">\n                   <div class="">背景颜色</div>\n                  <div class="color_select clearfix" style="margin-top:10px;">\n                      <input class=" flo_right" style="font-size:12px;width:135px;" style-input elem-id="{{elemDef.id}}" ng-model="model.backgroundColor" css-item="backgroundColor" type="text" />\n                     <a class="input_kuang flo_lef" ng-style="{backgroundColor: model.backgroundColor}" ng-model="model.backgroundColor" colorpicker="rgba" ></a>\n                  </div>\n                </div>\n                <div class="style_list_angel clearfix" ng-show="elemDef.type == \'2\' ||elemDef.type == \'8\' || (\'\'+elemDef.type).charAt(0) == \'6\'">\n                 <div class="">文字颜色</div>\n                  <div class="color_select clearfix" style="margin-top:10px;">\n                      <input class=" flo_right" style="font-size:12px;width:135px;" style-input elem-id="{{elemDef.id}}" ng-model="model.color" css-item="color" type="text" />\n                     <a class="input_kuang flo_lef" ng-style="{backgroundColor: model.color}" ng-model="model.color" colorpicker="rgba" ></a>\n\n                    </div>\n                </div>\n                <div class="style_list_angel clearfix">\n                   <div>透明度</div>\n                    <div class="touming clearfix">\n                        <p class="num"><input type="number" min="0" max="100" limit-input style="width:56px;height:24px;border-radius:0px;" style-input elem-id="{{elemDef.id}}" css-item="opacity" ng-model="model.opacity"/>%</p>\n                       <div style="width: 100px;" ui-slider min="0" max="100" ng-model="model.opacity"></div>\n                    </div>\n                </div>                  \n              <div class="style_list_angel clearfix" ng-show="elemDef.type == \'8\' || (\'\'+elemDef.type).charAt(0) == \'6\' || elemDef.type == \'2\' || (\'\'+elemDef.type).charAt(0) == \'5\'">\n                  <div>\n                     边距\n                        <div class="touming clearfix">\n                            <p class="num"><input min="0" max="20" limit-input class="input_kuang short" type="number" style-input css-item="padding" ng-model="model.paddingTop"/>px</p>               \n                          <div style="width: 100px;" ui-slider min="0" max="20" ng-model="model.paddingTop"></div>\n                      </div>\n                    </div>\n                </div>\n                <div class="style_list_angel clearfix" ng-show="elemDef.type == \'8\' || (\'\'+elemDef.type).charAt(0) == \'6\' || elemDef.type == \'2\' || (\'\'+elemDef.type).charAt(0) == \'5\'">\n                  <div>\n                     行高\n                        <div class="touming clearfix">\n                            <p class="num"><input min="0" max="3" limit-input step="0.1" class="input_kuang short" type="number" style-input css-item="lineHeight" ng-model="model.lineHeight"/>倍</p>           \n                          <div style="width: 100px;" use-decimals step="0.1" ui-slider min="0" max="3" ng-model="model.lineHeight"></div>\n                       </div>\n                    </div>\n                </div>                              \n          </div>\n        </section>\n        <section>\n         <div class="style_list" ng-click="showBorder = !showBorder; showBasic=false;showShadow=false;">\n               <b class="caret" ng-show="showBorder"></b><b class="caret off" ng-show="!showBorder"></b>边框样式\n         </div>\n            <div ng-show="showBorder" class="style_con_hei">\n              <div class="style_list_angel clearfix">\n                   边框尺寸\n                  <div class="touming clearfix">\n                        <p class="num"><input class="input_kuang short" limit-input type="number" min="0" max="20" style-input css-item="borderWidth" ng-model="model.borderWidth"/>px</p>              \n                      <div style="width: 100px;" ui-slider min="0" max="20" ng-model="model.borderWidth"></div>\n                 </div>\n                </div>\n                <div class="style_list_angel clearfix">\n                   <div>边框弧度</div>\n                   <!-- <div class="touming clearfix">\n                       <p class="num"><input type="number" min="0" max="100" limit-input style="width:56px;height:24px;border-radius:2px;" style-input css-item="borderRadius" ng-model="model.borderRadiusPerc" />%</p>       \n                      <div class="num" style="width:100px;" ui-slider min="0" max="100" ng-model="model.borderRadiusPerc"></div>\n                    </div> -->\n                    <div class="touming clearfix">\n                        <p class="num"><input class="input_kuang short" type="number" min="0" max="{{maxRadius}}" limit-input style-input css-item="borderRadius" ng-model="model.borderRadius" />px</p>        \n                      <div class="num" style="width:100px;" ui-slider min="0" max="{{maxRadius}}" ng-model="model.borderRadius"></div>\n                  </div>\n                </div>  \n              <div class="style_list_angel clearfix">\n                   <div class="flo_lef">边框样式</div>\n                   <div class="flo_right">\n                       <select style="border:1px solid #ccc" style-input css-item="borderStyle" ng-model="model.borderStyle">\n                            <option value="solid">直线</option>\n                         <option value="dashed">破折线</option>\n                           <option value="dotted">点状线</option>\n                           <option value="double">双划线</option>\n                           <option value="groove">3D凹槽</option>\n                          <option value="ridge">3D垄状</option>\n                           <option value="inset">3D内嵌</option>\n                           <option value="outset">3D外嵌</option>\n                      </select>\n                 </div>\n                </div>\n                <div class="style_list_angel clearfix">\n                   <div class="">边框颜色</div>\n                  <div class="clearfix" style="margin-top:10px;">\n                       <input class="flo_right" style="font-size:12px;width:135px;" style-input ng-model="model.borderColor" css-item="borderColor" type="text" />\n                       <a class="input_kuang flo_lef" ng-style="{backgroundColor: model.borderColor}" ng-model="model.borderColor" colorpicker="rgba"></a>\n                   </div>\n                </div>\n                <div class="style_list_angel clearfix">\n                   <div>\n                     旋转\n                        <div class="touming clearfix">\n                            <p class="num"><input min="0" max="360" limit-input style-input css-item="transform" class="input_kuang short" type="number"  ng-model="model.transform"/>度</p>         \n                          <div style="width: 100px;" ui-slider min="0" max="360" ng-model="model.transform"></div>\n                      </div>\n                    </div>\n                </div>              \n          </div>\n        </section>\n        <section>\n         <div class="style_list" ng-click="showShadow = !showShadow; showBasic=false;showBorder=false;">\n               <b class="caret" ng-show="showShadow"></b><b class="caret off" ng-show="!showShadow"></b>阴影样式\n         </div>\n            <div ng-show="showShadow" class="style_con_hei">\n              <div class="style_list_angel clearfix">\n                   大小\n                    <div class="touming clearfix">\n                        <div style="width: 100px;" ui-slider min="0" max="20" ng-model="tmpModel.boxShadowSize"></div>\n                        <p class="num"><input limit-input class="input_kuang short" min="0" max="20" type="number" style-input css-item="boxShadow" ng-model="tmpModel.boxShadowSize"/>px</p>\n                 </div>\n                </div>\n                <div class="style_list_angel clearfix">\n                   模糊\n                    <div class="touming clearfix">\n                        <div style="width: 100px;" ui-slider min="0" max="20" ng-model="tmpModel.boxShadowBlur"></div>\n                        <p class="num"><input limit-input class="input_kuang short" min="0" max="20" type="number" style-input css-item="boxShadow" ng-model="tmpModel.boxShadowBlur"/>px</p>\n                 </div>\n                </div>\n                <div class="style_list_angel clearfix">\n                   <div class="">颜色</div>\n                    <div class="clearfix" style="margin-top:10px;">\n                       <input class=" flo_right" style="font-size:12px;width:135px;" style-input  ng-model="tmpModel.boxShadowColor" css-item="boxShadow" type="text" />                       \n                      <a class="input_kuang flo_lef" ng-style="{backgroundColor: tmpModel.boxShadowColor}" ng-model="tmpModel.boxShadowColor" colorpicker="rgba" colorpicker-fixed-position="true"></a>\n\n                   </div>\n                </div>  \n              <div class="style_list_angel clearfix">\n                   方向\n                    <div class="clearfix" style="margin-top:15px;">\n                       <div class="fr">\n                          <p class="num" style="margin-top:18px;"><input style="width:58px;margin-right:5px;" min="0" max="359" limit-input class="input_kuang" type="number" style-input css-item="boxShadow" ng-model="tmpModel.boxShadowDirection"/>度</p></div>                    \n                      <angle-knob class="flo_lef" style="display: block;position: relative;height: 60px;margin-left:60px;"></angle-knob>\n                    </div>\n                </div>\n            </div>\n        </section>\n        <div class="modal-footer">\n            <a class="btn-main login" style="width: 120px;" ng-click="clear()">清除全部样式</a>\n     </div>\n    </div>\n</div>\n')
    }]);
    ng.module("scene/console/angle-knob.tpl.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("scene/console/angle-knob.tpl.html", '<div class="sliderContainer">\n  <div class="sliderKnob"></div>\n</div>')
    }]);
    ng.module("scene/console/anim.tpl.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("scene/console/anim.tpl.html", '<div ng-if="activeTab == \'anim\'" ng-controller="AnimConsoleCtrl">\n <div class="anim_area">\n       <div class="style_list_angel clearfix">\n           <div class="flo_lef">动画类型</div>\n           <div class="flo_right"><select style="width:100px;border:1px solid #C9C9C9" ng-model="activeAnim" ng-change="model.type=activeAnim.id; changeAnimation()" ng-options="animType.name for animType in animTypeEnum">\n                <option value="-1">无</option>\n         </select></div>\n           <div ng-show="model.type == 7" class="flo_right" style="clear:both;vertical-align: bottom;"><input type="checkbox" value="" ng-model="model.linear" ng-true-value="1" style="margin-right:3px;" />匀速</div>\n        </div>\n        <div class="row" ng-show="model.type != -1 && model.type != null">          \n          <form role="form">\n                <div class="style_list_angel clearfix" ng-show="model.type == 1 || model.type == 2">\n                  <div class="flo_lef"><label>方向</label></div>\n                  <div class="flo_right"><select style="color:#999" class="form-control" ng-model="direction" ng-change="changeAnimation()" ng-options="animDirection.name for animDirection in animDirectionEnum">\n                 </select></div>\n               </div>\n                <div class="style_list_angel">\n                    <label>动画时间</label>\n                   <div class="touming clearfix">\n                        <p class="num"><input limit-input class="input_kuang short" type="number" step="0.1" min="0" max="20" ng-model="model.duration" />秒</p>\n                       <div class="num" style="width:100px;" ui-slider min="0" max="20" use-decimals step="0.1" ng-model="model.duration"></div>\n                 </div>\n                </div>              \n              <div class="style_list_angel">\n                    <label>延迟时间</label>\n                   <div class="touming clearfix">\n                        <p class="num"><input limit-input class="input_kuang short" type="number" step="0.1" min="0" max="20" class="form-control" ng-model="model.delay" />秒</p>\n                     <div class="num" style="width:100px;" ui-slider min="0" max="20" use-decimals step="0.1" ng-model="model.delay"></div>\n                    </div>\n                </div>\n                <div class="style_list_angel">\n                    <label>动画次数</label>\n                   <div class="touming clearfix">\n                        <p class="num"><input ng-disabled  = "model.count" limit-input class="input_kuang short" type="number" min="1" max="10" class="form-control" ng-model="model.countNum"   />次</p>\n                      <div class="num" style="width:100px;" ui-slider min="0" max="10" ng-model="model.countNum" ng-disabled  = "model.count"></div>\n                    </div>\n                    <div class="" style="text-align:right;margin-top:5px;"><input type="checkbox" value="" id="xunhuan" ng-model="model.count" style="margin-right:3px;" />循环播放</div>               \n              </div>\n            </form>                 \n      </div>\n    </div>\n</div>')
    }]);
    ng.module("scene/console/setting.tpl.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("scene/console/setting.tpl.html", '<div panel-draggable id="comp_setting">\n  <div class="cancel"><a href="" title="关闭" ng-click="cancel()">x</a></div>\n <div class="style_head clearfix">\n     <ul class="clearfix">\n         <li><a ng-click="activeTab = \'style\'" ng-class="{hover:activeTab == \'style\'}">样式</a></li>\n         <li><a ng-click="activeTab = \'anim\'" ng-class="{hover:activeTab == \'anim\'}">动画</a></li>\n       </ul>\n </div>\n    <div class="style_content">\n       <div ng-include="\'scene/console/anim.tpl.html\'"></div>\n      <div ng-include="\'scene/console/style.tpl.html\'"></div>\n     \n  </div>      \n  \n</div>')
    }]);

    ng.module("scene/console/audio.tpl.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("scene/console/audio.tpl.html", '<div class="input_console">\n   <div class="modify_area">\n     <form class="form-horizontal" role="form">\n            <div class="category_list" style="padding-left:198px;">\n               <ul class="category_list_container clearfix">\n                 <li ng-class="{active: category.value == model.bgAudio.type}" class="category_item" ng-repeat="category in categoryList" ng-click="model.bgAudio.type = category.value">\n                      {{category.name}}\n                 </li>\n             </ul>\n         </div>\n            <div ng-if="model.bgAudio.type == \'1\'" class="audio_area clearfix">\n             <span class="control-label" style="padding-top:12px;padding-right:5px;">链接地址</span>\n               <input class="" type="text" ng-model="model.type1" placeholder="请输入mp3文件链接" style="width:280px;height:35px;line-height:35px;border:1px solid #E7E7E7;border-radius:0px;padding-left:5px;font-size:12px;" />\n           </div>\n            <div ng-if="model.bgAudio.type == \'2\'" class="audio_area clearfix" style="height:auto;">\n                <select class="float-lf selectcartoon" ng-change="selectAudio(2)" ng-model="model.selectedMyAudio" ng-options="myAudio.name for myAudio in myAudios" id="nb_musicurl" style="padding-left:5px;width:280px;">\n                  <option value="">选择我的音乐</option>\n              </select>\n             <span class="btn-main" ng-click="goUpload()">上传音乐</span>\n              <!-- <span ng-show="model.type2">\n                 <a class="glyphicon glyphicon-play" ng-click="playAudio(1);" title="试听">\n                      <audio id="audition1" ng-src="{{model.type2}}"></audio>\n                   </a>\n                  <a class="glyphicon glyphicon-pause" ng-click="pauseAudio(1);" title="暂停">\n                    </a>  \n                </span> -->\n               <div ng-if = "model.type2" style = "margin-top:10px;">\n                    <audio ng-src="{{model.type2}}" controls="controls">\n                  </audio>                                \n              </div>\n                <!-- <span class="btn-main" ng-click="goUpload()">上传音乐</span> -->\n         </div>\n            <div ng-if="model.bgAudio.type == \'3\'" class="audio_area clearfix">\n             <select class="float-lf selectcartoon" ng-change="selectAudio(3)" ng-model="model.selectedAudio" ng-options="reservedAudio.name for reservedAudio in reservedAudios" id="nb_musicurl" style="padding-left:5px;width:280px;height:35px;line-height:35px;border:1px solid #E7E7E7;">\n                    <option value="">选择音乐库文件</option>\n             </select>\n             <!-- <span ng-show="model.type3">\n                 <a class="glyphicon glyphicon-play" ng-click="playAudio(2);" title="试听">\n                      <audio id="audition2" ng-src="{{model.type3}}"></audio>\n                   </a>\n                  <a class="glyphicon glyphicon-pause" ng-click="pauseAudio(2);" title="暂停">\n                    </a>\n              </span>   -->   \n              <div ng-if = "model.type3" style = "margin-top:10px;">\n                    <audio  ng-src="{{model.type3}}" controls="controls">\n                 </audio>                                \n              </div>\n            </div>\n        </form>\n   </div>\n</div>\n<div class="modal-footer">\n    <a class="btn-main login" style="width: 88px;" ng-click="confirm()">确定</a>\n    <a class="btn-grey0 cancel" style="width: 88px;" ng-click="cancel()">取消</a>\n</div>')
    }]);
    ng.module("scene/console/input.tpl.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("scene/console/input.tpl.html", '<div class="input_console">\n   <div class="modify_area">\n     <span class="label">输入框名称：</span>\n     <input type="text" maxlength="15" ng-model="model.title" ng-keyup="$event.keyCode == 13 ? confirm() : null"/>\n     <input type="checkbox" id="checkbox_required" ng-model="model.required" ng-true-value="required" style="margin-top:0;margin-left:5px;" />\n     <label for="checkbox_required" style="font-weight: lighter; margin:0;font-size:12px;">必填</label>\n  \n      <div class="customized_container">\n            <input type="radio" id="input_name" ng-model="model.type" ng-change="model.title=\'姓名\'" value="501" /><label for="input_name" style="font-weight: lighter; margin: 0;">姓名</label>\n            <input type="radio" id="input_phone" ng-model="model.type" ng-change="model.title=\'手机\'" value="502" /><label for="input_phone" style="font-weight: lighter; margin: 0;" />手机</label>\n            <input type="radio" id="input_email" ng-model="model.type" ng-change="model.title=\'邮箱\'" value="503" /><label for="input_email" style="font-weight: lighter; margin: 0;">邮箱</label>\n          <input type="radio" id="input_text" ng-model="model.type" ng-change="model.title=\'文本\'" value="5" /><label for="input_text" style="font-weight: lighter; margin: 0;">文本</label>\n      </div>\n    </div>\n</div>\n<div class="modal-footer">\n    <a class="btn-main login" style="width: 88px;" ng-click="confirm()">确定</a>\n    <a class="btn-grey0 cancel" style="width: 88px;" ng-click="cancel()">取消</a>\n</div>')
    }]);
    ng.module("scene/console/button.tpl.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("scene/console/button.tpl.html", '<div class="button_console">\n    <div class="modify_area">\n     <span class="label">按钮名称：</span>\n      <input type="text" maxlength="15" ng-model="model.title" ng-keyup="$event.keyCode == 13 ? confirm() : null"/>\n </div>\n    \n</div>\n<div class="modal-footer">\n    <a class="btn-main login" style="width: 88px;" ng-click="confirm()">确定</a>\n    <a class="btn-grey0 cancel" style="width: 88px;" ng-click="cancel()">取消</a>\n</div>')
    }]);
    ng.module("scene/console/tel.tpl.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("scene/console/tel.tpl.html", '<div class="button_console">\n    <div class="modify_area  tel_title">\n      <span ng-repeat = "button in buttons track by $index" ng-class = "{spanborder: $index == btnIndex}">\n          <!-- <a ng-class = "{btn1: $index==0, btn2: $index == 1, btn3: $index ==2, btn4: $index ==3}" ng-click = "chooseTelButton(button, $index, $event)" selected><span class = "glyphicon glyphicon-earphone"></span>{{button.text}}</a> -->\n           <a ng-style = "button.btnStyle" ng-click = "chooseTelButton(button, $index, $event)" selected>{{button.text}}</a>\n     </span>\n   </div>\n    <div class = "divider" style = "margin-top: 10px; height: 1px; background: #ccc;"></div>\n  <div class="modify_area">\n     <span class="label" style="font-weight:lighter;">按钮名称：&nbsp;</span>\n       <input type="text" ng-model="model.title" ng-keyup="$event.keyCode == 13 ? confirm() : null"/>\n    </div>\n\n  <div class="modify_area">\n     <span class="label" style="font-weight:lighter;">手机/电话：</span>\n        <input class = "tel-button" type="text" placeholder = "010-88888888" ng-model="model.number" ng-keyup="$event.keyCode == 13 ? confirm() : null" ng-focus = "removePlaceHolder($event)" ng-blur = "addPlaceHolder()"/>\n </div>\n    \n</div>\n<div class="modal-footer">\n    <a class="btn-main login" style="width: 88px;" ng-click="confirm()">确定</a>\n    <a class="btn-grey0 cancel" style="width: 88px;" ng-click="cancel()">取消</a>\n</div>')
    }]);
    ng.module("scene/console/pic_lunbo.tpl.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("scene/console/pic_lunbo.tpl.html", '<div class="pic_lunbo_console input_console">\n    <div class="modify_area">\n        <div class="row">\n            <div class="col-sm-7">\n                <div class="row" style="margin:0px -15px 10px -15px;">\n                    <div class="col-sm-5" style="line-height: 35px; vertical-align: middle; text-align: center;">图集样式</div>\n                    <div class="col-sm-7">\n                        <select class="" style="font-size:12px;padding-left:3px;width:150px;">\n                            <option value="1">图片轮播</option>\n                        </select>\n                    </div>\n                </div>\n                <div class="row" style="margin:10px -15px;">\n                    <div class="col-sm-5" style="line-height: 35px; vertical-align: middle; text-align: center;">自动播放</div>\n                    <div class="col-sm-7" style="font-size: 30px; color: #9ad64b;text-align:left;">\n                        <span class="fa fa-toggle-on" style="cursor: pointer;" ng-show="isAutoPlay" ng-click="autoPlay(false)"></span>\n                        <span class="fa fa-toggle-off" style="cursor: pointer;" ng-hide="isAutoPlay" ng-click="autoPlay(true)"></span>\n                    </div>\n                </div>\n                <div class="row" style="margin: 10px -15px;">\n                    <div class="col-sm-5" style="text-align: center;">\n                        <a style="border-radius:3px;width:88px;" class="btn-main btn-success" ng-click="choosePic()">选择图片</a>\n                    </div>\n                    <div class="col-sm-7" style="font-size:12px; line-height: 35px;text-align:left;">\n                        <div>最多可选择6张图片</div>\n                    </div>\n                </div>\n            </div>\n            <div class="col-sm-5">\n                <div class="well" style="margin-bottom: 0;">\n                    <img class="scratch" style="height: 100px; width: 100%;" ng-src="{{CLIENT_CDN}}assets/images/u2462.png">\n                </div>\n            </div>\n        </div>\n        <div class="row" style="margin-top: 20px;" ng-hide="imgList.length">\n            <div class="col-sm-12">\n                <div class="divider" style="height: 1px; background: #ddd;"></div>\n            </div>\n        </div>\n        <div class="panel panel-default lunbo_upload" style="margin:20px 15px 0 15px;" ng-show="imgList.length">\n            <div class="panel-body">\n                <div style="margin: 10px 0; height: 66px;" ng-repeat="img in imgList track by $index">\n                    <div style="border-radius: 5px; overflow: hidden; width: 66px; height: 66px; float: left;">\n                        <img style="width: 100%; height: 100%;" ng-src="{{fileDomain + img.src}}">\n                    </div>\n                    <textarea placeholder="添加描述功能暂不开放" rows="4" disabled style="width: 75%; float: left; margin: 0 10px;" maxlength="150" ng-model="img.desc">{{img.desc}}</textarea>\n                    <div style="line-height: 66px; text-align: center; float: right;">\n                        <span class="glyphicon glyphicon-remove-circle" style="font-size: 30px; vertical-align: middle; cursor: pointer; color: orange;" ng-click="remove($index)"></span>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n\n<div class="modal-footer">\n    <a class="btn-main login" style="width: 88px;" ng-click="ok()">确定</a>\n    <a class="btn-grey0 cancel" style="width: 88px;" ng-click="cancel()">取消</a>\n</div>')
    }]);
    ng.module("scene/console/video.tpl.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("scene/console/video.tpl.html", '<div class="video_console">\n    <div class="modify_area" style="height:auto">\n     <div>\n         <span class="label">视频通用代码：</span>\n            <span class="video_code"><a href="http://eqxiu.hjtmt.com/forum.php?mod=viewthread&tid=678&page=1&extra=#pid2706" target="_blank"><ins>什么是视频通用代码？</ins></a></span>\n     </div>\n        <div class="video_tip">\n           <textarea style="border-radius:0px;" class = "video_src" ng-model="model.src" ng-keyup="$event.keyCode == 13 ? confirm() : null"/>\n        </div>\n        <div class="video_tip">将视频的通用代码粘贴到文本框里即可。<a href="http://eqxiu.hjtmt.com/forum.php?mod=viewthread&tid=678&page=1&extra=#pid2706" target="_blank"><ins>查看帮助</ins></a></div>\n        <div class="video_tip">建议使用视频：<a href="http://www.youku.com/" target="_blank"><ins>优酷</ins></a>、<a href="http://www.tudou.com/" target="_blank"><ins>土豆</ins></a>、<a href="http://v.qq.com/" target="_blank"><ins>腾讯视频</ins></a></div>\n    </div>  \n</div>\n<div class="modal-footer">\n    <a class="btn-main login" style="width: 88px;" ng-click="confirm()">确定</a>\n    <a class="btn-grey0 cancel" style="width: 88px;" ng-click="cancel()">取消</a>\n</div>')
    }]);
    ng.module("scene/console/link.tpl.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("scene/console/link.tpl.html", '<div class = "link-modal">   \n  <div class = "row" style = "font-size: 14px; text-align:center;">\n     <div class="input_console">\n           <div class = "modify_area" style="text-align:left;padding-left:110px;">\n               <div style="margin-bottom:20px;">\n                 <input type="radio" name="externalRadio" id="externalRadio" ng-model = "url.link" value="external" ng-change = "changed()" style="margin:0px;">\n                       网站地址：\n                 <input class = "" style="height:35px;width:280px;" type="text" ng-model = "url.externalLink" name="externalLink" id="externalLink" placeholder = "网站地址" ng-disabled = "url.link == \'internal\'" ng-change = "selectRadio(\'external\')"/>\n                    <a style = "font-size: 16px;display: inline-block; margin-top: 5px;background-image: url(\'assets/images/create/delete.png\'); width: 14px; height: 14px;" ng-show = "url.link == \'external\'" class = "delete-link" ng-click = "removeLink(\'external\')"></a>\n              </div>\n                <div class = "" >\n                 <input type="radio" name="internalRadio" id="internalRadio" value="internal" ng-model = "url.link" ng-change = "changed()" style="margin:0px;">\n                       场景页面：\n                 <select style = "border:1px solid #E7E7E7; height: 35px;width:280px;" ng-model = "url.internalLink" ng-options = "page.name for page in pageList" ng-disabled = "url.link == \'external\'" ng-change = "selectRadio(\'internal\')"></select>\n                  <a style = "display: inline-block;font-size: 16px; background-image: url(\'assets/images/create/delete.png\'); width: 14px; height: 14px;" ng-show = "url.link == \'internal\'" ng-click = "removeLink(\'internal\')"></a>\n                </div>\n            </div>\n        </div>\n        <div class = "modal-footer">\n          <a type = "button" style="width:88px" class = "btn  btn-main" ng-click = "confirm()">确定</a>\n           <a type = "button" style="width:88px" class = "btn  btn-grey0" ng-click = "cancel()">取消</a>\n       </div>\n    </div>\n</div>')
    }]);
    ng.module("scene/console/microweb.tpl.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("scene/console/microweb.tpl.html", '<div class="button_console">\n    <div class="modify_area">\n     <div>导航样式:\n            <ul>\n              <li ng-click = "selectColor(color)" ng-class = "{colorborder: model.color == color.backgroundColor}" style = "display: inline-block; margin: 10px;" ng-repeat = "color in backgroundColors"><div style = "width: 50px; height: 30px; margin: 10px; cursor:pointer;" ng-style = "color"></div></li>\n            </ul>\n     </div>\n    </div>\n    <div class = "divider" style = "margin-top: 10px; height: 1px; background: #ccc;"></div>\n  <div class="modify_area">\n     <div>\n         <ul class="clearfix" style="left:50%;margin-left:-160px;position:relative;height:65px;">\n              <li class = "title_color" ng-class = "{colorborder:labelIndex == $index && labelName.mousedown,selectedcolor: labelName.selected,whitecolor: labelName.color.backgroundColor == \'#fafafa\'}" ng-click = "switchLabel(labelName, $index)" style = "display: inline-block;float:left;" ng-repeat = "labelName in labelNames"><div style = "margin: 10px; width:50px; height: 30px;line-height:30px; border: 1px solid #ccc; cursor: pointer;" ng-style = "labelName.color">{{labelName.title}}</div></li>\n          </ul>\n     </div>\n        <span class="label">导航名称：</span>\n      <input type="text" ng-model="model.title" ng-change = "changeLabelName()" ng-keyup="$event.keyCode == 13 ? confirm() : null" placeholder = "导航名称" maxlength = "4"/>\n   </div>\n\n  <div class="modify_area">\n     <span class="label">链接页面：</span>\n      <select style = "width: 181px; height: 30px; display: inline-block;" ng-model = "model.link" ng-options = "page.name for page in pageList" ng-change = "selectLink(model.link)"></select>\n </div>\n\n  <div class="modify_area" style = "color: #ff0000">\n        至少选择两个标签，并分别添加链接\n  </div>\n    \n</div>\n<div class="modal-footer">\n    <a class="btn-main login" style="width: 88px;" ng-click="confirm()">确定</a>\n    <a class="btn-grey0 cancel" style="width: 88px;" ng-click="cancel()">取消</a>\n</div>')
    }]);
    ng.module("scene/console/map.tpl.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("scene/console/map.tpl.html", '<div class="map_console">\n <div id="l-map"></div>\n    <div class="search_area">\n     <div class="input-group">\n       <input type="text" class="form-control" ng-model="search.address" ng-keyup="$event.keyCode == 13 ? searchAddress() : null" placeholder="请输入地名">\n       <span class="input-group-btn">\n          <button ng-click="searchAddress()" class="btn btn-default" type="button">搜索</button>\n        </span>\n     </div><!-- /input-group -->\n       <div id="r-result">\n           <ul class="list-group">\n               <li class="list-group-item" ng-repeat="address in searchResult" ng-click="setPoint(address.point.lat, address.point.lng, address.address)">\n                   {{address.address}} \n              </li>\n         </ul>\n     </div>\n    </div>\n</div>\n<div class="modal-footer">\n    <a class="btn-main login" style="width: 88px;" ng-click="resetAddress()">确定</a>\n    <a class="btn-grey0 cancel" style="width: 88px;" ng-click="cancel()">取消</a>\n</div>');
    }]);
    ng.module("scene/console/category.tpl.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("scene/console/category.tpl.html", '<div class="category_input">\n <input type="text" ng-model="category.name" placeholder="分类名称" />\n</div>\n<div class="modal-footer">\n    <a class="btn-main login" style="width: 88px;" ng-click="confirm()">确定</a>\n</div>')
    }]);
    ng.module("scene/console/cropimage.tpl.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("scene/console/cropimage.tpl.html", '\n\n<div class="cropimage" style="">\n   <!-- <img ng-src="{{PREFIX_FILE_HOST + imgUrl}}"/> -->\n    <div class="image_crop">\n      <img id="target"></img>\n   </div>\n    <div class="crop_close">\n      <a class=" btn-main" href="" ng-click="crop()">确定</a>\n     <a class=" btn-main" href="" ng-click="cancel()">取消</a>\n   </div>\n</div>')
    }]);

    ng.module("templates-common", [
        "directives/toolbar.tpl.html"
    ]);
    ng.module("directives/toolbar.tpl.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("directives/toolbar.tpl.html", '<div class="btn-toolbar" id="btn-toolbar"  data-role="editor-toolbar">\n    <div class="btn-group">\n        <div class="dropdown">\n            <a class="btn dropdown-toggle first-child" data-toggle="dropdown" title="文字大小">\n                <i class="glyphicon glyphicon-text-width">\n                </i>\n                &nbsp;\n                <b class="caret">\n                </b>\n            </a>\n            <ul class="dropdown-menu size-menu">\n                <li>\n                    <a dropdown-toggle data-edit="fontSize 7">\n                        48px\n                    </a>\n                </li>\n                <li>\n                    <a dropdown-toggle data-edit="fontSize 6">\n                        32px\n                    </a>\n                </li>\n                <li>\n                    <a dropdown-toggle data-edit="fontSize 5">\n                        24px\n                    </a>\n                </li>\n                <li>\n                    <a dropdown-toggle data-edit="fontSize 4">\n                        18px\n                    </a>\n                </li>\n                <li>\n                    <a dropdown-toggle data-edit="fontSize 3">\n                        16px\n                    </a>\n                </li>\n                <li>\n                    <a dropdown-toggle data-edit="fontSize 2">\n                        13px\n                    </a>\n                </li>\n                <li>\n                    <a dropdown-toggle data-edit="fontSize 1">\n                        12px\n                    </a>\n                </li>\n            </ul>\n        </div>\n    </div>\n    <div class="btn-group">\n        <div class="dropdown">\n            <a class="btn dropdown-toggle" data-toggle="dropdown" title="文字颜色">\n                <i class="glyphicon glyphicon-font color-btn">\n                </i>\n                &nbsp;\n                <b class="caret">\n                </b>\n            </a>\n            <ul class="dropdown-menu color-menu">\n            </ul>\n        </div>\n    </div>\n    <div class="btn-group">\n        <div class="dropdown">\n            <a class="btn dropdown-toggle" data-toggle="dropdown" title="文字背景颜色">\n                <i class="glyphicon glyphicon-font bgcolor-btn">\n                </i>\n                &nbsp;\n                <b class="caret">\n                </b>\n            </a>\n            <ul class="dropdown-menu bgcolor-menu">\n            </ul>\n        </div>\n    </div>\n    <div class="btn-group">\n        <a class="btn" data-edit="bold" title="文字加粗">\n            <i class="glyphicon glyphicon-bold">\n            </i>\n        </a>\n    </div>\n    <div class="btn-group">\n        <a class="btn" data-edit="justifyleft" title="文字居左">\n            <i class="glyphicon glyphicon-align-left">\n            </i>\n        </a>\n        <a class="btn" data-edit="justifycenter" title="文字居中">\n            <i class="glyphicon glyphicon-align-center">\n            </i>\n        </a>\n        <a class="btn" data-edit="justifyright" title="文字居右">\n            <i class="glyphicon glyphicon-align-right">\n            </i>\n        </a>\n    </div>\n    <div class="btn-group">\n        <div class="dropdown">\n            <a class="btn dropdown-toggle createLink" data-toggle="dropdown" sceneid = "{{sceneId}}" title="先选中要加连接的文字"><i class="fa fa-link"></i></a>\n            <div class="dropdown-menu input-append" style="min-width: 335px;padding:4px 4px 14px 19px;">\n                <div class = "span4" style="margin-top:10px;">\n                    <input name = "external" ng-model = "link" class = "span2" type = "radio" value = "external" style="vertical-align:middle;margin:0px;"> 网站地址：\n                    <input class="span2" placeholder="URL" sceneid="{{sceneId}}" type="text" data-edit="createLink" value = "http://" style="border-radius:0px;width:200px;height:35px;" />\n                </div>\n                <!-- <input class="span2" placeholder="URL" sceneid="{{sceneId}}" type="text" data-edit="createLink" value="http://"/>   --> \n                <div class = "span4" style = "margin-top: 10px;">\n                     <input name = "internal" ng-model = "link" class = "span2" type = "radio" value = "internal" style="vertical-align:middle;margin:0px;"> 场景页面：\n                    <select class = "span2" style = "width: 200px;height:35px;" ng-options = "page.name for page in internalLinks" sceneid="{{sceneId}}" data-edit = "createLink" pageid="{{internalLink.id}}" ng-model = "internalLink"></select> \n                </div>           \n                <div style="text-align:center"><a class="btn-main" style="color:#FFF; margin-top:20px;" dropdown-toggle>确定</a></div>\n            </div>\n        </div>        \n    </div>\n    <div class="btn-group">\n        <a class="btn" data-edit="unlink" title="清除超链接"><i class="fa fa-unlink"></i></a>\n    </div>\n    <div class="btn-group">\n        <a class="btn last-child" data-edit="RemoveFormat" title="清除样式">\n            <i class="fa fa-eraser">\n            </i>\n        </a>\n    </div>\n</div>')
    }]);

}(window, window.angular);