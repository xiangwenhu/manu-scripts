基本的实现方式都是通过时间差值计算。
注意点：
* 上下文
* 参数
* 是否首次执行
* 停止时触发
* 返回值
* 差值计算


#### 关于是否执行
常见的是通过时间差值计算
```js
   var now = +new Date();     
    if (now - previous > wait) {
    }
```

也可以setTimeout，考虑setTimeout的误差，更为推荐上面的。
```js
if (timeout) {
    return;
}
```