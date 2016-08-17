var player = {
    init: function () {
        this.width = this.w = 27;
        this.height = this.h = 37;
        this.x = ( canvas.width / 2 ) - ( this.w / 2 ); 
        this.y = canvas.height - this.h; 
        this.speedx = 3;
        this.speedy = 4;
        this.sprite = {};
        
        this.__initSprite();
    },

    update: function () {
        this.__detectKeys();
    },

    render: function () {
        var sprite = this.sprite.normal;

        // http://www.gsarchives.net/index2.php?category=sprites&system=computer&game=raptor&type=sprites&level0=non-animated
        // @todo How to animate turning left over a number of ticks?
        if ( keyboard.isKeyDown( keyboard.codes.LEFT ) ) {
            sprite = this.sprite.left;
        } else if ( keyboard.isKeyDown( keyboard.codes.RIGHT ) ) {
            sprite = this.sprite.right;
        }

        canvas.ctx.drawImage( sprite, this.x, this.y, this.w, this.h );
    },

    shoot: function () {
        var b1 = bullet.create( { 
            x: this.x + 2, 
            y: this.y + 20
        }, bullet.position.CENTER );

        var b2 = bullet.create( { 
            x: this.x + ( this.width - 2), 
            y: this.y + 20
        }, bullet.position.CENTER );

        // @todo Implement stacking index so bullets are always rendered below ship.
        game.addBody( b1 );
        game.addBody( b2 );
    },

    // @todo Investigate sprite maps and animating them.
    __initSprite: function () {
        var normal = new Image();
        var left = new Image();
        var left2 = new Image();
        var right = new Image();
        var right2 = new Image();

        normal.src = 'assets/img/plane.gif';
        left.src = 'assets/img/plane_turning_right_1.gif';
        left2.src = 'assets/img/plane_turning_right_2.gif';
        right.src = 'assets/img/plane_turning_left_1.gif';
        right2.src = 'assets/img/plane_turning_left_2.gif';

        this.sprite = {
            normal: normal,
            left: left,
            left2: left2,
            right: right,
            right2: right2
        };
    },

    __detectKeys: function () {
        if ( keyboard.isKeyDown( keyboard.codes.SPACE ) ) {
            // @todo Limit the rate of fire.
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
