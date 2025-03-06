let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 500 } }
    },
    scene: { preload: preload, create: create, update: update }
};

let game, player, obstacles, background;

function submitPrompt() {
    let input = document.getElementById('user-input').value.split(', ');
    let character = input[0]?.trim() || 'default';
    let theme = input[1]?.trim() || 'default';

    // Grok’s response for "pirate, jungle"
    let grokResponse = {
        character: character,
        theme: theme,
        description: "A swashbuckling pirate with a tricorn hat and peg leg, sprinting through a dense tropical jungle with vines and treasure.",
        characterImage: 'https://via.placeholder.com/50x50.png?text=Pirate', // Replace with real URL
        backgroundImage: 'https://via.placeholder.com/800x600.png?text=Jungle', // Replace with real URL
        obstacleImage: 'https://via.placeholder.com/30x30.png?text=Crocodile' // Replace with real URL
    };

    game = new Phaser.Game(config);
    game.customData = grokResponse;
    document.getElementById('prompt-overlay').style.display = 'none';
}

function preload() {
    this.load.image('player', game.customData.characterImage);
    this.load.image('background', game.customData.backgroundImage);
    this.load.image('obstacle', game.customData.obstacleImage);
}

function create() {
    background = this.add.tileSprite(0, 0, 800, 600, 'background').setOrigin(0, 0);
    player = this.physics.add.sprite(100, 500, 'player');
    player.setCollideWorldBounds(true);

    obstacles = this.physics.add.group();
    this.physics.add.collider(player, obstacles, gameOver, null, this);
    this.time.addEvent({ delay: 2000, callback: spawnObstacle, callbackScope: this, loop: true });

    this.input.keyboard.on('keydown-SPACE', () => player.setVelocityY(-300));
    this.add.text(10, 10, game.customData.description, { fontSize: '16px', color: '#fff' });
}

function update() {
    background.tilePositionX += 5;
}

function spawnObstacle() {
    let obstacle = obstacles.create(800, 550, 'obstacle');
    obstacle.setVelocityX(-200);
}

function gameOver() {
    this.physics.pause();
    this.add.text(400, 300, 'Game Over!', { fontSize: '32px', color: '#ff0000' }).setOrigin(0.5);
}
