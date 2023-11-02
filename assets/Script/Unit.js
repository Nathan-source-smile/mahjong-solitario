export default cc.Class({
    extends: cc.Component,

    properties: {
        one: cc.Node,
        two: cc.Node,
        three: cc.Node,
        four: cc.Node,

        _list: [],
    },

    // use this for initialization
    onLoad: function () {
        this._list = [
            this.one,
            this.two,
            this.three,
            this.four,
        ];
    },

    onEnable: function () {
        this._list = [
            this.one,
            this.two,
            this.three,
            this.four,
        ];
    },

    changeChildren(i) {
        this._list = [
            this.one,
            this.two,
            this.three,
            this.four,
        ];
        this._list.forEach(list => {
            list.active = false;
        });
        this._list[(i % 4)].active = true;
    },

    // called every frame
    update: function (dt) {

    },
});