// src/systems/Camera.ts
export class Camera {
    private x: number = 0;
    private y: number = 0;
    private zoom: number = 1;
    private minZoom: number = 0.1;
    private maxZoom: number = 2;
    private isDragging: boolean = false;
    private lastX: number = 0;
    private lastY: number = 0;
    private worldWidth: number;
    private worldHeight: number;
    private viewportWidth: number;
    private viewportHeight: number;

    constructor(worldWidth: number, worldHeight: number, viewportWidth: number, viewportHeight: number) {
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;

        // 초기 위치를 중앙으로 설정
        this.x = (worldWidth * 32 - viewportWidth) / 2;
        this.y = (worldHeight * 32 - viewportHeight) / 2;

        this.clampPosition();
    }

    // 카메라 위치 제한
    private clampPosition(): void {
        // 현재 줌 레벨에서의 월드 크기
        const worldScreenWidth = this.worldWidth * 32 * this.zoom;
        const worldScreenHeight = this.worldHeight * 32 * this.zoom;

        // 뷰포트가 월드보다 큰 경우 중앙 정렬
        if (worldScreenWidth < this.viewportWidth) {
            this.x = (worldScreenWidth - this.viewportWidth) / 2;
        } else {
            // 기존처럼 x 위치 제한
            const maxX = worldScreenWidth - this.viewportWidth;
            this.x = Math.max(0, Math.min(this.x, maxX));
        }

        if (worldScreenHeight < this.viewportHeight) {
            this.y = (worldScreenHeight - this.viewportHeight) / 2;
        } else {
            // 기존처럼 y 위치 제한
            const maxY = worldScreenHeight - this.viewportHeight;
            this.y = Math.max(0, Math.min(this.y, maxY));
        }
    }

    // 줌 레벨 설정
    setZoom(delta: number, mouseX: number, mouseY: number): void {
        const oldZoom = this.zoom;

        // 새로운 줌 레벨 계산
        this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom - delta * 0.1));

        // 마우스 위치를 기준으로 줌
        const zoomPoint = {
            x: mouseX + this.x,
            y: mouseY + this.y
        };

        this.x = zoomPoint.x - (zoomPoint.x - this.x) * (this.zoom / oldZoom);
        this.y = zoomPoint.y - (zoomPoint.y - this.y) * (this.zoom / oldZoom);

        this.clampPosition();
    }

    // 드래그 시작
    startDrag(x: number, y: number): void {
        this.isDragging = true;
        this.lastX = x;
        this.lastY = y;
    }

    // 드래그 중
    drag(x: number, y: number): void {
        if (!this.isDragging) return;

        const dx = (x - this.lastX) * (1 / this.zoom);
        const dy = (y - this.lastY) * (1 / this.zoom);

        this.x -= dx;
        this.y -= dy;

        this.lastX = x;
        this.lastY = y;

        this.clampPosition();
    }

    // 드래그 종료
    stopDrag(): void {
        this.isDragging = false;
    }

    // 변환 매트릭스 적용
    applyTransform(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.scale(this.zoom, this.zoom);
        ctx.translate(-this.x, -this.y);
    }

    // 변환 매트릭스 복원
    restoreTransform(ctx: CanvasRenderingContext2D): void {
        ctx.restore();
    }

    // 화면 좌표를 월드 좌표로 변환
    screenToWorld(screenX: number, screenY: number): { x: number, y: number } {
        return {
            x: (screenX + this.x) / this.zoom,
            y: (screenY + this.y) / this.zoom
        };
    }

    // 현재 카메라 상태 반환
    getState() {
        return {
            x: this.x,
            y: this.y,
            zoom: this.zoom
        };
    }
}