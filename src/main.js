var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
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
        this.load.image('bruh', 'http://127.0.0.1:8887/assets/momement.png');
        this.load.spritesheet('bert', 'http://127.0.0.1:8887/assets/bert.png', {
            frameWidth: 107,
            frameHeight: 140
        });
    }

    function create ()
    {
        var test = this.physics.add.image(400, 100, 'bruh');
        this.bert = this.add.sprite(200,200,'bert');

        test.setVelocity(100, 200);
        test.setBounce(1, 1);
        test.setCollideWorldBounds(true);

        this.anims.create({
            key: 'bert_anim',
            frames: this.anims.generateFrameNumbers('bert'),
            frameRate: 10,
            repeat: -1
        });

    }

    function update ()
    {
        this.bert.play('bert_anim', true);
    }