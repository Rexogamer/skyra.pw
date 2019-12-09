import Phaser from 'phaser';
import grassWaterJson from './isometric-grass-and-water.json';
import grassWaterPNG from './isometric-grass-and-water.png';
import rem from './rem_0002.png';
import skeletonImage from './skeleton8.png';

export const GAME_WIDTH = '100%';
export const GAME_HEIGHT = '100%';

function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

const directions = {
	west: { offset: 0, x: -2, y: 0, opposite: 'east' },
	northWest: { offset: 32, x: -2, y: -1, opposite: 'southEast' },
	north: { offset: 64, x: 0, y: -2, opposite: 'south' },
	northEast: { offset: 96, x: 2, y: -1, opposite: 'southWest' },
	east: { offset: 128, x: 2, y: 0, opposite: 'west' },
	southEast: { offset: 160, x: 2, y: 1, opposite: 'northWest' },
	south: { offset: 192, x: 0, y: 2, opposite: 'north' },
	southWest: { offset: 224, x: -2, y: 1, opposite: 'northEast' }
};

const anims = {
	idle: {
		startFrame: 0,
		endFrame: 4,
		speed: 0.2
	},
	walk: {
		startFrame: 4,
		endFrame: 12,
		speed: 0.15
	},
	attack: {
		startFrame: 12,
		endFrame: 20,
		speed: 0.11
	},
	die: {
		startFrame: 20,
		endFrame: 28,
		speed: 0.2
	},
	shoot: {
		startFrame: 28,
		endFrame: 32,
		speed: 0.1
	}
};

const skeletons = [];

let tileWidthHalf;
let tileHeightHalf;

export class BaseScene extends Phaser.Scene {
	addUser(user) {
		// why tf we declaring a class in here
		class Skeleton extends Phaser.GameObjects.Image {
			constructor(scene, x, y, motion, direction, distance) {
				super(scene, x, y, 'skeleton', directions[direction].offset + anims[motion]);
				this.text = scene.add.text(x, y, user.displayName, { font: '14px Arial Black', fill: '#fff' });
				this.text.depth = 999;

				this.startX = x;
				this.startY = y;
				this.distance = distance;

				this.motion = motion;
				this.anim = anims[motion];
				this.direction = directions[direction];
				this.speed = 0.15;
				this.f = this.anim.startFrame;

				this.depth = y + 64;

				scene.time.delayedCall(this.anim.speed * 1000, this.changeFrame.bind(this), [], this);
			}

			changeFrame() {
				this.f++;

				let delay = this.anim.speed;

				if (this.f === this.anim.endFrame) {
					switch (this.motion) {
						case 'walk':
							this.f = this.anim.startFrame;
							this.frame = this.texture.get(this.direction.offset + this.f);
							this.scene.time.delayedCall(delay * 1000, this.changeFrame.bind(this), [], this);
							break;

						case 'attack':
							delay = Math.random() * 2;
							this.scene.time.delayedCall(delay * 1000, this.resetAnimation.bind(this), [], this);
							break;

						case 'idle':
							delay = 0.5 + Math.random();
							this.scene.time.delayedCall(delay * 1000, this.resetAnimation.bind(this), [], this);
							break;

						case 'die':
							delay = 6 + Math.random() * 6;
							this.scene.time.delayedCall(delay * 1000, this.resetAnimation.bind(this), [], this);
							break;
					}
				} else {
					this.frame = this.texture.get(this.direction.offset + this.f);

					this.scene.time.delayedCall(delay * 1000, this.changeFrame.bind(this), [], this);
				}
			}

			resetAnimation() {
				this.f = this.anim.startFrame;

				this.frame = this.texture.get(this.direction.offset + this.f);

				this.scene.time.delayedCall(this.anim.speed * 1000, this.changeFrame.bind(this), [], this);
			}

			update() {
				if (this.motion === 'walk') {
					this.x += this.direction.x * this.speed;

					if (this.direction.y !== 0) {
						this.y += this.direction.y * this.speed;
						this.depth = this.y + 64;
					}

					//  Walked far enough?
					if (Phaser.Math.Distance.Between(this.startX, this.startY, this.x, this.y) >= this.distance) {
						this.direction = directions[this.direction.opposite];
						this.f = this.anim.startFrame;
						this.frame = this.texture.get(this.direction.offset + this.f);
						this.startX = this.x;
						this.startY = this.y;
					}
				}
				this.text.x = this.x;
				this.text.y = this.y;
			}
		}

		const locations = ['southEast', 'southWest', 'east', 'west', 'south'];
		const randomDirection = () => locations[Math.floor(Math.random() * locations.length)];

		skeletons.push(this.add.existing(new Skeleton(this, rand(1, 900), rand(1, 500), 'walk', randomDirection(), 330)));
	}

	preload() {
		this.load.json('map', grassWaterJson);
		this.load.spritesheet('tiles', grassWaterPNG, { frameWidth: 64, frameHeight: 64 });
		this.load.spritesheet('skeleton', skeletonImage, { frameWidth: 128, frameHeight: 128 });
		this.load.image('house', rem);
	}

	create() {
		// Our Skeleton class

		this.buildMap();
		this.placeHouses();

		// this.cameras.main.setSize(1600, 600);

		// this.cameras.main.scrollX = 800;
	}

	buildMap() {
		//  Parse the data out of the map
		const data = this.cache.json.get('map');

		const { tilewidth } = data;
		const { tileheight } = data;

		tileWidthHalf = tilewidth / 2;
		tileHeightHalf = tileheight / 2;

		const layer = data.layers[0].data;

		const mapwidth = data.layers[0].width;
		const mapheight = data.layers[0].height;

		const centerX = mapwidth * tileWidthHalf;
		const centerY = 16;

		let i = 0;

		let id;

		for (let y = 0; y < mapheight; y++) {
			for (let x = 0; x < mapwidth; x++) {
				id = layer[i] - 1;

				const tx = (x - y) * tileWidthHalf;
				const ty = (x + y) * tileHeightHalf;

				const tile = this.add.image(centerX + tx, centerY + ty, 'tiles', id);

				tile.depth = centerY + ty;

				i++;
			}
		}
	}

	placeHouses() {
		let house = this.add.image(240, 370, 'house');

		house.depth = house.y + 86;

		house = this.add.image(1300, 290, 'house');

		house.depth = house.y + 86;
	}

	update() {
		skeletons.forEach(skeleton => {
			skeleton.update();
		});

		// return;
	}
}
