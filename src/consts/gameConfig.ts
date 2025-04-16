/**
 * Game configuration constants
 */
export const GAME_CONFIG = {
    // Obstacle positions
    OBSTACLE_START_POSITION: 30,
    OBSTACLE_END_POSITION: -30,
    OBSTACLE_SPEED: 3,

    // Obstacle spawner settings
    OBSTACLE_POOL_SIZE: 10,
    MIN_SPAWN_DELAY: 1.0,
    MAX_SPAWN_DELAY: 5.0,
    
    // Player settings
    PLAYER_JUMP_FORCE: 10,
    PLAYER_GRAVITY: 20,
    
    // Game settings
    INITIAL_SPEED: 10,
    MAX_SPEED: 15,
    SPEED_INCREMENT: 0.1,
    SPEED_INCREMENT_INTERVAL: 10, // seconds
    
    // Physics settings
    GROUND_FRICTION: 0.5,
    OBSTACLE_COLLISION_RADIUS: 0.8,
    
    // Visual settings
    DEBUG_MODE: false,
    SHOW_COLLISION_BOXES: false
}
