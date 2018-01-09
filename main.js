import throttle from 'lodash/throttle'

function getPosition(containment, el) {
    const containmentPosition = containment.getBoundingClientRect()
    const elPosition = el.getBoundingClientRect()
    return {
        top: elPosition.top - containmentPosition.top,
        left: elPosition.left - containmentPosition.left
    }
}

export default class Draggable {
    constructor(el, config) {
        const conf = {
            bubble: true,
            throttle: 0,
            containment: document.body,
            overflow: true,
            updatePosition(e, p) {
                el.style.left = p.left + 'px'
                el.style.top = p.top + 'px'
            }
        }
        Object.assign(conf, config)

        this.mouseMove = throttle(e => {
            const offsetY = e.clientY - status.clientY
            const offsetX = e.clientX - status.clientX
            style.maxOffsetX = conf.containment.clientWidth - el.clientWidth
            style.maxOffsetY = conf.containment.clientHeight - el.clientHeight
            status.clientX = e.clientX
            status.clientY = e.clientY
            let left = style.left + offsetX
            let top = style.top + offsetY
            if (!conf.overflow) {
                if (left > style.maxOffsetX) {
                    style.left = style.maxOffsetX
                } else if (left < 0) {
                    style.left = 0
                } else {
                    style.left = left
                }
                if (top > style.maxOffsetY) {
                    style.top = style.maxOffsetY
                } else if (top < 0) {
                    style.top = 0
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

        let style = {
            left: 0,
            top: 0,
            maxOffsetX: conf.containment.clientWidth - el.clientWidth,
            maxOffsetY: conf.containment.clientHeight - el.clientHeight
        }
        let status = {
            dragging: false,
            clientX: null,
            clientY: null
        }

        this.handler.addEventListener('mousedown', e => {
            const initPosition = getPosition(conf.containment, el)
            status.clientX = e.clientX
            status.clientY = e.clientY
            status.dragging = true
            el.style.top = initPosition.top + 'px'
            el.style.left = initPosition.left + 'px'
            style = getPosition(conf.containment, el)
            document.addEventListener('mousemove', this.mouseMove)
            !conf.bubble && e.preventDefault()
        })
        document.addEventListener('mouseup', e => {
            if (status.dragging) {
                document.removeEventListener('mousemove', this.mouseMove)
                conf.onEnd && conf.onEnd(e, style)
            }!conf.bubble && e.preventDefault()
        })
    }

}