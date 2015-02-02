/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var ASSETS, BLOCK_HEIGHT, BLOCK_NUM, BLOCK_NUM_X, BLOCK_NUM_Y, BLOCK_OFFSET_X, BLOCK_OFFSET_Y, BLOCK_WIDTH, FONT_FAMILY_FLAT, FONT_SIZE_TIME, LIMIT_TIME, SCREEN_CENTER_X, SCREEN_CENTER_Y, SCREEN_HEIGHT, SCREEN_WIDTH;

	SCREEN_WIDTH = 680;

	SCREEN_HEIGHT = 960;

	SCREEN_CENTER_X = SCREEN_WIDTH / 2;

	SCREEN_CENTER_Y = SCREEN_HEIGHT / 2;

	BLOCK_NUM_X = 5;

	BLOCK_NUM_Y = 5;

	BLOCK_NUM = BLOCK_NUM_X * BLOCK_NUM_Y;

	BLOCK_OFFSET_X = 99;

	BLOCK_OFFSET_Y = 240;

	BLOCK_WIDTH = 120;

	BLOCK_HEIGHT = 120;

	FONT_FAMILY_FLAT = "'Helvetica-Light' 'Meiryo' sans-serif";

	LIMIT_TIME = 3000;

	FONT_SIZE_TIME = 100;

	ASSETS = {
	  "iwiImage": "./assets/iwi60.png",
	  "bgm": "./assets/boss.mp3",
	  "pinponSE": "./assets/explosion.mp3",
	  "booSE": "./assets/miss.mp3",
	  "end": "./assets/end.mp3"
	};

	tm.main(function() {
	  var app, loading;
	  app = tm.app.CanvasApp("#world");
	  app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
	  app.fitWindow();
	  app.background = "rgba(250,250,250,1.0)";
	  app.replaceScene(TitleScene());
	  loading = tm.app.LoadingScene({
	    width: SCREEN_WIDTH,
	    height: SCREEN_HEIGHT,
	    assets: ASSETS,
	    nextScene: TitleScene
	  });
	  app.replaceScene(loading);
	  return app.run();
	});

	tm.define("GameScene", {
	  superClass: "tm.app.Scene",
	  init: function() {
	    var block, bomCount, centerImg, i, index, j, k, r, restartBtn, self, titleBtn, _i, _j, _k, _len, _ref;
	    this.superInit();
	    tm.asset.AssetManager.get("bgm").play();
	    self = this;
	    bomCount = 0;
	    this.blockGroup = tm.app.CanvasElement();
	    this.addChild(this.blockGroup);
	    r = tm.util.Random.randint(0, BLOCK_NUM - 1);
	    for (i = _i = 0; _i <= 4; i = ++_i) {
	      for (j = _j = 0; _j <= 4; j = ++_j) {
	        block = Block().addChildTo(this.blockGroup);
	        block.x = j * 125 + BLOCK_OFFSET_X;
	        block.y = i * 125 + BLOCK_OFFSET_Y;
	        _ref = this.blockGroup.children;
	        for (index = _k = 0, _len = _ref.length; _k < _len; index = ++_k) {
	          k = _ref[index];
	          if (index === r) {
	            k.imgEnable();
	          } else {
	            k.imgDisable();
	          }
	        }
	        block.onpointingstart = function() {
	          var _l, _len1, _ref1, _results;
	          if (this.isVisible === true) {
	            tm.asset.AssetManager.get("pinponSE").clone().play();
	            this.imgDisable();
	            bomCount += 1;
	            self.bomCountLabel.text = bomCount.toString();
	            r = tm.util.Random.randint(0, BLOCK_NUM - 1);
	            _ref1 = self.blockGroup.children;
	            _results = [];
	            for (index = _l = 0, _len1 = _ref1.length; _l < _len1; index = ++_l) {
	              k = _ref1[index];
	              if (index === r) {
	                _results.push(k.imgEnable());
	              } else {
	                _results.push(k.imgDisable());
	              }
	            }
	            return _results;
	          } else {
	            return tm.asset.AssetManager.get("booSE").clone().play();
	          }
	        };
	      }
	    }
	    this.bomCountLabel = tm.app.Label("0").addChildTo(this);
	    this.bomCountLabel.setPosition(SCREEN_CENTER_X - 50, 160).setFillStyle("#444").setAlign("right").setBaseline("bottom").setFontFamily(FONT_FAMILY_FLAT).setFontSize(FONT_SIZE_TIME);
	    this.timerLabel = tm.app.Label("").addChildTo(this);
	    this.timerLabel.setPosition(650, 160).setFillStyle("#444").setAlign("right").setBaseline("bottom").setFontFamily(FONT_FAMILY_FLAT).setFontSize(FONT_SIZE_TIME);
	    centerImg = tm.display.Sprite("iwiImage", 90, 90).addChildTo(this);
	    centerImg.position.set(SCREEN_CENTER_X, 110);
	    titleBtn = tm.app.FlatButton({
	      width: 300,
	      height: 100,
	      text: "TITLE",
	      bgColor: "#888"
	    }).addChildTo(this);
	    titleBtn.position.set(180, 880);
	    titleBtn.onpointingend = function() {
	      return self.app.replaceScene(TitleScene());
	    };
	    restartBtn = tm.app.FlatButton({
	      width: 300,
	      height: 100,
	      text: "RESTART",
	      bgColor: "#888"
	    }).addChildTo(this);
	    restartBtn.position.set(500, 880);
	    return restartBtn.onpointingstart = function() {
	      return self.app.replaceScene(GameScene());
	    };
	  },
	  update: function(app) {
	    var time, timeStr;
	    time = LIMIT_TIME - parseInt((app.frame / app.fps) * 100, 10);
	    if (time < 0) {
	      this.app.replaceScene(ResultScene(this.children[1].text));
	      tm.asset.AssetManager.get("bgm").stop();
	      tm.asset.AssetManager.get("end").clone().play();
	    }
	    timeStr = time.toString();
	    return this.timerLabel.text = timeStr.replace(/(\d)(?=(\d\d)+$)/g, "$1.");
	  },
	  onenter: function(e) {
	    e.app.pushScene(CountdownScene());
	    return this.onenter = null;
	  }
	});

	tm.define("Block", {
	  superClass: "tm.app.Shape",
	  init: function() {
	    var angle, self;
	    this.superInit(BLOCK_HEIGHT, BLOCK_HEIGHT);
	    self = this;
	    this.setInteractive(true);
	    this.setBoundingType("rect");
	    angle = tm.util.Random.randint(0, 360);
	    this.canvas.clearColor("hsl({0}, 80%, 70%)".format(angle));
	    this.blockImage = tm.display.Sprite("iwiImage", 120, 120).setVisible(false).addChildTo(this);
	    return this.isVisible = false;
	  },
	  imgEnable: function() {
	    this.isVisible = true;
	    return this.blockImage.setVisible(true);
	  },
	  imgDisable: function() {
	    this.isVisible = false;
	    return this.blockImage.setVisible(false);
	  }
	});

	tm.define("TitleScene", {
	  superClass: "tm.app.Scene",
	  init: function() {
	    this.superInit();
	    this.fromJSON({
	      children: [
	        {
	          type: "Label",
	          name: "titleLabel",
	          text: "IWI BOMBER!!!",
	          x: SCREEN_CENTER_X,
	          y: 200,
	          fillStyle: "#444",
	          fontSize: 60,
	          fontFamily: FONT_FAMILY_FLAT,
	          align: "center",
	          baseline: "middle"
	        }, {
	          type: "Label",
	          name: "nextLabel",
	          text: "タッチして開始",
	          x: SCREEN_CENTER_X,
	          y: 650,
	          fillStyle: "#444",
	          fontSize: 26,
	          fontFamily: FONT_FAMILY_FLAT,
	          align: "center",
	          baseline: "middle"
	        }
	      ]
	    });
	    return this.nextLabel.tweener.fadeOut(500).fadeIn(1000).setLoop(true);
	  },
	  onpointingstart: function() {
	    return this.app.replaceScene(GameScene());
	  }
	});

	tm.define("ResultScene", {
	  superClass: "tm.app.Scene",
	  init: function(param) {
	    var self;
	    this.superInit();
	    this.fromJSON({
	      children: [
	        {
	          type: "Label",
	          name: "hitLabel",
	          text: "0",
	          x: SCREEN_CENTER_X,
	          y: 320,
	          fillStyle: "#888",
	          fontSize: 100,
	          fontFamily: FONT_FAMILY_FLAT,
	          align: "center"
	        }, {
	          type: "FlatButton",
	          name: "tweetButton",
	          x: SCREEN_CENTER_X - 160,
	          y: 650,
	          init: [
	            {
	              text: "TWEET",
	              bgColor: "hsl(240, 80%, 70%)"
	            }
	          ]
	        }, {
	          type: "FlatButton",
	          name: "backButton",
	          init: [
	            {
	              text: "もう一回",
	              bgColor: "hsl(240, 0%, 70%)"
	            }
	          ],
	          x: SCREEN_CENTER_X + 160,
	          y: 650
	        }
	      ]
	    });
	    this.hitLabel.text = param + "回\nまだまだですね";
	    this.tweetButton.onclick = function() {
	      var twitterURL;
	      twitterURL = tm.social.Twitter.createURL({
	        type: "tweet",
	        text: "例のあの人を" + param + "回タッチしました",
	        hashtags: "iwi-bomber",
	        url: window.document.location.href
	      });
	      return window.open(twitterURL);
	    };
	    self = this;
	    return this.backButton.onpointingstart = function() {
	      return self.app.replaceScene(TitleScene());
	    };
	  }
	});

	tm.define("CountdownScene", {
	  superClass: "tm.app.Scene",
	  init: function() {
	    var filter, label, self;
	    this.superInit();
	    self = this;
	    filter = tm.app.Shape(SCREEN_WIDTH, SCREEN_HEIGHT).addChildTo(this);
	    filter.origin.set(0, 0);
	    filter.canvas.clearColor("rgba(250, 250, 250, 1.0");
	    label = tm.app.Label(3).addChildTo(this);
	    label.setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y).setFillStyle("#888").setFontFamily(FONT_FAMILY_FLAT).setFontSize(512).setAlign("center").setBaseline("middle");
	    return label.tweener.set({
	      scaleX: 0.5,
	      scaleY: 0.5,
	      text: 3
	    }).scale(1).set({
	      scaleX: 0.5,
	      scaleY: 0.5,
	      text: 2
	    }).scale(1).set({
	      scaleX: 0.5,
	      scaleY: 0.5,
	      text: 1
	    }).scale(1).call(function() {
	      self.app.frame = 0;
	      return self.app.popScene();
	    });
	  }
	});


/***/ }
/******/ ])