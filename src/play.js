class play extends Phaser.Scene {
    constructor() {
        super({key:'play'});
    }

    preload ()
    {
    // IMPORTANT! Web server needs to be running for ADSB-game folder.
    // index.html can be run via IDE but the image paths need to be through server.
    // Make sure "set CORS headers" option is on

        // ------   FOR HOME - USE WITH CHROME WEB SERVER  -----
        /*this.load.image('bruh', 'http://127.0.0.1:8887/assets/momement2.png');
        this.load.image('tiles', 'http://127.0.0.1:8887/assets/earth-tiles.png');
        this.load.tilemapTiledJSON('map', 'http://127.0.0.1:8887/assets/first-test-json.json');
        this.load.spritesheet('bert', 'http://127.0.0.1:8887/assets/temp-guy.png', {
            frameWidth: 48,
            frameHeight: 48
        });
        this.load.spritesheet('portal', 'http://127.0.0.1:8887/assets/portal.png', {
            frameWidth: 35,
            frameHeight: 50
        });*/

        // ------   FOR INTELLIJ  --------
        this.load.image('bruh', 'http://localhost:63342/ADSB-game2/assets/momement2.png');
        this.load.image('tiles', 'http://localhost:63342/ADSB-game2/assets/earth-tiles.png');
        this.load.tilemapTiledJSON('map', 'http://localhost:63342/ADSB-game2/assets/first-test-json.json');
        this.load.spritesheet('bert', 'http://localhost:63342/ADSB-game2/assets/temp-guy.png', {
            frameWidth: 48,
            frameHeight: 48
        });
        this.load.spritesheet('portal', 'http://localhost:63342/ADSB-game2/assets/portal.png', {
            frameWidth: 35,
            frameHeight: 50
        });
    }

    create ()
    {
        var spawnX;
        var spawnY;

        const map = this.make.tilemap({ key: 'map' });
        // first thing is embedded tileset name, second is tileset png
        // then width+height of tiles, margin, and spacing
        // Remember to manually extrude tiles (18*18 in piskel) :)
        const tileset = map.addTilesetImage('earth', 'tiles', 16, 16, 1, 2);
        const background = map.createStaticLayer('background', tileset, 0, 0).setScale(4);
        const platforms = map.createStaticLayer('platforms', tileset, 0, 0).setScale(4);
        const rear_platforms = map.createStaticLayer('rear_platforms', tileset, 0, 0).setScale(4);
  // There are many ways to set collision between tiles and players
  // As we want players to collide with all of the platforms, we tell Phaser to
  // set collisions for every tile in our platform layer whose index isn't -1.
  // Tiled indices can only be >= 0, therefore we are colliding with all of
  // the platform layer
        platforms.setCollisionByExclusion(-1, true);
        rear_platforms.setCollisionByExclusion(-1, true);

        this.physics.world.setBounds(0, 0, 8200, 4000);
        this.cameras.main.zoom = 0.8;
        
        this.checkpoints = this.physics.add.group({
            immovable: true
        });
        
        this.checkpoints.create(800, 2550, 'checkpoint1');
        //this.checkpoints.setImmovable(true);
        this.bert = this.physics.add.sprite(200,2500,'bert').setScale(1.2);
        this.portal = this.physics.add.sprite(500,2550,'portal').setScale(2);

        this.bert.body.setGravityY(400);
        //this.bert.setBounce(0.2);
        this.bert.setCollideWorldBounds(true);
        this.physics.add.collider(this.bert, platforms);
        this.physics.add.collider(this.bert, rear_platforms);
        this.physics.add.collider(this.portal, platforms);
        this.physics.add.collider(this.bert, this.checkpoints);
        this.physics.add.collider(this.checkpoints, platforms);
        this.physics.add.overlap(this.bert, this.portal, function(){
            this.bert.setX(spawnX);
            this.bert.setY(spawnY);
        }, null, this);
        this.physics.add.overlap(this.bert, this.checkpoints, function(){
            spawnX = this.bert.x;
            spawnY = this.bert.y;
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

        this.bert.setMaxVelocity(280, 900);

        this.cameras.main.startFollow(this.bert);
        //this.cameras.main.roundPixels = true;
    }

    update ()
    {
        // deceleration
        this.bert.body.useDamping=true;
        this.bert.setDrag(0.9, 0); //takes value between 0-1 you can also set x,y seperately setDrag(x,y)
        if (this.keyW.isDown && this.bert.body.onFloor()) {
            this.bert.setVelocityY(-450);
        }
        if (this.keyD.isDown) {
            this.bert.setAccelerationX(1000);
        } else if (this.keyA.isDown) {
            this.bert.setAccelerationX(-1000);
        } else {
            this.bert.setAccelerationX(0);
        }
        //this.bert.play('bert_anim', true);
        this.portal.play('portal_anim', true);
    }
}