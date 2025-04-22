import {Canvas} from "@react-three/fiber";
import {OrbitControls, Sky, Stats} from "@react-three/drei"
import {Physics} from "@react-three/cannon";
import {Bloom, EffectComposer, Noise} from '@react-three/postprocessing'
import {useState, useEffect} from "react";
import Ground from "./Components/Ground";
import Player from "./Components/Player";
import ObstacleSpawner from "./Components/ObstacleSpawner";
import {GAME_CONFIG} from "./consts/gameConfig";

function App() {
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [speed, setSpeed] = useState(GAME_CONFIG.OBSTACLE_SPEED);

    useEffect(() => {
        let scoreInterval: number;
        let speedInterval: number;

        if (!isGameOver) {
            // Update score every 100ms (10 points per second)
            scoreInterval = setInterval(() => {
                setScore(prev => prev + 1);
            }, 100);

            // Increase speed every 10 seconds, but cap at MAX_SPEED
            speedInterval = setInterval(() => {
                if (speed < GAME_CONFIG.MAX_SPEED) {
                    setSpeed(prev => {
                        const newSpeed = prev * GAME_CONFIG.SPEED_INCREMENT; // Increase speed by 20%
                        return Math.min(newSpeed, GAME_CONFIG.MAX_SPEED); // Cap at MAX_SPEED
                    })
                }
            }, GAME_CONFIG.SPEED_INCREMENT_INTERVAL);
        }

        return () => {
            if (scoreInterval) clearInterval(scoreInterval);
            if (speedInterval) clearInterval(speedInterval);
        };
    }, [isGameOver]);

    const handleGameOver = () => {
        setIsGameOver(true);
    };

    return (
        <div className='text-center w-full h-screen'>
            {/* Score Display */}
            <div className="absolute top-4 right-4 text-black bg-white px-4 py-2 rounded-lg shadow-lg z-10">
                <span className="font-mono text-2xl">
                    {score}
                </span>
            </div>

            {isGameOver && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                    <div className="bg-white p-8 rounded-lg">
                        <h1 className="text-4xl font-bold mb-4">Game Over!</h1>
                        <p className="text-2xl mb-4">Score: {score}</p>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={() => window.location.reload()}
                        >
                            Play Again
                        </button>
                    </div>
                </div>
            )}

            <Canvas
                shadows
                camera={{position: [-15, 10, 10], fov: 50}}
            >
                {/* FPS Counter */}
                <Stats/>
                {/* Effects */}
                <EffectComposer >
                    <Bloom luminanceThreshold={2} luminanceSmoothing={2} height={500}/>
                    <Noise opacity={0.02}/>
                </EffectComposer>
                <Sky/>
                <directionalLight
                    position={[10, 15, 10]}
                    castShadow
                    shadow-mapSize={[4096, 4096]}
                    shadow-camera-far={100}
                    shadow-camera-left={-50}
                    shadow-camera-right={50}
                    shadow-camera-top={50}
                    shadow-camera-bottom={-50}
                />
                <ambientLight intensity={0.5}/>
                <OrbitControls/>
                <Physics gravity={[0, -9.81, 0]}>
                    {/* <Debug color="green" scale={1}>*/}
                    <Ground speed={speed}/>
                    <Player onGameOver={handleGameOver}/>
                    <ObstacleSpawner speed={speed}/>
                    {/*  </Debug>*/}
                </Physics>
            </Canvas>
        </div>
    )
}

export default App
