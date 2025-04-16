import {useTexture} from "@react-three/drei";
import {RepeatWrapping} from "three";
import {useFrame} from "@react-three/fiber";
import {useRef} from "react";
import {usePlane} from "@react-three/cannon";

interface GroundProps {
    speed: number;
}

export default function Ground({speed}: GroundProps) {
    const [ref] = usePlane(() => ({
        rotation: [-Math.PI / 2, 0, 0],
        position: [0, 0, 0],
        userData: {tag: 'ground'},
        type: "Static",/*Static bodies which can only be positioned in the world and aren't affected by forces nor velocity.*/
    }));

    // Load and configure the texture
    const texture = useTexture("/sand.jpg");
    const textureRef = useRef(texture);

    // Configure texture
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(4, 8); // Adjust these values to control texture tiling

    // Animate the texture at a slower speed
    useFrame((_, delta) => {
        if (textureRef.current) {
            // Slow down the texture movement with a 0.05 multiplier
            textureRef.current.offset.y -= speed * delta * 0.05;
        }
    });

    return (
        <mesh ref={ref} receiveShadow>
            <planeGeometry args={[100, 200]}/>
            <meshStandardMaterial
                map={texture}
                roughness={0.8}
                metalness={0.2}
            />
        </mesh>
    );
}