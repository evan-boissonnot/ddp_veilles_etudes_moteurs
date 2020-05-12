ig.module(
        'game.main'
    )
    .requires(
        'impact.game',
        'impact.font',

        'game.entities.cherry',
        'game.entities.enemie',
        'game.entities.player',

        'game.levels.main'
    )
    .defines(function() {

        MyGame = ig.Game.extend({

            // Load a font
            font: new ig.Font('media/04b03.font.png'),

            gravity: 300,
            score: 0,
            deathCount: 0,

            init: function() {
                this.loadLevel(LevelMain);

                ig.music.add('media/track_1.ogg');
                ig.music.volume = 0.5;
                ig.music.play();

                // Initialize your game here; bind keys etc.
                ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
                ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
                ig.input.bind(ig.KEY.SPACE, 'jump');
                var levelStatus = false;
            },

            update: function() {
                // Update all entities and backgroundMaps
                this.parent();

                var player = this.getEntitiesByType(EntityPlayer)[0];
                // Add your own, additional update code here
                var xDifference = player.pos.x - ig.system.width / 2;

                var yDifference = player.pos.y - ig.system.height / 2;

                if (this.screen.x > xDifference + 2 || this.screen.x < xDifference - 2) {
                    this.screen.x = (9 * this.screen.x + xDifference) / 10;
                } else {
                    this.screen.x = xDifference;
                }

                if (this.screen.y > yDifference + 2 || this.screen.y < yDifference - 2) {
                    this.screen.y = (9 * this.screen.y + yDifference) / 10;
                } else {
                    this.screen.y = yDifference;
                }
            },

            draw: function() {
                // Draw all entities and backgroundMaps
                this.parent();

                this.font.height = 5;

                this.font.draw("Score: " + this.score.floor().toString(), 25, 25, ig.Font.ALIGN.LEFT);
                this.font.draw("Health: " + (this.getEntitiesByType(EntityPlayer)[0].health.floor() - 10).toString(), 25, 35, ig.Font.ALIGN.LEFT);
                this.font.draw("Death count: " + this.deathCount.floor().toString(), 25, 45, ig.Font.ALIGN.LEFT);

                if (this.levelStatus == true) {
                    this.font.draw("Bravo vous avez fini le niveau !", ig.system.width / 2, (ig.system.height / 2) - 60, ig.Font.ALIGN.CENTER);
                    this.font.draw("Score: " + this.score.floor().toString() + "/10", ig.system.width / 2, (ig.system.height / 2) - 50, ig.Font.ALIGN.CENTER);
                    this.font.draw("Death count: " + this.deathCount.floor().toString(), ig.system.width / 2, (ig.system.height / 2) - 40, ig.Font.ALIGN.CENTER);
                }
            }
        });


        // Start the Game with 60fps, a resolution of 320x240, scaled
        // up by a factor of 2
        ig.main('#canvas', MyGame, 60, 800, 480, 1);

    });