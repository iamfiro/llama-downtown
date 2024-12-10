import {Position, Resident, ResidentState} from "./Resident";
import {AreaManager} from "./AreaManager";
import {Camera} from "./Camera";

// Custom error types for better error handling
class ResidentInitializationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ResidentInitializationError';
	}
}

class ResidentUpdateError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ResidentUpdateError';
	}
}

class APIError extends Error {
	constructor(message: string, public statusCode?: number) {
		super(message);
		this.name = 'APIError';
	}
}

export class AgentManager {
	private residents: Map<string, Resident> = new Map();
	private readonly API_ENDPOINT: string;
	private readonly MAX_RETRY_ATTEMPTS = 3;
	private readonly RETRY_DELAY = 1000; // 1초
	private areaManager: AreaManager;
	private initialized: boolean = false;
	private debugMode: boolean = true;

	// 렌더링 관련 상수
	private readonly RESIDENT_COLORS = {
		DEFAULT: '#4CAF50',
		AT_HOME: '#8BC34A',
		MOVING: '#FFA726',
		WORKING: '#42A5F5'
	};
	private readonly RESIDENT_SIZE = 32;
	private readonly NAME_FONT = '12px Arial';
	private readonly STATE_FONT = '10px Arial';

	constructor(areaManager: AreaManager, apiEndpoint?: string) {
		if (!areaManager) {
			throw new Error('AreaManager is required');
		}
		this.areaManager = areaManager;
		this.API_ENDPOINT = apiEndpoint || 'https://6588f40c-df84-4e96-9181-6e66691acd71.mock.pstmn.io';
	}

	async initialize(): Promise<void> {
		if (this.initialized) {
			return;
		}

		try {
			await this.initializeResidents();
			this.initialized = true;
		} catch (error) {
			console.error('Initialization failed:', error);
			throw new ResidentInitializationError(
				`Initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	private async initializeResidents(): Promise<void> {
		try {
			const residentsToInitialize = [
				{id: 'william', name: 'William', houseId: 'house_william'}
			];

			for (const residentInfo of residentsToInitialize) {
				await this.initializeSingleResident(residentInfo);
			}
		} catch (error) {
			console.error('Failed to initialize residents:', error);
			throw new ResidentInitializationError(
				`Failed to initialize residents: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	private async initializeSingleResident(
		residentInfo: { id: string; name: string; houseId: string }
	): Promise<void> {
		try {
			if (!this.areaManager.hasArea(residentInfo.houseId)) {
				throw new Error(`House area not found for resident: ${residentInfo.name}`);
			}

			const homeCenter = this.areaManager.getAreaCenter(residentInfo.houseId);
			if (!homeCenter) {
				throw new Error(`Unable to get home center for resident: ${residentInfo.name}`);
			}

			if (!this.isValidPosition(homeCenter)) {
				throw new Error(`Invalid home center position for resident: ${residentInfo.name}`);
			}

			await this.addResident(residentInfo.id, residentInfo.name, homeCenter);
			console.log(`Successfully initialized resident: ${residentInfo.name}`);
		} catch (error) {
			console.error(`Failed to initialize resident ${residentInfo.name}:`, error);
			throw error;
		}
	}

	private isValidPosition(position: Position): boolean {
		return (
			position &&
			typeof position.x === 'number' &&
			typeof position.y === 'number' &&
			!isNaN(position.x) &&
			!isNaN(position.y) &&
			position.x >= 0 &&
			position.y >= 0
		);
	}

	private async addResident(id: string, name: string, position: Position): Promise<void> {
		try {
			if (this.residents.has(id)) {
				throw new Error(`Resident with ID ${id} already exists`);
			}

			const resident = new Resident(id, name, position, this.areaManager);

			this.residents.set(id, resident);
		} catch (error) {
			throw new ResidentInitializationError(
				`Failed to add resident ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	async update(deltaTime: number): Promise<void> {
		if (typeof deltaTime !== 'number' || deltaTime < 0) {
			throw new ResidentUpdateError('Invalid deltaTime value');
		}

		const updatePromises = Array.from(this.residents.values()).map(async (resident) => {
			try {
				resident.update(deltaTime);
				await this.checkAndUpdateAICommand(resident);
			} catch (error) {
				console.error(`Failed to update resident ${resident.name}:`, error);
				throw new ResidentUpdateError(
					`Failed to update resident ${resident.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
				);
			}
		});

		await Promise.all(updatePromises);
	}

	private async checkAndUpdateAICommand(resident: Resident): Promise<void> {
		if (!resident) {
			throw new Error('Invalid resident object');
		}

		const state = resident.getState();
		if (state.currentAction === 'idle') {
			let lastError: Error | null = null;

			for (let attempt = 0; attempt < this.MAX_RETRY_ATTEMPTS; attempt++) {
				try {
					const command = await this.fetchNextCommand(resident.id, state);
					await resident.executeCommand(command);
					return;
				} catch (error) {
					lastError = error instanceof Error ? error : new Error('Unknown error');
					console.error(`Attempt ${attempt + 1} failed:`, error);

					if (attempt < this.MAX_RETRY_ATTEMPTS - 1) {
						await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
					}
				}
			}

			throw new Error(
				`Failed to update AI command after ${this.MAX_RETRY_ATTEMPTS} attempts: ${lastError?.message}`
			);
		}
	}

	private async fetchNextCommand(residentId: string, state: ResidentState): Promise<string> {
		if (!residentId || !state) {
			throw new APIError('Invalid parameters for fetchNextCommand');
		}

		try {
			const response = await fetch(`${this.API_ENDPOINT}/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					residentId,
					currentState: state,
					timestamp: Date.now(),
					isHome: state.isHome
				})
			});

			if (!response.ok) {
				throw new APIError(`API request failed with status ${response.status}`, response.status);
			}

			const data = await response.json();

			if (!data || !data.command) {
				throw new APIError('Invalid response format from API');
			}

			return data.command;
		} catch (error) {
			if (error instanceof APIError) {
				throw error;
			}
			throw new APIError(
				`Failed to fetch next command: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	render(ctx: CanvasRenderingContext2D, camera: Camera): void {
		if (!ctx || !camera) {
			console.error('Invalid rendering context or camera');
			return;
		}

		try {
			camera.applyTransform(ctx);

			for (const resident of this.residents.values()) {
				this.renderResident(ctx, resident);
				if (this.debugMode) {
					this.renderDebugInfo(ctx, resident);
				}
			}

			camera.restoreTransform(ctx);
		} catch (error) {
			console.error('Error during rendering:', error);
		}
	}

	private renderResident(ctx: CanvasRenderingContext2D, resident: Resident): void {
		try {
			const state = resident.getState();
			if (!state || !state.position) return;

			const {x, y} = state.position;
			const tileSize = this.RESIDENT_SIZE;

			ctx.beginPath();
			ctx.arc(
				x * tileSize + tileSize / 2,
				y * tileSize + tileSize / 2,
				tileSize / 3,
				0,
				Math.PI * 2
			);

			ctx.fillStyle = this.getResidentColor(state);
			ctx.fill();
			ctx.strokeStyle = '#388E3C';
			ctx.lineWidth = 2;
			ctx.stroke();

			this.renderResidentName(ctx, resident, x * tileSize + tileSize / 2, y * tileSize - 5);
		} catch (error) {
			console.error(`Failed to render resident ${resident.name}:`, error);
		}
	}

	private renderResidentName(ctx: CanvasRenderingContext2D, resident: Resident, x: number, y: number): void {
		ctx.font = this.NAME_FONT;
		const textWidth = ctx.measureText(resident.name).width;
		const padding = 4;

		ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
		ctx.fillRect(
			x - textWidth / 2 - padding,
			y - 12,
			textWidth + padding * 2,
			20
		);

		ctx.fillStyle = '#000';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(resident.name, x, y);
	}

	private renderDebugInfo(ctx: CanvasRenderingContext2D, resident: Resident): void {
		const state = resident.getState();
		if (!state || !state.position) return;

		const {x, y} = state.position;
		const tileSize = this.RESIDENT_SIZE;

		ctx.font = this.STATE_FONT;
		ctx.fillStyle = '#000';
		ctx.textAlign = 'center';

		const debugInfo = [
			`Action: ${state.currentAction}`,
			`isHome: ${state.isHome}`,
			`Pos: (${Math.floor(x)},${Math.floor(y)})`
		];

		debugInfo.forEach((text, index) => {
			const yOffset = y * tileSize + tileSize + 12 + (index * 12);

			const textWidth = ctx.measureText(text).width;
			const padding = 2;

			ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
			ctx.fillRect(
				x * tileSize + tileSize / 2 - textWidth / 2 - padding,
				yOffset - 8,
				textWidth + padding * 2,
				12
			);

			ctx.fillStyle = '#000';
			ctx.fillText(text, x * tileSize + tileSize / 2, yOffset);
		});
	}

	private getResidentColor(state: ResidentState): string {
		if (state.isHome) return this.RESIDENT_COLORS.AT_HOME;
		switch (state.currentAction) {
			case 'moving':
				return this.RESIDENT_COLORS.MOVING;
			case 'working':
				return this.RESIDENT_COLORS.WORKING;
			default:
				return this.RESIDENT_COLORS.DEFAULT;
		}
	}

	toggleDebugMode(): void {
		this.debugMode = !this.debugMode;
	}
}