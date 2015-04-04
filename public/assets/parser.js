!function(win, ng, undefined){
    !function(win){
        var IMybest_Show = win.IMybest_Show || (win.IMybest_Show = {});
        function setTemplateParser(win){
            function ensureObject(win, name, constructor){
                return win[name] || (win[name] = constructor());
            }

            var IMybest_Show = ensureObject(win, "IMybest_Show", Object);

            return ensureObject(IMybest_Show, "templateParser", function(){
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
        getTemplateParser();
    }(win, document),

    function(IMybest_Show){
        function calculate(width, height, w, h){
            var dimension = {},
                rate = width / height,
                pRate = w / h;
            rate > pRate
                ? (dimension.width = w, dimension.height = w / rate )
                : (dimension.height = h, dimension.width = h * rate);
            return dimension;
        }

        var JSONParser = IMybest_Show.templateParser("jsonParser", function(){
            function ensure(entity){
                return function(prop, val){
                    entity[prop] = val;
                }
            }
            function wrapComponent(comp, mode){
                var component = components[("" + comp.type).charAt(0)](comp);
                if(component){
                    var element = $('<li comp-drag comp-rotate class="comp-resize comp-rotate inside" id="inside_' + component.id + '" num="' + comp.num + '" ctype="' + comp.type + '"></li>');
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
    }(win.IMybest_Show);
}(window, window.angular);