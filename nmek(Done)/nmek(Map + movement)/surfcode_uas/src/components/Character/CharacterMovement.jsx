import React, { useEffect, useRef, useState } from "react";
import walkSheet from "../../assets/Walk.png";
import idleSheet from "../../assets/Idle.png";

// Ukuran dan pengaturan sprite
const frameWidth = 64;
const frameHeight = 64;
const framesPerRow = 9;

// Urutan baris animasi untuk arah gerakan, jangan diubah ges
const directionMap = {
  down: 2,
  right: 3,
  left: 1,
  up: 0,
};

const CharacterMovement = ({
  playerPosition, // posisi dari luar
  setPlayerPosition, // fungsi ubah posisi player
  onPlayerMove, // callback untuk kamera follow
}) => {
  // Ref dan state utama
  const canvasRef = useRef(null);
  const directionRef = useRef("down");
  const positionRef = useRef(playerPosition);
  const keysRef = useRef({});
  const frameIndexRef = useRef(0);
  const walkImgRef = useRef(new Image());
  const idleImgRef = useRef(new Image());

  const [imagesReady, setImagesReady] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);

  // Load gambar sprite
  useEffect(() => {
    let walkLoaded = false;
    let idleLoaded = false;

    walkImgRef.current.onload = () => {
      walkLoaded = true;
      if (idleLoaded) setImagesReady(true);
    };
    idleImgRef.current.onload = () => {
      idleLoaded = true;
      if (walkLoaded) setImagesReady(true);
    };

    walkImgRef.current.src = walkSheet;
    idleImgRef.current.src = idleSheet;
  }, []);

  // Sinkronisasi posisi player dari luar
  useEffect(() => {
    positionRef.current = playerPosition;
  }, [playerPosition]);

  // Keyboard input (WASD)
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysRef.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Loop animasi & gerakan player
  useEffect(() => {
    if (!imagesReady) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let lastFrameTime = 0;
    const frameDuration = 120; // Ubah ini untuk atur kecepatan/frame animasi

    let lastDraw = {
      frame: -1,
      direction: "",
      x: null,
      y: null,
    };

    const loop = (timestamp) => {
      // Deteksi input gerak
      const keys = keysRef.current;
      let newX = positionRef.current.x;
      let newY = positionRef.current.y;
      let newDirection = directionRef.current;
      let moved = false;

      // Kecepatan gerak karakter, Ubah angka yang 2 jadi nilai lain untuk atur speed
      if (keys["w"]) {
        newY -= 2;
        newDirection = "up";
        moved = true;
      } else if (keys["s"]) {
        newY += 2;
        newDirection = "down";
        moved = true;
      } else if (keys["a"]) {
        newX -= 2;
        newDirection = "left";
        moved = true;
      } else if (keys["d"]) {
        newX += 2;
        newDirection = "right";
        moved = true;
      }

      // Update posisi & arah
      if (moved) {
        positionRef.current = { x: newX, y: newY };
        directionRef.current = newDirection;
        setPlayerPosition({ x: newX, y: newY });

        if (typeof onPositionUpdate === "function") {
          onPositionUpdate({ x: newX, y: newY });
        }

        if (typeof onPlayerMove === "function") {
          onPlayerMove(); // Aktifkan kembali kamera follow
        }
      }

      if (timestamp - lastFrameTime > frameDuration) {
        let newFrame = frameIndexRef.current;

        if (moved) {
          newFrame = (frameIndexRef.current + 1) % framesPerRow;
        } else {
          newFrame = 1; // Frame idle default
        }

        if (newFrame !== frameIndexRef.current) {
          frameIndexRef.current = newFrame;
          setFrameIndex(newFrame);
        }

        lastFrameTime = timestamp;
      }

      // Ambil arah & frame saat ini
      const currentFrame = frameIndexRef.current;
      const currentDirection = directionRef.current;
      const image = moved ? walkImgRef.current : idleImgRef.current;

      const shouldRedraw =
        lastDraw.frame !== currentFrame ||
        lastDraw.direction !== currentDirection ||
        lastDraw.x !== positionRef.current.x ||
        lastDraw.y !== positionRef.current.y;

      if (shouldRedraw) {
        const row = directionMap[currentDirection];
        const sx = currentFrame * frameWidth;
        const sy = row * frameHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          image,
          sx,
          sy,
          frameWidth,
          frameHeight,
          0,
          0,
          frameWidth,
          frameHeight
        );

        lastDraw = {
          frame: currentFrame,
          direction: currentDirection,
          x: positionRef.current.x,
          y: positionRef.current.y,
        };
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [imagesReady]);

  // Render karakter ke canvas
  return (
    <canvas
      ref={canvasRef}
      width={frameWidth}
      height={frameHeight}
      style={{
        position: "absolute",
        left: `${positionRef.current.x}px`,
        top: `${positionRef.current.y}px`,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        backgroundColor: "transparent",
        zIndex: 5,
      }}
    />
  );
};

export default CharacterMovement;