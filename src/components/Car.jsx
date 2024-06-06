import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from 'three';
import carScene from "../assets/3d/benz.glb";
import CanvasLoader from "./Loader";

const Car = ({ rotation, scale, position, carColor }) => {
  const carRef = useRef();
  const { scene } = useGLTF(carScene);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    scene.position.sub(center);  // Reposition to center the pivot

    carRef.current.position.copy(center); // Optional: position the group itself at the original center
  }, [scene]);


  useEffect(() => {
    if (carRef.current) {
      carRef.current.traverse((child) => {
        console.log(child)
        if (child.isMesh && child.material && child.material.name === 'carpaint_metalic_white') {
          child.material.color.set(carColor);
        }
      });
    }
  }, [carColor])

  return (
    <group ref={carRef} scale={scale} rotation={rotation} position={position}>
      <primitive object={scene} />
    </group>
  );
};
const ColorPicker = ({ colors, onSelectColor }) => {
  return (
    <div className="">
      {colors.map((color, index) => (
        <button
          key={index}
          onClick={() => onSelectColor(color)}
          className="w-12 h-12 border-2 mr-2"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};


const CarCanvas = ({ scrollContainer }) => {
  const [rotationY, setRotationY] = useState(0);
  const [scale, setScale] = useState([2, 2, 2]);
  const [position, setPosition] = useState([0, 0, 0]);
  const [carColor, setCarColor] = useState("");
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [initialMouseX, setInitialMouseX] = useState(0);
  const [initialRotationY, setInitialRotationY] = useState(0);

  const colors = ["#ff0000", "#00ff00", "#0000ff", "#800080", "#000000", "#ffffff"];


  const handleSelectColor = (color) => {
    setCarColor(color);
    console.log(carColor);
  };

  useEffect(() => {
    // const handleScroll = () => {
    //   const scrollTop = scrollContainer.current.scrollTop;
    //   const rotationYValue = scrollTop * -0.00075;
    //   setRotationY(rotationYValue);
    // };

    const handleResize = () => {
      if (window.innerWidth < 390) {
        setScale([0.7, 0.7, 0.7]);
        setPosition([0.2, -0.1, 0]);
      }
      else if (window.innerWidth < 500) {
        setScale([0.8, 0.8, 0.8]);
        setPosition([0.2, -0.1, 0]);
      } else if (window.innerWidth < 768) {
        setScale([1, 1, 1]);
        setPosition([0.2, -0.1, 0]);
      } else if (window.innerWidth < 1024) {
        setScale([1.33, 1.33, 1.33]);
        setPosition([0.2, -0.3, 0]);
      } else if (window.innerWidth < 1280) {
        setScale([1.5, 1.5, 1.5]);
        setPosition([0.2, -0.4, 0]);
      } else if (window.innerWidth < 1536) {
        setScale([1.66, 1.66, 1.66]);
        setPosition([0.1, -0.5, -1.3]);
      } else {
        setScale([1.7, 1.7, 1.7]);
        setPosition([0.2, -0.7, 0]);
      }
    };

    const handleMouseDown = (event) => {
      setIsMousePressed(true);
      setInitialMouseX(event.clientX);
      setInitialRotationY(rotationY);
    };

    const handleMouseUp = () => {
      setIsMousePressed(false);
    };

    const handleMouseMove = (event) => {
      if (isMousePressed) {
        const deltaX = event.clientX - initialMouseX;
        const newRotationY = initialRotationY + deltaX * 0.01;
        setRotationY(newRotationY);
      }
    };

    const handleTouchStart = (event) => {
      setIsMousePressed(true);
      setInitialMouseX(event.touches[0].clientX);
      setInitialRotationY(rotationY);
    };

    const handleTouchEnd = () => {
      setIsMousePressed(false);
    };

    const handleTouchMove = (event) => {
      if (isMousePressed) {
        const deltaX = event.touches[0].clientX - initialMouseX;
        const newRotationY = initialRotationY + deltaX * 0.01;
        setRotationY(newRotationY);
      }
    };

    handleResize();
    // window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      // window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [scrollContainer, isMousePressed, initialMouseX, initialRotationY, rotationY]);

  return (
    <>
      <Canvas
        className={`w-full h-screen bg-stone-200 z-10`}
        camera={{ position: [0, 1.2, 7], near: 0.1, far: 1000 }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <directionalLight position={[0, 5, 0]} intensity={2} />
          <directionalLight position={[0, -5, 0]} intensity={2} />
          <directionalLight position={[5, 0, 0]} intensity={0.8} />
          <directionalLight position={[-5, 0, 0]} intensity={0.8} />
          <directionalLight position={[0, 1, 0]} intensity={2} />
          <pointLight position={[0, 1, 0]} intensity={2} />
          <hemisphereLight skyColor="#ffffff" groundColor="#cecece" intensity={0.7} />
          {/* <mesh rotation={[-Math.PI / 2, 0, 0]} position-y={-1}>
          <planeGeometry args={[40, 40]} />
        </mesh> */}

          <Car rotation={[0, rotationY, 0]} scale={scale} position={position} carColor={carColor} />
        </Suspense>
      </Canvas>
      <ColorPicker colors={colors} onSelectColor={handleSelectColor} />
    </>
  );
};

export default CarCanvas;
