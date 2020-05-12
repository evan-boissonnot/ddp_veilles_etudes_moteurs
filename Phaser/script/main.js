var config = {
    type: Phaser.AUTO,
    width: 750,
    height: 432,
    backgroundColor: '#2d2d2d',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var skeleton1;

var playerGroup;
var ennemiesGroup;

var cursors;
var controls;
var A_Key;

var isJumping;
var isFalling;
var isAttack;
var isIdle = true;

var healthText;
var deathCount;
var deathCountText;

var game = new Phaser.Game(config);

function preload() {
    this.load.baseURL = 'assets/maps/';
    this.load.image('background', 'background_glacial_mountains_lightened.png');
    this.load.tilemapTiledJSON('map', 'tile_map1.json');

    this.load.spritesheet('platform', 'tileset.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('props', 'props.png', { frameWidth: 16, frameHeight: 16 });

    this.load.spritesheet('character',
        '../characters/adventurer-v1.5-Sheet.png', { frameWidth: 50, frameHeight: 37 }
    );

    this.load.spritesheet('skeletonIdle',
        '../characters/skeleton/Skeleton-Idle.png', { frameWidth: 24, frameHeight: 32 }
    );

    this.load.spritesheet('skeletonAttack',
        '../characters/skeleton/Skeleton-Attack.png', { frameWidth: 43, frameHeight: 37 }
    );

    this.load.spritesheet('skeletonHit',
        '../characters/skeleton/Skeleton-Hit.png', { frameWidth: 24, frameHeight: 32 }
    );

    this.load.spritesheet('skeletonDeath',
        '../characters/skeleton/Skeleton-Dead.png', { frameWidth: 33, frameHeight: 32 }
    );
}

function create() {
    this.map = this.make.tilemap({ key: 'map' });

    var groundTiles = this.map.addTilesetImage('platform', 'platform');
    var propsTiles = this.map.addTilesetImage('props', 'props');

    for (i = 384; i < this.map.widthInPixels; i += 768) {
        var backgroundTiles = this.add.tileSprite(i, 216, 384, 216, 'background').setScale(2);
    }

    var backgroundPropsLayer = this.map.createStaticLayer('background_props', propsTiles, 0, 20).setScale(2);
    var propsLayer = this.map.createStaticLayer('props', propsTiles, 0, 20).setScale(2);
    var groundLayer = this.map.createStaticLayer('platform', groundTiles, 0, 20).setScale(2);

    groundLayer.setCollisionByExclusion([-1]);


    /*################### Player ####################*/

    player = this.physics.add.sprite(50, 325, 'character').setScale(2);
    player.health = 500;
    player.setCollideWorldBounds(false);

    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('character', { start: /*38*/ 0, end: /*41*/ 3 }),
        frameRate: 5,
        repeat: -1
    });

    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('character', { start: 8, end: 12 }),
        frameRate: 10,
        revert: true,
        repeat: -1
    });

    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('character', { start: 13, end: 21 }),
        frameRate: 15,
        repeat: 0
    });
    this.anims.create({
        key: 'slide',
        frames: this.anims.generateFrameNumbers('character', { start: 24, end: 28 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'fall',
        frames: this.anims.generateFrameNumbers('character', { start: 22, end: 23 }),
        frameRate: 10,
        repeat: 0
    });

    this.anims.create({
        key: 'attack',
        frames: this.anims.generateFrameNumbers('character', { start: 38, end: 70 }),
        frameRate: 20,
        repeat: 0
    });

    playerGroup = this.add.group();
    playerGroup.add(player);


    /*################### Skeleton ####################*/

    skeleton1 = this.physics.add.sprite(450, 310, 'skeletonIdle').setScale(2);

    this.anims.create({
        key: 'skeleton_idle',
        frames: this.anims.generateFrameNumbers('skeletonIdle', { start: 0, end: 10 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'skeleton_attack',
        frames: this.anims.generateFrameNumbers('skeletonAttack', { start: 0, end: 17 }),
        frameRate: 25,
        repeat: 0
    });

    this.anims.create({
        key: 'skeleton_death',
        frames: this.anims.generateFrameNumbers('skeletonDeath', { start: 0, end: 14 }),
        frameRate: 10,
        repeat: 0
    });

    enemiesGroup = this.add.group();
    enemiesGroup.add(skeleton1);
    let children = enemiesGroup.children.entries;
    for (let i = 0; i < children.length; i++) { children[i].body.moves = false; }
    skeleton1.setCollideWorldBounds(false);


    this.physics.add.collider(playerGroup, groundLayer);
    this.physics.add.collider(enemiesGroup, groundLayer);
    this.physics.add.collider(playerGroup, enemiesGroup, playerHitSkeleton);

    var camera = this.cameras.main;
    camera.startFollow(player);
    camera.setBounds(0, 0, 14000, 216);

    cursors = this.input.keyboard.createCursorKeys();

    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        space: cursors.space,
        speed: 0.5
    };


    A_Key = this.input.keyboard.addKey('A');

    controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
    healthText = this.add.text(10, 10, 'Health:', { font: '15px Arial', fill: '#fff' });
    healthText.setScrollFactor(0);

    deathCount = 0;
    deathCountText = this.add.text(10, 25, 'DeathCount:', { font: '15px Arial', fill: '#fff' });
    deathCountText.setScrollFactor(0);
}

function update() {
    healthText.setText('Health: ' + player.health);
    deathCountText.setText('DeathCount: ' + deathCount);

    // skeleton1.anims.play('skeleton_idle', true);
    skeleton1.flipX = true;

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.flipX = true;

        if (isJumping == true) {
            player.anims.play('jump', true);
            player.on(Phaser.Animations.Events.SPRITE_ANIMATION_KEY_COMPLETE + 'jump', function() {
                isFalling = true;
            });

            if (isJumping == true && player.body.onFloor()) {
                player.anims.play('slide', true);
                isFalling = false;
                this.tweens.add({
                    targets: player,
                    alpha: '+=1',
                    duration: 250,
                    onComplete: function() {
                        isJumping = false;
                        isIdle = true;
                    },
                });
            }
        } else {
            player.anims.play('run', true);
        }
    } else if (cursors.right.isDown) {
        player.flipX = false;
        player.setVelocityX(160);

        if (isJumping == true) {
            player.anims.play('jump', true);
            player.on(Phaser.Animations.Events.SPRITE_ANIMATION_KEY_COMPLETE + 'jump', function() {
                isFalling = true;
            });

            if (isJumping == true && player.body.onFloor()) {
                player.anims.play('slide', true);
                isFalling = false;
                this.tweens.add({
                    targets: player,
                    alpha: '+=1',
                    duration: 250,
                    onComplete: function() {
                        isJumping = false;
                        isIdle = true;
                    },
                });
            }
        } else {
            player.anims.play('run', true);
        }
    } else {
        player.setVelocityX(0);

        if (isFalling == true) {
            player.anims.play('fall', true);
        }
        if (isIdle == true) {
            player.anims.play('idle', false); // ici le idle passe avant la fin de l'anim d'attaque, donc il stoppe l'ancienne :)
        }
    }

    if (A_Key.isDown /*&& isIdle == true*/ ) {
        isIdle = false;
        this.isAttack = true; // le probleme etait que ta variable ! isAttack n'était plus reconnue dans le scope, car en var. avec le this tu attribue le isAttack à ta scene
    }

    if (this.isAttack == true) {
        player.anims.play('attack', true).on(Phaser.Animations.Events.SPRITE_ANIMATION_KEY_COMPLETE + 'attack', function() {
            isIdle = true;
            this.isAttack = false;
        }.bind(this));
    }

    if (isFalling == true) {
        isIdle = false;
        player.anims.play('fall', true);
    }


    if (cursors.space.isDown && player.body.onFloor()) {
        isIdle = false;
        isJumping = true;
        player.setVelocityY(-200);
    }

    if (player.body.onFloor()) {
        isFalling = false;
    }

    if (player.health <= 0) {
        player.x = 50;
        player.y = 325;
        player.health = 500;
        deathCount++;

        endText = this.add.text(275, 200, 'Game Over', { font: '35px Arial', fill: '#fff' });
        endText.setScrollFactor(0);
        this.tweens.add({
            targets: endText,
            alpha: '+=1',
            duration: 1000,
            onComplete: function() { endText.destroy() },
        });
    }

    if ((player.x >= (skeleton1.x - 50) && player.x <= (skeleton1.x + 50)) && this.isAttack == true) {
        skeleton1.anims.play('skeleton_death', false).on(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, function() {
            //skeleton1.destroy();
        });
    }
}

function playerHitSkeleton() {
    player.health -= 0.5;
    skeleton1.body.offset.x = 15;
    skeleton1.anims.play('skeleton_attack', false).on(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, function() {
        skeleton1.body.offset.x = 0;
        //skeleton1.anims.play('skeleton_idle', true);
    } /*.bind(skeleton1.anims.currentAnim)*/ );
}