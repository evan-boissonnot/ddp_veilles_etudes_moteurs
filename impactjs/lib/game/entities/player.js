ig.module(
    'game.entities.player'
).requires(
    'impact.entity'
).defines(function() {
    EntityPlayer = ig.Entity.extend({
        size: { x: 60, y: 89 },
        offset: { x: 80, y: 45 },

        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        animSheet: new ig.AnimationSheet('media/player.png', 231, 140),

        health: 60,

        accelGround: 400,
        accelAir: 200,
        jump: 250,
        friction: { x: 600, y: 0 },
        maxVel: { x: 100, y: 150 },

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('idleAnim', 0.1, [0, 1, 2, 3, 4, 5]);
            this.addAnim('runAnim', 0.1, [6, 7, 8, 9, 10, 11, 12, 13]);
            this.addAnim('jumpAnim', 0.5, [14, 15]);
        },

        update: function() {
            var accel = this.standing ? this.accelGround : this.accelAir;
            if (ig.input.state('left')) {
                this.accel.x = -accel;
                this.flip = true;
                this.currentAnim = this.anims.runAnim;
            } else if (ig.input.state('right')) {
                this.accel.x = accel;
                this.flip = false;
            } else {
                this.accel.x = 0;
            }

            if (this.standing && ig.input.pressed('jump')) {
                this.vel.y = -this.jump;
            }

            if (this.vel.y < 0) {
                this.currentAnim = this.anims.idleAnim;
            } else if (this.y > 0) {
                this.currentAnim = this.anims.idleAnim;
            } else if (this.vel.x != 0) {
                this.currentAnim = this.anims.runAnim;
            } else {
                this.currentAnim = this.anims.idleAnim;
            }

            this.currentAnim.flip.x = this.flip;

            if (this.pos.y >= 500 || this.health <= 10) {
                ig.game.score = 0;
                ig.game.deathCount++;
                this.health = 60;
                this.pos.x = 16;
                this.pos.y = 343;
            }

            if (this.pos.x >= 1540) {
                ig.game.levelStatus = true;
            }

            this.parent();
        },


        check: function(other) {
            other.kill();
            ig.game.score++;
        }
    });
});