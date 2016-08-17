var player = {
    init: function () {
        this.width = this.w = 10;
        this.height = this.h = 20;
        this.x = ( canvas.width / 2 ) - ( this.w / 2 ); 
        this.y = canvas.height - this.h; 
        this.speedx = 3;
        this.speedy = 4;
    },

    update: function () {
        this.__detectKeys();
    },

    render: function () {
        canvas.ctx.fillStyle = 'green';
        canvas.ctx.fillRect( this.x, this.y, this.w, this.h );
    },

    shoot: function () {
        /**
         * 1. Create a new bullet from Bullet class.
         * 2. Position new bullet at front center of player.
         * 3. Bullets will update + render every tick.
         * 4. Bullets will track any collisions with other collidables and stage bounds.
         */

        var b = bullet.create( { 
            x: this.x + ( this.width / 2 ), 
            y: this.y - 5
        }, bullet.position.CENTER );

        game.addBody( b );
    },

    __detectKeys: function () {
        if ( keyboard.isKeyReleased( keyboard.codes.SPACE ) ) {
            this.shoot();
        }

        if ( keyboard.isKeyDown( keyboard.codes.LEFT ) ) {
            this.x = utils.clamp( 
                this.x - this.speedx, 
                0, 
                map.width - this.width
            );
        }

        if ( keyboard.isKeyDown( keyboard.codes.RIGHT ) ) {
            this.x = utils.clamp( 
                this.x + this.speedx, 
                0, 
                map.width - this.width
            );
        }

        if ( keyboard.isKeyDown( keyboard.codes.UP ) ) {
            this.y = utils.clamp( 
                this.y - this.speedy, 
                0, 
                map.height - this.height
            );
        }

        if ( keyboard.isKeyDown( keyboard.codes.DOWN ) ) {
            this.y = utils.clamp( 
                this.y + this.speedy, 
                0, 
                map.height - this.height
            );
        }
    }

 };
