import { useEffect, useRef, useState } from "react";
import * as BABYLON from "@babylonjs/core";
import styled from "styled-components";
import useInitiateScene from "./useInitiateScene";

function App() {
  const [scenes, setScenes] = useState<BABYLON.Scene[]>([]);
  const leftCanvas = useRef<HTMLCanvasElement>(null);
  const rightCanvas = useRef<HTMLCanvasElement>(null);

  // forEach가 아니라, 하나하나 인자로 넣어줘야 무한 루프에 안 빠짐.. 이유는 아직 모르겠..
  useInitiateScene({ canvasRef: leftCanvas, setScenes });
  useInitiateScene({ canvasRef: rightCanvas, setScenes });

  useEffect(() => {
    console.log("scenes: ", scenes);
  }, [scenes]);

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
