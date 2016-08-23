import map from './map';
import Enemy from './Enemy';

export default class Level {
    constructor( _options = {} ) {
        /**
         * 1. Level has a pattern of enemies to be spawned at certain distances (ticks) passed. Should the distances be measured in seconds? i.e ticks converted to seconds.
         * 2. When certain distance has passed, level is complete.
         */

        this.frame = 0;
        this.level = _options.level;
        this.enemies = [];

        this.initEnemies();
    }
    static get LEVELS() {
        return {
            ONE: {
                enemies: [
                    {
                        distance: 100,
                        type: Enemy.TYPES.BASIC,
                        pattern: Enemy.PATTERNS.DRIFT_RIGHT,
                        pos: {
                            x: 100,
                            y: -Enemy.TYPES.BASIC.height
                        }
                    },
                    {
                        distance: 100,
                        type: Enemy.TYPES.BASIC,
                        pattern: Enemy.PATTERNS.DRIFT_LEFT,
                        pos: {
                            x: map.width - 100,
                            y: -Enemy.TYPES.BASIC.height
                        }
                    },
                    {
                        distance: 200,
                        type: Enemy.TYPES.BASIC,
                        pattern: Enemy.PATTERNS.STRAIGHT_DOWN,
                        pos: {
                            x: ( map.width / 2 ) - ( Enemy.TYPES.BASIC.width / 2 ),
                            y: -Enemy.TYPES.BASIC.height
                        }
                    },
                    {
                        distance: 400,
                        type: Enemy.TYPES.BASIC,
                        pattern: Enemy.PATTERNS.STRAIGHT_DOWN,
                        pos: {
                            x: ( map.width / 2 ) - ( Enemy.TYPES.BASIC.width / 2 ),
                            y: -Enemy.TYPES.BASIC.height
                        }
                    },
                    {
                        distance: 500,
                        type: Enemy.TYPES.BASIC,
                        pattern: Enemy.PATTERNS.DRIFT_LEFT,
                        pos: {
                            x: 200,
                            y: -Enemy.TYPES.BASIC.height
                        }
                    },
                    {
                        distance: 600,
                        type: Enemy.TYPES.BASIC,
                        pattern: Enemy.PATTERNS.DRIFT_RIGHT,
                        pos: {
                            x: 350,
                            y: -Enemy.TYPES.BASIC.height
                        }
                    },
                ],
            },
        };
    }
    update() {
        this.frame += 1;

        this.enemies.forEach( ( _enemy ) => {
            if ( !_enemy.isActive && _enemy.isActiveAt <= this.frame ) {
                _enemy.isActive = true;
                game.addBody( _enemy );
            }
        } );
    }
    initEnemies() {
        this.level.enemies.forEach( ( _enemy ) => {
            const e = new Enemy( {
                type: _enemy.type,
                pattern: _enemy.pattern,
                pos: _enemy.pos,
            } );

            e.isActive = false;
            e.isActiveAt = _enemy.distance;

            this.enemies.push( e );
        } );
    }
}
