export default cc.Class({
    extends: cc.Component,

    properties: {
        hover: cc.Node,
        clicked: cc.Node,
        regular: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.hover.active = false;
        this.clicked.active = false;
        this.regular.active = false;

        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    },

    onMouseMove(e){

    },

    onTouchStart(e){

    },

    // called every frame
    update: function (dt) {

    },
});