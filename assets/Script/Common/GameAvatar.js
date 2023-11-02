import { TIME_LIMIT, ALARM_LIMIT } from "./Constants";
import { loadAvatar } from "./Common/SpriteHelper";

export default cc.Class({
  extends: cc.Component,

  properties: {
    avatarSprite: cc.Sprite,
    checkerSelect: cc.Prefab,
    nameLabelActive: cc.Label,
    nameLabelInactive: cc.Label,

    bgNode1Active: cc.Node,
    bgNode1Inactive: cc.Node,
    bgNode2Active: cc.Node,
    bgNode2Inactive: cc.Node,

    progressRoot: cc.Node,
    progressSprite: cc.Sprite,
    timerLabel: cc.Label,

    otherUserModal1: cc.Node,
    otherUserModal2: cc.Node,

    player1: cc.Label,
    player2: cc.Label,
    checkerLayout: cc.Node,

    _type: [],
    _timeLimit: [],
    _pname: "",
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    // this.notifyRoot.active = false;
    this._timeLimit = TIME_LIMIT;
    this.showProgressBar(false);
    this.checkerLayout.removeAllChildren();
  },

  start() { },

  showNotify_1() {
    let self = this;
    this.player1.string = this._pname;
    this.otherUserModal1.active = true;
    setTimeout(() => {
      self.otherUserModal1.active = false;
    }, ALARM_LIMIT * 1000);
  },

  showNotify_2(str) {
    let self = this;
    this.player2.string = str;
    this.otherUserModal2.active = true;
    setTimeout(() => {
      self.otherUserModal2.active = false;
    }, ALARM_LIMIT * 1000);
  },

  setChecker(mode, color) {
    this.checkerLayout.removeAllChildren();
    if (mode === 1) {
      let checkerSelect = cc.instantiate(this.checkerSelect);
      const checker = checkerSelect.getComponent('SetChecker');
      checker.setColor(color);
      this.checkerLayout.addChild(checkerSelect);
    } else if (mode === 2) {
      let checkerSelect = cc.instantiate(this.checkerSelect);
      const checker = checkerSelect.getComponent('SetChecker');
      checker.setColor(color[0]);
      let checkerSelect1 = cc.instantiate(this.checkerSelect);
      const checker1 = checkerSelect1.getComponent('SetChecker');
      checker1.setColor(color[1]);
      this.checkerLayout.addChild(checkerSelect);
      this.checkerLayout.addChild(checkerSelect1);
    }
  },

  setName(str) {
    this._pname = str;
    this.nameLabelActive.string = str.substring(0, 15);
    this.nameLabelInactive.string = str.substring(0, 15);
  },

  setAvatar(path) {
    if (this.path) {
      console.log("Avatar already set", this.path);
      return;
    }

    console.log("Setting avatar", path);
    this.path = path;
    loadAvatar(this.avatarSprite, path);
  },

  startCountdown(timeLimit) {
    this.progressSprite.fillRange = 1;
    if (timeLimit) {
      this._timeLimit = timeLimit;
    }
    this.showProgressBar(true);
  },

  stopCountdown() {
    this.showProgressBar(false);
  },

  isShowingProgressBar() {
    return this.progressRoot.active;
  },

  showProgressBar(visible) {
    this.progressRoot.active = visible;
    if (visible) {
      this.bgNode1Active.active = true;
      this.bgNode1Inactive.active = false;
      this.bgNode2Active.active = true;
      this.bgNode2Inactive.active = false;
      this.nameLabelActive.node.active = true;
      this.nameLabelInactive.node.active = false;

    } else {
      this.bgNode1Active.active = false;
      this.bgNode1Inactive.active = true;
      this.bgNode2Active.active = false;
      this.bgNode2Inactive.active = true;
      this.nameLabelActive.node.active = false;
      this.nameLabelInactive.node.active = true;
    }
  },

  update(dt) {
    if (!this.isShowingProgressBar()) {
      return;
    }

    var progress = this.progressSprite.fillRange;
    if (progress > 0) {
      progress -= dt / this._timeLimit;
      if (progress < 0) progress = 0;
      this.progressSprite.fillRange = progress;

      var sec = Math.ceil(progress * this._timeLimit);
      this.timerLabel.string = Math.floor(sec / 60) + ":" + (sec % 60);
    } else {
      this.showProgressBar(false);
    }
  },
});
