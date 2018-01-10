import throttle from 'lodash/throttle'

function getPosition(containment, el) {
    const containmentPosition = containment.getBoundingClientRect()
    const elPosition = el.getBoundingClientRect()
    return {
        top: elPosition.top - containmentPosition.top,
        left: elPosition.left - containmentPosition.left
    }
}

export default class ElDraggable {
    constructor(el, config) {
        this.conf = {
            el: el,
            bubble: true,
            throttle: 0,
            containment: document.body,
            overflow: true,
            updatePosition(e, p) {
                el.style.left = p.left + 'px'
                el.style.top = p.top + 'px'
            }
        }
        const _this = this
        const { conf, border } = this
        
        Object.assign(conf, config)
        this.border = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        }
        this.size = {
            width: el.clientWidth,
            height: el.clientHeight
        }
        this.mouseMove = throttle(e => {
            const { border } = this
            const offsetY = e.clientY - status.clientY
            const offsetX = e.clientX - status.clientX
            // console.log(offsetX, offsetY, style)
            _this.updateBorder.call(_this)
            status.clientX = e.clientX
            status.clientY = e.clientY
            let left = style.left + offsetX
            let top = style.top + offsetY
            if (!conf.overflow) {
                if (left > border.right) {
                    style.left = border.right
                } else if (left < border.left) { 
                    style.left = border.left
                } else {
                    style.left = left
                }
                if (top > border.bottom) {
                    style.top = border.bottom
                } else if (top < border.top) {
                    style.top = border.top
                } else {
                    style.top = top
                }
            } else {
                style.left = left
                style.top = top
            }
            conf.updatePosition(e, style)
            conf.onDrag && conf.onDrag(e, style)
        }, conf.throttle)

        this.handler = el.querySelector(conf.handler) || el
        this.containment = conf.containment

        let style = {
            left: 0,
            top: 0,
        }

        let status = {
            dragging: false,
            clientX: null,
            clientY: null
        }

        this.handler.addEventListener('mousedown', e => {
            const initPosition = getPosition(el.offsetParent, el)
            status.clientX = e.clientX
            status.clientY = e.clientY
            status.dragging = true
            el.style.top = initPosition.top + 'px'
            el.style.left = initPosition.left + 'px'
            style = initPosition
            document.addEventListener('mousemove', this.mouseMove)
            conf.onStart && conf.onStart(e, style)            
            !conf.bubble && e.preventDefault()
        })
        document.addEventListener('mouseup', e => {
            if (status.dragging) {
                document.removeEventListener('mousemove', this.mouseMove)
                conf.onEnd && conf.onEnd(e, style)
            }
            !conf.bubble && e.preventDefault()
        })
    }
    updateBorder () {
        const { size } = this
        const { containment, el } = this.conf
        const offsetParent = el.offsetParent
        const containmentPosition = containment.getBoundingClientRect()
        const offsetParentPosition = offsetParent.getBoundingClientRect()
        this.border.top = containmentPosition.top - offsetParentPosition.top
        this.border.bottom = containmentPosition.bottom - offsetParentPosition.top - size.height
        this.border.left = containmentPosition.left - offsetParentPosition.left
        this.border.right = containmentPosition.right - offsetParentPosition.left - size.width
    }
}