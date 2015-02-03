# スクリーンサイズを設定
SCREEN_WIDTH    = 680
SCREEN_HEIGHT   = 960
SCREEN_CENTER_X = SCREEN_WIDTH / 2
SCREEN_CENTER_Y = SCREEN_HEIGHT / 2

# ブロック定義
BLOCK_NUM_X    = 5
BLOCK_NUM_Y    = 5
BLOCK_NUM      = BLOCK_NUM_X * BLOCK_NUM_Y
BLOCK_OFFSET_X = 99
BLOCK_OFFSET_Y = 240
BLOCK_WIDTH    = 120
BLOCK_HEIGHT   = 120

# フラットデザイン用フォント
FONT_FAMILY_FLAT= "'Helvetica-Light' 'Meiryo' sans-serif"  

# 制限時間 ex: 3000 -> 30.00s
LIMIT_TIME = 3000

# 画面上のフォントサイズ
FONT_SIZE_TIME = 100

# アセットの読み込みパス
ASSETS = {
  "iwiImage":  "./assets/iwi60.png"
  "bgm":       "./assets/boss.mp3"
  "pinponSE":  "./assets/explosion.mp3"
  "booSE":     "./assets/miss.mp3"
  "end":       "./assets/end.mp3"
}

tm.main ->
  app = tm.app.CanvasApp("#world")
  # 画面サイズの設定
  app.resize(SCREEN_WIDTH, SCREEN_HEIGHT)
  # 画面サイズを自動にウィンドウに合わせる
  app.fitWindow()
  app.background = "rgba(250,250,250,1.0)"
  app.replaceScene TitleScene()

  # ローディング
  # 幅、高さ、アセットパス、ローディング完了後の画面
  loading = tm.app.LoadingScene({
    width: SCREEN_WIDTH
    height: SCREEN_HEIGHT
    assets: ASSETS
    nextScene: TitleScene
  })
  # シーン切り替え
  app.replaceScene loading
  app.run()

tm.define "GameScene",
  superClass: "tm.app.Scene"
  init: ->
    @superInit()

    tm.asset.AssetManager.get("bgm").play()

    self = this
    bomCount = 0

    # ブロックの集合
    @blockGroup = tm.app.CanvasElement()
    @addChild @blockGroup

    # 乱数を生成
    r = tm.util.Random.randint 0, BLOCK_NUM - 1 
    # 5*5マスのブロックの生成
    for i in [0..4]
      for j in [0..4]
        block = Block().addChildTo @blockGroup
        block.x =  j * 125 + BLOCK_OFFSET_X
        block.y =  i * 125 + BLOCK_OFFSET_Y
        # ブロックの配列の中の乱数の数と一致した場所に画像表示
        for k, index in @blockGroup.children
          if index is r
            k.imgEnable()
          else
            k.imgDisable()

        # クリックされたときの処理
        block.onpointingstart = ->
          # 表示されているところクリックした時
          if @isVisible is true
            # 正解のSE
            tm.asset.AssetManager.get("pinponSE").clone().play()
            # 表示を隠す
            @imgDisable()
            # 現在のカウントを増やす
            bomCount += 1
            self.bomCountLabel.text = bomCount.toString()
            # 次に画像を表示するブロックを決める
            # 乱数の生成
            r = tm.util.Random.randint 0, BLOCK_NUM - 1 
            # 乱数の場所を表示
            for k, index in self.blockGroup.children
              if index is r
                k.imgEnable()
              else
                k.imgDisable()
          else
            # 間違えた場所をクリックしたらミス効果音
            tm.asset.AssetManager.get("booSE").clone().play()

    # 爆破した数を表示するラベル
    @bomCountLabel = tm.app.Label("0").addChildTo this
    @bomCountLabel
      .setPosition SCREEN_CENTER_X - 50, 160
      .setFillStyle "#444"
      .setAlign "right"
      .setBaseline "bottom"
      .setFontFamily FONT_FAMILY_FLAT
      .setFontSize FONT_SIZE_TIME

    # タイマーラベル
    @timerLabel = tm.app.Label("").addChildTo this
    @timerLabel
      .setPosition 650, 160
      .setFillStyle "#444"
      .setAlign "right"
      .setBaseline "bottom"
      .setFontFamily FONT_FAMILY_FLAT
      .setFontSize FONT_SIZE_TIME 
    # 中心に画像表示
    centerImg = tm.display.Sprite "iwiImage", 90, 90
      .addChildTo this
    centerImg.position.set SCREEN_CENTER_X, 110

    # タイトルボタン
    titleBtn = tm.app.FlatButton({
      width: 300
      height: 100
      text: "TITLE"
      bgColor: "#888"
    }).addChildTo this
    titleBtn.position.set 180, 880
    titleBtn.onpointingend = ->
      self.app.replaceScene TitleScene()

    # リスタートボタン
    restartBtn = tm.app.FlatButton({
      width: 300
      height: 100
      text: "RESTART"
      bgColor: "#888"
    }).addChildTo(this)
    restartBtn.position.set 500, 880
    restartBtn.onpointingstart = ->
      self.app.replaceScene GameScene()

  update: (app) ->
    time = LIMIT_TIME - parseInt((app.frame / app.fps) * 100, 10)
    # タイムアップ後、リザルト画面へ
    if time < 0
      # todo:無理やりオブジェクトを切り開いたのでオブジェクト的な処理を
      @app.replaceScene ResultScene @children[1].text
      # 結果画面になるとき曲を止める
      tm.asset.AssetManager.get("bgm").stop()
      tm.asset.AssetManager.get("end").clone().play()
    # 文字列へ置換
    timeStr = time.toString()
    # ミリ秒以下に.を追加
    @timerLabel.text = timeStr.replace(/(\d)(?=(\d\d)+$)/g, "$1.")
  # このシーンが呼び出された時
  onenter: (e) ->
    e.app.pushScene CountdownScene()
    @onenter = null

tm.define "Block",
  superClass: "tm.app.Shape"
  init: ->
    @superInit BLOCK_HEIGHT, BLOCK_HEIGHT
    self = this
    # タッチ判定を有効にする
    @setInteractive true
    # 四角形のバインディングを設定
    @setBoundingType "rect"
    # 0 - 360の間の乱数を生成
    angle = tm.util.Random.randint 0, 360
    # ブロックの色を設定
    @canvas.clearColor "hsl({0}, 80%, 70%)".format(angle)
    # iwi画像を表示 初期状態では非表示に設定
    @blockImage = tm.display.Sprite "iwiImage", 120, 120
      .setVisible false
      .addChildTo this
    # 画像の表示・非表示の状態
    @isVisible = false
  # 画像の表示のトグル
  imgEnable: ->
    @isVisible = true
    @blockImage.setVisible true
  imgDisable: ->
    @isVisible = false
    @blockImage.setVisible false

# タイトルシーン
tm.define "TitleScene",
  superClass: "tm.app.Scene"
  init: ->
    @superInit()
    # fromJSON: jsonデータから自身のプロパティや子要素を生成
    @fromJSON({
      children: [
        {
          type: "Label"
          name: "titleLabel"
          text: "IWI BOMBER!!!"
          x: SCREEN_CENTER_X
          y: 200
          fillStyle: "#444"
          fontSize: 60
          fontFamily: FONT_FAMILY_FLAT
          align: "center"
          baseline: "middle"
        },
        {
          type: "Label"
          name: "nextLabel"
          text: "タッチして開始"
          x: SCREEN_CENTER_X
          y: 650
          fillStyle: "#444"
          fontSize: 26
          fontFamily: FONT_FAMILY_FLAT
          align: "center"
          baseline: "middle"
        }
      ]
    })
    # アニメーション
    @nextLabel.tweener
      .fadeOut 500
      .fadeIn 1000
      .setLoop true
  onpointingstart: ->
    @app.replaceScene GameScene()

# 結果画面
tm.define "ResultScene",
  superClass: "tm.app.Scene"
  # 爆破数を受け取る
  init: (param) ->
    @superInit()
    @fromJSON({
      children: [
        {
          type: "Label"
          name: "hitLabel"
          text: "0"
          x: SCREEN_CENTER_X
          y: 320
          fillStyle: "#888"
          fontSize: 100
          fontFamily: FONT_FAMILY_FLAT
          align: "center"
        },
        {
          type: "FlatButton"
          name: "tweetButton"
          x: SCREEN_CENTER_X - 160
          y: 650
          init: [
            {
              text: "TWEET"
              bgColor: "hsl(240, 80%, 70%)"
            }
          ]
        },
        {
          type: "FlatButton"
          name: "backButton"
          init: [
            {
              text: "もう一回"
              bgColor: "hsl(240, 0%, 70%)"
            }
          ]
          x: SCREEN_CENTER_X + 160
          y: 650
        }
      ]
    })

    # 引数で渡された爆破数をセット
    @hitLabel.text = "#{param}回\nまだまだですね"

    # tweetボタンのクリック処理
    @tweetButton.onclick = ->
      twitterURL = tm.social.Twitter.createURL({
        type: "tweet"
        text: "例のあの人を#{param}回タッチしました"
        hashtags: "iwi_bomber"
        url: window.document.location.href
      })
      window.open twitterURL
    self = this
    # バックボタンでタイトル画面に遷移
    @backButton.onpointingstart = ->
      self.app.replaceScene TitleScene()

tm.define "CountdownScene",
  superClass: "tm.app.Scene"
  init: ->
    @superInit()
    self = this

    filter = tm.app.Shape(SCREEN_WIDTH, SCREEN_HEIGHT)
      .addChildTo this
    filter.origin.set 0, 0
    filter.canvas.clearColor "rgba(250, 250, 250, 1.0"

    label = tm.app.Label(3).addChildTo this
    label
      .setPosition SCREEN_CENTER_X, SCREEN_CENTER_Y
      .setFillStyle "#888"
      .setFontFamily FONT_FAMILY_FLAT
      .setFontSize 512
      .setAlign "center"
      .setBaseline "middle"

    label.tweener
      .set({
        scaleX: 0.5
        scaleY: 0.5
        text: 3
      })
      .scale 1
      .set({
        scaleX: 0.5
        scaleY: 0.5
        text: 2
      })
      .scale 1
      .set({
        scaleX: 0.5
        scaleY: 0.5
        text: 1
      })
      .scale 1
      .call ->
        self.app.frame = 0
        self.app.popScene()
