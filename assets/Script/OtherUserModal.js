import { ClientCommService } from "./ClientCommService"

cc.Class({
    extends: cc.Component,

    properties: {
        Player: {
            default: null,
            type: cc.Label,
        },
        
    },
    onLoad() {
    },

    setText(coin) {
        
    },

    onClick() {
        // ClientCommService.sendRestartMission();
        this.node.active = false;
    }

})