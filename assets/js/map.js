var map = {
    init: function () {
        this.width = this.w = canvas.width;
        this.height = this.h = canvas.height;
    },

    update: function () {},

    render: function () {
        canvas.ctx.fillStyle = 'black';
        canvas.ctx.fillRect( 0, 0, canvas.width, canvas.height );
    }
};