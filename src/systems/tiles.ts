// 스프라이트 시트의 특정 영역을 정의하는 인터페이스
export interface SpriteRegion {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    name?: string;
}

// 스프라이트 카테고리 (이미지에서 보이는 구역들)
export enum SpriteCategory {
    TERRAIN = 'terrain',    // 지형 (초록색 타일)
    WALLS = 'walls',        // 벽 (회색 타일)
    FURNITURE = 'furniture',// 가구류
    OBJECTS = 'objects',    // 일반 오브젝트
    CHARACTERS = 'characters' // 캐릭터 스프라이트
}

// 스프라이트 시트의 공간을 관리하는 클래스
export class SpriteSheet {
    private regions: Map<number, SpriteRegion>;
    private categories: Map<SpriteCategory, SpriteRegion[]>;
    private image: HTMLImageElement | null;

    constructor() {
        this.regions = new Map();
        this.categories = new Map();
        this.image = null;

        // 모든 카테고리 초기화
        Object.values(SpriteCategory).forEach(category => {
            this.categories.set(category, []);
        });
    }

    // 스프라이트 시트 이미지 로드
    async loadImage(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.image = img;
                resolve();
            };
            img.onerror = reject;
            img.src = url;
        });
    }

    // 스프라이트 영역 등록
    registerRegion(category: SpriteCategory, region: SpriteRegion): void {
        this.regions.set(region.id, region);
        const categoryRegions = this.categories.get(category) || [];
        categoryRegions.push(region);
        this.categories.set(category, categoryRegions);
    }

    // 제공된 이미지의 영역을 기반으로 스프라이트 영역 자동 등록
    registerTerrainSprites(): void {
        // 지형 타일 (상단 녹색 영역)
        const terrainStartX = 0;
        const terrainStartY = 0;
        const tileSize = 32; // 기본 타일 크기

        // 3x3 녹색 타일 영역
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                this.registerRegion(SpriteCategory.TERRAIN, {
                    id: y * 3 + x,
                    x: terrainStartX + (x * tileSize),
                    y: terrainStartY + (y * tileSize),
                    width: tileSize,
                    height: tileSize,
                    name: `terrain_${y * 3 + x}`
                });
            }
        }

        // 벽 타일 등록 (회색 영역)
        const wallStartY = tileSize * 3;
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 5; x++) {
                this.registerRegion(SpriteCategory.WALLS, {
                    id: 100 + (y * 5 + x), // 100번대 ID 사용
                    x: x * tileSize,
                    y: wallStartY + (y * tileSize),
                    width: tileSize,
                    height: tileSize,
                    name: `wall_${y * 5 + x}`
                });
            }
        }

        // 가구 및 오브젝트 영역 (중앙 영역)
        const furnitureStartY = tileSize * 6;
        const furnitureStartX = 0;
        // 가구 스프라이트 등록 (4x4 영역 예시)
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                this.registerRegion(SpriteCategory.FURNITURE, {
                    id: 200 + (y * 4 + x), // 200번대 ID 사용
                    x: furnitureStartX + (x * tileSize),
                    y: furnitureStartY + (y * tileSize),
                    width: tileSize,
                    height: tileSize,
                    name: `furniture_${y * 4 + x}`
                });
            }
        }

        // 캐릭터 스프라이트 영역 (우측 캐릭터 영역)
        const charStartX = tileSize * 12; // 가정된 시작 위치
        const charStartY = 0;
        // 캐릭터 방향별 스프라이트 (4방향, 각 3프레임)
        const directions = ['down', 'left', 'right', 'up'];
        directions.forEach((dir, dirIndex) => {
            for (let frame = 0; frame < 3; frame++) {
                this.registerRegion(SpriteCategory.CHARACTERS, {
                    id: 300 + (dirIndex * 3 + frame), // 300번대 ID 사용
                    x: charStartX + (frame * tileSize),
                    y: charStartY + (dirIndex * tileSize),
                    width: tileSize,
                    height: tileSize,
                    name: `character_${dir}_${frame}`
                });
            }
        });
    }

    // 특정 ID의 스프라이트 영역 가져오기
    getRegion(id: number): SpriteRegion | undefined {
        return this.regions.get(id);
    }

    // 특정 카테고리의 모든 스프라이트 영역 가져오기
    getCategoryRegions(category: SpriteCategory): SpriteRegion[] {
        return this.categories.get(category) || [];
    }

    // 스프라이트 렌더링
    drawSprite(ctx: CanvasRenderingContext2D, id: number, x: number, y: number, width?: number, height?: number): void {
        if (!this.image) return;

        const region = this.getRegion(id);
        if (!region) return;

        ctx.drawImage(
            this.image,
            region.x, region.y, region.width, region.height,
            x, y, width || region.width, height || region.height
        );
    }

    // 애니메이션 프레임 시퀀스 생성
    createAnimationSequence(baseId: number, frameCount: number): number[] {
        const sequence: number[] = [];
        for (let i = 0; i < frameCount; i++) {
            sequence.push(baseId + i);
        }
        return sequence;
    }
}

// 스프라이트 애니메이션 관리 클래스
export class SpriteAnimator {
    private sequences: Map<string, number[]>;
    private currentFrame: number;
    private frameInterval: number;
    private lastFrameTime: number;

    constructor() {
        this.sequences = new Map();
        this.currentFrame = 0;
        this.frameInterval = 200; // 기본 프레임 간격 (ms)
        this.lastFrameTime = 0;
    }

    // 애니메이션 시퀀스 등록
    registerSequence(name: string, frames: number[]): void {
        this.sequences.set(name, frames);
    }

    // 프레임 간격 설정
    setFrameInterval(interval: number): void {
        this.frameInterval = interval;
    }

    // 현재 프레임 가져오기
    getCurrentFrame(sequenceName: string): number {
        const sequence = this.sequences.get(sequenceName);
        if (!sequence) return -1;

        const currentTime = Date.now();
        if (currentTime - this.lastFrameTime >= this.frameInterval) {
            this.currentFrame = (this.currentFrame + 1) % sequence.length;
            this.lastFrameTime = currentTime;
        }

        return sequence[this.currentFrame];
    }
}

// 사용 예시
export class SpriteManager {
    private spriteSheet: SpriteSheet;
    private animator: SpriteAnimator;

    constructor() {
        this.spriteSheet = new SpriteSheet();
        this.animator = new SpriteAnimator();
    }

    async initialize(spriteSheetUrl: string): Promise<void> {
        await this.spriteSheet.loadImage(spriteSheetUrl);
        this.spriteSheet.registerTerrainSprites();

        // 캐릭터 애니메이션 시퀀스 등록
        const walkDownSequence = this.spriteSheet.createAnimationSequence(300, 3);
        this.animator.registerSequence('walk_down', walkDownSequence);
    }

    // 특정 위치에 스프라이트 그리기
    drawSprite(ctx: CanvasRenderingContext2D, id: number, x: number, y: number): void {
        this.spriteSheet.drawSprite(ctx, id, x, y);
    }

    // 애니메이션 스프라이트 그리기
    drawAnimatedSprite(ctx: CanvasRenderingContext2D, sequenceName: string, x: number, y: number): void {
        const frameId = this.animator.getCurrentFrame(sequenceName);
        if (frameId !== -1) {
            this.spriteSheet.drawSprite(ctx, frameId, x, y);
        }
    }
}