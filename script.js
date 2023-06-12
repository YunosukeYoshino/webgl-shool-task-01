// 必要なモジュールを読み込み
import * as THREE from "./lib/three.module.js";
import { OrbitControls } from "./lib/OrbitControls.js";

// DOM がパースされたことを検出するイベントを設定
window.addEventListener(
  "DOMContentLoaded",
  () => {
    // 制御クラスのインスタンスを生成
    const app = new App3();

    // 初期化
    app.init();

    // 描画
    app.render();
  },
  false
);

/**
 * three.js を効率よく扱うために自家製の制御クラスを定義
 */
class App3 {
  /**
   * カメラ定義のための定数
   */
  static get CAMERA_PARAM() {
    return {
      fovy: 60,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 1500.0,
      x: 0.0,
      y: 2.0,
      z: 500.0,
      lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
    };
  }
  /**
   * レンダラー定義のための定数
   */
  static get RENDERER_PARAM() {
    return {
      clearColor: "rgb(0,0,0)",
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  /**
   * マテリアル定義のための定数
   */

  static get MATERIAL_PARAM() {
    return {
      color: "0xffffff", // マテリアルの基本色
    };
  }

  /**
   * コンストラクタ
   * @constructor
   */
  constructor() {
    this.renderer; // レンダラ
    this.scene; // シーン
    this.camera; // カメラ
    this.geometry; // ジオメトリ
    this.material; // マテリアル
    this.box; // ボックスメッシュ
    this.boxArray;
    this.orangeLight;
    this.blueLight;
    this.yellowLight;
    // 再帰呼び出しのための this 固定
    this.render = this.render.bind(this);

    // リサイズイベント
    window.addEventListener(
      "resize",
      () => {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
      },
      false
    );
  }

  /**
   * 初期化処理
   */
  init() {
    // - レンダラの初期化 -----------------------------------------------------
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(
      new THREE.Color(App3.RENDERER_PARAM.clearColor)
    );
    this.renderer.setSize(
      App3.RENDERER_PARAM.width,
      App3.RENDERER_PARAM.height
    );
    const wrapper = document.querySelector("#webgl");
    wrapper.appendChild(this.renderer.domElement);

    // - シーンの初期化 -------------------------------------------------------
    this.scene = new THREE.Scene();

    // - ライトを定義 -------------------------------------------------------
    const violetLight = new THREE.PointLight(0xb799ff, 1);
    violetLight.position.set(200, -150, 0);
    this.scene.add(violetLight);

    const paleVioletLight = new THREE.DirectionalLight(0xacbcff, 1);
    paleVioletLight.position.set(-1, 0, 0);
    this.scene.add(paleVioletLight);

    const blueLight = new THREE.SpotLight(0xaee2ff, 1);
    blueLight.position.set(0, 40, 200);
    blueLight.target.position.set(0, 0, 0);
    blueLight.angle = Math.PI / 2;
    blueLight.penumbra = 0.5;
    blueLight.decay = 2;
    blueLight.distance = 0;

    this.scene.add(blueLight);

    // - カメラの初期化 -------------------------------------------------------
    this.camera = new THREE.PerspectiveCamera(
      App3.CAMERA_PARAM.fovy,
      App3.CAMERA_PARAM.aspect,
      App3.CAMERA_PARAM.near,
      App3.CAMERA_PARAM.far
    );
    this.camera.position.set(
      App3.CAMERA_PARAM.x,
      App3.CAMERA_PARAM.y,
      App3.CAMERA_PARAM.z
    );
    this.camera.lookAt(App3.CAMERA_PARAM.lookAt);

    // サイズを設定
    var width = 450;
    var height = 450;
    this.boxArray = [];
    this.geometry = new THREE.BoxGeometry(50, 50, 50); //箱の形(様々な種類がある)
    this.material = new THREE.MeshPhongMaterial(App3.MATERIAL_PARAM); //質感(様々な種類がある)

    for (var x = 0; x <= width; x += 50) {
      for (var y = 0; y <= height; y += 50) {
        // - メッシュの初期化 -----------------------------------------------------
        this.box = new THREE.Mesh(this.geometry, this.material); //メッシュ(形) = geometry + material
        this.box.position.set(x - width / 2, y - height / 2, 0);
        this.scene.add(this.box); //シーンにメッシュを追加する
        this.boxArray.push(this.box); //配列にpush
      }
    }

    // コントロール
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  /**
   * 描画処理
   */
  render() {
    // 恒常ループの設定
    requestAnimationFrame(this.render);

    // コントロールを更新
    this.controls.update();

    // 各ボックスを個別に回転させる
    for (var i = 0; i < this.boxArray.length; i++) {
      this.boxArray[i].rotation.x += 0.01;
      this.boxArray[i].rotation.y += 0.01;
    }
    // レンダラーで描画
    this.renderer.render(this.scene, this.camera);
  }
}
