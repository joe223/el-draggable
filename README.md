`$ npm install el-draggable`
```javascript
const box1 = document.getElementById('box-1')
new ElDraggable(box1, {
    overflow: false,
    containment: containment,
    handler: 'span',
    throttle: 30,
    onStart () {
        box1.style.zIndex = 999
    },
    onDrag (e, position) {
        // TODO
    },
    onEnd () {
        box1.style.zIndex = 'auto'
    }
});
```