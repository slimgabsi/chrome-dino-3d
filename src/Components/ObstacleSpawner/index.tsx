import {useEffect, useState} from "react";
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

// seconds

export default function ObstacleSpawner({ speed }: ObstacleSpawnerProps) {
    const [obstacles, setObstacles] = useState<ObstacleInstance[]>([]);
    const [nextSpawnTime, setNextSpawnTime] = useState<number>(0);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [nextId, setNextId] = useState<number>(0);

    // Set initial spawn time
    useEffect(() => {
        const initialDelay = Math.random() * (GAME_CONFIG.MAX_SPAWN_DELAY - GAME_CONFIG.MIN_SPAWN_DELAY) + GAME_CONFIG.MIN_SPAWN_DELAY;
        setNextSpawnTime(initialDelay);
    }, []);

    // Game loop using useFrame
    useFrame((_, delta) => {
        // Update elapsed time in seconds
        setElapsedTime(prev => prev + delta);
        
        // Check if it's time to spawn a new obstacle
        if (elapsedTime >= nextSpawnTime) {
            setObstacles(prev => [...prev, {
                id: nextId,
                position: GAME_CONFIG.OBSTACLE_START_POSITION
            }]);
            setNextId(prev => prev + 1);
            
            // Schedule next spawn with random delay
            const nextDelay = Math.random() * (GAME_CONFIG.MAX_SPAWN_DELAY - GAME_CONFIG.MIN_SPAWN_DELAY) + GAME_CONFIG.MIN_SPAWN_DELAY;
            setNextSpawnTime(elapsedTime + nextDelay);
        }
    });

    function handleObstacleReachEnd(id: number) {
        setObstacles(prev => prev.filter(obs => obs.id !== id));
    }

    return (
        <>
            {obstacles.map(obstacle => (
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