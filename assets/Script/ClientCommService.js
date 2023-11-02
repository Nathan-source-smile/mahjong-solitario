import { MESSAGE_TYPE } from "./Common/Messages";
import { ServerCommService } from "./Common/CommServices";
import { GameScene } from "./GameScene";

export const ClientCommService = {
    onExtensionResponse(event) {
        const messageType = event.cmd;
        const params = event.params;

        console.log("C - onExtensionResponse", event.cmd, event.params);

        switch (messageType) {
            case MESSAGE_TYPE.SC_START_GAME:
                GameScene.start1(params.playerList, params.user);
                break;
            case MESSAGE_TYPE.SC_ASK_USER:
                GameScene.askUser(params.user);
                break;
            case MESSAGE_TYPE.SC_END_GAME:
                GameScene.showEndModal(params.ranking);
                break;
            case MESSAGE_TYPE.SC_AVAIL_CELLS:
                GameScene.setAvailCells(params.availableCells, params.user);
                break;
            case MESSAGE_TYPE.SC_MOVE_UNIT:
                GameScene.setMoveResult(params.result, params.finish, params.user, params.currentUnit, params.targetCell, params.ranking, params.entered);
                break;
        }
    },

    send(messageType, data, room) {
        ServerCommService.onReceiveMessage(messageType, data, room);
    },

    sendSelectUnit(u, v, w, user, step) {
        this.send(MESSAGE_TYPE.CS_SELECT_UNIT, { u, v, w, user, step }, 1);
    },

    sendClaimMove(currentUnit, targetCell, user) {
        this.send(MESSAGE_TYPE.CS_CLAIM_MOVE, { currentUnit, targetCell, user }, 1);
    },

    sendRestartGame(playerCnt, mode) {
        this.send(MESSAGE_TYPE.CS_RESTART_GAME, { playerCnt, mode }, 1);
    }
};
