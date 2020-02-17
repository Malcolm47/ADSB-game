class play extends Phaser.Scene {
    constructor() {
        super({key:'play'});
    }

    preload ()
    {
    // IMPORTANT! Web server needs to be running for ADSB-game folder.
    // index.html can be run via IDE but the image paths need to be through server.
    // Make sure "set CORS headers" option is on
        this.load.image('bruh', 'http://127.0.0.1:8887/assets/momement2.png');
        //this.load.image('level-end', 'http://127.0.0.1:8887/assets/ascension.png');
        this.load.image('tiles', 'http://127.0.0.1:8887/assets/earth-tiles.png');
        this.load.tilemapTiledJSON('map', 'http://127.0.0.1:8887/assets/first-test-json.json');
        this.load.spritesheet('bert', 'http://127.0.0.1:8887/assets/bert.png', {
            frameWidth: 107,
            frameHeight: 140
        });
        this.load.spritesheet('portal', 'http://127.0.0.1:8887/assets/portal.png', {
            frameWidth: 35,
            frameHeight: 50
        });
    }

    create ()
    {
        const map = this.make.tilemap({ key: 'map' });
        // first thing is embedded tileset name, second is tileset png
        // then width+height of tiles, margin, and spacing
        // Remember to manually extrude tiles (18*18 in piskel) :)
        const tileset = map.addTilesetImage('earth', 'tiles', 16, 16, 1, 2);
        const background = map.createStaticLayer('background', tileset, 0, 0).setScale(4);
        const platforms = map.createStaticLayer('platforms', tileset, 0, 0).setScale(4);
  // There are many ways to set collision between tiles and players
  // As we want players to collide with all of the platforms, we tell Phaser to
  // set collisions for every tile in our platform layer whose index isn't -1.
  // Tiled indices can only be >= 0, therefore we are colliding with all of
  // the platform layer
        platforms.setCollisionByExclusion(-1, true);

        this.physics.world.setBounds(0, 0, 4000, 4000);
        this.cameras.main.zoom = 0.8;
        

        this.bert = this.physics.add.sprite(200,2600,'bert').setScale(0.45);
        this.portal = this.physics.add.sprite(1500,1000,'portal').setScale(2);
        //this.portal.body.setGravityY(400);

        this.bert.body.setGravityY(400);
        //this.bert.setBounce(0.2);
        this.bert.setCollideWorldBounds(true);
        this.physics.add.collider(this.bert, platforms);
        this.physics.add.collider(this.portal, platforms);
        this.physics.add.overlap(this.bert, this.portal, function(){
            this.scene.start('play');
        }, null, this);

        this.anims.create({
            key: 'bert_anim',
            frames: this.anims.generateFrameNumbers('bert'),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'portal_anim',
            frames: this.anims.generateFrameNumbers('portal'),
            frameRate: 12,
            repeat: -1
        });

        this.keyW = this.input.keyboard.addKey('W');  // Get key object
        this.keyD = this.input.keyboard.addKey('D');
        this.keyA = this.input.keyboard.addKey('A');

        this.cameras.main.startFollow(this.bert);
        //this.cameras.main.roundPixels = true;
    }

    update ()
    {
        //var isDown = this.keyW.isDown;
        //var isUp = this.keyW.isUp;
        if (this.keyW.isDown && this.bert.body.onFloor()) {
            this.bert.setVelocityY(-450);
        }
        if (this.keyD.isDown) {
            this.bert.setVelocityX(220);
        } else if (this.keyA.isDown) {
            this.bert.setVelocityX(-220);
        } else {
            this.bert.setVelocityX(0);
        }
        this.bert.play('bert_anim', true);
        this.portal.play('portal_anim', true);
    }
}