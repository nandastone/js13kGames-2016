import game from './game';
import canvas from './canvas';
import map from './map';

export default class Bullet {
    constructor( _options = {} ) {
        this.entity = game.ENTITIES.BULLET;
        this.isActive = true;
        this.isDead = false;
        this.collidesWith = _options.collidesWith;

        this.z = 200;
        this.pos = _options.pos;
        this.width = this.w = 5;
        this.height = this.h = 5;
        this.speed = _options.velocity || { y: -10, x: 0 };

        this.damage = _options.damage || 25;
        this.deathFrames = 0;

        // center align bullet position
        this.pos.x = this.pos.x - ( this.width / 2 );
        this.pos.y = this.pos.y - ( this.height / 2 );
    }
    update() {
        if ( !this.isActive ) return;

        if ( this.isDead ) {
            if ( this.deathFrames >= 6 ) {
                game.removeBody( this );
            } else {
                this.deathFrames += 1;
            }
        } else {
            this.pos.x = this.pos.x + this.speed.x;
            this.pos.y = this.pos.y + this.speed.y;

            // if bullet leaves stage, destroy it
            if (
                // off left of screen
                ( ( this.pos.x + this.width ) < 0 ) ||
                // off right of screen
                ( this.pos.x > map.width ) ||
                // off top of screen
                ( ( this.pos.y + this.height ) < 0 ) ||
                // off bottom of screen
                ( this.pos.y > map.height ) ) {
                game.removeBody( this );
            }
        }
    }
    render() {
        if ( !this.isActive ) return;

        canvas.ctx.save();

        if ( this.isDead && this.deathFrames ) {
            switch ( this.deathFrames ) {
            case 1:
            case 2:
                canvas.ctx.fillStyle = '#bc6220';
                break;
            case 3:
            case 4:
                canvas.ctx.fillStyle = '#f0d914';
                break;
            case 5:
            case 6:
            default:
                canvas.ctx.fillStyle = 'white';
            }
        } else {
            canvas.ctx.fillStyle = 'red';
        }

        canvas.ctx.fillRect( this.pos.x, this.pos.y, this.width, this.height );
        canvas.ctx.restore();
    }
    kill() {
        this.isDead = true;
    }
}
