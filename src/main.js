var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    var game = new Phaser.Game(config);

    function preload ()
    {
    // IMPORTANT! Web server needs to be running for ADSB-game folder.
    // index.html can be run via IDE but the image paths need to be through server.
    // Make sure "set CORS headers" option is on
        this.load.image('bruh', 'http://127.0.0.1:8887/assets/momement2.png');
        this.load.image('tiles', 'http://127.0.0.1:8887/assets/momement.png');
        this.load.tilemapTiledJSON('map', 'http://127.0.0.1:8887/assets/first-test-json.json');
        this.load.spritesheet('bert', 'http://127.0.0.1:8887/assets/bert.png', {
            frameWidth: 107,
            frameHeight: 140
        });
    }

    function create ()
    {
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('testing', 'tiles', 32, 32);
        const platforms = map.createStaticLayer('Tile Layer 1', tileset, 0, 200).setScale(2);
  // There are many ways to set collision between tiles and players
  // As we want players to collide with all of the platforms, we tell Phaser to
  // set collisions for every tile in our platform layer whose index isn't -1.
  // Tiled indices can only be >= 0, therefore we are colliding with all of
  // the platform layer
        platforms.setCollisionByExclusion(-1, true);

        this.physics.world.setBounds(0, 0, 1600, 1200);
        this.cameras.main.zoom = 0.8; 

        //var test = this.physics.add.image(400, 100, 'bruh');
        //test.setVelocity(100, 200);
        //test.setBounce(1, 1);
        //test.setCollideWorldBounds(true);
        bert = this.physics.add.sprite(200,200,'bert').setScale(0.45);

        //platforms = this.physics.add.staticGroup();
        //platforms.enableBody = true;

        //platforms.create(400,400, 'bruh').setScale(2).refreshBody();

        bert.body.setGravityY(400);
        //this.bert.setBounce(0.2);
        bert.setCollideWorldBounds(true);
        this.physics.add.collider(bert, platforms);

        this.anims.create({
            key: 'bert_anim',
            frames: this.anims.generateFrameNumbers('bert'),
            frameRate: 10,
            repeat: -1
        });

        keyW = this.input.keyboard.addKey('W');  // Get key object
        keyD = this.input.keyboard.addKey('D');
        keyA = this.input.keyboard.addKey('A');

        this.cameras.main.startFollow(bert);
    }

    function update ()
    {
        //var isDown = this.keyW.isDown;
        //var isUp = this.keyW.isUp;
        if (keyW.isDown && bert.body.onFloor()) {
            bert.setVelocityY(-450);
        }
        if (keyD.isDown) {
            bert.setVelocityX(160);
        } else if (keyA.isDown) {
            bert.setVelocityX(-160);
        } else {
            bert.setVelocityX(0);
        }
        bert.play('bert_anim', true);
    }