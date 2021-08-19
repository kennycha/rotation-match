import React, {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  // useState,
} from "react";
import styled from "styled-components";
import * as BABYLON from "@babylonjs/core";
import * as dat from "dat.gui";

function App() {
  const leftCanvas = useRef<HTMLCanvasElement>(null);
  const rightCanvas = useRef<HTMLCanvasElement>(null);

  // type rotationType = "euler" | "quaternion";

  // const [currentRotationType, setCurrentRotationType] = useState<rotationType>(
  //   "euler"
  // );

  // const [eulerGUI, setEulerGUI] = useState<dat.GUI | null>(null);
  // const [quaternionGUI, setQuaternionGUI] = useState<dat.GUI | null>(null);

  type CanvasPosition = "left" | "right";

  const setRotationCanvas = useCallback(
    (
      canvasRef: RefObject<HTMLCanvasElement>,
      canvasPosition: CanvasPosition
    ) => {
      if (canvasRef.current) {
        const createDice = (scene: BABYLON.Scene) => {
          const columns = 6;
          const rows = 1;

          const faceUV = new Array(6);
          for (let i = 0; i < 6; i += 1) {
            faceUV[i] = new BABYLON.Vector4(
              i / columns,
              0,
              (i + 1) / columns,
              1 / rows
            );
          }

          const mat = new BABYLON.StandardMaterial("mat", scene);
          const texture = new BABYLON.Texture("dice.png", scene);
          mat.diffuseTexture = texture;

          const dice = BABYLON.MeshBuilder.CreateBox(
            "dice",
            { size: 1, faceUV, wrap: true },
            scene
          );
          dice.material = mat;

          return dice;
        };

        const createControl = (target: BABYLON.Mesh) => {
          const oldEulerGUI = document.querySelector(
            `#${canvasPosition}EulerDatGUI`
          );
          if (oldEulerGUI) {
            oldEulerGUI.remove();
          }
          const innerEulerGUI = new dat.GUI();
          innerEulerGUI.domElement.style.marginTop = "100px";
          innerEulerGUI.domElement.style.position = "absolute";
          innerEulerGUI.domElement.id = `${canvasPosition}EulerDatGUI`;
          if (canvasPosition === "left") {
            innerEulerGUI.domElement.style.left = "100px";
          } else {
            innerEulerGUI.domElement.style.right = "100px";
          }
          innerEulerGUI.add(
            target.rotation,
            "x",
            -Math.PI * 2,
            Math.PI * 2,
            0.01
          );
          innerEulerGUI.add(
            target.rotation,
            "y",
            -Math.PI * 2,
            Math.PI * 2,
            0.01
          );
          innerEulerGUI.add(
            target.rotation,
            "z",
            -Math.PI * 2,
            Math.PI * 2,
            0.01
          );
          // setEulerGUI(innerEulerGUI);
        };

        const handleSceneReady = (scene: BABYLON.Scene) => {
          scene.useRightHandedSystem = true;

          const arcRotateCamera = new BABYLON.ArcRotateCamera(
            "arcRotateCamera",
            0,
            0,
            10,
            BABYLON.Vector3.Zero(),
            scene
          );
          arcRotateCamera.setPosition(new BABYLON.Vector3(1, 1, 5));
          arcRotateCamera.attachControl(canvasRef.current, false, true);
          arcRotateCamera.allowUpsideDown = false;
          arcRotateCamera.minZ = 0.1;
          arcRotateCamera.inertia = 0.5;
          arcRotateCamera.wheelPrecision = 50;
          arcRotateCamera.wheelDeltaPercentage = 0.01;
          arcRotateCamera.lowerRadiusLimit = 0.1;
          arcRotateCamera.upperRadiusLimit = 20;
          arcRotateCamera.panningAxis = new BABYLON.Vector3(1, 1, 0);
          arcRotateCamera.pinchPrecision = 50;
          arcRotateCamera.panningInertia = 0.5;
          arcRotateCamera.panningDistanceLimit = 20;

          const hemisphericLight = new BABYLON.HemisphericLight(
            "hemisphericLight",
            new BABYLON.Vector3(1, 1, 1),
            scene
          );
          hemisphericLight.intensity = 0.7;

          const dice = createDice(scene);
          createControl(dice);
        };

        const engine = new BABYLON.Engine(canvasRef.current, true);
        const scene = new BABYLON.Scene(engine);

        scene.onReadyObservable.addOnce((scene) => {
          handleSceneReady(scene);
        });

        engine.runRenderLoop(() => {
          scene.render();
        });
      }
    },
    []
  );

  useEffect(() => {
    setRotationCanvas(leftCanvas, "left");
    setRotationCanvas(rightCanvas, "right");
  }, [setRotationCanvas]);

  // useEffect(() => {
  //   if (currentRotationType === "euler") {
  //   } else if (currentRotationType === "quaternion") {
  //   }
  // }, [currentRotationType]);

  return (
    <Container>
      <canvas ref={leftCanvas} className="rendering-canvas"></canvas>
      <canvas ref={rightCanvas} className="rendering-canvas"></canvas>
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;

  .rendering-canvas {
    width: 100%;
    height: 100%;
    position: relative;
  }
`;

export default App;
