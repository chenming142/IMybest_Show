/**
 * Zepto swipeSlide Plugin
 * 西门 http://ons.me/500.html
 * 20141007 v2.0
 */

;(function($){
    'use strict';
    $.fn.swipeSlide = function(options,callback){
        var _index = 0,
            _startX = 0,
            _startY = 0,
            _moveX = 0,
            _moveY = 0,
            _moveDistance = 0,
            _curX = 0,
            _curY = 0,
            autoScroll,
            _touchDistance = 50,
            _loadPicNum = 0,
            firstMovePrev = true,
            $this = $(this),
            opts = $.extend({}, {
                ul : $this.children('ul'),              // 父dom
                li : $this.children().children('li'),   // 子dom
                continuousScroll : false,               // 连续滚动
                autoSwipe : true,                       // 自动切换
                speed : 4000,                           // 切换速度
                axisX : true,                           // X轴
                transitionType : 'ease',                // 过渡类型
                lazyLoad : false,                       // 懒加载
                clone: true,                            // 是否要克隆li
                width: 0,                               // 轮播的宽度
                length: 0                               // li的个数
            }, options || {}),
            _liWidth = opts.width || opts.li.width(),
            _liHeight = opts.li.height(),
            _liLength = opts.length || opts.li.length;
        callback = callback || function(){};

        // 初始化
        (function(){
            // 连续滚动，需要复制dom
            if(opts.continuousScroll){
                if(opts.clone) opts.ul.prepend(opts.li.last().clone()).append(opts.li.first().clone());
                if(opts.axisX){
                    fnTranslate(opts.ul.children().first(),_liWidth*-1);
                    fnTranslate(opts.ul.children().last(),_liWidth*_liLength);
                }else{
                    fnTranslate(opts.ul.children().first(),_liHeight*-1);
                    fnTranslate(opts.ul.children().last(),_liHeight*_liLength);
                }
            }

            // 懒加载图片
            if(opts.lazyLoad){
                var i = 0;
                if(opts.continuousScroll){
                    _loadPicNum = 3;
                }else{
                    _loadPicNum = 2;
                }
                for(i; i < _loadPicNum; i++){
                    fnLazyLoad(i);
                }
            }

            // 给初始图片定位
            if(opts.axisX){
                opts.li.each(function(i){
                    fnTranslate($(this),_liWidth*i);
                });
            }else{
                opts.li.each(function(i){
                    fnTranslate($(this),_liHeight*i);
                });
            }

            // 自动滚动
            fnAutoSwipe();

            // 回调
            callback(_index, autoScroll);

            // 绑定触摸
            $this.on('touchstart',function(e){
                e.stopPropagation();
                fnTouches(e);
                fnTouchstart(e);
            });
            $this.on('touchmove',function(e){
                e.stopPropagation();
                fnTouches(e);
                fnTouchmove(e);
            });
            $this.on('touchend',function(e){
                e.stopPropagation();
                fnTouchend();
            });
        })();

        // css过渡
        function fnTransition(dom,num){
            dom.css({
                '-webkit-transition':'all '+num+'s '+opts.transitionType,
                'transition':'all '+num+'s '+opts.transitionType
            });
        }

        // css滚动
        function fnTranslate(dom,result){
            if(opts.axisX){
                dom.css({
                    '-webkit-transform':'translate3d(' + result + 'px,0,0)',
                    'transform':'translate3d(' + result + 'px,0,0)'
                });
            }else{
                dom.css({
                    '-webkit-transform':'translate3d(0,' + result + 'px,0)',
                    'transform':'translate3d(0,' + result + 'px,0)'
                });
            }
        }

        // 懒加载图片
        function fnLazyLoad(index){
            if(opts.lazyLoad){
                var $img = opts.ul.find('[data-src]');
                if($img.length > 0){
                    var $thisImg = $img.eq(index);
                    if($thisImg.data('src')){
                        if($thisImg.is('img')){
                            $thisImg.attr('src',$thisImg.data('src')).data('src','');
                        }else{
                            $thisImg.css({'background-image':'url('+$thisImg.data('src')+')'}).data('src','');
                        }
                    }
                }
            }
        }

        // touches
        function fnTouches(e){
            if(!e.touches){
                e.touches = e.originalEvent.touches;
            }
        }

        // touchstart
        function fnTouchstart(e){
            _startX = e.touches[0].pageX;
            _startY = e.touches[0].pageY;
        }

        // touchmove
        function fnTouchmove(e){
            e.preventDefault();
            if(opts.autoSwipe && autoScroll){
                clearInterval(autoScroll);
            }
            _curX = e.touches[0].pageX;
            _curY = e.touches[0].pageY;
            _moveX = _curX - _startX;
            _moveY = _curY - _startY;
            fnTransition(opts.ul,0);
            if(opts.axisX){
                if(!opts.continuousScroll){
                    if(_index == 0 && _moveX > 0){
                        _moveX = 0;
                        return fnAutoSwipe();
                    }else if((_index + 1) >= _liLength && _moveX < 0){
                        _moveX = 0;
                        return fnAutoSwipe();
                    }
                }
                fnTranslate(opts.ul,-(_liWidth * (parseInt(_index)) - _moveX));
            }else{
                if(!opts.continuousScroll){
                    if(_index == 0 && _moveY > 0){
                        _moveY = 0;
                        return fnAutoSwipe();
                    }else if((_index + 1) >= _liLength && _moveY < 0){
                        _moveY = 0;
                        return fnAutoSwipe();
                    }
                }
                fnTranslate(opts.ul,-(_liHeight * (parseInt(_index)) - _moveY));
            }
        }

        // touchend
        function fnTouchend(){
            if(opts.axisX){
                _moveDistance = _moveX;
            }else{
                _moveDistance = _moveY;
            }
            // 距离小
            if(Math.abs(_moveDistance) <= _touchDistance){
                fnScroll(.3);
            // 距离大
            }else{
                // 手指触摸上一屏滚动
                if(_moveDistance > _touchDistance){
                    fnMovePrev();
                // 手指触摸下一屏滚动
                }else if(_moveDistance < -_touchDistance){
                    fnMoveNext();
                }
            }
            fnAutoSwipe();
            _moveX = 0;
            _moveY = 0;
        }

        // 滚动方法
        function fnScroll(num){
            fnTransition(opts.ul,num);
            if(opts.axisX){
                fnTranslate(opts.ul,-_index*_liWidth);
            }else{
                fnTranslate(opts.ul,-_index*_liHeight);
            }
        }

        // 滚动判断
        function fnMove(){
            if(opts.continuousScroll){
                if(_index >= _liLength){
                    fnScroll(.3);
                    _index = 0;
                    setTimeout(function(){
                        fnScroll(0);
                    },300);
                }else if(_index < 0){
                    fnScroll(.3);
                    _index = _liLength-1;
                    setTimeout(function(){
                        fnScroll(0);
                    },300);
                }else{
                    fnScroll(.3);
                }
            }else{
                if(_index >= _liLength){
                    _index = 0;
                }else if(_index < 0){
                    _index = _liLength-1;
                }
                fnScroll(.3);
            }
            callback(_index);
        }

        // 下一屏滚动
        function fnMoveNext(){
            _index++;
            fnMove();
            if(opts.lazyLoad){
                if(opts.continuousScroll){
                    fnLazyLoad(_index+2);
                }else{
                    fnLazyLoad(_index+1);
                }
            }
        }

        // 上一屏滚动
        function fnMovePrev(){
            _index--;
            fnMove();
            // 第一次往右滚动懒加载图片
            if(firstMovePrev && opts.lazyLoad){
                var i = _liLength-1;
                for(i; i <= (_liLength+1); i++){
                    fnLazyLoad(i);
                }
                firstMovePrev = false;
                return;
            }
            if(!firstMovePrev && opts.lazyLoad){
                fnLazyLoad(_index);
            }
        }
        
        // 自动滚动
        function fnAutoSwipe(){
            if(opts.autoSwipe){
                autoScroll = setInterval(function(){
                    fnMoveNext();
                    //console.log(1);
                },opts.speed);
            }
        }
    }
})(window.Zepto || window.jQuery);