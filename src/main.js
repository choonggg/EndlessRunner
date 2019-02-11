import 'phaser'
import Game from './Game'

if (module.hot) {
  module.hot.accept(() => {
    location.reload()
  })
}

const Settings = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [Game],
  backgroundColor: '#444444',
  physics: {
    default: 'arcade'
  }
}

export default Settings

const game = new Phaser.Game(Settings)
