import React, { Component } from 'react';
import Phaser from 'phaser';

// import Scene from 'game/Scene';
import { GAME_HEIGHT, GAME_WIDTH, BaseScene } from 'game/base';

export default class Game extends Component {
	componentDidMount() {
		const config = {
			type: Phaser.AUTO,
			width: GAME_WIDTH,
			height: GAME_HEIGHT,
			parent: 'phaser-game',
			scene: [BaseScene]
		};

		new Phaser.Game(config);
	}

	shouldComponentUpdate() {
		return false;
	}

	render() {
		return <div style={{ height: '100vh', width: '100vw' }} id="phaser-game" />;
	}
}
