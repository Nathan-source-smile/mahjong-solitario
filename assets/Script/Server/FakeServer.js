import { MESSAGE_TYPE, ROUNDS } from "../Common/Messages";
import { ClientCommService } from "../ClientCommService";
import { TIME_LIMIT, ALARM_LIMIT } from "../Common/Constants";


//--------Defining global variables----------
var playerCnt = 2;
var cubic = {
    NEIGHBOR_OFFSETS: [[0, 1, -1], [1, 0, -1], [1, -1, 0], [0, -1, 1], [-1, 0, 1], [-1, 1, 0]],
    DIR_TO_CUBIC: [[1, -0.5, -0.5], [0.5, -1, 0.5], [-0.5, -0.5, 1], [-1, 0.5, 0.5], [-0.5, 1, -0.5], [0.5, 0.5, -1]],
};
var currentUnit = [];
var targetCell = [];
var playerList = [];
var startList = [];
var targetList = [];
var availableCells = [];
var currentPlayer = 0;
var repliedUsers = [];
var endflags = [];
var gameEndFlag = false;
var step = 0; // for mode 2
var panel = [];
var mode = 1;
var ranking = [];
var players = [];
var timeHandlers = [];
var s = 0;
var fff = -1; // for mode 2

panel = [
    [4, -8, 4], [3, -7, 4], [4, -7, 3], [2, -6, 4], [3, -6, 3], [4, -6, 2], [1, -5, 4], [2, -5, 3], [3, -5, 2], [4, -5, 1],
    [-8, 4, 4], [-7, 4, 3], [-7, 3, 4], [-6, 4, 2], [-6, 3, 3], [-6, 2, 4], [-5, 4, 1], [-5, 3, 2], [-5, 2, 3], [-5, 1, 4],
    [4, 4, -8], [4, 3, -7], [3, 4, -7], [4, 2, -6], [3, 3, -6], [2, 4, -6], [4, 1, -5], [3, 2, -5], [2, 3, -5], [1, 4, -5]
]
for (var i = -4; i <= 8; i++) {
    for (var j = -4; j <= 4 - i; j++) {
        panel.push(copyObject([i, j, -i - j]));
    }
}
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

if (!trace) {
    var trace = function () {
        console.trace(JSON.stringify(arguments));
    }
}

function resetRepliedUsers() {
    repliedUsers = [];
}

function isUserRepliedAlready(user) {
    return repliedUsers.indexOf(user) >= 0;
}

function markUserReplied(user) {
    if (isUserRepliedAlready(user)) {
        return false;
    }
    repliedUsers.push(user);
    return true;
}

function isAllUsersReplied() {
    return repliedUsers.length === playerCnt;
}

function initHandlers() {
    ServerCommService.addRequestHandler(
        MESSAGE_TYPE.CS_RESTART_GAME,
        startGame
    );
    ServerCommService.addRequestHandler(
        MESSAGE_TYPE.CS_SELECT_UNIT,
        selectUnit
    );
    ServerCommService.addRequestHandler(
        MESSAGE_TYPE.CS_CLAIM_MOVE,
        moveUnit
    );
}

function init() {
    startGame({ playerCnt: 2, mode: 1 }, 0);
}

function startGame(params, room) {
    // clear parameters
    playerCnt = params.playerCnt;
    mode = params.mode;
    playerList = [];
    targetList = [];
    endflags = [];
    ranking = [];
    gameEndFlag = false;
    players = [];
    step = 0;
    fff = -1;

    /**
     * The commented players(1, 4, 3, 6) is neccessary to test the end of players' moves.
     * For instance commented player1 variable is similar to uncommented player4 variable. Only last two points are different.
     * And the commented player4 variable is similar to uncommented player1 variable. Only last point is different.
     * So, if you start the game the player1 and player4 can reach their target place(opposite side) quickly.
     * The same goes for player3 and player6.
     */

    //starting positions of players
    var player1 = [[8, -4, -4], [7, -4, -3], [7, -3, -4], [6, -4, -2], [6, -3, -3], [6, -2, -4], [5, -4, -1], [5, -3, -2], [5, -2, -3], [5, -1, -4]];
    // var player1 = [[-8, 4, 4], [-7, 4, 3], [-7, 3, 4], [-6, 4, 2], [-6, 3, 3], [-6, 2, 4], [-5, 4, 1], [-5, 3, 2], [-4, 2, 2], [-4, 1, 3]];
    var player2 = [[4, -8, 4], [3, -7, 4], [4, -7, 3], [2, -6, 4], [3, -6, 3], [4, -6, 2], [1, -5, 4], [2, -5, 3], [3, -5, 2], [4, -5, 1]];
    // var player2 = [[-4, 8, -4], [-3, 7, -4], [-4, 7, -3], [-2, 6, -4], [-3, 6, -3], [-4, 6, -2], [-1, 5, -4], [-2, 5, -3], [-3, 5, -2], [-4, 4, 0]];
    var player3 = [[-4, -4, 8], [-4, -3, 7], [-3, -4, 7], [-4, -2, 6], [-3, -3, 6], [-2, -4, 6], [-4, -1, 5], [-3, -2, 5], [-2, -3, 5], [-1, -4, 5]];
    // var player3 = [[4, 4, -8], [4, 3, -7], [3, 4, -7], [4, 2, -6], [3, 3, -6], [2, 4, -6], [4, 1, -5], [3, 2, -5], [2, 3, -5], [1, 3, -4]];
    var player4 = [[-8, 4, 4], [-7, 4, 3], [-7, 3, 4], [-6, 4, 2], [-6, 3, 3], [-6, 2, 4], [-5, 4, 1], [-5, 3, 2], [-5, 2, 3], [-5, 1, 4]];
    // var player4 = [[8, -4, -4], [7, -4, -3], [7, -3, -4], [6, -4, -2], [6, -3, -3], [6, -2, -4], [5, -4, -1], [5, -3, -2], [4, -2, -2], [5, -1, -4]];
    var player5 = [[-4, 8, -4], [-3, 7, -4], [-4, 7, -3], [-2, 6, -4], [-3, 6, -3], [-4, 6, -2], [-1, 5, -4], [-2, 5, -3], [-3, 5, -2], [-4, 5, -1]];
    // var player5 = [[4, -8, 4], [3, -7, 4], [4, -7, 3], [2, -6, 4], [3, -6, 3], [4, -6, 2], [1, -5, 4], [2, -5, 3], [3, -5, 2], [4, -4, 0]];
    var player6 = [[4, 4, -8], [4, 3, -7], [3, 4, -7], [4, 2, -6], [3, 3, -6], [2, 4, -6], [4, 1, -5], [3, 2, -5], [2, 3, -5], [1, 4, -5]];
    // var player6 = [[-4, -4, 8], [-4, -3, 7], [-3, -4, 7], [-4, -2, 6], [-3, -3, 6], [-2, -4, 6], [-4, -1, 5], [-3, -2, 5], [-2, -3, 5], [-1, -3, 4]];
    //target positions of players
    var target1 = [[-8, 4, 4], [-7, 4, 3], [-7, 3, 4], [-6, 4, 2], [-6, 3, 3], [-6, 2, 4], [-5, 4, 1], [-5, 3, 2], [-5, 2, 3], [-5, 1, 4]];
    var target2 = [[-4, 8, -4], [-3, 7, -4], [-4, 7, -3], [-2, 6, -4], [-3, 6, -3], [-4, 6, -2], [-1, 5, -4], [-2, 5, -3], [-3, 5, -2], [-4, 5, -1]];
    var target3 = [[4, 4, -8], [4, 3, -7], [3, 4, -7], [4, 2, -6], [3, 3, -6], [2, 4, -6], [4, 1, -5], [3, 2, -5], [2, 3, -5], [1, 4, -5]];
    var target4 = [[8, -4, -4], [7, -4, -3], [7, -3, -4], [6, -4, -2], [6, -3, -3], [6, -2, -4], [5, -4, -1], [5, -3, -2], [5, -2, -3], [5, -1, -4]];
    var target5 = [[4, -8, 4], [3, -7, 4], [4, -7, 3], [2, -6, 4], [3, -6, 3], [4, -6, 2], [1, -5, 4], [2, -5, 3], [3, -5, 2], [4, -5, 1]];
    var target6 = [[-4, -4, 8], [-4, -3, 7], [-3, -4, 7], [-4, -2, 6], [-3, -3, 6], [-2, -4, 6], [-4, -1, 5], [-3, -2, 5], [-2, -3, 5], [-1, -4, 5]];
    switch (playerCnt) {
        case 2:
            playerList.push(copyObject(player1));
            playerList.push(copyObject(player4));
            targetList.push(copyObject(target1));
            targetList.push(copyObject(target4));
            break;
        case 3:
            if (mode === 1) {
                playerList.push(copyObject(player1));
                playerList.push(copyObject(player3));
                playerList.push(copyObject(player5));
                targetList.push(copyObject(target1));
                targetList.push(copyObject(target3));
                targetList.push(copyObject(target5));
            } else if (mode === 2) {
                ////////////
                playerList.push(copyObject(player1));
                playerList.push(copyObject(player2));
                playerList.push(copyObject(player3));
                playerList.push(copyObject(player4));
                playerList.push(copyObject(player5));
                playerList.push(copyObject(player6));
                targetList.push(copyObject(target1));
                targetList.push(copyObject(target2));
                targetList.push(copyObject(target3));
                targetList.push(copyObject(target4));
                targetList.push(copyObject(target5));
                targetList.push(copyObject(target6));
            }
            break;
        case 4:
            playerList.push(copyObject(player1));
            playerList.push(copyObject(player3));
            playerList.push(copyObject(player4));
            playerList.push(copyObject(player6));
            targetList.push(copyObject(target1));
            targetList.push(copyObject(target3));
            targetList.push(copyObject(target4));
            targetList.push(copyObject(target6));
            break;
        case 5:
            playerList.push(copyObject(player1));
            playerList.push(copyObject(player2));
            playerList.push(copyObject(player3));
            playerList.push(copyObject(player4));
            playerList.push(copyObject(player5));
            targetList.push(copyObject(target1));
            targetList.push(copyObject(target2));
            targetList.push(copyObject(target3));
            targetList.push(copyObject(target4));
            targetList.push(copyObject(target5));
            break;
        case 6:
            playerList.push(copyObject(player1));
            playerList.push(copyObject(player2));
            playerList.push(copyObject(player3));
            playerList.push(copyObject(player4));
            playerList.push(copyObject(player5));
            playerList.push(copyObject(player6));
            targetList.push(copyObject(target1));
            targetList.push(copyObject(target2));
            targetList.push(copyObject(target3));
            targetList.push(copyObject(target4));
            targetList.push(copyObject(target5));
            targetList.push(copyObject(target6));
            break;
        default:
            playerList.push(copyObject(player1));
            playerList.push(copyObject(player4));
            targetList.push(copyObject(target1));
            targetList.push(copyObject(target4));
            break;
    }
    Array(playerCnt).fill().forEach(function (e, i) {
        endflags.push(false);
        players.push(i);
    });
    startList = copyObject(playerList);
    currentPlayer = 0;
    ServerCommService.send(
        MESSAGE_TYPE.SC_START_GAME,
        {
            playerList: playerList,
            user: currentPlayer,
        },
        currentPlayer,
    );
    timeHandlers.forEach(function (e) {
        clearTimeout(e);
    });
    timeHandlers = [];
    askUser(currentPlayer);
}

function isEmpty(unit) {
    for (var i = 0; i < playerList.length; i++) {
        if (isIn2DArray(playerList[i], unit)) {
            return false;
        }
    }
    return true;
}

function getAvailableCells(unit) {
    if (s === 0) {
        s += 1;
        Array(6).fill().forEach(function (e, i) {
            var newCell = sumArrays(unit, cubic.NEIGHBOR_OFFSETS[i]);
            if (isIn2DArray(panel, newCell)) {
                if (isEmpty(newCell) && !isIn2DArray(availableCells, newCell)) {
                    availableCells.push(copyObject(newCell));
                } else if (isIn2DArray(availableCells, newCell)) {

                } else {
                    getAvailableCells(sumArrays(newCell, cubic.NEIGHBOR_OFFSETS[i]));
                }
            }
        });
    }
    else {
        if (isEmpty(unit) && isIn2DArray(panel, unit)) {
            if (!isIn2DArray(availableCells, unit)) {
                availableCells.push(copyObject(unit));
                Array(6).fill().forEach(function (e, i) {
                    var newCell = sumArrays(unit, cubic.NEIGHBOR_OFFSETS[i]);
                    if (isIn2DArray(panel, newCell)) {
                        if (!isEmpty(newCell)) {
                            getAvailableCells(sumArrays(newCell, cubic.NEIGHBOR_OFFSETS[i]));
                        }
                    }
                });
            }
        }
    }
}

function askUser(user) {
    trace("ask user to claim put stone : " + user);
    step = 0;
    // if (mode === 2) {
    //     fff = (fff + 1) % (players.length * 2);
    //     step = Math.floor(fff / players.length);
    // }
    ServerCommService.send(
        MESSAGE_TYPE.SC_ASK_USER,
        {
            user: user,
            // step: step,
        },
        1,
    );

    TimeoutManager.setNextTimeout(function () {
        var r = Math.floor(Math.random() * 10);
        s = 0;
        availableCells = [];
        currentUnit = currentUnit.length === 0 ? playerList[user + step * playerCnt][r] : currentUnit;
        getAvailableCells(currentUnit);
        exceptAvailableCells();
        var random = Math.floor(Math.random() * availableCells.length);
        moveUnit({ currentUnit: currentUnit, targetCell: availableCells[random], user: user }, 1);
    });
    timeHandlers.push(TimeoutManager.timeoutHandler);
}

function exceptAvailableCells() {
    var result = [];
    for (var i = 0; i < availableCells.length; i++) {
        if (isIn2DArray(targetList[currentPlayer + step * playerCnt], currentUnit)) {
            if (isIn2DArray(targetList[currentPlayer + step * playerCnt], availableCells[i])) {
                result.push(copyObject(availableCells[i]));
            }
        } else {
            var flag = false;
            for (var j = 0; j < targetList.length; j++) {
                if (j !== currentPlayer + step * playerCnt && isIn2DArray(targetList[j], availableCells[i]) && !isIn2DArray(startList[currentPlayer + step * playerCnt], availableCells[i])) {
                    flag = true;
                    break;
                }
                if (j !== currentPlayer + step * playerCnt && isIn2DArray(startList[j], availableCells[i]) && !isIn2DArray(targetList[currentPlayer + step * playerCnt], availableCells[i])) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                result.push(copyObject(availableCells[i]));
            }
        }
    }
    availableCells = copyObject(result);
}

function selectUnit(params, room) {
    currentUnit = [params.u, params.v, params.w];
    step = params.step;
    availableCells = [];
    s = 0;
    getAvailableCells(currentUnit);
    exceptAvailableCells();
    ServerCommService.send(
        MESSAGE_TYPE.SC_AVAIL_CELLS,
        {
            availableCells: availableCells,
            user: currentPlayer,
        },
        1
    );
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

function moveUnit(params, room) {
    TimeoutManager.clearNextTimeout();
    timeHandlers.splice(timeHandlers.indexOf(TimeoutManager.timeoutHandler), 1);
    currentUnit = copyObject(params.currentUnit);
    if (params.targetCell === undefined) {
        currentPlayer = setNextUser(currentPlayer);
        askUser(currentPlayer);
        players = [];
        Array(playerCnt).fill().forEach(function (e, i) {
            if (!endflags[i]) {
                players.push(i);
            }
        });
        currentUnit = [];
        targetCell = [];
        return;
    }
    targetCell = copyObject(params.targetCell);
    // if (!markUserReplied(user)) {
    //     return;
    // }
    playerList[currentPlayer + playerCnt * step] = replaceSubarray(playerList[currentPlayer + playerCnt * step], currentUnit, targetCell);
    if (arraysEqual(playerList[currentPlayer], targetList[currentPlayer])) {
        if (mode === 2) {
            if (arraysEqual(playerList[currentPlayer + playerCnt], targetList[currentPlayer + playerCnt])) {
                endflags[currentPlayer] = true;
                ranking.push(currentPlayer);
                fff = -1;
            }
        } else {
            endflags[currentPlayer] = true;
            ranking.push(currentPlayer);
        }
    }
    gameOver();
    var entered = false;
    if (!isIn2DArray(targetList[currentPlayer + playerCnt * step], currentUnit) && isIn2DArray(targetList[currentPlayer + playerCnt * step], targetCell)) {
        entered = true;
    }
    ServerCommService.send(
        MESSAGE_TYPE.SC_MOVE_UNIT,
        {
            result: true,
            finish: endflags[currentPlayer],
            user: currentPlayer,
            currentUnit: currentUnit,
            targetCell: targetCell,
            ranking: ranking,
            entered: entered,
        },
        1
    );
    currentUnit = [];
    targetCell = [];
    if (gameEndFlag) {
        ServerCommService.send(
            MESSAGE_TYPE.SC_END_GAME,
            {
                ranking: ranking,
            },
            1
        );
    } else {
        currentPlayer = setNextUser(currentPlayer);
        askUser(currentPlayer);
        players = [];
        Array(playerCnt).fill().forEach(function (e, i) {
            if (!endflags[i]) {
                players.push(i);
            }
        });
    }
}

function setNextUser(user) {
    var index = players.indexOf(user);
    var next = (index + 1) % players.length;
    return players[next];
}

// finish the game or mission
function gameOver() {
    if (ranking.length === playerCnt - 1) {
        for (var i = 0; i < playerCnt; i++) {
            if (ranking.indexOf(i) === -1)
                ranking.push(i);
        }
        gameEndFlag = true;
    }
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
            timeLimit ? timeLimit * 1000 : (TIME_LIMIT) * 1000
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