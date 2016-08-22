var player = {
    init: function () {
        this.z = 10;
        this.width = this.w = 27;
        this.height = this.h = 37;
        this.pos = {
            x: ( canvas.width / 2 ) - ( this.w / 2 ),
            y: canvas.height - 100
        };
        this.speed = { x: 3, y: 4 };
        this.velocity = { x: 0, y: 0 };
        this.sprite = {};
        this.shootDelay = 0; 
        
        this.initSprite();
    },

    update: function () {
        this.shootDelay += 1;

        // detect player actions via keyboard input
        this.detectKeys();

        // update position of player based on input
        this.pos = {
            x: utils.clamp( 
                this.pos.x + this.velocity.x, 
                0, 
                map.width - this.width
            ),
            y: utils.clamp( 
                this.pos.y + this.velocity.y, 
                0, 
                map.height - this.height
            ) 
        };
    },

    render: function () {
        var sprite = this.sprite.normal;

        // @todo How to animate turning left over a number of ticks?
        if ( this.velocity.x < 0 ) {
            sprite = this.sprite.left;
        } else if ( this.velocity.x > 0 ) {
            sprite = this.sprite.right;
        }
        
        canvas.ctx.save();
        canvas.ctx.drawImage( sprite, this.pos.x, this.pos.y, this.w, this.h );
        canvas.ctx.restore();
    },

    shoot: function () {
        var b1 = bullet.create( { 
            x: this.pos.x + 2, 
            y: this.pos.y + 20
        }, bullet.position.CENTER );

        var b2 = bullet.create( { 
            x: this.pos.x + ( this.width - 2), 
            y: this.pos.y + 20
        }, bullet.position.CENTER );

        game.addBody( b1 );
        game.addBody( b2 );
    },

    // @todo Investigate sprite maps and animating them.
    initSprite: function () {
        var normal = new Image();
        var left = new Image();
        var left2 = new Image();
        var right = new Image();
        var right2 = new Image();

        // http://www.gsarchives.net/index2.php?category=sprites&system=computer&game=raptor&type=sprites&level0=non-animated
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

    detectKeys: function () {
        this.velocity.x = 0;
        this.velocity.y = 0;

        if ( keyboard.isKeyDown( keyboard.codes.SPACE ) ) {
            if ( this.canShoot() ) {
                this.shoot();
            }
        }

        if ( keyboard.isKeyDown( keyboard.codes.LEFT ) ) {
            this.velocity.x = -this.speed.x;
        }

        if ( keyboard.isKeyDown( keyboard.codes.RIGHT ) ) {
            this.velocity.x = this.speed.x;
        }

        if ( keyboard.isKeyDown( keyboard.codes.UP ) ) {
            this.velocity.y = -this.speed.x;
        }

        if ( keyboard.isKeyDown( keyboard.codes.DOWN ) ) {
            this.velocity.y = this.speed.x;
        }
    },

    canShoot: function () {
        if ( this.shootDelay < 10 ) {
            return false;
        }

        this.shootDelay = 0;
        return true;
    }
 };
