var player = {
    __tempPos: null,

    init: function () {
        this.width = this.w = 10;
        this.height = this.h = 20;
        this.x = ( canvas.width / 2 ) - ( this.w / 2 ); 
        this.y = ( canvas.height / 2 ) - ( this.h / 2 ); 
        this.speedx = 4;
        this.speedy = 3;
    },

    update: function () {
        this.__detectMovement();
    },

    render: function () {
        // rocket ship body
        canvas.ctx.fillStyle = 'green';
        canvas.ctx.fillRect( this.x, this.y, this.w, this.h );
    },

    __detectMovement: function () {
        if ( keyboard.isKeyDown( keyboard.codes.LEFT ) ) {
            this.x = utils.clamp( 
                this.x - this.speedx, 
                0, 
                canvas.width - this.width
            );
        }

        if ( keyboard.isKeyDown( keyboard.codes.RIGHT ) ) {
            this.x = utils.clamp( 
                this.x + this.speedx, 
                0, 
                canvas.width - this.width
            );
        }

        if ( keyboard.isKeyDown( keyboard.codes.UP ) ) {
            this.y = utils.clamp( 
                this.y - this.speedy, 
                0, 
                canvas.height - this.height
            );
        }

        if ( keyboard.isKeyDown( keyboard.codes.DOWN ) ) {
            this.y = utils.clamp( 
                this.y + this.speedy, 
                0, 
                canvas.height - this.height
            );
        }
    },


 };
