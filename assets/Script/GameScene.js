import { loadImgAtlas } from "./AssetLoader";
import { FakeServer } from "./Common/CommServices";
import { ClientCommService } from "./ClientCommService";
import TopBar from "./TopBar";
import GlobalVariables from "./GlobalVariables";
import Modal from "./Modal";

export let GameScene;
cc.Class({
    extends: cc.Component,

    properties: {
        backSprite: cc.Sprite,

        winNotify: Modal,
        loseNotify: Modal,
        placeNotify1: Modal,
        topBar: TopBar,
    },

    // use this for initialization
    onLoad: function () {
        GameScene = this;

        loadImgAtlas()
            .then(() => {
                FakeServer.initHandlers();
                // setTimeout(() => {
                FakeServer.init();
                // this.start1();
                // }, 3000);
            })
            .catch((error) => {
                console.log("Error loading card atlas:", error);
            });
    },

    start1() {
    },

    clickRestart() {
    },

    showEndModal() {
    },

    // called every frame
    update: function (dt) { },
});
