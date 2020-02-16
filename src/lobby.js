class lobby extends Phaser.Scene {
    constructor() {
        super({key:'lobby'});
    }

    preload() {
        //this.load.image('start', )
    }

    create() {
        var startButton = this.add.text(config.width/2,config.height/2,'Start', {fill: '#0f0'}).setOrigin(0.5).setScale(1.4);
        startButton.setInteractive();
        //startButton.originX = 0.5;
        //startButton.originX = 0.5;

        startButton.on('pointerover', function(){startButton.setStyle({fill: '#fff'})});
        startButton.on('pointerout', function(){startButton.setStyle({fill: '#0f0'})});
        startButton.on('pointerdown', function(){
            this.scene.start('play');
        }, this);
    }

    update() {
        
    }
}