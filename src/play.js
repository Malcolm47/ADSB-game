class play extends Phaser.Scene {
    constructor() {
        super({key:'play'});
    }

    preload ()
    {
        this.load.scenePlugin({
            key: 'AnimatedTiles',
            url: 'AnimatedTiles.js',
            sceneKey: 'animatedTiles'
        });

    // IMPORTANT! Web server needs to be running for ADSB-game folder.
    // index.html can be run via IDE but the image paths are served through server.
    // Make sure "set CORS headers" option is on
        this.load.image('bruh', '../assets/momement2.png');
        this.load.image('tiles', '../assets/earth-tiles.png');
        this.load.image('gooTiles', '../assets/purple-goo.png');
        this.load.image('dot', '../assets/dot.png');
        this.load.tilemapTiledJSON('map', '../assets/first-test-json.json');
        this.load.spritesheet('bert', '../assets/temp-guy.png', {
            frameWidth: 48,
            frameHeight: 48
        });
        this.load.spritesheet('portal', '../assets/portal.png', {
            frameWidth: 35,
            frameHeight: 50
        });
        // REMEMBER TO ADD FLAG RESPONSIVENESS AT SOME POINT
        this.load.spritesheet('flag', '../assets/flag.png', {
            frameWidth: 25,
            frameHeight: 32
        });
        this.load.spritesheet('enemy', '../assets/enemy.png', {
            frameWidth: 48, 
            frameHeight: 14
        });
        this.load.spritesheet('coin', '../assets/coin.png', {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    create ()
    {
        var spawnX = 3035;
        var spawnY = 2220;
        var score = 0;

        var coinX = [1220,1290,1150, 338,2151,2491,3231,3521,3682,3938,3772,3682,3592,3220,3300,1820,1627,1370,1181,1025,
        1095, 900, 830, 760, 690, 620, 550, 480, 410,3415,3548,3806,4530,5116,5768,6080,6963,7300,7550,7700,7810,7880,7950,
        8020,8090,6750,6816,6882,7095,4127,4283,4547,5805,6400,6509,6596,6673,7137,7293,7860,7943,8026,8109];
        var coinY = [2550,2550,2550,2614,2422,2294,1969,1846,1718,1334,1078,1078,1078, 950, 950,1078,1398,1782,2102,2166,
        2166,2230,2230,2230,2230,2230,2230,2230,2230,2225,2225,2161,2161,2353,2289,2161,2033,2033,2033,2033,2033,2033,2033,
        2033,2033,2737,2737,2737,2737,1073, 945, 817, 817, 881, 945, 945, 945,1201, 881, 753, 753, 753, 753];

        const map = this.make.tilemap({ key: 'map' });
        // first thing is embedded tileset name, second is tileset png
        // then width+height of tiles, margin, and spacing
        // Remember to manually extrude tiles (18*18 in piskel) :)
        const tileset = map.addTilesetImage('earth', 'tiles', 16, 16, 1, 2);
        const enemy_walls = map.addTilesetImage('enemy_walls', 'dot', 16, 16, 0, 0);
        const background = map.createStaticLayer('background', tileset, 0, 0).setScale(4);
        const platforms = map.createStaticLayer('platforms', tileset, 0, 0).setScale(4);
        const rear_platforms = map.createStaticLayer('rear_platforms', tileset, 0, 0).setScale(4);
        const enemyWalls = map.createStaticLayer('enemy_walls', enemy_walls, 0, 0).setScale(4);
        const gooTiles = map.addTilesetImage('purple-goo', 'gooTiles', 16, 16, 1, 2);
        const goo = map.createDynamicLayer('goo', gooTiles, 0, 0).setScale(4);
        this.animatedTiles.init(map);
        this.animatedTiles.setRate(0.5);
  // There are many ways to set collision between tiles and players
  // As we want players to collide with all of the platforms, we tell Phaser to
  // set collisions for every tile in our platform layer whose index isn't -1.
  // Tiled indices can only be >= 0, therefore we are colliding with all of
  // the platform layer
        platforms.setCollisionByExclusion(-1, true);
        rear_platforms.setCollisionByExclusion(-1, true);
        goo.setCollisionByExclusion(-1, true);
        enemyWalls.setCollisionByExclusion(-1, true);
        
        this.physics.world.setBounds(0, 0, 8200, 4000);
        this.cameras.main.zoom = 0.8;
        
        this.checkpoints = this.physics.add.group({
            immovable: true
        });
        this.checkpoints.create(2914,2182, 'flag').setScale(2.5);
        this.checkpoints.create(2406, 0, 'flag').setScale(2.5);

        this.enemies = this.physics.add.group({
            immovable: true,
            moves: true
        });
        this.enemies.create(600, 2550, 'enemy');
        this.enemies.create(1200, 2400, 'enemy');
        this.enemies.children.iterate((child) => {
            child.setSize(45,10);
            child.setOffset(0,4)
            child.setScale(3);
            child.setVelocityX(160);
            child.setBounceX(1);
        });

        this.bert = this.physics.add.sprite(spawnX,spawnY,'bert').setScale(1.3);
        this.portal = this.physics.add.sprite(1000,2600,'portal').setScale(2);

        this.coins = this.physics.add.group({
            immovable: true,
            key: 'coin'
        })
        coinX.forEach(createCoins, this);
        function createCoins(value, index) {
            this.coins.create(value, coinY[index]);
        }
        this.coins.children.iterate((child) => {
            child.setSize(20,20);
            child.setOffset(0,12)
            child.setScale(1.4);
            child.setGravityY(1000);
        });

        this.bert.body.setGravityY(400);
        this.bert.setCollideWorldBounds(true);
        this.physics.add.collider(this.bert, platforms);
        this.physics.add.collider(this.bert, rear_platforms);
        this.physics.add.collider(this.portal, platforms);
        this.physics.add.collider(this.checkpoints, [rear_platforms, platforms]);
        //this.physics.add.collider(this.checkpoints, platforms);
        this.physics.add.collider(this.enemies, enemyWalls);
        this.physics.add.collider(this.enemies, platforms);
        this.physics.add.collider(this.coins, [platforms, rear_platforms]);
        this.physics.add.collider(this.bert, goo, function(){
            this.bert.setX(spawnX);
            this.bert.setY(spawnY);
        }, null, this);
        this.physics.add.overlap(this.bert, this.enemies, enemyHit, null, this);
        function enemyHit (player, enemy) {
            if (this.bert.body.velocity.y > 0) {
                enemy.disableBody(true,true);
            } else {
                this.bert.setX(spawnX);
                this.bert.setY(spawnY);
            }
        }

        this.physics.add.overlap(this.bert, this.coins, collectCoin, null, this);
        function collectCoin (player, coin) {
            // disable collision for the coin so the overlap is only detected once
            coin.body.checkCollision.none = true;
            var tween = this.tweens.add({
                targets: coin,
                y: coin.body.position.y - 60,
                alpha: 0,
                duration: 300,
                ease: 'Cubic',
                repeat: 0,
                onComplete: () => {
                    coin.disableBody(true,true);
                    this.events.emit('addScore');
                }
            });
        }
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
        this.anims.create({
            key: 'flag_anim',
            frames: this.anims.generateFrameNumbers('flag'),
            frameRate: 9,
            repeat: -1
        });
        this.anims.create({
            key: 'enemy_right',
            frames: this.anims.generateFrameNumbers('enemy', {start: 0, end: 2}),
            frameRate: 7,
            yoyo: true,
            repeat: -1
        });
        this.anims.create({
            key: 'enemy_left',
            frames: this.anims.generateFrameNumbers('enemy', {start: 3, end: 5}),
            frameRate: 7,
            yoyo: true,
            repeat: -1
        });
        this.anims.create({
            key: 'coin_anim',
            frames: this.anims.generateFrameNumbers('coin'),
            frameRate: 27,
            repeat: -1
        });

        this.keyW = this.input.keyboard.addKey('W');  // Get key object
        this.keyD = this.input.keyboard.addKey('D');
        this.keyA = this.input.keyboard.addKey('A');
        var keyC = this.input.keyboard.addKey('C');
        var keyP = this.input.keyboard.addKey('P');

        keyC.on('up', function() {console.log(Math.floor(this.bert.body.position.x + 24) + ", " + 
        Math.floor(this.bert.body.position.y + 48));}, this)
        keyP.on('up', function() {this.bert.setMaxVelocity(500,900)}, this)

        this.bert.setMaxVelocity(370, 900);

        this.cameras.main.startFollow(this.bert);
        this.cameras.main.setLerp(0.1);
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

        this.enemies.children.iterate((child) => {
            if (child.body.velocity.x > 0) {
                child.play('enemy_right', true);
            } else {
                child.play('enemy_left', true);
            }
        });
        this.portal.play('portal_anim', true);
        this.checkpoints.playAnimation('flag_anim', true);
        //this.enemies.playAnimation('enemy_anim', true);
        this.coins.playAnimation('coin_anim', true);
    }
}