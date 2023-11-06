import { MESSAGE_TYPE, ROUNDS } from "../Common/Messages";
import { ClientCommService } from "../ClientCommService";
import { TIME_LIMIT, ALARM_LIMIT, TOTAL_TILES, WIN, LOSE, NOT_END } from "../Common/Constants";

//--------Defining global variables----------
var tile = {
    type: -1,
    semiType: -1,
    available: false,
    x: -1, // 0~18
    y: -1, // 0~38
    z: -1, // 0~9
}
var coordinates = [];
for (var i = 0; i < TOTAL_TILES; i++) {
    var z = Math.floor(i / 36);
    var x = Math.floor((i % 36) / 9) * 2;
    var y = Math.floor((i % 36) % 9) * 2;
    coordinates.push({ x: x, y: y, z: z });
}
coordinates.sort(function (a, b) {
    return Math.floor(Math.random() * 3) - 1;
});
var tiles = [];
for (var i = 0; i < TOTAL_TILES; i++) {
    var temp = [];
    temp = copyObject(tile);
    temp.type = Math.floor(i / 4);
    if (temp.type >= 0 && temp.type <= 8) {
        temp.semiType = 0;
    } else if (temp.type >= 9 && temp.type <= 17) {
        temp.semiType = 1;
    } else if (temp.type >= 18 && temp.type <= 26) {
        temp.semiType = 2;
    } else if (temp.type >= 27 && temp.type <= 28) {
        switch (temp.type) {
            case 27:
                temp.semiType = 3 + (Math.floor(i % 4) + 1) / 10;
                break;
            case 28:
                temp.semiType = 4 + (Math.floor(i % 4) + 1) / 10;
                break;
            default:
                0;
        }
    } else if (temp.type >= 29 && temp.type <= 35) {
        temp.semiType = 5 + (temp.type - 29);
    }
    temp.available = false;
    temp.x = coordinates[i].x; // 0~18
    temp.y = coordinates[i].y; // 0~38
    temp.z = coordinates[i].z; // 0~9
    tiles.push(temp);
}
var availableTiles = [];
var availableMatches = [];
//--------Defining global variables----------

function copyObject(object) {
    if (!object) {
        trace("undefined object in copyObject:", object);
        return object;
    }
    return JSON.parse(JSON.stringify(object));
}

function isIn2DArray(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        // if (JSON.stringify(arr[i]) === JSON.stringify(val)) {
        //     return true;
        // }
        if (arr[i][0] === val[0] && arr[i][1] === val[1] && arr[i][2] === val[2]) {
            return true;
        }
    }
    return false;
}

function sumArrays(arr1, arr2) {
    var sum = [];

    for (var i = 0; i < arr1.length; i++) {
        sum.push(arr1[i] + arr2[i]);
    }

    return sum;
}

function replaceSubarray(arr, subarr, replacement) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].toString() === subarr.toString()) {
            arr[i] = replacement;
            break;
        }
    }
    return arr;
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    arr1 = arr1.sort();
    arr2 = arr2.sort();
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i].toString() !== arr2[i].toString()) {
            return false;
        }
    }
    return true;
}

if (!trace) {
    var trace = function () {
        console.trace(JSON.stringify(arguments));
    };
}

function initHandlers() {
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_RESTART_GAME, startGame);
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_SELECT_UNIT, selectUnit);
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_CLAIM_MOVE, moveUnit);
}

function getTile(x, y, z) {
    var result = null;
    for (var i = 0; i < tiles.length; i++) {
        if (tiles[i].x === x && tiles[i].y === y && tiles[i].z === z) {
            result = copyObject(tiles[i]);
            break;
        }
    }
    return result;
}

function isEmpty(x, y, z) {
    if (getTile(x, y, z) === null)
        return true;
    else return false;
}

function isTop(x, y, z) {
    for (var i = 10; i > z; i--) {
        if (!isEmpty(x, y, i))
            return false;
    }
    return true;
}

function isVisible(x, y, z) {
    var a = false; var b = false; var c = false; var d = false;
    var E = isTop(x, y, z);
    if (!E)
        return false;
    var A = isTop(x - 1, y - 1, z); if (A) a = true;
    var B = isTop(x - 1, y, z); if (B) { a = true; b = true; }
    var C = isTop(x - 1, y + 1, z); if (C) b = true;
    var D = isTop(x, y - 1, z); if (D) { a = true; c = true; }
    var F = isTop(x, y + 1, z); if (F) { b = true; d = true; }
    var G = isTop(x + 1, y - 1, z); if (G) c = true;
    var H = isTop(x + 1, y, z); if (H) { c = true; d = true; }
    var I = isTop(x + 1, y + 1, z); if (I) d = true;
    if (a && b && c && d)
        return false;
    else return true;
}

function getAvailableTiles() {
    availableTiles = [];
    for (var i = 0; i < tiles.length; i++) {
        var tile = tiles[i];
        if (isVisible(tile.x, tile.y, tile.z))
            if (isEmpty(tile.x, tile.y - 2, tile.z) && isEmpty(tile.x, tile.y + 2, tile.z))
                availableTiles.push(tile);
    }
}

function isMatch(tile1Type, tile2Type) {
    if (tile1Type === tile2Type)
        return true;
    else return false;
}

function getAvailableMatches() {
    availableMatches = [];
    for (var i = 0; i < availableTiles.length; i++)
        for (var j = i + 1; j < availableTiles.length; j++)
            if (isMatch(availableTiles[i].type, availableTiles[j].type))
                availableMatches.push([availableTiles[i], availableTiles[j]]);
}

function isWinOrLose() {
    if (tiles.length === 0)
        return WIN;
    if (tiles.length > 0 && availableMatches.length === 0)
        return LOSE;
    else return NOT_END;
}

function init() {
    startGame();
}

function startGame() { }

function selectUnit() { }

function moveUnit(params, room) {
    // TimeoutManager.clearNextTimeout();
}

// finish the game or mission
function gameOver() {
}

export const ServerCommService = {
    callbackMap: {},
    init() {
        this.callbackMap = {};
    },
    addRequestHandler(messageType, callback) {
        this.callbackMap[messageType] = callback;
    },
    send(messageType, data, users) {
        // TODO: Make fake code here to send message to client side
        // Added timeout bc there are times that UI are not updated properly if we send next message immediately
        // If we move to backend, we can remove this timeout
        setTimeout(function () {
            ClientCommService.onExtensionResponse({
                cmd: messageType,
                params: data,
                users: users,
            });
        }, 100);
    },
    onReceiveMessage(messageType, data, room) {
        const callback = this.callbackMap[messageType];
        trace("S - onReceiveMessage", messageType, data, room);
        if (callback) {
            callback(data, room);
        }
    },
};
ServerCommService.init();

const TimeoutManager = {
    timeoutHandler: null,
    nextAction: null,

    setNextTimeout(callback, timeLimit) {
        this.timeoutHandler = setTimeout(
            function () {
                return callback();
            },
            timeLimit ? timeLimit * 1000 : TIME_LIMIT * 1000
        );
    },

    clearNextTimeout() {
        if (this.timeoutHandler) {
            clearTimeout(this.timeoutHandler);
            this.timeoutHandler = null;
        }
    },
};

export const FakeServer = {
    initHandlers() {
        initHandlers();
    },
    init() {
        init();
    },

    startGame() {
        startGame();
    },
    //ask user to put stone
    askUser(currentPlayer) {
        askUser(currentPlayer);
    },
    // finish the game or mission
    gameOver() {
        gameOver();
    },
};
