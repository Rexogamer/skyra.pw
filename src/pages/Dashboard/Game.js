import React, { Component } from 'react';
import Phaser from 'phaser';

// import Scene from 'game/Scene';
import { GAME_HEIGHT, GAME_WIDTH, BaseScene } from 'game/base';
import { authedFetch } from 'meta/util';

export default class Game extends Component {
	componentDidMount() {
		const config = {
			type: Phaser.AUTO,
			width: GAME_WIDTH,
			height: GAME_HEIGHT,
			parent: 'phaser-game',
			scene: [BaseScene]
		};

		const game = new Phaser.Game(config);

		setTimeout(() => {
			const scene = game.scene.scenes[0];
			authedFetch(`/guilds/${this.props.guildID}/members`).then(res => res.map(scene.addUser.bind(scene)));
		}, 1000);
	}

	shouldComponentUpdate() {
		return false;
	}

	render() {
		console.log(this.props);
		return <div style={{ height: '100%', width: '100%', margin: -32 }} id="phaser-game" />;
	}
}
