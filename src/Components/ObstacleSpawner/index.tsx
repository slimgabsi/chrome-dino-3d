import {useRef, useState} from "react";
import {useFrame} from "@react-three/fiber";
import Obstacle from "../Obstacle";
import {GAME_CONFIG} from "../../consts/gameConfig";

interface ObstacleInstance {
    id: number;
    position: number;
}

interface ObstacleSpawnerProps {
    speed: number;
}

export default function ObstacleSpawner({speed}: ObstacleSpawnerProps) {
    const [obstacles, setObstacles] = useState<ObstacleInstance[]>([]);
    const nextSpawnTimeRef = useRef<number>(0);
    const elapsedTimeRef = useRef<number>(0);
    const nextIdRef = useRef<number>(0);


    useFrame((_, delta) => {
        // Update elapsed time
        elapsedTimeRef.current += delta;

        // Check if it's time to spawn a new obstacle
        if (elapsedTimeRef.current >= nextSpawnTimeRef.current) {
            // Add a new obstacle
            setObstacles((prev) => [
                ...prev,
                {
                    id: nextIdRef.current++,
                    position: GAME_CONFIG.OBSTACLE_START_POSITION,
                },
            ]);

            // Schedule the next spawn
            const nextDelay =
                Math.random() * (GAME_CONFIG.MAX_SPAWN_DELAY - GAME_CONFIG.MIN_SPAWN_DELAY) +
                GAME_CONFIG.MIN_SPAWN_DELAY;
            nextSpawnTimeRef.current = elapsedTimeRef.current + nextDelay;
        }
    });

    function handleObstacleReachEnd(id: number) {
        setObstacles((prev) => prev.filter((obs) => obs.id !== id));
    }

    return (
        <>
            {obstacles.map((obstacle) => (
                <Obstacle
                    key={obstacle.id}
                    initialPosition={obstacle.position}
                    onReachEnd={() => handleObstacleReachEnd(obstacle.id)}
                    speed={speed}
                />
            ))}
        </>
    );
}