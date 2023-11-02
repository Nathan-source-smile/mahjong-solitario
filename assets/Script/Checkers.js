import Unit from "./Unit";

export default cc.Class({
    extends: cc.Component,

    properties: {
        blue: Unit,
        red: Unit,
        purple: Unit,
        orange: Unit,
        yellow: Unit,
        green: Unit,
        blue_button: cc.Node,
        red_button: cc.Node,
        purple_button: cc.Node,
        orange_button: cc.Node,
        yellow_button: cc.Node,
        green_button: cc.Node,

        _currentNode: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
    },

    unvisibleColor() {
        this.red.node.active = false;
        this.blue.node.active = false;
        this.purple.node.active = false;
        this.green.node.active = false;
        this.orange.node.active = false;
        this.yellow.node.active = false;
        this.blue_button.active = false;
        this.red_button.active = false;
        this.purple_button.active = false;
        this.orange_button.active = false;
        this.yellow_button.active = false;
        this.green_button.active = false;
    },

    setColor(col) {
        this.unvisibleColor();
        if (col === 'red') {
            // this.red.node.active = true;
            this.red_button.active = true;
            this._currentNode = this.red_button;
        } else if (col === 'blue') {
            // this.blue.node.active = true;
            this.blue_button.active = true;
            this._currentNode = this.blue_button;
        } else if (col === 'purple') {
            // this.purple.node.active = true;
            this.purple_button.active = true;
            this._currentNode = this.purple_button;
        } else if (col === 'yellow') {
            // this.yellow.node.active = true;
            this.yellow_button.active = true;
            this._currentNode = this.yellow_button;
        } else if (col === 'green') {
            // this.green.node.active = true;
            this.green_button.active = true;
            this._currentNode = this.green_button;
        } else if (col === 'orange') {
            // this.orange.node.active = true;
            this.orange_button.active = true;
            this._currentNode = this.orange_button;
        }
    },

    setColor_1(col) {
        let t = this;
        this.unvisibleColor();
        if (col === 'red') {
            this.red.node.active = true;
            let i = 0;
            let unit = this.red;
            let button = this.red_button;
            let callback = function () {
                if (i === 4) {
                    unit.node.active = false;
                    button.active = true;
                    t._currentNode = button;
                    unit.unschedule(callback);
                }
                unit.changeChildren(i);
                i++;
            }
            this.red.schedule(callback, 0.2, 4, 0);
        } else if (col === 'blue') {
            this.blue.node.active = true;
            let i = 0;
            let unit = this.blue;
            let button = this.blue_button;
            let callback = function () {
                if (i === 4) {
                    unit.node.active = false;
                    button.active = true;
                    t._currentNode = button;
                    unit.unschedule(callback);
                }
                unit.changeChildren(i);
                i++;
            }
            this.blue.schedule(callback, 0.15, 4, 0);
        } else if (col === 'purple') {
            this.purple.node.active = true;
            let i = 0;
            let unit = this.purple;
            let button = this.purple_button;
            let callback = function () {
                if (i === 4) {
                    unit.node.active = false;
                    button.active = true;
                    t._currentNode = button;
                    unit.unschedule(callback);
                }
                unit.changeChildren(i);
                i++;
            }
            this.purple.schedule(callback, 0.15, 4, 0);
        } else if (col === 'yellow') {
            this.yellow.node.active = true;
            let i = 0;
            let unit = this.yellow;
            let button = this.yellow_button;
            let callback = function () {
                if (i === 4) {
                    unit.node.active = false;
                    button.active = true;
                    t._currentNode = button;
                    unit.unschedule(callback);
                }
                unit.changeChildren(i);
                i++;
            }
            this.yellow.schedule(callback, 0.15, 4, 0);
        } else if (col === 'green') {
            this.green.node.active = true;
            let i = 0;
            let unit = this.green;
            let button = this.green_button;
            let callback = function () {
                if (i === 4) {
                    unit.node.active = false;
                    button.active = true;
                    t._currentNode = button;
                    unit.unschedule(callback);
                }
                unit.changeChildren(i);
                i++;
            }
            this.green.schedule(callback, 0.15, 4, 0);
        } else if (col === 'orange') {
            this.orange.node.active = true;
            let i = 0;
            let unit = this.orange;
            let button = this.orange_button;
            let callback = function () {
                if (i === 4) {
                    unit.node.active = false;
                    button.active = true;
                    t._currentNode = button;
                    unit.unschedule(callback);
                }
                unit.changeChildren(i);
                i++;
            }
            this.orange.schedule(callback, 0.15, 4, 0);
        }
    },

    onButtonClick() {
        const parent = this.node.getParent();
        const cell = parent.getComponent("cell");
        cell.onTouchStart();
    },

    // called every frame
    update: function (dt) {

    },
});