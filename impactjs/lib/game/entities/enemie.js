ig.module(
    'game.entities.enemie'
).requires(
    'impact.entity'
).defines(function() {
    EntityEnemie = ig.Entity.extend({
        size: { x: 30, y: 25 },

        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.COLLIDES.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        gravityFactor: 0,

        animSheet: new ig.AnimationSheet('media/frog-idle.png', 35, 25),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('frogAnim', 0.2, [0, 1, 2, 3]);
        },

        update: function() {
            this.currentAnim = this.anims.frogAnim;

            this.parent();
        },

        check: function(other) {
            if (other.getEntitiesByType(EntityPlayer)[0]) {
                other.receiveDomage(10, this);
            }
        }
    });
});