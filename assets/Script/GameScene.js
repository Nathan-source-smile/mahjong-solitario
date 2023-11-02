import { loadImgAtlas } from './AssetLoader';
import { FakeServer } from './Common/CommServices';
import { ClientCommService } from "./ClientCommService";
import GameAvatar from '././Common/GameAvatar';
import TopBar from './TopBar';
import GlobalVariables from './GlobalVariables';
import { ROUNDS } from './Common/Messages';
import Modal from './Modal';
import SetChecker from './SetChecker';
import EditBox from './EditBox';
import cell from './cell';
import Hover from './Hover';

export let GameScene;
cc.Class({
    extends: cc.Component,

    properties: {
        backSprite: cc.Sprite,

        winNotify: Modal,
        loseNotify: Modal,
        // drawNotify: Modal,
        placeNotify1: Modal,
        placeNotify2: Modal,
        playerAvatar1: GameAvatar,
        playerAvatar2: GameAvatar,
        playerAvatar3: GameAvatar,
        playerAvatar4: GameAvatar,
        playerAvatar5: GameAvatar,
        playerAvatar6: GameAvatar,
        topBar: TopBar,
        EditBox: EditBox,
        blueChecker: cc.Prefab,
        redChecker: cc.Prefab,
        purpleChecker: cc.Prefab,
        orangeChecker: cc.Prefab,
        yellowChecker: cc.Prefab,
        greenChecker: cc.Prefab,
        checker: cc.Prefab,
        hover: cc.Prefab,
        selectEnv: cc.ToggleContainer,

        // user can be -1(white) or 1(black)
        // _currentUser: 0,
        _playerAvatars: [],
        _playerCnt: 2,
        _mode: 1,
        _cells: [],
        _step: 0,
    },

    // use this for initialization
    onLoad: function () {
        GameScene = this;

        this.playerAvatar1.node.active = false;
        this.playerAvatar2.node.active = false;
        this.playerAvatar3.node.active = false;
        this.playerAvatar4.node.active = false;
        this.playerAvatar5.node.active = false;
        this.playerAvatar6.node.active = false;

        this._playerCnt = 2;
        this._cells = this.node.getComponentsInChildren(cell);

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

    start1(playerList, user) {
        GlobalVariables.currentUser = user;
        this.removeAllCheckers();
        this.playerAvatar1.node.active = false;
        this.playerAvatar2.node.active = false;
        this.playerAvatar3.node.active = false;
        this.playerAvatar4.node.active = false;
        this.playerAvatar5.node.active = false;
        this.playerAvatar6.node.active = false;

        this.winNotify.node.active = false;
        this.loseNotify.node.active = false;
        this.placeNotify1.node.active = false;
        this.placeNotify2.node.active = false;

        GlobalVariables.round = ROUNDS.START_STEP;
        switch (this._playerCnt) {
            case 2:
                this.playerAvatar1.node.active = true;
                this.playerAvatar1.setChecker(1, 'blue');
                this.playerAvatar4.node.active = true;
                this.playerAvatar4.setChecker(1, 'orange');
                this._playerAvatars = [
                    this.playerAvatar1,
                    this.playerAvatar4,
                ];
                break;
            case 3:
                if (this._mode === 1) {
                    this.playerAvatar1.node.active = true;
                    this.playerAvatar1.setChecker(1, 'blue');
                    this.playerAvatar3.node.active = true;
                    this.playerAvatar3.setChecker(1, 'purple');
                    this.playerAvatar6.node.active = true;
                    this.playerAvatar6.setChecker(1, 'yellow');
                    this._playerAvatars = [
                        this.playerAvatar1,
                        this.playerAvatar3,
                        this.playerAvatar6,
                    ];
                } else if (this._mode === 2) {
                    this.playerAvatar1.node.active = true;
                    this.playerAvatar1.setChecker(this._mode, ['blue', 'orange']);
                    this.playerAvatar3.node.active = true;
                    this.playerAvatar3.setChecker(this._mode, ['red', 'yellow']);
                    this.playerAvatar4.node.active = true;
                    this.playerAvatar4.setChecker(this._mode, ['purple', 'green']);
                    this._playerAvatars = [
                        this.playerAvatar1,
                        this.playerAvatar3,
                        this.playerAvatar4,
                    ];
                }
                break;
            case 4:
                this.playerAvatar1.node.active = true;
                this.playerAvatar1.setChecker(1, 'blue');
                this.playerAvatar2.node.active = true;
                this.playerAvatar2.setChecker(1, 'purple');
                this.playerAvatar4.node.active = true;
                this.playerAvatar4.setChecker(1, 'orange');
                this.playerAvatar5.node.active = true;
                this.playerAvatar5.setChecker(1, 'green');
                this._playerAvatars = [
                    this.playerAvatar1,
                    this.playerAvatar2,
                    this.playerAvatar4,
                    this.playerAvatar5,
                ];
                break;
            case 5:
                this.playerAvatar1.node.active = true;
                this.playerAvatar1.setChecker(1, 'blue');
                this.playerAvatar2.node.active = true;
                this.playerAvatar2.setChecker(1, 'red');
                this.playerAvatar3.node.active = true;
                this.playerAvatar3.setChecker(1, 'purple');
                this.playerAvatar4.node.active = true;
                this.playerAvatar4.setChecker(1, 'orange');
                this.playerAvatar6.node.active = true;
                this.playerAvatar6.setChecker(1, 'yellow');
                this._playerAvatars = [
                    this.playerAvatar1,
                    this.playerAvatar2,
                    this.playerAvatar3,
                    this.playerAvatar4,
                    this.playerAvatar6,
                ];
                break;
            case 6:
                this.playerAvatar1.node.active = true;
                this.playerAvatar1.setChecker(1, 'blue');
                this.playerAvatar2.node.active = true;
                this.playerAvatar2.setChecker(1, 'red');
                this.playerAvatar3.node.active = true;
                this.playerAvatar3.setChecker(1, 'purple');
                this.playerAvatar4.node.active = true;
                this.playerAvatar4.setChecker(1, 'orange');
                this.playerAvatar5.node.active = true;
                this.playerAvatar5.setChecker(1, 'yellow');
                this.playerAvatar6.node.active = true;
                this.playerAvatar6.setChecker(1, 'green');
                this._playerAvatars = [
                    this.playerAvatar1,
                    this.playerAvatar2,
                    this.playerAvatar3,
                    this.playerAvatar4,
                    this.playerAvatar5,
                    this.playerAvatar6,
                ];
                break;
            default:
                this.playerAvatar1.node.active = true;
                this.playerAvatar1.setChecker(1, 'blue');
                this.playerAvatar4.node.active = true;
                this.playerAvatar4.setChecker(1, 'orange');
                this._playerAvatars = [
                    this.playerAvatar1,
                    this.playerAvatar4,
                ];
                break;
        }
        for (let i = 0; i < this._playerAvatars.length; i++) {
            this._playerAvatars[i].setName("Player " + (i + 1));
        }
        this._cells.forEach((cell) => {
            cell.setUser(-1);
            cell._clicked = false;
        });
        console.log("ssssss", playerList);
        playerList.forEach((player, i) => {
            player.forEach((unit, j) => {
                const cell = getCell(this._cells, unit);
                if (cell) {
                    cell.setUser(i);
                    let prefab = cc.instantiate(this.checker);
                    const checker = prefab.getComponent('Checkers');
                    if (this._mode === 2 && this._playerCnt === 3)
                        checker.setColor(GlobalVariables.playerColors[6 - 2][i]);
                    else
                        checker.setColor(GlobalVariables.playerColors[GlobalVariables.playerCnt - 2][i]);
                    cell.node.addChild(prefab);
                }
            });
        });
    },

    askUser(user) {
        GlobalVariables.currentUser = user;
        GlobalVariables.currentUnit = [];
        this.setActivePlayer(user);
    },

    setAvailCells(avaialbeCells, user) {
        // let hovers = this.node.getComponentsInChildren(Hover);
        // hovers.forEach((hover) => {
        //     hover.node.destroy();
        // });
        GlobalVariables.availableCells = avaialbeCells;
        // GlobalVariables.availableCells.forEach((unit, j) => {
        //     const cell = getCell(this._cells, unit);
        //     if (cell) {
        //         let prefab = cc.instantiate(this.hover);
        //         cell.node.addChild(prefab);
        //     }
        // });
    },

    setMoveResult(result, finish, user, currentUnit, targetCell, ranking, entered) {
        GlobalVariables.currentUnit = currentUnit;
        GlobalVariables.targetCell = targetCell;
        if (GlobalVariables.currentUnit.length === 0 || GlobalVariables.targetCell.length === 0)
            return;
        const cell = getCell(this._cells, GlobalVariables.currentUnit);
        const cell1 = getCell(this._cells, GlobalVariables.targetCell);
        let prefab = cc.instantiate(this.checker);
        const checker = prefab.getComponent('Checkers');
        if (entered) {
            checker.setColor_1(GlobalVariables.playerColors[((this._mode === 2 && this._playerCnt === 3) ? 6 : GlobalVariables.playerCnt) - 2][user + GlobalVariables.step * GlobalVariables.playerCnt]);
        } else {
            checker.setColor(GlobalVariables.playerColors[((this._mode === 2 && this._playerCnt === 3) ? 6 : GlobalVariables.playerCnt) - 2][user + GlobalVariables.step * GlobalVariables.playerCnt]);
        }

        cell1.node.addChild(prefab);
        cell1.setUser(user + GlobalVariables.step * GlobalVariables.playerCnt);
        cell.node.removeAllChildren();
        cell.setUser(-1);

        if (finish) {
            this.stopPlayer(user);
            switch (ranking.indexOf(user)) {
                case 0:
                    this._playerAvatars[user].showNotify_1();
                    break;
                case 1:
                    this._playerAvatars[user].showNotify_2('2nd');
                    break;
                case 2:
                    this._playerAvatars[user].showNotify_2('3rd');
                    break;
                case 3:
                    this._playerAvatars[user].showNotify_2('4th');
                    break;
                case 4:
                    this._playerAvatars[user].showNotify_2('5th');
                    break;
                case 5:
                    this._playerAvatars[user].showNotify_2('6th');
                    break;
            }
        }

        GlobalVariables.round = ROUNDS.START_STEP;
        GlobalVariables.currentUnit = [];
        GlobalVariables.targetCell = [];
        GlobalVariables.availableCells = [];
        let hovers = this.node.getComponentsInChildren(Hover);
        hovers.forEach((hover) => {
            hover.node.destroy();
        });
        try {
            const hover = GlobalVariables.checker._currentNode.getChildByName('hover');
            const clicked = GlobalVariables.checker._currentNode.getChildByName('clicked');
            const regular = GlobalVariables.checker._currentNode.getChildByName('regular');
            hover.active = false;
            clicked.active = false;
            regular.active = true;
        } catch (e) {
            console.log("set the move result: ", e);
        }
    },

    setActivePlayer(user) {
        this._playerAvatars.forEach((item) => item.stopCountdown());
        this._playerAvatars[user].startCountdown();
        GlobalVariables.round = ROUNDS.START_STEP;
        GlobalVariables.currentUnit = [];
        GlobalVariables.targetCell = [];
        GlobalVariables.availableCells = [];
        let hovers = this.node.getComponentsInChildren(Hover);
        hovers.forEach((hover) => {
            hover.node.destroy();
        });
        if (!GlobalVariables.checker)
            return;
        try {
            const hover = GlobalVariables.checker._currentNode.getChildByName('hover');
            const clicked = GlobalVariables.checker._currentNode.getChildByName('clicked');
            const regular = GlobalVariables.checker._currentNode.getChildByName('regular');
            hover.active = false;
            clicked.active = false;
            regular.active = true;
        } catch (e) {
            console.log("set next player: ", e);
        }
    },

    stopPlayer(user) {
        this._playerAvatars[user].stopCountdown();
    },

    stopAllPlayers() {
        this._playerAvatars.forEach((item) => item.stopCountdown());
    },

    setPlayerCnt(e) {
        let n = parseInt(e.string);
        if (n > 1 && n < 7)
            GlobalVariables.playerCnt = n;
    },

    setMode(e) {
        let n = parseInt(e.string);
        if (n > 1)
            GlobalVariables.mode = 2;
        else
            GlobalVariables.mode = 1;
    },

    clickRestart() {
        this._playerCnt = GlobalVariables.playerCnt;
        this._mode = GlobalVariables.mode;
        // if (this._mode === 2 && this._playerCnt === 3) {
        //     this._playerCnt = 6;
        //     GlobalVariables = 6;
        // }
        ClientCommService.sendRestartGame(this._playerCnt, this._mode);
    },

    setEnv(e) {
        switch (e.node.name) {
            case "toggle1":
                GlobalVariables.mode = 1;
                GlobalVariables.playerCnt = 2;
                break;
            case "toggle2":
                GlobalVariables.mode = 1;
                GlobalVariables.playerCnt = 3;
                break;
            case "toggle3":
                GlobalVariables.mode = 2;
                GlobalVariables.playerCnt = 3;
                break;
            case "toggle4":
                GlobalVariables.mode = 1;
                GlobalVariables.playerCnt = 4;
                break;
            case "toggle5":
                GlobalVariables.mode = 1;
                GlobalVariables.playerCnt = 5;
                break;
            case "toggle6":
                GlobalVariables.mode = 1;
                GlobalVariables.playerCnt = 6;
                break;
        }
        this._playerCnt = GlobalVariables.playerCnt;
        this._mode = GlobalVariables.mode;
        ClientCommService.sendRestartGame(this._playerCnt, this._mode);
    },

    removeAllCheckers() {
        for (let i = 0; i < this._cells.length; i++) {
            this._cells[i].node.removeAllChildren();
        }
    },

    showEndModal(ranking) {
        this.stopAllPlayers();
        if (ranking.indexOf(0) === 0) {
            this.winNotify.node.active = true;
        } else if (ranking.indexOf(0) === this._playerCnt - 1) {
            this.loseNotify.node.active = true;
            this.loseNotify.setText(this._playerAvatars[ranking[0]]._pname);
        } else {
            switch (ranking.indexOf(0)) {
                case 1:
                    this.placeNotify1.node.active = true;
                    this.placeNotify1.setText('2nd');
                    break;
                case 2:
                    this.placeNotify1.node.active = true;
                    this.placeNotify1.setText('3rd');
                    break;
                case 3:
                    this.placeNotify1.node.active = true;
                    this.placeNotify1.setText('4th');
                    break;
                case 4:
                    this.placeNotify1.node.active = true;
                    this.placeNotify1.setText('5th');
                    break;
            }
        }
    },

    // called every frame
    update: function (dt) {
    },
});

function getCell(cells, position) {
    for (var i = 0; i < cells.length; i++) {
        if (JSON.stringify([cells[i].u, cells[i].v, cells[i].w]) === JSON.stringify(position)) {
            return cells[i];
        }
    }
    return false;
}