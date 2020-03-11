class hud extends Phaser.Scene {
    constructor() {
        super({ key: 'hud', active: true });

        this.score = 0;
    }

    preload() {}

    create() {
        var scoreText = this.add.text(680,560, "Score: 0", {fill: '#0f0'});

        //var theGame = this.scene.get('play');
        this.scene.get('play').events.on('addScore', function () {
            this.score++;

            scoreText.setText('Score: ' + this.score);

        }, this);
    }

    update() {}
}