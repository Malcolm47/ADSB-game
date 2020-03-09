class hud extends Phaser.Scene {
    constructor() {
        super({key:'hud'});

        this.score = 0;
    }

    preload() {}

    create() {
        var scoreText = this.add.text(650,500, "Score: 0", {fill: '#0f0'});

        var theGame = this.scene.get('play');

        theGame.events.on('addScore', function () {
            console.log('addScore received');
            this.score++;

            scoreText.setText('Score: ' + this.score);

        }, this);
    }

    update() {}
}