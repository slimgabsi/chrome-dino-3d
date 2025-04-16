import {useBox} from "@react-three/cannon";
import {Mesh, Object3D} from "three";
import {useState, useEffect, useMemo} from "react";
import {useFrame} from "@react-three/fiber";
import {GAME_CONFIG} from "../../consts/gameConfig";
import {useGLTF} from "@react-three/drei";

interface ObstacleProps {
    initialPosition: number;
    onReachEnd: () => void;
    speed: number;
}

function Obstacle({initialPosition, onReachEnd, speed}: ObstacleProps) {
    const [position, setPosition] = useState(initialPosition);
    const {scene} = useGLTF(`${import.meta.env.BASE_URL}/chrome-dinosaur-game-cactus/source/model.gltf`);

    // Clone the scene for this instance
    const clonedScene = useMemo(() => {
        return scene.clone();
    }, [scene]);

    // Create a more stable physics body configuration with adjusted size
    const [ref, api] = useBox<Mesh>(() => ({
        mass: 0, // Static body
        position: [0, 0.6, position],
        args: [0.6, 1.5, 0.6],
        type: "Kinematic", /*Kinematic bodies which aren't affected by forces but can have a velocity and move around*/
        allowSleep: false,
        userData: {
            tag: "obstacle",
        },
    }));

    // Make sure all meshes in the scene cast and receive shadows
    useEffect(() => {
        clonedScene.traverse((child: Object3D) => {
            if (child instanceof Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, [clonedScene]);

    // Reset position when component mounts or initialPosition changes
    useEffect(() => {
        setPosition(initialPosition);

    }, [initialPosition]);


    // The delta time shows the milliseconds between renders

    useFrame((_, delta) => {
        const newPosition = Math.max(position - speed * delta, GAME_CONFIG.OBSTACLE_END_POSITION);
        setPosition(newPosition);

        api.position.set(0, 0.6, newPosition);

        // Check if we've reached the end position
        if (newPosition <= GAME_CONFIG.OBSTACLE_END_POSITION) {
            onReachEnd();
        }
    });

    return (
        <group ref={ref} position={[0, 0.6, position]}>
            <primitive
                position={[0, -0.6, 0]}
                rotation={[0, Math.PI, 0]}
                object={clonedScene}
            />
        </group>
    );
}

export default Obstacle;