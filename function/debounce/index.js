function debounce(fn, wait){
    var timeout;

    return function(){
        if(timeout)  clearTimeout();
        var context = this;
        timeout = setTimeout(function(){
            fn.apply(context, arguments);
        }, wait)
    }

}




// https://github.com/mqyqingfeng/Blog/issues/26
function debounce(func, wait, immediate) {

    var timeout, result;

    var debounced = function () {
        var context = this;
        var args = arguments;

        if (timeout) clearTimeout(timeout);
        if (immediate) {
            // 如果已经执行过，不再执行
            var callNow = !timeout;
            timeout = setTimeout(function () {
                timeout = null;
            }, wait)
            if (callNow) result = func.apply(context, args)
        }
        else {
            timeout = setTimeout(function () {
                func.apply(context, args)
            }, wait);
        }
        return result;
    };

    debounced.cancel = function () {
        clearTimeout(timeout);
        timeout = null;
    };

    return debounced;
}


/**
 * 1. debounce返回的函数如果同时用在两个地方，会有问题
 * @param {*} func 
 * @param {*} wait 
 * @param {*} immediate 
 */
function debounce(func, wait, immediate) {
    var timeout, called = false;

    var debounced = function () {
        var context = this;
        var args = arguments;

        if (timeout) clearTimeout(timeout);
        
        if (immediate && !called) {
            result = func.apply(context, args);
            called = true;
            return result;
        }

        timeout = setTimeout(function () {
            func.apply(context, args)
        }, wait);

        return undefined;
    };

    debounced.cancel = function () {
        clearTimeout(timeout);
        timeout = null;
        called = false;
    };

    return debounced;
}