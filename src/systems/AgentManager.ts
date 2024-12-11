import {AreaManager} from "./AreaManager";
import {Camera} from "./Camera";
import {Resident} from "./Resident.ts";

interface BehaviorBubble {
	text: string;
}

export class AgentManager {
	private residents: Map<string, Resident> = new Map();
	private behaviorBubbles: Map<string, BehaviorBubble> = new Map();
	private readonly RESIDENT_SIZE = 32;

	constructor(private areaManager: AreaManager) {
	}

	async initialize(): Promise<void> {
		const residentsToInitialize = [
			{id: 'william', name: 'William', houseId: 'house_william', spriteId: Math.floor(Math.random() * 5)},
		];

		for (const info of residentsToInitialize) {
			const homeCenter = this.areaManager.getAreaCenter(info.houseId);
			if (homeCenter) {
				const resident = new Resident(info.id, info.name, homeCenter, this.areaManager, 0);
				this.residents.set(info.id, resident);
				// 초기 상태 설정
				this.updateBehaviorBubble(resident.id, this.formatAction(resident.getState().currentAction));
			}
		}
	}

	update(deltaTime: number): void {
		for (const resident of this.residents.values()) {
			const previousState = resident.getState().currentAction;
			resident.update(deltaTime);
			const currentState = resident.getState().currentAction;

			// 상태가 변경되었을 때만 버블 업데이트
			if (previousState !== currentState) {
				this.updateBehaviorBubble(resident.id, this.formatAction(currentState));
			}
		}
	}

	private formatAction(action: string): string {
		switch (action) {
			case 'move':
				return "🚶 Walking...";
			case 'idle':
				return "🧍 Standing";
			default:
				return `${action}`;
		}
	}

	private updateBehaviorBubble(residentId: string, text: string) {
		this.behaviorBubbles.set(residentId, {text});
	}

	render(ctx: CanvasRenderingContext2D, camera: Camera): void {
		if (!ctx || !camera) return;

		camera.applyTransform(ctx);

		for (const resident of this.residents.values()) {
			// 주민 렌더링
			resident.render(ctx, this.RESIDENT_SIZE);

			// 행동 버블 렌더링
			const bubble = this.behaviorBubbles.get(resident.id);
			if (bubble) {
				this.renderBehaviorBubble(ctx, resident, bubble);
			}
		}

		camera.restoreTransform(ctx);
	}

	private renderBehaviorBubble(ctx: CanvasRenderingContext2D, resident: Resident, bubble: BehaviorBubble): void {
		const position = resident.getPosition();
		const pixelX = Math.floor(position.x * this.RESIDENT_SIZE + 14);
		const pixelY = Math.floor(position.y * this.RESIDENT_SIZE);

		// 버블 배경 그리기
		const padding = 4;
		const bubbleHeight = 24;
		ctx.font = '11px Arial';
		const textWidth = ctx.measureText(bubble.text).width;
		const bubbleWidth = textWidth + (padding * 2);

		// 버블 스타일 설정 - 검은색 배경으로 변경
		ctx.fillStyle = '#fff';  // 약간의 투명도를 추가

		// 둥근 사각형 버블 그리기
		const radius = 6;
		const x = pixelX - (bubbleWidth / 2);
		const y = pixelY - 50;

		ctx.beginPath();
		ctx.moveTo(x + radius, y);
		ctx.lineTo(x + bubbleWidth - radius, y);
		ctx.quadraticCurveTo(x + bubbleWidth, y, x + bubbleWidth, y + radius);
		ctx.lineTo(x + bubbleWidth, y + bubbleHeight - radius);
		ctx.quadraticCurveTo(x + bubbleWidth, y + bubbleHeight, x + bubbleWidth - radius, y + bubbleHeight);
		ctx.lineTo(x + radius, y + bubbleHeight);
		ctx.quadraticCurveTo(x, y + bubbleHeight, x, y + bubbleHeight - radius);
		ctx.lineTo(x, y + radius);
		ctx.quadraticCurveTo(x, y, x + radius, y);
		ctx.closePath();

		// 버블 테두리와 내부 채우기
		ctx.fill();

		// 텍스트 그리기 - 흰색으로 변경
		ctx.fillStyle = 'black';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(bubble.text, pixelX, y + (bubbleHeight / 2));

		// 말풍선 꼬리 그리기 - 검은색으로 변경
		ctx.fillStyle = '#fff';
		ctx.beginPath();
		ctx.moveTo(pixelX - 5, y + bubbleHeight);
		ctx.lineTo(pixelX, y + bubbleHeight + 8);
		ctx.lineTo(pixelX + 5, y + bubbleHeight);
		ctx.closePath();
		ctx.fill();
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
		ctx.stroke();
	}
}