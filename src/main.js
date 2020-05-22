var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        pixelArt: true,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 480 }
            }
        },
        scene: [lobby, play, hud]
    };

var game = new Phaser.Game(config);