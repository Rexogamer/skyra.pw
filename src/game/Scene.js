import Phaser from 'phaser';

export default class ExampleScene extends Phaser.Scene {
	create() {
		const text = this.add.text(250, 250, 'Toggle UI', {
			backgroundColor: 'white',
			color: 'blue',
			fontSize: 48
		});

		text.setInteractive({ useHandCursor: true });

		text.on('pointerup', () => {
			console.log('');
		});
	}
}
