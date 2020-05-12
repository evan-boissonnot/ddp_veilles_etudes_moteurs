ig.module(
    'game.entities.cherry'
).requires(
    'impact.entity'
).defines(function() {
    EntityCherry = ig.Entity.extend({
        size: { x: 21, y: 21 },

        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.COLLIDES.NONE,
        collides: ig.Entity.COLLIDES.PASSIVE,

        gravityFactor: 0,

        animSheet: new ig.AnimationSheet('media/cherry.png', 21, 21),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('cherryAnim', 0.125, [0, 1, 2, 3, 4, 3, 2, 1, 0]);
        },

        update: function() {
            this.currentAnim = this.anims.cherryAnim;

            this.parent();
        }
    });
});