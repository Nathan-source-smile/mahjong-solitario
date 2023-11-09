import { loadImgAtlas } from "./AssetLoader";
import { FakeServer } from "./Common/CommServices";
import { ClientCommService } from "./ClientCommService";
import TopBar from "./TopBar";
import GlobalVariables from "./GlobalVariables";
import Modal from "./Modal";
import { LOSE, TILE_SIZE, TOTAL_TIME, WIN } from "./Common/Constants";

export let GameScene;
cc.Class({
    extends: cc.Component,

    properties: {
        backSprite: cc.Sprite,

        winNotify: Modal,
        loseNotify: Modal,
        solveNotify: Modal,
        topBar: TopBar,
        moves: cc.Label,
        timeMin: cc.Label,
        timeSecond: cc.Label,
        remainedTiles: cc.Label,
        layer1: cc.Node,
        layer2: cc.Node,
        layer3: cc.Node,
        layer4: cc.Node,
        layer5: cc.Node,
        tilePrefab: cc.Prefab,

        _layers: [],
        _tiles: [],
        _progress: 1,
    },

    // use this for initialization
    onLoad: function () {
        GameScene = this;

        loadImgAtlas()
            .then(() => {
                FakeServer.initHandlers();
                FakeServer.init();
                // setTimeout(() => {
                //     this.start1();
                // }, 3000);
            })
            .catch((error) => {
                // console.log("Error loading card atlas:", error);
            });
    },

    start1(tiles, availableTiles, moves) {
        this._layers = [this.layer1, this.layer2, this.layer3, this.layer4, this.layer5];
        this.drawBoard(tiles, availableTiles, moves, false);
        // let time = TOTAL_TIME;
        // setInterval(() => {
        //     this.timeMin.string = Math.floor((time - 1) / 60) + ":";
        //     this.timeSecond.string = Math.floor(())
        // }, 1000);
    },

    drawBoard(tiles, availableTiles, moves, succeed) {
        var this_temp = this;
        if (succeed) {
            this.getTile(GlobalVariables.compareTiles[0]);
            this.getTile(GlobalVariables.compareTiles[1]);
            setTimeout(() => {
                GlobalVariables.tiles = tiles;
                GlobalVariables.availableTiles = availableTiles;
                GlobalVariables.moves = moves;
                GlobalVariables._tileComponents = [];
                this_temp._layers.forEach(element => {
                    element.removeAllChildren();
                });
                for (let i = 0; i < tiles.length; i++) {
                    const tileNode = cc.instantiate(this_temp.tilePrefab);
                    this_temp._layers[tiles[i].z].addChild(tileNode);
                    tileNode.setPosition(cc.v2(tiles[i].y * TILE_SIZE[0] / 2, -tiles[i].x * TILE_SIZE[1] / 2));
                    const tileComponent = tileNode.getComponent("Tile");
                    tileComponent.setTileType(tiles[i]);
                    GlobalVariables._tileComponents.push(tileComponent);
                }
                this_temp.remainedTiles.string = tiles.length;
                this_temp.moves.string = GlobalVariables.moves;
                GlobalVariables.compareTiles = [];
            }, 500);
        } else {
            GlobalVariables.tiles = tiles;
            GlobalVariables.availableTiles = availableTiles;
            GlobalVariables.moves = moves;
            GlobalVariables._tileComponents = [];
            this_temp._layers.forEach(element => {
                element.removeAllChildren();
            });
            for (let i = 0; i < tiles.length; i++) {
                const tileNode = cc.instantiate(this_temp.tilePrefab);
                this_temp._layers[tiles[i].z].addChild(tileNode);
                tileNode.setPosition(cc.v2(tiles[i].y * TILE_SIZE[0] / 2, -tiles[i].x * TILE_SIZE[1] / 2));
                const tileComponent = tileNode.getComponent("Tile");
                tileComponent.setTileType(tiles[i]);
                GlobalVariables._tileComponents.push(tileComponent);
            }
            this_temp.remainedTiles.string = tiles.length;
            this_temp.moves.string = GlobalVariables.moves;
            GlobalVariables.compareTiles = [];
        }
    },

    clickRestart() {
        this.winNotify.node.active = false;
        this.loseNotify.node.active = false;
        this._progress = 1;
        ClientCommService.sendRestartGame();
    },

    showEndModal(gameResult) {
        if (gameResult === WIN) {
            this.winNotify.node.active = true;
        } else if (gameResult === LOSE) {
            this.loseNotify.node.active = true;
        }
    },

    getTile(tile) {
        GlobalVariables._tileComponents.forEach((el) => {
            if (tile.x === el._x && tile.y === el._y && tile.z === el._z) {
                el.setFace("click");
            }
        });
    },

    // called every frame
    update: function (dt) {
        if (this._progress > 0) {
            this._progress -= dt / TOTAL_TIME;
            if (this._progress < 0) this._progress = 0;
            var sec = Math.ceil(this._progress * TOTAL_TIME);
            // console.log(sec);
            this.timeMin.string = String(Math.floor(sec / 60)).padStart(2, '0') + ":";
            this.timeSecond.string = String(sec % 60).padStart(2, '0');
            if (sec > 40) {
                this.timeSecond.node.color = new cc.Color(20, 102, 102);
                // this.timeSecond.node.opacity = 255;
            } else {
                this.timeSecond.node.color = new cc.Color(104, 4, 4);
            }
            // console.log(dt);
            // let time = TOTAL_TIME - dt;
            // setInterval(() => {
            //     this.timeMin.string = Math.floor((time - 1) / 60) + ":";
            //     this.timeSecond.string = Math.floor(())
            // }, 1000);
        } else {
            // this.showProgressBar(false);
        }
    },

});