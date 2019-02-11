import 'phaser'
import GameSetting from './config/Game'
import * as images from '../assets/*.png'

export default class Game extends Phaser.Scene {
  constructor () {
    super('Game')
  }

  preload () {
    this.load.image('platform', images.platform)
    this.load.image('player', images.player)
  }

  create () {
    // group all active playforms
    this.platformGroup = this.add.group({
      removeCallback: (platform) => {
        platform.scene.platformPool.add(platform)
      }
    })

    // pool
    this.platformPool = this.add.group({
      removeCallback: (platform) => {
        platform.scene.platformGroup.add(platform)
      }
    })

    this.playerJumps = 0

    // Add platform to game
    this.addPlatform(this.game.config.width, this.game.config.width / 2)

    this.player = this.physics.add.sprite(
      GameSetting.playerStartPosition,
      this.game.config.height / 2,
      'player'
    )

    this.player.setGravityY(GameSetting.playerGravity)
    this.physics.add.collider(this.player, this.platformGroup)

    this.input.on("pointerdown", this.jump, this);
  }

  addPlatform (platformWidth, posX) {
    let platform

    if ( this.platformPool.getLength() ) {
      platform = this.platformPool.getFirst()
      platform.x = posX
      platform.active = true
      platform.visible = true
      this.platformPool.remove(platform)
    } else {
      platform = this.physics.add.sprite(posX, this.game.config.height * 0.8, "platform")
      platform.setImmovable(true)
      platform.setVelocityX(GameSetting.platformStartSpeed * -1)
      this.platformGroup.add(platform)
    }

    platform.displayWidth = platformWidth
    this.nextPlatformDistance = Phaser.Math.Between(GameSetting.spawnRange[0], GameSetting.spawnRange[1])
  }

  jump () {
    if ( this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < GameSetting.jumps) ) {
      if ( this.player.body.touching.down ) {
        this.playerJumps = 0
      }
      this.player.setVelocityY(GameSetting.jumpForce * -1);
      this.playerJumps++
    }
  }

  update () {
    if ( this.player.y > this.game.config.height ) {
      this.scene.start('Game')
    }

    this.player.x = GameSetting.playerStartPosition

    // Recucling platforms
    let minDistance = this.game.config.width

    this.platformGroup.getChildren().forEach(platform => {
      let platformDistance = this.game.config.width - platform.x - platform.displayWidth / 2
      minDistance = Math.min(minDistance, platformDistance)
      if ( platform.x < - platform.displayWidth / 2 ) {
        this.platformGroup.killAndHide(platform);
        this.platformGroup.remove(platform);
      }
    }, this)

    if ( minDistance > this.nextPlatformDistance ) {
      let nextPlatformWidth = Phaser.Math.Between(GameSetting.platformSizeRange[0], GameSetting.platformSizeRange[1])
      this.addPlatform(nextPlatformWidth, this.game.config.width + nextPlatformWidth / 2)
    }

  }
}
