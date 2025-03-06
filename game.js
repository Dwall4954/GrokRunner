let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 800 } } // Higher gravity for snappier jumps
    },
    scene: { preload: preload, create: create, update: update }
};

let game, player, ground, obstacles, backgroundFar, backgroundMid;

function submitPrompt() {
    let input = document.getElementById('user-input').value.split(', ');
    let character = input[0]?.trim() || 'default';
    let theme = input[1]?.trim() || 'default';

    // Grok’s pirate/jungle response
    let grokResponse = {
        character: character,
        theme: theme,
        description: "A swashbuckling pirate with a tricorn hat and peg leg, running through a dense tropical jungle with vines and treasure.",
        characterImage: 'https://via.placeholder.com/64x64.png?text=Pirate', // Bigger sprite
        backgroundFarImage: 'https://via.placeholder.com/800x600.png?text=JungleFar', // Distant trees
        backgroundMidImage: 'https://via.placeholder.com/800x600.png?text=JungleMid', // Closer foliage
        obstacleJumpImage: 'https://via.placeholder.com/80x40.png?text=Log', // Jump over
        obstacleSlideImage: 'https://via.placeholder.com/80x20.png?text=Vine' // Slide under
    };

    game = new Phaser.Game(config);
    game.customData = grokResponse;
    document.getElementById('prompt-overlay').style.display = 'none';
}

function preload() {
    this.load.image('player', game.customData.characterImage);
    this.load.image('backgroundFar', game.customData.backgroundFarImage);
    this.load.image('backgroundMid', game.customData.backgroundMidImage);
    this.load.image('obstacleJump', game.customData.obstacleJumpImage);
    this.load.image('obstacleSlide', game.customData.obstacleSlideImage);
    this.load.image('ground', 'https://via.placeholder.com/800x100.png?text=Path');
}

function create() {
    // Layered scrolling backgrounds for depth
    backgroundFar = this.add.tileSprite(0, 0, 800, 600, 'backgroundFar').setOrigin(0, 0);
    backgroundMid = this.add.tileSprite(0, 0, 800, 600, 'backgroundMid').setOrigin(0, 0);
    ground = this.add.tileSprite(0, 500, 800, 100, 'ground').setOrigin(0, 0);

    // Player
    player = this.physics.add.sprite(400, 450, 'player');
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, ground);

    // Obstacles
    obstacles = this.physics.add.group();
    this.physics.add.collider(player, obstacles, gameOver, null, this);
    this.time.addEvent({ delay: 2500, callback: spawnObstacle, callbackScope: this, loop: true });

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-SPACE', () => {
        if (player.body.touching.down) player.setVelocityY(-400); // Jump
    });
    this.input.keyboard.on('keydown-DOWN', () => {
        if (player.body.touching.down) player.setScale(1, 0.5); // Slide (shrink height)
    });
    this.input.keyboard.on('keyup-DOWN', () => player.setScale(1, 1)); // Reset scale
    // Left/Right movement
    this.input.keyboard.on('keydown-LEFT', () => player.x = Math.max(200, player.x - 200));
    this.input.keyboard.on('keydown-RIGHT', () => player.x = Math.min(600, player.x + 200));

    // Description
    this.add.text(10, 10, game.customData.description, { fontSize: '16px', color: '#fff' });
}

function update() {
    // Scroll backgrounds at different speeds for parallax
    backgroundFar.tilePositionY -= 1;
    backgroundMid.tilePositionY -= 3;
    ground.tilePositionY -= 5;

    // Obstacle movement
    obstacles.children.each(obstacle => {
        obstacle.y -= 5; // Move "toward" player
        if (obstacle.y < -50) obstacle.destroy(); // Remove off-screen
    });
}

function spawnObstacle() {
    let type = Phaser.Math.Between(0, 1) ? 'obstacleJump' : 'obstacleSlide';
    let yPos = type === 'obstacleJump' ? 550 : 500; // Jump: on ground, Slide: higher
    let obstacle = obstacles.create(Phaser.Math.Between(200, 600), 600, type);
    obstacle.setVelocityY(0); // Movement handled in update
    obstacle.checkWorldBounds = true;
    obstacle.outOfBoundsKill = true;
}

function gameOver() {
    this.physics.pause();
    this.add.text(400, 300, 'Game Over!', { fontSize: '32px', color: '#ff0000' }).setOrigin(0.5);
}
