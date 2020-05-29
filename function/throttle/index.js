// https://github.com/mqyqingfeng/Blog/issues/26
function throttle(fn, wait) {

    var pre = 0;

    return function () {
        var context = this;
        var now = Date.now();
        if (now - pre > wait) {
            fn.apply(context, arguments);
            pre = now;
        }
    }

}


function throttle(fn, wait) {
    var timeout;

    var throttled = function () {
        if (timeout) {
            return;
        }
        var context = this;
        timeout = setTimeout(function () {
            fn.apply(context, arguments);
            timeout = null;
        }, wait)

    }

    throttled.cancel = function () {
        clearTimeout(timeout);
        waiting = false;
    }

    return throttled;

}

function throttle(func, wait) {
    var timeout, context, args, result;
    var previous = 0;

    var later = function() {
        previous = +new Date();
        timeout = null;
        func.apply(context, args)
    };

    var throttled = function() {
        var now = +new Date();
        //下次触发 func 剩余的时间
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
         // 如果没有剩余的时间了或者你改了系统时间
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(context, args);
        } else if (!timeout) {
            timeout = setTimeout(later, remaining);
        }
    };
    return throttled;
}

// underscore版本
function throttle(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function () {
        previous = options.leading === false ? 0 : new Date().getTime();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };

    var throttled = function () {
        var now = new Date().getTime();

        // !previous 可以表示为首次
        // options.leading === false的 previous = now => wait - (now - previous) => wait 表示需要等待
        // options.leading 为真时，previous = 0 => wait - (now - previous) => wait - now , 是肯定小于0的，肯定会被执行
        if (!previous && options.leading === false) previous = now;

        // 计算剩余时间
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        // 如果没有剩余的时间了或者你改了系统时间
        if (remaining <= 0 || remaining > wait) {
            // 如果有计划中的timeout，就取消，
            // 理论上只有options.trailing !== false，这个值才会为真，所以这里可以添加判断
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            // context args 都是保存着给setTimeout函数使用的，如果没有，就无需保留
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) { // !timeout表示，没有计划
            timeout = setTimeout(later, remaining);
        }
        return result;
    };

    throttled.cancel = function () {
        clearTimeout(timeout);
        previous = 0;
        timeout = context = args = null;
    };

    return throttled;
};


const log = () => console.log(new Date().toLocaleTimeString());

const throttled = throttle(log, 1000)

setInterval(() => {
    throttled();
}, 100)