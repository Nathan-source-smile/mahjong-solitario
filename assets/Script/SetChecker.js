export default cc.Class({
    extends: cc.Component,

    properties: {
        red: cc.Sprite,
        blue: cc.Sprite,
        purple: cc.Sprite,
        green: cc.Sprite,
        orange: cc.Sprite,
        yellow: cc.Sprite,
    },


    onload() {

    },

    start() { },

    unvisibleColor() {
        this.red.node.active = false;
        this.blue.node.active = false;
        this.purple.node.active = false;
        this.green.node.active = false;
        this.orange.node.active = false;
        this.yellow.node.active = false;
    },

    setColor(col) {
        this.unvisibleColor();
        if (col === 'red') {
            this.red.node.active = true;
        } else if (col === 'blue') {
            this.blue.node.active = true;
        } else if (col === 'purple') {
            this.purple.node.active = true;
        } else if (col === 'yellow') {
            this.yellow.node.active = true;
        } else if (col === 'green') {
            this.green.node.active = true;
        } else if (col === 'orange') {
            this.orange.node.active = true;
        }
    },

    update(dt) {
    },
});