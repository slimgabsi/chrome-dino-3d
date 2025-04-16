import {useBox} from "@react-three/cannon";
import {Mesh, Object3D} from "three";
import {useEffect, useState} from "react";
import {GAME_CONFIG} from "../../consts/gameConfig";
import {useGLTF, useAnimations} from "@react-three/drei";
import {TAGS} from "../../consts/tags.ts";

interface PlayerProps {
    onGameOver: () => void;
}

export default function Player({onGameOver}: PlayerProps) {
    const {scene, animations} = useGLTF(`${import.meta.env.BASE_URL}/chrome-dino-3d-animated/source/model.gltf`);
    const {actions, names} = useAnimations(animations, scene);
    const [isJumping, setIsJumping] = useState(false);


    // Create a more stable physics body configuration with adjusted size
    const [ref, api] = useBox<Mesh>(() => ({
        mass: 1,
        position: [0, 1, 0],
        args: [0.8, 1.2, 0.8], // Adjusted size to better match the dinosaur model
        linearDamping: 0.9,
        angularDamping: 0.9,
        fixedRotation: true,
        allowSleep: false,
        userData: {
            tag: TAGS.PLAYER,
        },
        onCollide: (e) => {
            if (e.body.userData?.tag === 'ground') {
                setIsJumping(false);
            }
            if (e.body.userData?.tag === 'obstacle') {
                onGameOver();
            }
        }
    }));


    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'Space' && !isJumping) {
                setIsJumping(true);
                api.velocity.set(0, GAME_CONFIG.PLAYER_JUMP_FORCE, 0); // Apply upward velocity
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [api, isJumping]);

    useEffect(() => {
        // Play the first animation
        actions[names[0]]?.play();
        // Make sure all meshes in the scene cast and receive shadows
        scene.traverse((child: Object3D) => {
            if (child instanceof Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, [scene, actions, names]);

    return (
        <group ref={ref}>
            <primitive
                position={[0, -0.65, 0]}
                rotation={[0, Math.PI, 0]}
                object={scene}
                scale={1}
            />
        </group>
    );
}