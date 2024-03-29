(function($) {
    var slide = function(ele,options) {
        var $ele = $(ele);
        var setting = {
            speed: 1000,
            interval: 2000,
        };
        $.extend(true, setting, options);

        var statesMobile = [
            { $zIndex: 1, width: 30, height: 35.5, top: 49, left: 204, $opacity: 0.2 },
            { $zIndex: 2, width: 35, height: 45, top: 39, left: 199, $opacity: 0.4 },
            { $zIndex: 3, width: 55, height: 98, top: 15, left: 220, $opacity: 0.7 },
            { $zIndex: 4, width: 72, height: 168, top: 0, left: 263, $opacity: 1 },
            { $zIndex: 3, width: 55, height: 98, top: 15, left: 330, $opacity: 0.7 },
            { $zIndex: 2, width: 35, height: 45, top: 39, left: 370, $opacity: 0.4 },
            { $zIndex: 1, width: 30, height: 35.5, top: 49, left: 300, $opacity: 0.2 }
        ];

        var statesTablet = [
            { $zIndex: 1, width: 60, height: 75, top: 59, left: 184, $opacity: 0.2 },
            { $zIndex: 2, width: 70, height: 90, top: 49, left: 100, $opacity: 0.4 },
            { $zIndex: 3, width: 110, height: 138, top: 25, left: 160, $opacity: 0.7 },
            { $zIndex: 4, width: 164, height: 208, top: 0, left: 263, $opacity: 1 },
            { $zIndex: 3, width: 110, height: 138, top: 25, left: 415, $opacity: 0.7 },
            { $zIndex: 2, width: 70, height: 90, top: 49, left: 520, $opacity: 0.4 },
            { $zIndex: 1, width: 60, height: 75, top: 59, left: 490, $opacity: 0.2 }
        ];

        var statesPC = [
            { $zIndex: 1, width: 120, height: 150, top: 69, left: 134, $opacity: 0.2 },
            { $zIndex: 2, width: 130, height: 170, top: 59, left: 0, $opacity: 0.4 },
            { $zIndex: 3, width: 170, height: 218, top: 35, left: 110, $opacity: 0.7 },
            { $zIndex: 4, width: 224, height: 288, top: 0, left: 263, $opacity: 1 },
            { $zIndex: 3, width: 170, height: 218, top: 35, left: 470, $opacity: 0.7 },
            { $zIndex: 2, width: 130, height: 170, top: 59, left: 620, $opacity: 0.4 },
            { $zIndex: 1, width: 120, height: 150, top: 69, left: 500, $opacity: 0.2 }
        ];

        function detectView() {
            if (window.matchMedia('(max-width: 767px)').matches) {
                return 'mobile';
            } else if (window.matchMedia('(min-width: 768px) and (max-width: 1024px)').matches) {
                return 'tablet';
            } else {
                return 'pc';
            }
        }

        var $lis = $ele.find('li');
        var timer = null;

        $ele.find('.hi-next').on('click', function() {
            next();
        });
        $ele.find('.hi-prev').on('click', function() {
            var currentView = detectView();
            var stateArray = [];

            if (currentView === 'mobile') {
                stateArray = statesMobile;
            } else if (currentView === 'tablet') {
                stateArray = statesTablet;
            } else if (currentView === 'pc') {
                stateArray = statesPC;
            }

            stateArray.push(stateArray.shift());
            move();
        });
        $ele.on('mouseenter', function() {
            clearInterval(timer);
            timer = null;
        }).on('mouseleave', function() {
            autoPlay();
        });

        move();
        autoPlay();

        function move() {
            var currentView = detectView();
            var stateArray = [];

            if (currentView === 'mobile') {
                stateArray = statesMobile;
            } else if (currentView === 'tablet') {
                stateArray = statesTablet;
            } else if (currentView === 'pc') {
                stateArray = statesPC;
            }

            $lis.each(function(index, element) {
                var state = stateArray[index];
                $(element).css('zIndex', state.$zIndex).finish().animate(state, setting.speed).find('img').css('opacity', state.$opacity);
            });
        }

        function next() {
            var currentView = detectView();
            var stateArray = [];

            if (currentView === 'mobile') {
                stateArray = statesMobile;
            } else if (currentView === 'tablet') {
                stateArray = statesTablet;
            } else if (currentView === 'pc') {
                stateArray = statesPC;
            }

            stateArray.unshift(stateArray.pop());
            move();
        }

        function autoPlay() {
            timer = setInterval(next, setting.interval);
        }
    };
    $.fn.hiSlide = function(options) {
        $(this).each(function(index, ele) {
            slide(ele,options);
        });
        return this;
    };
})(jQuery);
