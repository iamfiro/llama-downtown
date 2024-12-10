import {Camera} from "./Camera.ts";

export type Area = {
    id: string;
    name: string;
    color: string;
    tiles: Array<{ x: number, y: number }>;
    center?: { x: number, y: number };
    bounds: {
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
    };
}

export class AreaManager {
    private areas: Map<string, Area>;
    private tileSize: number;
    private debugMode: boolean;

    constructor(tileSize: number = 32) {
        this.areas = new Map();
        this.tileSize = tileSize;
        this.debugMode = true;
    }

    hasArea(areaId: string): boolean {
        if (!areaId) return false;
        return this.areas.has(areaId);
    }

    addArea(id: string, name: string, tiles: Array<{ x: number, y: number }>, color: string = this.getRandomColor()) {
        const bounds = {
            minX: Math.min(...tiles.map(t => t.x)),
            minY: Math.min(...tiles.map(t => t.y)),
            maxX: Math.max(...tiles.map(t => t.x)),
            maxY: Math.max(...tiles.map(t => t.y))
        };

        const center = {
            x: Math.floor((bounds.minX + bounds.maxX) / 2),
            y: Math.floor((bounds.minY + bounds.maxY) / 2)
        };

        const area: Area = {
            id,
            name,
            color,
            tiles,
            center,
            bounds
        };

        this.areas.set(id, area);
    }

    render(ctx: CanvasRenderingContext2D, camera: Camera) {
        if (!this.debugMode) return;

        camera.applyTransform(ctx);

        this.areas.forEach(area => {
            ctx.globalAlpha = 0.3;
            area.tiles.forEach(tile => {
                ctx.fillStyle = area.color;
                ctx.fillRect(
                    tile.x * this.tileSize,
                    tile.y * this.tileSize,
                    this.tileSize,
                    this.tileSize
                );
            });

            ctx.globalAlpha = 0.8;
            ctx.strokeStyle = area.color;
            ctx.lineWidth = 2;
            ctx.strokeRect(
                area.bounds.minX * this.tileSize,
                area.bounds.minY * this.tileSize,
                (area.bounds.maxX - area.bounds.minX + 1) * this.tileSize,
                (area.bounds.maxY - area.bounds.minY + 1) * this.tileSize
            );

            ctx.globalAlpha = 1;
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            const textX = (area.center?.x || 0) * this.tileSize + (this.tileSize / 2);
            const textY = (area.center?.y || 0) * this.tileSize + (this.tileSize / 2);

            const padding = 2;
            const textWidth = ctx.measureText(area.name).width;
            ctx.fillStyle = 'white';
            ctx.fillRect(
                textX - (textWidth / 2) - padding,
                textY - 10 - padding,
                textWidth + (padding * 2),
                20 + (padding * 2)
            );

            ctx.fillStyle = area.color;
            ctx.fillText(area.name, textX, textY + 5);
        });

        camera.restoreTransform(ctx);
    }

    getAreaAtPosition(x: number, y: number): Area | null {
        for (const area of this.areas.values()) {
            if (area.tiles.some(tile => tile.x === x && tile.y === y)) {
                return area;
            }
        }
        return null;
    }

    getAreaCenter(areaId: string): { x: number, y: number } | null {
        const area = this.areas.get(areaId);
        return area?.center || null;
    }

    toggleDebugMode() {
        this.debugMode = !this.debugMode;
    }

    private getRandomColor(): string {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1',
            '#D4A5A5', '#9B59B6', '#3498DB',
            '#F39C12', '#F9BF3B', '#F9690E',
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}
