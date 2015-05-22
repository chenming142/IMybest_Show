!function(win, ng, undefined) {
    ng.module("services.mine", []);
    ng.module("services.mine").factory("MineService", ["$http", function($http) {
        var mineFactory = {};
        mineFactory.getMyScenes = function(b, pageNo, pageSize) {
            var url = "m/scene/my";
            b && (url += "/" + b);
            url += "?pageNo=" + (pageNo ? pageNo : 1);
            url += "&pageSize=" + (pageSize ? pageSize : 12);
            url += (/\?/.test(url) ? "&" : "?") + "time=" + new Date().getTime();
            $http({
                withCredentials: !0,
                method: "GET",
                url: PREFIX_URL + url
            });
        };
        return mineFactory;
    }]);

    ng.module("I18N.MESSAGES", []).constant("I18N.MESSAGES", {
        "notify.success": "success",
        "notify.info": "info",
        "notify.danger": "danger",
        "notify.warning": "warning",
        "errors.route.changeError": "Route change error",
        "crud.user.save.success": "A user with id '{{id}}' was saved successfully.",
        "crud.user.remove.success": "A user with id '{{id}}' was removed successfully.",
        "crud.user.remove.error": "Something went wrong when removing user with id '{{id}}'.",
        "crud.user.save.error": "Something went wrong when saving a user...",
        "crud.project.save.success": "A project with id '{{id}}' was saved successfully.",
        "crud.project.remove.success": "A project with id '{{id}}' was removed successfully.",
        "crud.project.save.error": "Something went wrong when saving a project...",
        "login.reason.notAuthorized": "离开久了，麻烦再登录一次吧！",
        "login.reason.notAuthenticated": "离开久了，麻烦再登录一次吧！",
        "login.error.invalidCredentials": "登录失败，请检查邮箱和密码是否正确。",
        "login.error.serverError": "There was a problem with authenticating: {{exception}}.",
        "register.error.serverError": "There was a problem with authenticating: {{exception}}.",
        "login.reset.notmatch": "新密码和重复密码不匹配",
        "register.error.match": "两次输入密码不一致",
        "register.error.agreement": "请先同意注册协议再完成注册",
        "file.bg.pageSize": "18",
        "scene.save.success.published": "场景已保存成功！",
        "scene.save.success.nopublish": "保存成功，还需要发布哦！",
        "scene.publish.success": "发布成功！",
        "branch.open.success": "账号打开成功！",
        "branch.close.success": "账号关闭成功！",
        "dept.create.success": "部门创建成功！",
        "scene.setting.success": "场景设置成功！"
    });
    ng.module("services.localizedMessages", []).factory("localizedMessages", ["$interpolate", "I18N.MESSAGES", function($interpolate, i18nMessages) {
        var c = function(a, b) {
            return a || "?" + b + "?"
        };
        return {
            get: function(d, e) {
                var f = i18nMessages[d];
                return f ? $interpolate(f)(e) : c(f, d);
            }
        }
    }]);
    ng.module("services.notifications", []).factory("notifications", ["$rootScope", function(a) {
        var c = {
                STICKY: [],
                ROUTE_CURRENT: [],
                ROUTE_NEXT: []
            },
            d = {},
            e = function(a, c) {
                if (!b.isObject(c)) throw new Error("Only object can be added to the notification service");
                return a.push(c), c
            };
        return a.$on("$routeChangeSuccess", function() {
            c.ROUTE_CURRENT.length = 0, c.ROUTE_CURRENT = b.copy(c.ROUTE_NEXT), c.ROUTE_NEXT.length = 0
        }), d.getCurrent = function() {
            return [].concat(c.STICKY, c.ROUTE_CURRENT)
        }, d.pushSticky = function(a) {
            return e(c.STICKY, a)
        }, d.pushForCurrentRoute = function(a) {
            return e(c.ROUTE_CURRENT, a)
        }, d.pushForNextRoute = function(a) {
            return e(c.ROUTE_NEXT, a)
        }, d.remove = function(a) {
            b.forEach(c, function(b) {
                var c = b.indexOf(a);
                c > -1 && b.splice(c, 1)
            })
        }, d.removeAll = function() {
            b.forEach(c, function(a) {
                a.length = 0
            })
        }, d
    }]);
    ng.module("services.i18nNotifications", ["services.notifications", "services.localizedMessages"]);
    ng.module("services.i18nNotifications").factory("i18nNotifications", ["localizedMessages", "notifications", function(a, c) {
        var d = function(c, d, e, f) {
                return b.extend({
                    message: a.get(c, e),
                    type: a.get(d, e)
                }, f)
            },
            e = {
                pushSticky: function(a, b, e, f) {
                    return c.pushSticky(d(a, b, e, f))
                },
                pushForCurrentRoute: function(a, b, e, f) {
                    return c.pushForCurrentRoute(d(a, b, e, f))
                },
                pushForNextRoute: function(a, b, e, f) {
                    return c.pushForNextRoute(d(a, b, e, f))
                },
                getCurrent: function() {
                    return c.getCurrent()
                },
                remove: function(a) {
                    return c.remove(a)
                }
            };
        return e
    }]);

    ng.module("services.history", []).factory("historyService", ["$rootScope", function ($rootScope) {
        var HistoryService = {}, PageHistorys = {}, PageHistory = {};
        HistoryService.addPage = function (tplPageId, elements) {
            if (!PageHistorys[tplPageId]) {
                PageHistorys[tplPageId] = {currentPos: 0, inHistory: !1, pageHistory: []};
                HistoryService.addPageHistory(tplPageId, elements);
            }
            $rootScope.$broadcast("history.changed");
            return JSON.parse(PageHistorys[tplPageId].pageHistory[PageHistorys[tplPageId].currentPos]);
        };
        HistoryService.addPageHistory = function (tplPageId, elements) {
            PageHistory = PageHistorys[tplPageId];
            if (PageHistory.inHistory) {
                PageHistory.inHistory = !1;
                PageHistory.pageHistory.length = PageHistory.currentPos + 1
            }
            var elementTpl = JSON.stringify(elements);
            if (elementTpl != PageHistory.pageHistory[PageHistory.pageHistory.length - 1]) {
                PageHistory.pageHistory.push(elementTpl);
            }
            PageHistory.currentPos = PageHistory.pageHistory.length - 1;
            $rootScope.$broadcast("history.changed");
        };
        HistoryService.clearHistory = function () {
            PageHistorys = {};
        };
        HistoryService.canBack = function (tplPageId) {
            PageHistory = PageHistorys[tplPageId];
            return PageHistory.currentPos > 0;
        };
        HistoryService.canForward = function (tplPageId) {
            PageHistory = PageHistorys[tplPageId];
            return PageHistory.currentPos < PageHistory.pageHistory.length - 1;
        };
        HistoryService.back = function (tplPageId) {
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
        HistoryService.forward = function (tplPageId) {
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
    ng.module("services.scene").factory("sceneService", ["$http", "$rootScope", "$modal", "$q", "$cacheFactory", "historyService", function ($http, $rootScope, $modal, $q, $cacheFactory, historyService) {
        function addComponentHandle(type, component, gFlag) {
            var li = JsonParser.wrapComp(component, "edit");
            $("#nr .edit_area").append(li);
            for (var interceptors = JsonParser.getInterceptors(), i = 0; i < interceptors.length; i++) {
                interceptors[i](li, component);
            }
            JsonParser.getEventHandlers()[("" + type).charAt(0)](li, component);
            if ("g101" != gFlag) {
                historyService.addPageHistory(CurPageTplInfo.obj.id, CurPageTplInfo.obj.elements);
                $rootScope.$broadcast("dom.changed");
            }
        }//m

        function editableHandle(element, component) {
            $(element).css("cursor", "text");
            if (!$(element).parents("li").hasClass("inside-active")) {
                $(element).bind("click", function (event) {
                    event.stopPropagation()
                });
            }
            $(document).bind("mousedown", function () {
                $(element).css("cursor", "default");
                $("#btn-toolbar").find("input[type=text][data-edit]").blur();
                if ($("#btn-toolbar"))$("#btn-toolbar").remove();
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
            openModal(component, function (modal) {
                component.properties.src = modal.data;
                var rate = modal.width / modal.height,
                    $component = $("#" + component.id);
                if ($component.length > 0) {
                    var width = $("#inside_" + component.id).width(), height = $("#inside_" + component.id).height(), r = width / height;
                    if (rate >= r) {
                        $component.outerHeight(height);
                        $component.outerWidth(height * rate);

                        $component.css("marginLeft", -($component.outerWidth() - width) / 2);
                        $component.css("marginTop", 0);
                    } else {
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
                    if (modal.width > $("#nr .edit_area").width()) {
                        modal.width = $("#nr .edit_area").width();
                        modal.height = modal.width / rate;
                    }
                    if (modal.height > $("#nr .edit_area").height()) {
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
            }, function () {
                component.properties.src || (CurPageElementInfo.splice(CurPageElementInfo.indexOf(I[component.id]), 1), delete I[component.id]);
            })
        }//p
        function bgHandle(component) {
            openModal(component, function (data) {
                var $target = $("#nr .edit_area").parent()[0];
                if ("imgSrc" == data.type) {
                    var imgSrc = data.data;
                    $target.style.backgroundImage = "url(" + PREFIX_FILE_HOST + imgSrc + ")";
                    component.properties.bgColor = null;
                    component.properties.imgSrc = imgSrc;
                }
                if ("backgroundColor" == data.type) {
                    $target.style.backgroundImage = "none";
                    $target.style.backgroundColor = data.color;
                    component.properties.imgSrc = null;
                    component.properties.bgColor = data.color;
                }
                historyService.addPageHistory(CurPageTplInfo.obj.id, CurPageTplInfo.obj.elements);
                $("#editBG").unbind("click");
                $("#editBG").show().bind("click", function () {
                    bgHandle(component);
                });
            }, function () {
            });
        }//x
        function inputHandle(component) {
            if (!Modal) {
                Modal = $modal.open({
                    windowClass: "console",
                    templateUrl: "scene/console/input.tpl.html",
                    controller: "InputConsoleCtrl",
                    resolve: {
                        obj: function () {
                            return component;
                        }
                    }
                }).result.then(function (data) {
                        Modal = null;
                        data.type && (component.type = data.type);

                        component.properties.placeholder = data.title;
                        component.properties.required = data.required;
                        component.title = data.title;

                        if ($("#" + component.id).length > 0) {
                            $("#" + component.id).attr("placeholder", data.title);
                            $("#" + component.id).attr("required", data.required);
                        } else {
                            addComponentHandle(component.type, component);
                        }
                    }, function () {
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
                    obj: function () {
                        return component;
                    }
                }
            }).result.then(function (data) {
                    component.properties.title = data.title;
                    var title = data.title.replace(/ /g, "&nbsp;");
                    $("#" + component.id).html(title);
                });
        }//r
        function telHandle(component) {
            if (!Modal) {
                Modal = $modal.open({
                    windowClass: "console",
                    templateUrl: "scene/console/tel.tpl.html",
                    controller: "TelConsoleCtrl",
                    resolve: {
                        obj: function () {
                            return component;
                        }
                    }
                }).result.then(function (data) {
                        Modal = null;
                        component.properties.title = data.title;
                        component.properties.number = data.number;
                        data.title.replace(/ /g, "&nbsp;");
                        $.extend(!0, component.css, b.btnStyle);
                        $("#" + component.id).length > 0 && $("#" + component.id).parents("li").remove();

                        addComponentHandle(component.type, component);
                    }, function () {
                        Modal = null;
                        $("#" + component.id).length || (CurPageElementInfo.splice(CurPageElementInfo.indexOf(I[component.id]), 1), delete I[component.id]);
                    });
            }
        }//s
        function carouselHandle(component) {
            if (!Modal) {
                Modal = $modal.open({
                    windowClass: "console",
                    templateUrl: "scene/console/pic_lunbo.tpl.html",
                    controller: "picsCtrl",
                    resolve: {
                        obj: function () {
                            return component;
                        }
                    }
                }).result.then(function (data) {
                        Modal = null;
                        component.properties = data;
                        var element = $("#inside_" + component.id);
                        element.length && element.remove();

                        addComponentHandle(component.type, component);
                    }, function () {
                        Modal = null;
                        $("#" + component.id).length || (CurPageElementInfo.splice(CurPageElementInfo.indexOf(I[component.id]), 1), delete I[component.id]);
                    })
            }
        }//u
        function videoHandle(component) {
            if (Modal) {
                $modal.open({
                    windowClass: "console",
                    templateUrl: "scene/console/video.tpl.html",
                    controller: "VideoCtrl",
                    resolve: {
                        obj: function () {
                            return component;
                        }
                    }
                }).result.then(function (data) {
                        Modal = null;
                        component.properties.src = data;
                        if (!$("#" + component.id).length) {
                            addComponentHandle(component.type, component);
                        }
                    }, function () {
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
                    obj: function () {
                        return component;
                    }
                }
            }).result.then(function (data) {
                    if (data && "http://" != data) {
                        if (isNaN(b)) {
                            component.properties.url = PREFIX_S1_URL + "eqs/link?id=" + component.sceneId + "&url=" + encodeURIComponent(data)
                        } else {
                            component.properties.url = data;
                            console.log(data);
                        }
                        $("#inside_" + component.id).find(".fa-link").removeClass("fa-link").addClass("fa-anchor");
                    } else {
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
                    obj: function () {
                        if (!component.properties.labels) {
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
            }).result.then(function (data) {
                    if ($("#" + component.id).length > 0) {
                        component.properties.labels = [];
                        ng.forEach(data, function (d) {
                            delete d.selected;
                            delete d.mousedown;
                            delete d.$$hashKey;
                            component.properties.labels.push(d);
                        });
                        $("#" + component.id).parents("li").remove();
                        addComponentHandle(component.type, component);
                    } else {
                        component.css = {left: "0px", width: "100%", bottom: "0px", height: "50px", zIndex: 999};
                        component.properties.labels = [];
                        ng.forEach(data, function (d) {
                            delete d.selected;
                            delete d.mousedown;
                            delete d.$$hashKey;
                            component.properties.labels.push(d);
                        });
                        position = null;
                        addComponentHandle(component.type, component);
                    }
                }, function () {
                    if (!$("#" + component.id).length) {
                        CurPageElementInfo.splice(CurPageElementInfo.indexOf(I[component.id]), 1);
                        delete I[component.id];
                        console.log(component)
                    }
                });
        }//w
        function audioHandle() {
            if (!Modal) {
                Modal = $modal.open({
                    windowClass: "console",
                    templateUrl: "scene/console/audio.tpl.html",
                    controller: "AudioConsoleCtrl",
                    resolve: {
                        obj: function () {
                            return CurPageTplInfo.obj.scene.image && CurPageTplInfo.obj.scene.image.bgAudio ? CurPageTplInfo.obj.scene.image.bgAudio : {};
                        }
                    }
                }).result.then(function (data) {
                        Modal = null;
                        if ("bgAudio" == data.compType) {
                            if (!CurPageTplInfo.obj.scene.image)CurPageTplInfo.obj.scene.image = {};
                            CurPageTplInfo.obj.scene.image.bgAudio = data.bgAudio;
                        }
                    }, function () {
                        Modal = null;
                    });
            }
        }//y

        function openModal(component, successFn, failFn) {
            if (!Modal) {
                var fileType = "0";
                if (3 == component.type)fileType = "0";
                if (4 == component.type)fileType = "1";
                Modal = $modal.open({
                    windowClass: "console img_console",
                    templateUrl: "scene/console/bg.tpl.html",
                    controller: "BgConsoleCtrl",
                    resolve: {
                        obj: function () {
                            return {fileType: fileType, elemDef: component}
                        }
                    }
                }).result.then(function (data) {
                        Modal = null;
                        successFn(data);
                    }, function (data) {
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

        function reParseElements(elements) {
            CurPageTplInfo.obj.elements = elements;
            $("#nr").empty();
            JsonParser.parse({
                def: CurPageTplInfo.obj,
                appendTo: "#nr",
                mode: "edit"
            });
            $("#editBG").hide();
            for (var elem in elements) {
                if (3 == elements[elem].type) {
                    $("#editBG").show();
                    break;
                }
            }
            $rootScope.$broadcast("dom.changed");
        }//i
        function revisePosition(originalElemDef, copyElemDef) {
            var top = parseInt(originalElemDef.css.top.substring(0, originalElemDef.css.top.length - 2), 10) + 34 * SceneService.sameCopyCount,
                left = parseInt(originalElemDef.css.left.substring(0, originalElemDef.css.left.length - 2), 10);
            if (top + 34 > $("#nr .edit_area").outerHeight()) {
                copyElemDef.css.top = top + "px";
                copyElemDef.css.left = left + 10 + "px"
            } else {
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
            if ($maxIndex.length > 0) {
                curIndex = parseInt($maxIndex.css("z-index"), 10) + 1;
            } else {
                if ($last.length > 0) {
                    curIndex = parseInt($last.css("z-index"), 10) + 1;
                } else {
                    curIndex = 101;
                }
            }
            if (b) {
                b.zIndex = curIndex;
                return b;
            }
            if ($last.length <= 0) {
                cssProps = {top: "30px", left: "0px"};
            } else {
                if ($last.position().top + $last.outerHeight() > $("#nr .edit_area").outerHeight() - 10) {
                    cssProps = {top: $last.position().top, left: $last.position().left + 10 + "px"};
                } else {
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
                getRandomUId = function () {
                    for (var uid = Math.ceil(1e3 * Math.random()), b = 0; b < CurPageElementInfo.length; b++) {
                        if (CurPageElementInfo[b].id == uid) return getRandomUId();
                    }
                    return uid;
                },
                rndUid = getRandomUId(),
                elemData = {};
            switch (("" + type).charAt(0)) {
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
                        for (var h = 0; h < CurPageElementInfo.length; h++) {
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
                        properties: {bgColor: null, imgSrc: null},
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
                        properties: {width: "100px", height: "100px", src: ""},
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
                        properties: {title: "一键拨号", number: ""},
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
            switch (type) {
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
            if ("g101" == type) {
                inputData.push(setInputData("501"));
                inputData.push(setInputData("502"));
                inputData.push(setInputData("503"));
                inputData.push(setInputData("601"));
            }
            return inputData;
        }//n

        {
            var SceneService = {}, JsonParser = IMybest_Show.templateParser("jsonParser"), CurPageTplInfo = null, CurPageElementInfo = null, I = {};
        }

        SceneService.historyBack = function () {
            if (historyService.canBack(CurPageTplInfo.obj.id)) {
                CurPageElementInfo = historyService.back(CurPageTplInfo.obj.id);
                reParseElements(CurPageElementInfo);
            }
        };
        SceneService.historyForward = function () {
            if (historyService.canForward(CurPageTplInfo.obj.id)) {
                CurPageElementInfo = historyService.forward(CurPageTplInfo.obj.id);
                reParseElements(CurPageElementInfo);
            }
        };
        SceneService.copyElement = function (elemDefTpl) {
            var copyElemDef = ng.copy(elemDefTpl);
            q = !0;
            SceneService.originalElemDef = elemDefTpl;
            SceneService.copyElemDef = copyElemDef;
        };
        SceneService.pasteElement = function (originalElemDef, copyElemDef) {
            copyElemDef.id = Math.ceil(100 * Math.random());
            copyElemDef.pageId = CurPageTplInfo.obj.id;
            if (SceneService.pageId == copyElemDef.pageId) {
                revisePosition(originalElemDef, copyElemDef);
            } else {
                SceneService.sameCopyCount = 0;
                copyElemDef.css = ng.copy(originalElemDef.css);
            }
            var finalElem = ng.copy(copyElemDef);
            CurPageElementInfo.push(finalElem);
            I[finalElem.id] = finalElem;
            addComponentHandle(finalElem.type, finalElem);
            SceneService.pageId = CurPageTplInfo.obj.id;
        };
        $(document).keydown(function (event) {
            if ($("#nr .edit_area").length) {
                if ((event.ctrlKey || event.metaKey) && 90 == event.keyCode)SceneService.historyBack();//z
                if ((event.ctrlKey || event.metaKey) && 89 == event.keyCode)SceneService.historyForward();//y
                if ((event.ctrlKey || event.metaKey)
                    && SceneService.elemDefTpl
                    && !$("#btn-toolbar")[0]
                    && !$(".modal-dialog")[0]) {
                    if (86 == event.keyCode) {//v
                        event.preventDefault();
                        if (q)SceneService.pasteElement(SceneService.originalElemDef, SceneService.copyElemDef);
                    }
                    if (67 == event.keyCode) {//c
                        event.preventDefault();
                        SceneService.pageId = CurPageTplInfo.obj.id;
                        SceneService.sameCopyCount = 0;
                        SceneService.copyElement(SceneService.elemDefTpl);
                    }
                }
                $rootScope.$apply();
            }
        });
        SceneService.resetCss = function () {
            $("#nr .edit_area li").each(function (key, value) {
                var component = I[value.id.replace(/inside_/g, "")];
                if (component) {
                    if (!component.css)component.css = {};
                    component.css.zIndex = value.style.zIndex ? value.style.zIndex : "0";
                }
            });
        };
        var createCompGroup = SceneService.createCompGroup = function (type, b) {
            for (var inputData = setG101Data(type), e = 0; e < inputData.length; e++) {
                var elementData = setElementData(inputData[e].type, b, inputData[e]);
                b = null;
                addComponentHandle(inputData[e].type, elementData, "g101");
            }
            historyService.addPageHistory(CurPageTplInfo.obj.id, CurPageTplInfo.obj.elements);
            $rootScope.$broadcast("dom.changed");
        }
        SceneService.createComp = function (type, b) {
            var elementData;
            switch (("" + type).charAt(0)) {
                case "1":
                    if ($(".comp_title").length > 0) {
                        alert("已存在一个标签");
                    } else {
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
        SceneService.updateCompSize = function (elementId, props) {
            for (var d = 0; d < CurPageElementInfo.length; d++) {
                if ("inside_" + CurPageElementInfo[d].id == elementId) {
                    if (!CurPageElementInfo[d].css)CurPageElementInfo[d].css = {};
                    CurPageElementInfo[d].css.width = props.width;
                    CurPageElementInfo[d].css.height = props.height;

                    CurPageElementInfo[d].properties.width = props.width;
                    CurPageElementInfo[d].properties.height = props.height;
                    if (props.imgStyle)CurPageElementInfo[d].properties.imgStyle = props.imgStyle;
                    //h.addPageHistory(CurPageTplInfo.obj.id, CurPageElementInfo)
                }
            }
            $rootScope.$apply();
        };
        SceneService.updateCompPosition = function (elementId, props) {
            for (var d = 0; d < CurPageElementInfo.length; d++) {
                if ("inside_" + CurPageElementInfo[d].id == elementId) {
                    if (CurPageElementInfo[d].css) {
                        CurPageElementInfo[d].css.left = props.left;
                        CurPageElementInfo[d].css.top = props.top;
                        //h.addPageHistory(CurPageTplInfo.obj.id, CurPageElementInfo);
                    } else {
                        CurPageElementInfo[d].css = props;
                        //h.addPageHistory(CurPageTplInfo.obj.id, CurPageElementInfo);
                    }
                }
            }
            $rootScope.$apply();
        };
        SceneService.updateCompAngle = function (elementId, angle) {
            for (var d = 0; d < CurPageElementInfo.length; d++) {
                if ("inside_" + CurPageElementInfo[d].id == elementId) {
                    if (CurPageElementInfo[d].css) {
                        CurPageElementInfo[d].css.transform = "rotateZ(" + angle + "deg)"
                    } else {
                        CurPageElementInfo[d].css = {};
                    }
                    //h.addPageHistory(CurPageTplInfo.obj.id, CurPageElementInfo);
                }
            }
            $rootScope.$apply();
        };


        var Modal = null, GlobalEvt = null;
        JsonParser.addInterceptor(function (wrapComponent, element, mode) {
            function generatePopMenu() {
                var $popMenu = $('<ul id="popMenu" class="dropdown-menu" style="min-width: 100px; display: block;" role="menu" aria-labelledby="dropdownMenu1"><li class="edit" role="presentation"><a role="menuitem" tabindex="-1"><div class="glyphicon glyphicon-edit" style="color: #08a1ef;"></div>&nbsp;&nbsp;编辑</a></li><li class="style" role="presentation"><a role="menuitem" tabindex="-1"><div class="fa fa-paint-brush" style="color: #08a1ef;"></div>&nbsp;&nbsp;样式</a></li><li class="animation" role="presentation"><a role="menuitem" tabindex="-1"><div class="fa fa-video-camera" style="color: #08a1ef;"></div>&nbsp;&nbsp;动画</a></li><li class="link" role="presentation"><a role="menuitem" tabindex="-1"><div class="fa fa-link" style="color: #08a1ef;"></div>&nbsp;&nbsp;链接</a></li><li class="copy" role="presentation" style="margin-bottom:5px;"><a role="menuitem" tabindex="-1"><div class="fa fa-copy" style="color: #08a1ef;"></div>&nbsp;&nbsp;复制</a></li><li class="cut" role="presentation" style="margin-bottom:5px;"><a role="menuitem" tabindex="-1"><div class="fa fa-cut" style="color: #08a1ef;"></div>&nbsp;&nbsp;裁剪</a></li><li role="presentation" class="bottom_bar"><a title="上移一层"><div class="up" style="display: inline-block; width: 26px;height: 22px; background: url(http://static.parastorage.com/services/skins/2.1127.3/images/wysiwyg/core/themes/editor_web/button/fpp-buttons-icons4.png) 0px -26px no-repeat;"></div></a><a title="下移一层"><div class="down" style="display: inline-block; width: 26px;height: 22px; background: url(http://static.parastorage.com/services/skins/2.1127.3/images/wysiwyg/core/themes/editor_web/button/fpp-buttons-icons4.png) 0px -80px no-repeat;"></div></a><a title="删除"><div class="remove" style="display: inline-block; width: 26px;height: 22px; background: url(http://static.parastorage.com/services/skins/2.1127.3/images/wysiwyg/core/themes/editor_web/button/fpp-buttons-icons4.png) 0px -1px no-repeat;"></div></a></li></ul>')
                    .css({position: "absolute", "user-select": "none"});
                if (q) {
                    $popMenu.find(".copy").after($('<li class="paste" role="presentation"><a role="menuitem" tabindex="-1"><div class="fa fa-paste" style="color: #08a1ef;"></div>&nbsp;&nbsp;粘贴</a></li>'));
                }

                $popMenu.find(".edit").click(function (event) {
                    event.stopPropagation();
                    switch (element.type.toString().charAt(0)) {
                        case "1":
                            break;
                        case "2":
                            editableHandle(wrapComponent.find(".element").get(0), element);
                            break;
                        case "3":
                            break;
                        case "4":
                            imageHandle(element);
                            break;
                        case "5":
                            inputHandle(element);
                            break;
                        case "6":
                            buttonHandle(element);
                            break;
                        case "7":
                            break;
                        case "8":
                            telHandle(element);
                            break;
                        case "9":
                            break;
                        case "g":
                            break;
                        case "p":
                            carouselHandle(element);
                            break;
                        case "v":
                            videoHandle(element);
                            break;
                    }
                    $popMenu.hide();
                });
                $popMenu.find(".style").click(function (event) {
                    if (true) {
                        event.stopPropagation();
                        activeStyleTab(element, function (b) {
                            if (1 == element.type) {
                                for (var label in element.properties.labels) {
                                    if (b.backgroundColor) {
                                        element.properties.labels[label].color.backgroundColor = b.backgroundColor;
                                        $(".label_content").css("background-color", b.backgroundColor);
                                    }
                                    if (b.color) {
                                        element.properties.labels[label].color.color = b.color;
                                        $(".label_content").css("color", b.color);
                                    }
                                }
                            } else {
                                $(".element-box", wrapComponent).css(b);
                                $.extend(!0, element.css, b);
                            }
                        });
                    } else {
                        event.stopPropagation();
                        $modal.open({
                            windowClass: "console",
                            templateUrl: "scene/console/fake.tpl.html",
                            controller: "FakeConsoleCtrl",
                            resolve: {
                                type: function () {
                                    return "style";
                                }
                            }
                        });
                    }
                    $popMenu.hide();
                });
                $popMenu.find(".animation").click(function (event) {
                    event.stopPropagation();
                    activeAnimTab(element, function (a) {
                        element.properties.anim = a;
                    });
                    $popMenu.hide();
                });
                $popMenu.find(".link").click(function (event) {
                    event.stopPropagation();
                    linkHandle(element);
                    $popMenu.hide();
                });

                $popMenu.find(".remove").click(function (event) {
                    event.stopPropagation();
                    historyService.addPageHistory(CurPageTplInfo.obj.id, CurPageElementInfo);
                    wrapComponent.remove();
                    CurPageElementInfo.splice(CurPageElementInfo.indexOf(I[element.id]), 1);
                    historyService.addPageHistory(CurPageTplInfo.obj.id, CurPageElementInfo);
                    INTERVAL_OBJ[element.id] && (clearInterval(INTERVAL_OBJ[element.id]), delete INTERVAL_OBJ[element.id]);
                    $popMenu.hide();
                    $rootScope.$apply();
                    $rootScope.$broadcast("hideStylePanel");
                });
                $popMenu.find(".down").click(function () {
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
                $popMenu.find(".up").click(function () {
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
                $popMenu.find(".copy").click(function (event) {
                    event.stopPropagation();
                    SceneService.sameCopyCount = 0;
                    SceneService.pageId = CurPageTplInfo.obj.id;
                    if (!$(".modal-dialog")[0])SceneService.copyElement(element);
                    $popMenu.hide();
                });
                $popMenu.find(".paste").click(function (event) {
                    event.stopPropagation();
                    if (!$(".modal-dialog")[0])SceneService.pasteElement(SceneService.originalElemDef, SceneService.copyElemDef);
                    $popMenu.hide();
                });
                $popMenu.find(".cut").click(function (event) {
                    event.stopPropagation();
                    activeCrop(element);
                    $popMenu.hide();
                });

                if (4 != element.type) {
                    $popMenu.find(".link").hide();
                    $popMenu.find(".cut").hide();
                }
                if ("p" == element.type) {
                    $popMenu.find(".animation").hide();
                    $popMenu.find(".style").hide();
                }
                return $popMenu;
            }

            if ("view" != mode) {
                var $eq_main = $("#eq_main");
                wrapComponent.on("click contextmenu", ".element-box", function (event) {
                    event.stopPropagation();
                    //TODO: SceneService.elemDefTpl
                    if (!$("#btn-toolbar")[0])SceneService.elemDefTpl = ng.copy(element);
                    if ($("#comp_setting:visible").length > 0 && "p" != element.type) {
                        console.log("-----$rootScope.showStylePanel-------");
                        SceneService.currentElemDef = element;
                        $rootScope.$broadcast("showStylePanel");
                    }
                    var PopMenu = generatePopMenu(), $popMenu = $("#popMenu");
                    if ($popMenu.length > 0)$popMenu.remove();
                    $eq_main.append(PopMenu);
                    PopMenu.css({
                        left: event.pageX + $eq_main.scrollLeft() + 15,
                        top: event.pageY + $eq_main.scrollTop()
                    }).show();
                    $eq_main.mousemove(function (event) {
                        if (event.pageX < PopMenu.offset().left - 20
                            || event.pageX > PopMenu.offset().left + PopMenu.width() + 20
                            || event.pageY < PopMenu.offset().top - 20
                            || event.pageY > PopMenu.offset().top + PopMenu.height() + 20) {
                            PopMenu.hide();
                            $(this).unbind("mousemove");
                        }
                    });
                    return !1;
                });
                wrapComponent.attr("title", "按住鼠标进行拖动，点击鼠标进行编辑")
            }
        });
        JsonParser.bindEditEvent("1", function (element, component) {
            $(element).unbind("dblclick");
            $(element).show().bind("dblclick", function () {
                microwebHandle(component);
            });
        });
        JsonParser.bindEditEvent("2", function (element, component) {
            var target = $(".element", element)[0];
            $(target).mousedown(function (event) {
                $(this).parents("li").hasClass("inside-active") && event.stopPropagation();
            });
            $(target).bind("contextmenu", function (event) {
                $(this).parents("li").hasClass("inside-active")
                    ? event.stopPropagation()
                    : $(this).blur();
            });
            target.addEventListener("dblclick", function (event) {
                editableHandle(target, component);
                $("#popMenu").hide();
                event.stopPropagation();
            });
        });
        JsonParser.bindEditEvent("3", function (element, component) {
            $("#editBG").unbind("click");
            $("#editBG").show().bind("click", function () {
                bgHandle(component);
            });
        });
        JsonParser.bindEditEvent("v", function (element, component) {
            var target = $(".element", element)[0];
            $(target).unbind("dblclick");
            $(target).bind("dblclick", function () {
                videoHandle(component);
                $("#popMenu").hide();
            })
        });
        JsonParser.bindEditEvent("4", function (element, component) {
            var target = $(".element", element)[0];
            $(target).unbind("dblclick");
            $(target).bind("dblclick", function () {
                imageHandle(component);
                $("#popMenu").hide()
            })
        });
        JsonParser.bindEditEvent("5", function (element, component) {
            var target = $(".element", element)[0];
            $(target).unbind("dblclick");
            $(target).bind("dblclick", function () {
                inputHandle(element);
                $("#popMenu").hide();
            });
        });
        JsonParser.bindEditEvent("p", function (element, component) {
            var target = $(".element", element)[0];
            $(target).unbind("dblclick");
            $(target).bind("dblclick", function () {
                carouselHandle(component);
                $("#popMenu").hide();
            })
        });
        JsonParser.bindEditEvent("6", function (element, component) {
            var target = $(".element", element)[0];
            $(target).unbind("dblclick");
            $(target).bind("dblclick", function () {
                buttonHandle(component);
                $("#popMenu").hide()
            });
        });
        JsonParser.bindEditEvent("7", function (element, component) {
            var target = $(".element", element)[0];
            target.addEventListener("click", function () {
                if (!Modal) {
                    $modal.open({
                        windowClass: "",
                        templateUrl: "scene/console/map.tpl.html",
                        controller: "MapConsoleCtrl"
                    }).result.then(function (data) {
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
        JsonParser.bindEditEvent("8", function (element, component) {
            var target = $(".element", element)[0];
            $(target).unbind("dblclick");
            $(target).bind("dblclick", function () {
                telHandle(component);
                $("#popMenu").hide()
            });
        });
        SceneService.templateEditor = JsonParser;

        SceneService.getScenePages = function (sceneId) {
            var url = "m/scene/pageList/" + sceneId + "?date=" + (new Date).getTime();
            return $http({
                withCredentials: !0,
                method: "GET",
                url: PREFIX_URL + url
            });
        };
        SceneService.getSceneByPage = function (pageId, isNewPage, d) {
            var url = "";
            if (isNewPage || d) {
                url = "m/scene/createPage/" + pageId;
                if (d)url += "?copy=true";
            } else {
                url = "m/scene/design/" + pageId;
            }
            var defer = $q.defer(), tt = new Date;
            url += (/\?/.test(url) ? "&" : "?") + "time=" + tt.getTime();
            $http({
                withCredentials: !0,
                method: "GET",
                url: PREFIX_URL + url
            }).then(function (a) {
                defer.resolve(a);
                CurPageTplInfo = a.data;
                CurPageTplInfo.obj.elements || (CurPageTplInfo.obj.elements = []);
                CurPageElementInfo = CurPageTplInfo.obj.elements;
                for (var b = 0; CurPageElementInfo && b < CurPageElementInfo.length; b++) I[CurPageElementInfo[b].id] = CurPageElementInfo[b];
            }, function (a) {
                defer.reject(a)
            });
            return defer.promise;
        };
        SceneService.getSceneTpl = function (pageTplId) {
            var tplCache = $cacheFactory.get("tplCache") ? $cacheFactory.get("tplCache") : $cacheFactory("tplCache"),
                defer = $q.defer();

            if (tplCache.get(pageTplId)) {
                var pageTplInfo = $.extend(!0, {}, tplCache.get(pageTplId));
                if (pageTplInfo.data.obj.scene
                    && pageTplInfo.data.obj.scene.image
                    && pageTplInfo.data.obj.scene.image.bgAudio) {
                    if (!CurPageTplInfo.obj.scene.image)CurPageTplInfo.obj.scene.image = {};
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
                var url = "m/scene/pageTpl/" + pageTplId, tt = new Date;
                url += (/\?/.test(url) ? "&" : "?") + "time=" + tt.getTime();
                $http({
                    withCredentials: !0,
                    method: "GET",
                    url: PREFIX_URL + url
                }).then(function (data) {
                    tplCache.put(data.data.obj.id, $.extend(!0, {}, data));

                    if (data.data.obj.scene
                        && data.data.obj.scene.image
                        && data.data.obj.scene.image.bgAudio) {
                        if (!CurPageTplInfo.obj.scene.image)CurPageTplInfo.obj.scene.image = {};
                        CurPageTplInfo.obj.scene.image.bgAudio = data.data.obj.scene.image.bgAudio
                    }
                    for (var b = 0; b < data.data.obj.elements.length; b++) {
                        var element = data.data.obj.elements[b];
                        element.id = Math.ceil(100 * Math.random());
                        element.sceneId = CurPageTplInfo.obj.sceneId;
                        element.pageId = CurPageTplInfo.obj.id;
                    }
                    CurPageElementInfo = data.data.obj.elements;
                    for (var f = 0; f < CurPageElementInfo.length; f++) {
                        I[CurPageElementInfo[f].id] = CurPageElementInfo[f];
                    }
                    defer.resolve(data)
                }, function (data) {
                    defer.reject(data);
                });
            }
            return defer.promise;
        };
        SceneService.getElements = function () {
            return CurPageElementInfo;
        };
        SceneService.getSceneObj = function () {
            return CurPageTplInfo;
        };
        SceneService.savePageNames = function (info) {
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

        SceneService.saveScene = function (json) {
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

    ng.module("confirm-dialog", []).controller("ConfirmDialogCtrl", ["$scope", "confirmObj", function ($scope, confirmObj) {
        $scope.confirmObj = confirmObj;
        $scope.ok = function () {$scope.$close();};
        $scope.cancel = function () {$scope.$dismiss();}
    }]);
    ng.module("message-dialog", []).controller("MessageDialogCtrl", ["$scope", "msgObj", function ($scope, msgObj) {
        $scope.msgObj = msgObj;
        $scope.close = function () {$scope.$close();};
        $scope.cancel = function () {$scope.$dismiss();}
    }]);
    ng.module("services.modal", ["confirm-dialog", "message-dialog"]).factory("ModalService", ["$modal", function ($modal) {
        var modal = {};
        modal.openConfirmDialog = function (data, successFn, failFn) {
            $modal.open({
                backdrop: "static",
                keyboard: !1,
                backdropClick: !1,
                windowClass: "confirm-dialog",
                templateUrl: "dialog/confirm.tpl.html",
                controller: "ConfirmDialogCtrl",
                resolve: {
                    confirmObj: function () {
                        return data;
                    }
                }
            }).result.then(successFn, failFn);
        };
        modal.openMsgDialog = function (data, successFn, failFn) {
            $modal.open({
                backdrop: "static",
                keyboard: !1,
                backdropClick: !1,
                windowClass: "message-dialog",
                templateUrl: "dialog/message.tpl.html",
                controller: "MessageDialogCtrl",
                resolve: {
                    msgObj: function () {
                        return data;
                    }
                }
            }).result.then(successFn, failFn);
        };
        return modal;
    }]);

    ng.module("services.pagetpl", []);
    ng.module("services.pagetpl").factory("pageTplService", ["$http", "$rootScope", "$modal", "$q", function (a) {
        var PageTplService = {};
        PageTplService.getPageTpls = function (b) {
            var c = "m/scene/pageTplList/" + b,
                d = new Date;
            return c += (/\?/.test(c) ? "&" : "?") + "time=" + d.getTime(), a({
                withCredentials: !0,
                method: "GET",
                url: PREFIX_URL + c
            })
        };
        PageTplService.getMyTplList = function (b) {
            var c = "/m/scene/pageList/" + b,
                d = new Date;
            return c += (/\?/.test(c) ? "&" : "?") + "time=" + d.getTime(), a({
                withCredentials: !0,
                method: "GET",
                url: PREFIX_URL + c
            })
        };
        PageTplService.getPageTplTypes = function () {
            var b = "base/class/tpl_page",
                c = new Date;
            return b += (/\?/.test(b) ? "&" : "?") + "time=" + c.getTime(), a({
                withCredentials: !0,
                method: "GET",
                url: PREFIX_URL + b
            })
        };
        PageTplService.getPageTagLabel = function (b) {
            var c = "m/scene/tag/sys/list?type=1";
            null != b && (c += (/\?/.test(c) ? "&" : "?") + "bizType=" + b);
            var d = new Date;
            return c += (/\?/.test(c) ? "&" : "?") + "time=" + d.getTime(), a({
                withCredentials: !0,
                method: "GET",
                url: PREFIX_URL + c
            })
        };
        PageTplService.getPageTagLabelCheck = function (b) {
            var c = "/m/scene/tag/page/list?id=" + b,
                d = new Date;
            return c += (/\?/.test(c) ? "&" : "?") + "time=" + d.getTime(), a({
                withCredentials: !0,
                method: "GET",
                url: PREFIX_URL + c
            })
        };
        PageTplService.getPageTplTypestemp = function (b, c) {
            var d = "m/scene/tpl/page/list/",
                e = new Date;
            return null != b && (d += (/\?/.test(d) ? "&" : "?") + "tagId=" + b), null != c && (d += (/\?/.test(d) ? "&" : "?") + "bizType=" + c), d += (/\?/.test(d) ? "&" : "?") + "time=" + e.getTime(), a({
                withCredentials: !0,
                method: "GET",
                url: PREFIX_URL + d
            })
        };
        PageTplService.updataChildLabel = function (b, c) {
            var d = "/m/eqs/tag/page/set/?ids=" + b;
            null != c && (d += (/\?/.test(d) ? "&" : "?") + "pageId=" + c);
            var e = new Date;
            return d += (/\?/.test(d) ? "&" : "?") + "time=" + e.getTime(), a({
                withCredentials: !0,
                method: "POST",
                url: PREFIX_URL + d
            })
        };
        return PageTplService;
    }]);
}(window, window.angular);
