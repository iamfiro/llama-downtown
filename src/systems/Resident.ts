import { AreaManager } from "./AreaManager";

export interface Position {
    x: number;
    y: number;
}

export interface ResidentState {
    position: Position;
    currentAction: string;
    isHome: boolean;
    targetPosition?: Position;
    movementSpeed?: number;
    currentPath?: Position[];
    workProgress?: number;
}

type MovementResult = {
    newPosition: Position;
    reachedTarget: boolean;
};

export class Resident {
    private state: ResidentState;
    private readonly DEFAULT_MOVEMENT_SPEED = 2.0; // 타일/초

    public readonly id: string;
    public readonly name: string;

    constructor(
        id: string,
        name: string,
        position: Position,
        private areaManager: AreaManager
    ) {
        this.id = id;
        this.name = name;
        this.state = {
            position: { ...position },
            currentAction: 'idle',
            isHome: false,
            movementSpeed: this.DEFAULT_MOVEMENT_SPEED,
            workProgress: 0
        };
    }

    update(deltaTime: number): void {
        if (!deltaTime || deltaTime < 0) return;

        // 초를 기준으로 한 델타타임 계산 (밀리초 -> 초)
        const deltaSeconds = deltaTime / 1000;

        try {
            // 현재 행동에 따른 업데이트
            switch (this.state.currentAction) {
                case 'moving':
                    this.updateMovement(deltaSeconds);
                    break;
                case 'working':
                    this.updateWork(deltaSeconds);
                    break;
                case 'idle':
                    // 대기 상태에서는 특별한 업데이트 없음
                    break;
                default:
                    console.warn(`Unknown action: ${this.state.currentAction}`);
            }

            // 현재 위치의 영역 확인 및 상태 업데이트
            this.updateAreaStatus();
        } catch (error) {
            console.error(`Error updating resident ${this.name}:`, error);
        }
    }

    private updateAreaStatus(): void {
        // 현재 위치의 영역 확인
        const currentArea = this.areaManager.getAreaAtPosition(
            Math.floor(this.state.position.x),
            Math.floor(this.state.position.y)
        );

        // 집 안에 있는지 확인
        this.state.isHome = currentArea?.id === `house_${this.id}`;
    }

    private updateMovement(deltaSeconds: number): void {
        if (!this.state.targetPosition) {
            this.state.currentAction = 'idle';
            return;
        }

        const movementResult = this.moveTowardsTarget(
            this.state.position,
            this.state.targetPosition,
            this.state.movementSpeed || this.DEFAULT_MOVEMENT_SPEED,
            deltaSeconds
        );

        this.state.position = movementResult.newPosition;

        if (movementResult.reachedTarget) {
            this.state.targetPosition = undefined;
            this.state.currentAction = 'idle';
        }
    }

    private moveTowardsTarget(
        current: Position,
        target: Position,
        speed: number,
        deltaSeconds: number
    ): MovementResult {
        const dx = target.x - current.x;
        const dy = target.y - current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 0.01) {
            return {
                newPosition: { ...target },
                reachedTarget: true
            };
        }

        const maxDistanceThisFrame = speed * deltaSeconds;
        const movement = Math.min(maxDistanceThisFrame, distance);
        const ratio = movement / distance;

        return {
            newPosition: {
                x: current.x + dx * ratio,
                y: current.y + dy * ratio
            },
            reachedTarget: false
        };
    }

    private updateWork(deltaSeconds: number): void {
        if (typeof this.state.workProgress !== 'number') {
            this.state.workProgress = 0;
        }

        this.state.workProgress += deltaSeconds;

        // 예: 작업이 10초 후에 완료되도록 설정
        if (this.state.workProgress >= 10) {
            this.state.workProgress = 0;
            this.state.currentAction = 'idle';
        }
    }

    async executeCommand(command: string): Promise<void> {
        try {
            switch (command) {
                case 'move_home':
                    await this.moveToHome();
                    break;
                case 'start_work':
                    await this.startWork();
                    break;
                case 'idle':
                    this.state.currentAction = 'idle';
                    break;
                default:
                    console.warn(`Unknown command: ${command}`);
                    this.state.currentAction = 'idle';
            }
        } catch (error) {
            console.error(`Error executing command ${command}:`, error);
            this.state.currentAction = 'idle';
        }
    }

    private async moveToHome(): Promise<void> {
        const homeCenter = this.areaManager.getAreaCenter(`house_${this.id}`);
        if (!homeCenter) {
            throw new Error('Home center not found');
        }

        this.state.targetPosition = homeCenter;
        this.state.currentAction = 'moving';
    }

    private async startWork(): Promise<void> {
        this.state.currentAction = 'working';
        this.state.workProgress = 0;
    }

    getState(): ResidentState {
        return { ...this.state };
    }

    setMovementSpeed(speed: number): void {
        if (speed > 0) {
            this.state.movementSpeed = speed;
        }
    }

    setPosition(position: Position): void {
        if (position && typeof position.x === 'number' && typeof position.y === 'number') {
            this.state.position = { ...position };
        }
    }

    getPosition(): Position {
        return { ...this.state.position };
    }
}