import React, { useState, useEffect } from "react";
import * as THREE from "three";
import SceneManager from "./ThreeJSManager";
import { useThree } from "./ThreeJSManager/";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function ThreeCanvas(props) {
  const { width, height } = props;
  const [color, changeColor] = useState("00ffaa");
  const [showGrid, toggleShowGrid] = useState(true);
  const [showCube, toggleShowCube] = useState(true);

  const Grid = () => {
    useThree(({ scene }) => {
      const grid = new THREE.GridHelper(10000, 1000);
      scene.add(grid);
      return grid;
    });
    return null;
  };

  const Cube = (props) => {
    const { h = 50, w = 50, d = 50, color = 0x00ff00 } = props;
    const setup = (context) => {
      const { scene } = context;
      const cubegeometry = new THREE.BoxGeometry(h, w, d);
      const cubematerial = new THREE.MeshPhongMaterial({ color });
      const cube = new THREE.Mesh(cubegeometry, cubematerial);
      cube.castShadow = true;
      cube.position.y = 50;
      scene.add(cube);
      return cube;
    };
    const { getEntity, timer } = useThree(setup);
    useEffect(() => {
      const cube = getEntity();
      cube.material.color.setHex(props.color);
    }, [props.color]);
    useEffect(() => {
      const cube = getEntity();
      const oscillator = Math.sin(timer / 1000) * Math.PI - Math.PI;
      cube.rotation.y = oscillator;
      cube.rotation.z = -oscillator;
    }, [timer]);
    return null;
  };

  const CameraControls = () => {
    useThree(({ camera, canvas }) => {
      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = true;
      controls.dampingFactor = 0.12;
      controls.rotateSpeed = 0.08;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.08;
      controls.maxPolarAngle = Math.PI / 2;
      controls.enableKeys = false;
      controls.update();
    });
    return null;
  };

  const getCamera = ({ offsetWidth, offsetHeight }) => {
    const camera = new THREE.PerspectiveCamera(
      75,
      offsetWidth / offsetHeight,
      0.1,
      1000
    );
    camera.position.set(50, 150, 0);
    return camera;
  };

  const getRenderer = (canvas) => {
    const context = canvas.getContext("webgl");
    const renderer = new THREE.WebGLRenderer({
      canvas,
      context,
    });
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    return renderer;
  };

  const getScene = () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);
    scene.fog = new THREE.FogExp2(0xcccccc, 0.002);
    const light = new THREE.SpotLight(0xffffff, 1, 750, 1);
    light.position.set(50, 200, 0);
    light.rotation.z = (90 * Math.PI) / 180;
    scene.add(light);
    const planeGeometry = new THREE.PlaneBufferGeometry(10000, 10000, 32, 32);
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = (-90 * Math.PI) / 180;
    plane.receiveShadow = true;
    scene.add(plane);
    return scene;
  };

  return (
    <SceneManager
      getCamera={getCamera}
      getRenderer={getRenderer}
      getScene={getScene}
      canvasStyle={{
        height: height,
        width: width,
        zIndex: -1,
      }}
    >
      <CameraControls />
      {showGrid && <Grid />}
      {showCube && <Cube color={Number(`0x${color}`)} />}
      <div
        style={{
          width: "100px",
          padding: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <input
            type="text"
            placeholder="enter a hex color"
            onChange={(e) => changeColor(e.target.value)}
          />

          <label>
            <input
              type="checkbox"
              checked={showGrid}
              onChange={() => toggleShowGrid(!showGrid)}
            />
            show grid
          </label>
          <label>
            <input
              type="checkbox"
              checked={showCube}
              onChange={() => toggleShowCube(!showCube)}
            />
            show cube
          </label>
        </div>
      </div>
    </SceneManager>
  );
}
