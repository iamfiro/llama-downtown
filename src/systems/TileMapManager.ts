import {Camera} from "./Camera.ts";

type TileType = {
	id: string;
	walkable: boolean;
	sprite: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
}

type PlacedTile = {
	type: TileType;
	x: number;
	y: number;
}

type Layer = {
	tiles: Array<Array<PlacedTile | null>>;
	visible: boolean;
}

export class TileMapManager {
	private static instance: TileMapManager | null = null;
	private width: number;
	private height: number;
	private tileTypes: Map<string, TileType>;
	private layers: Layer[];
	private tileSize: number;
	private tilesetImage: HTMLImageElement | null;

	private constructor(width: number, height: number, tileSize: number = 32) {
		this.width = width;
		this.height = height;
		this.tileSize = tileSize;
		this.tileTypes = new Map();
		this.layers = [];
		this.tilesetImage = null;
	}

	public static getInstance(width?: number, height?: number, tileSize?: number): TileMapManager {
		if (!TileMapManager.instance) {
			if (width === undefined || height === undefined) {
				throw new Error('Width and height must be provided when creating TileMapManager instance');
			}
			TileMapManager.instance = new TileMapManager(width, height, tileSize);
		}
		return TileMapManager.instance;
	}

	public static resetInstance(): void {
		TileMapManager.instance = null;
	}

	async loadTileset(url: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => {
				this.tilesetImage = img;
				resolve();
			};
			img.onerror = reject;
			img.src = url;
		});
	}

	addLayer(): number {
		const newLayer: Layer = {
			tiles: Array(this.height).fill(null).map(() =>
				Array(this.width).fill(null)
			),
			visible: true
		};

		this.layers.push(newLayer);
		return this.layers.length - 1;
	}

	registerTileType(tileType: TileType): void {
		this.tileTypes.set(tileType.id, tileType);
	}

	placeTile(x: number, y: number, layerIndex: number, tileTypeId: string): boolean {
		if (!this.isValidPosition(x, y) || !this.isValidLayer(layerIndex)) {
			return false;
		}

		const tileType = this.tileTypes.get(tileTypeId);
		if (!tileType) {
			return false;
		}

		this.layers[layerIndex].tiles[y][x] = {
			type: tileType,
			x: x,
			y: y
		};

		return true;
	}

	private isValidPosition(x: number, y: number): boolean {
		return x >= 0 && x < this.width && y >= 0 && y < this.height;
	}

	private isValidLayer(layerIndex: number): boolean {
		return layerIndex >= 0 && layerIndex < this.layers.length;
	}

	getTilesetImage() {
		return this.tilesetImage;
	}

	getTilesetObstacleData(): Array<Array<boolean>> {
		const obstacleData = Array(this.height).fill(null).map(() =>
			Array(this.width).fill(false)
		);

		this.layers.forEach((layer) => {
			for (let y = 0; y < this.height; y++) {
				for (let x = 0; x < this.width; x++) {
					const tile = layer.tiles[y][x];
					if (tile && !tile.type.walkable) {
						obstacleData[y][x] = true;
					}
				}
			}
		});

		return obstacleData;
	}

	render(ctx: CanvasRenderingContext2D, camera: Camera): void {
		if (!this.tilesetImage) {
			console.warn('No tileset image loaded');
			return;
		}

		camera.applyTransform(ctx);

		this.layers.forEach((layer) => {
			if (!layer.visible) return;

			const cameraState = camera.getState();
			const startX = Math.floor(cameraState.x / this.tileSize);
			const startY = Math.floor(cameraState.y / this.tileSize);
			const endX = Math.ceil((cameraState.x + ctx.canvas.width / cameraState.zoom) / this.tileSize);
			const endY = Math.ceil((cameraState.y + ctx.canvas.height / cameraState.zoom) / this.tileSize);

			for (let y = startY; y < endY && y < this.height; y++) {
				for (let x = startX; x < endX && x < this.width; x++) {
					if (y < 0 || x < 0) continue;

					const tile = layer.tiles[y][x];
					if (!tile) continue;

					const {sprite} = tile.type;

					ctx.drawImage(
						this.tilesetImage as HTMLImageElement,
						sprite.x,
						sprite.y,
						sprite.width,
						sprite.height,
						x * this.tileSize,
						y * this.tileSize,
						this.tileSize,
						this.tileSize
					);
				}
			}
		});

		camera.restoreTransform(ctx);
	}
}