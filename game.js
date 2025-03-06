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

    // Simulate Grok's response (we’ll replace this with my actual output)
    game = new Phaser.Game(config);
    game.customData = {
        character: character,
        theme: theme,
        description: `A ${character} running through a ${theme}.`
    };
    document.getElementById('prompt-overlay').style.display = 'none';
}

function preload() {
    // Placeholder assets for now
    this.load.image('player', 'https://via.placeholder.com/50x50.png?text=Player');
    this.load.image('background', 'https://via.placeholder.com/800x600.png?text=Background');
    this.load.image('obstacle', 'https://via.placeholder.com/30x30.png?text=Obstacle');
}

function create() {
    // Background
    background = this.add.tileSprite(0, 0, 800, 600, 'background').setOrigin(0, 0);

    // Player
    player = this.physics.add.sprite(100, 500, 'player');
    player.setCollideWorldBounds(true);

    // Obstacles
    obstacles = this.physics.add.group();
    this.physics.add.collider(player, obstacles, gameOver, null, this);
    this.time.addEvent({ delay: 2000, callback: spawnObstacle, callbackScope: this, loop: true });

    // Controls
    this.input.keyboard.on('keydown-SPACE', () => player.setVelocityY(-300));

    // Display description
    this.add.text(10, 10, game.customData.description, { fontSize: '16px', color: '#fff' });
}

function update() {
    background.tilePositionX += 5; // Scroll background
}

function spawnObstacle() {
    let obstacle = obstacles.create(800, 550, 'obstacle');
    obstacle.setVelocityX(-200);
}

function gameOver() {
    this.physics.pause();
    this.add.text(400, 300, 'Game Over!', { fontSize: '32px', color: '#ff0000' }).setOrigin(0.5);
}