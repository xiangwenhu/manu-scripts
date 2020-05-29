基本的实现方式都是通过setTimeout。
注意点：
* 上下文
* 参数
* 是否首次执行
* 返回值


#### 关于首次是否执行
常见的是通过是否有计划中的setTimeout.
```js
var callNow = !timeout;
timeout = setTimeout(function () {
    timeout = null;
}, wait)
```

也可以单独采取一个变量called来标记。
```js
if (immediate && !called) {
    result = func.apply(context, args);
    called = true;
    return result;
}
```