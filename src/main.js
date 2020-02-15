var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
        },
        scene: {
            preload: preload,
            create: create
        }
    };

    var game = new Phaser.Game(config);

    function preload ()
    {
    // IMPORTANT! Web server needs to be running for ADSB-game folder.
    // index.html can be run via IDE but the image paths need to be through server.
    // Make sure "set CORS headers" option is on
        this.load.image('test', 'http://127.0.0.1:8887/assets/momement.png');
    }

    function create ()
    {

        var test = this.physics.add.image(400, 100, 'test');

        test.setVelocity(100, 200);
        test.setBounce(1, 1);
        test.setCollideWorldBounds(true);
    }