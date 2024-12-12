import {AreaManager} from "./AreaManager";
import {TileMapManager} from "./TileMapManager";

interface Position {
	x: number;
	y: number;
}

interface SpriteAnimation {
	row: number;     // 스프라이트시트에서의 행 위치
	column: number;  // 스프라이트시트에서의 열 위치
	frames: number;  // 총 프레임 수
	currentFrame: number;  // 현재 프레임
	frameTime: number;     // 프레임당 시간
	timeSinceLastFrame: number;  // 마지막 프레임 이후 경과 시간
}

interface ResidentState {
	position: Position;
	displayPosition: Position;
	currentAction: string;
	isHome: boolean;
	targetPosition?: Position;
	movementSpeed: number;
	currentPath: Position[];
	pathProgress: number;
	nextPathPosition?: Position;
	hasReachedDestination: boolean;
	direction: 'up' | 'down' | 'left' | 'right';
	animation: SpriteAnimation;
	currentActivity?: string;
}

export class Resident {
	private state: ResidentState;
	private readonly DEFAULT_SPEED = 2.0;
	private spritesheet: HTMLImageElement | null = null;
	private readonly SPRITE_SIZE = 16;
	private readonly FRAME_TIME = 0.2;
	private readonly SPRITE_ID;

	private readonly SPRITE_START_X = 384;
	private readonly SPRITE_START_Y = 0;

	constructor(
		public readonly id: string,
		public readonly name: string,
		startPosition: Position,
		private areaManager: AreaManager,
		private spriteId: number
	) {
		this.state = {
			position: {...startPosition},
			displayPosition: {...startPosition},
			currentAction: 'idle',
			isHome: false,
			movementSpeed: this.DEFAULT_SPEED,
			currentPath: [],
			pathProgress: 0,
			hasReachedDestination: false,
			direction: 'down',
			animation: {
				row: 0,
				column: 0,
				frames: 4,
				currentFrame: 0,
				frameTime: this.FRAME_TIME,
				timeSinceLastFrame: 0
			},
		};

		this.SPRITE_ID = this.spriteId;
		this.loadSprites();
	}

	private async loadSprites(): Promise<void> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => {
				this.spritesheet = img;
				resolve();
			};
			img.onerror = reject;
			img.src = '/tilemap.png';
		});
	}

	private readonly DIRECTION_COLUMN = {
		down: 1,
		left: 0,
		right: 3,
		up: 2
	};

	update(deltaTime: number): void {
		if (!deltaTime || deltaTime < 0) return;

		this.updateAnimation(deltaTime);
		this.updatePathMovement(deltaTime);
		this.updateAreaStatus();

		if (!this.state.hasReachedDestination && this.state.currentAction === 'idle') {
			this.fetchAIResponse();
		}
	}

	private updateAnimation(deltaTime: number): void {
		const animation = this.state.animation;

		if (this.state.currentAction === 'move') {
			animation.timeSinceLastFrame += deltaTime;

			if (animation.timeSinceLastFrame >= animation.frameTime * 1000) {
				animation.currentFrame = (animation.currentFrame + 1) % animation.frames;
				animation.timeSinceLastFrame = 0;
			}
		} else {
			animation.currentFrame = 0;
		}
	}

	private updatePathMovement(deltaTime: number): void {
		if (this.state.currentAction !== 'move' || !this.state.nextPathPosition) {
			return;
		}

		const moveStep = this.state.movementSpeed * deltaTime / 1000;

		const dx = this.state.nextPathPosition.x - this.state.position.x;
		const dy = this.state.nextPathPosition.y - this.state.position.y;

		if (Math.abs(dx) > Math.abs(dy)) {
			this.state.direction = dx > 0 ? 'right' : 'left';
		} else {
			this.state.direction = dy > 0 ? 'down' : 'up';
		}

		const distance = Math.sqrt(dx * dx + dy * dy);

		if (distance <= moveStep) {
			this.state.position = {...this.state.nextPathPosition};
			this.state.displayPosition = {...this.state.nextPathPosition};
			this.state.pathProgress = 0;
			this.followPath();
		} else {
			const ratio = moveStep / distance;
			this.state.position.x += dx * ratio;
			this.state.position.y += dy * ratio;
			this.state.displayPosition = {...this.state.position};
		}
	}

	private fetchAIResponse(): void {
		const data = {command: 'move 1 1'};

		if (this.state.currentAction !== 'idle') return;
		if (this.state.hasReachedDestination) return;

		if (data.command.startsWith('move')) {
			const [_, x, y] = data.command.split(' ');
			const targetX = parseInt(x);
			const targetY = parseInt(y);

			if (Math.floor(this.state.position.x) === targetX &&
				Math.floor(this.state.position.y) === targetY) {
				this.state.hasReachedDestination = true;
				return;
			}

			this.moveToPosition({x: targetX, y: targetY});
		}
	}

	private updateAreaStatus(): void {
		const currentArea = this.areaManager.getAreaAtPosition(
			Math.floor(this.state.position.x),
			Math.floor(this.state.position.y)
		);
		this.state.isHome = currentArea?.id === `house_${this.id}`;
	}

	moveToPosition(position: Position): void {
		this.state.targetPosition = position;
		this.state.currentAction = 'move';
		this.state.hasReachedDestination = false;

		const path = this.findPath(this.state.position, position);
		if (path.length > 0) {
			this.state.currentPath = path;
			this.followPath();
		} else {
			console.log('No valid path found to target');
			this.state.currentAction = 'idle';
		}
	}

	private followPath(): void {
		if (this.state.currentPath.length === 0) {
			this.state.currentAction = 'idle';
			this.state.nextPathPosition = undefined;

			if (this.state.targetPosition &&
				Math.floor(this.state.position.x) === Math.floor(this.state.targetPosition.x) &&
				Math.floor(this.state.position.y) === Math.floor(this.state.targetPosition.y)) {
				this.state.hasReachedDestination = true;
			}
			return;
		}

		this.state.nextPathPosition = this.state.currentPath.shift()!;
		this.state.pathProgress = 0;
	}

	private serializePosition(pos: Position): string {
		return `${Math.floor(pos.x)},${Math.floor(pos.y)}`;
	}

	private findPath(startPos: Position, targetPos: Position): Position[] {
		const openList: Position[] = [];
		const closedSet: Set<string> = new Set();
		const gScore: Map<string, number> = new Map();
		const fScore: Map<string, number> = new Map();
		const cameFrom: Map<string, Position> = new Map();

		const start = {
			x: Math.floor(startPos.x),
			y: Math.floor(startPos.y)
		};
		const target = {
			x: Math.floor(targetPos.x),
			y: Math.floor(targetPos.y)
		};

		openList.push(start);
		gScore.set(this.serializePosition(start), 0);
		fScore.set(this.serializePosition(start), this.calculateHeuristic(start, target));

		while (openList.length > 0) {
			const current = this.getLowestFScore(openList, fScore);
			const currentKey = this.serializePosition(current);

			if (current.x === target.x && current.y === target.y) {
				return this.reconstructPath(cameFrom, current);
			}

			openList.splice(openList.findIndex(pos =>
				pos.x === current.x && pos.y === current.y), 1);
			closedSet.add(currentKey);

			const neighbors = this.getNeighbors(current);
			for (const neighbor of neighbors) {
				const neighborKey = this.serializePosition(neighbor);

				if (closedSet.has(neighborKey)) {
					continue;
				}

				const tentativeGScore = gScore.get(currentKey)! + 1;

				if (!openList.some(pos => pos.x === neighbor.x && pos.y === neighbor.y)) {
					openList.push(neighbor);
				} else if (tentativeGScore >= (gScore.get(neighborKey) ?? Infinity)) {
					continue;
				}

				cameFrom.set(neighborKey, current);
				gScore.set(neighborKey, tentativeGScore);
				fScore.set(neighborKey, tentativeGScore + this.calculateHeuristic(neighbor, target));
			}
		}

		return [];
	}

	private calculateHeuristic(pos: Position, goal: Position): number {
		return Math.abs(pos.x - goal.x) + Math.abs(pos.y - goal.y);
	}

	private getLowestFScore(openList: Position[], fScore: Map<string, number>): Position {
		let lowest = openList[0];
		let lowestScore = fScore.get(this.serializePosition(lowest)) ?? Infinity;

		for (const pos of openList) {
			const score = fScore.get(this.serializePosition(pos)) ?? Infinity;
			if (score < lowestScore) {
				lowest = pos;
				lowestScore = score;
			}
		}

		return lowest;
	}

	private reconstructPath(cameFrom: Map<string, Position>, current: Position): Position[] {
		const path: Position[] = [current];
		let currentKey = this.serializePosition(current);

		while (cameFrom.has(currentKey)) {
			const prev = cameFrom.get(currentKey)!;
			path.unshift(prev);
			currentKey = this.serializePosition(prev);
		}

		return path;
	}

	private getNeighbors(position: Position): Position[] {
		const neighbors: Position[] = [];
		const directions = [
			{x: 0, y: -1},
			{x: 1, y: 0},
			{x: 0, y: 1},
			{x: -1, y: 0}
		];

		for (const direction of directions) {
			const neighbor = {
				x: position.x + direction.x,
				y: position.y + direction.y
			};

			if (!this.positionHaveObstacle(neighbor)) {
				neighbors.push(neighbor);
			}
		}

		return neighbors;
	}

	private positionHaveObstacle(position: Position): boolean {
		const tilemapManager = TileMapManager.getInstance();
		const obstacleData = tilemapManager.getTilesetObstacleData();

		const x = Math.floor(position.x);
		const y = Math.floor(position.y);

		if (y < 0 || y >= obstacleData.length || x < 0 || x >= obstacleData[0].length) {
			return true;
		}

		return obstacleData[y][x];
	}

	render(ctx: CanvasRenderingContext2D, tileSize: number): void {
		const {x, y} = this.state.displayPosition;
		const pixelX = Math.floor(x * tileSize);
		const pixelY = Math.floor(y * tileSize);

		if (this.spritesheet) {
			const column = this.DIRECTION_COLUMN[this.state.direction];
			const frame = this.state.animation.currentFrame;

			const characterTypeOffset = this.SPRITE_ID * (this.SPRITE_SIZE * 4);
			const sourceX = this.SPRITE_START_X + (column * this.SPRITE_SIZE) + 8;
			const sourceY = this.SPRITE_START_Y + (frame * this.SPRITE_SIZE) + characterTypeOffset + 2 + (this.spriteId * 4);

			ctx.imageSmoothingEnabled = false;

			ctx.drawImage(
				this.spritesheet,
				sourceX,
				sourceY,
				this.SPRITE_SIZE,
				this.SPRITE_SIZE,
				pixelX,
				pixelY,
				tileSize,
				tileSize
			);
		} else {
			// Fallback rendering
			ctx.beginPath();
			ctx.arc(
				pixelX + tileSize / 2,
				pixelY + tileSize / 2,
				tileSize / 3,
				0,
				Math.PI * 2
			);
			ctx.fillStyle = this.state.isHome ? '#8BC34A' : '#4CAF50';
			ctx.fill();
			ctx.strokeStyle = '#388E3C';
			ctx.lineWidth = 2;
			ctx.stroke();
		}

		// 이름 표시
		ctx.font = '12px Arial';
		ctx.fillStyle = '#fff';
		ctx.textAlign = 'center';
		ctx.fillText(this.name, pixelX + tileSize / 2, pixelY - 6);
	}

	getState(): ResidentState {
		return {...this.state};
	}

	getPosition(): Position {
		return {...this.state.displayPosition};
	}
}