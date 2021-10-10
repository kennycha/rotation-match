import { RefObject, useEffect } from "react";
import * as BABYLON from "@babylonjs/core";

interface Params {
  canvasRef: RefObject<HTMLCanvasElement>;
  setScenes: React.Dispatch<React.SetStateAction<BABYLON.Scene[]>>;
}

const useInitiateScene = (params: Params) => {
  const { canvasRef, setScenes } = params;

  useEffect(() => {
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
      };

      const engine = new BABYLON.Engine(canvasRef.current, true);
      const scene = new BABYLON.Scene(engine);

      scene.onReadyObservable.addOnce((scene) => {
        handleSceneReady(scene);
        setScenes((prev) => [...prev, scene]);
      });

      console.log("for rerender");
      console.log("for rerender");

      engine.runRenderLoop(() => {
        scene.render();
      });

      return () => {
        engine.dispose();
        setScenes((prev) => prev.filter((s) => s.uid !== scene.uid));
      };
    }
  }, [canvasRef, setScenes]);
};

export default useInitiateScene;
