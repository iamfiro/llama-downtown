import { TileMapManager } from './TileMapManager';

export function setupGameLayers(tileMapManager: TileMapManager) {
    // 먼저 기본 타일 타입들을 등록
    registerGrassGroundTile(tileMapManager);
    registerRoadTile(tileMapManager);

    // 레이어 데이터를 생성하고 적용
    const layerData = generateLayerData();
    applyLayerData(tileMapManager, layerData);
}

function registerGrassGroundTile(tileMapManager: TileMapManager) {
    // 3x3 grass ground tiles 등록
    let tileIndex = 0;
    for (let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            tileMapManager.registerTileType({
                id: `stone_${tileIndex}`,
                walkable: true,
                sprite: {
                    x: i * 16 + 128,
                    y: j * 16,
                    width: 16,
                    height: 16
                }
            });
            tileIndex++;
        }
    }
}

function registerRoadTile(tileMapManager: TileMapManager) {
    // 가로 도로 타일
    for (let i = 0; i < 3; i++) {
        tileMapManager.registerTileType({
            id: `horizontal_road_${i}`,
            walkable: false,
            sprite: {
                x: 16,
                y: i * 16 + 240,
                width: 16,
                height: 16,
            }
        })
    }

    // 가로 도로 위의 보행 가능한 도로 타일
    for (let i = 0; i < 3; i++) {
        tileMapManager.registerTileType({
            id: `horizontal_walk_road_${i}`,
            walkable: true,
            sprite: {
                x: 0,
                y: i * 16 + 240,
                width: 16,
                height: 16,
            }
        })
    }

    // 세로 도로 타일
    for (let i = 0; i < 3; i++) {
        tileMapManager.registerTileType({
            id: `vertical_road_${i}`,
            walkable: false,
            sprite: {
                x: 16 * i + 32,
                y: 16 * 17,
                width: 16,
                height: 16,
            }
        })
    }

    // 세로 도로 위의 보행 가능한 도로 타일
    for (let i = 0; i < 3; i++) {
        tileMapManager.registerTileType({
            id: `vertical_walk_road_${i}`,
            walkable: true,
            sprite: {
                x: 16 * i + 32,
                y: 16 * 16,
                width: 16,
                height: 16,
            }
        })
    }

    // 빈 도로 타일
    tileMapManager.registerTileType({
        id: 'empty_road',
        walkable: false,
        sprite: {
            x: 16 * 9,
            y: 16 * 16,
            width: 16,
            height: 16,
        }
    });

    // 자전거 도로 타일
    tileMapManager.registerTileType({
        id: 'bicycle_road',
        walkable: false,
        sprite: {
            x: 16 * 10,
            y: 16 * 17,
            width: 16,
            height: 16,
        }
    });

    // 파킹 도로 타일
    tileMapManager.registerTileType({
        id: 'parking_road',
        walkable: false,
        sprite: {
            x: 16 * 10,
            y: 16 * 16,
            width: 16,
            height: 16,
        }
    });

    // 코너 도로 타일
    let cornerTileIndex = 0;
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            tileMapManager.registerTileType({
                id: `corner_road_${cornerTileIndex}`,
                walkable: false,
                sprite: {
                    x: 16 * j + (16 * 7),
                    y: 16 * i + (16 * 16),
                    width: 16,
                    height: 16,
                }
            });
            cornerTileIndex++;
        }
    }

    // 원형 도로 타일
    for (let i = 0; i < 2; i++) {
        tileMapManager.registerTileType({
            id: `circle_road_${i}`,
            walkable: false,
            sprite: {
                x: 16 * i + (16 * 5),
                y: 16 * 16,
                width: 16,
                height: 16,
            }
        })
    }
}

function generateLayerData(): string[][][] {
    return [
        [
            ['stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'stone_1', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4','stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'empty_road', 'vertical_road_0', 'empty_road'],
            ['stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'stone_1', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4','stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'empty_road', 'vertical_road_0', 'empty_road'],
            ['stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'stone_1', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4','stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'empty_road', 'vertical_road_0', 'empty_road'],
            ['stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_walk_road_0', 'vertical_walk_road_1', 'vertical_walk_road_2', 'stone_1', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4','stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'empty_road', 'vertical_road_0', 'empty_road'],
            ['stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'stone_1', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4','stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'empty_road', 'vertical_road_0', 'empty_road'],
            ['stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'stone_1', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4','stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'empty_road', 'vertical_road_0', 'empty_road'],
            ['stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'stone_1', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4','stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'empty_road', 'vertical_road_0', 'empty_road'],
            ['stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'stone_1', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4','stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'empty_road', 'vertical_road_0', 'empty_road'],
            ['stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'stone_1', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4','stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'bicycle_road', 'vertical_road_0', 'empty_road'],
            ['stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_walk_road_0', 'vertical_walk_road_1', 'vertical_walk_road_2', 'stone_1', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4','stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_walk_road_0', 'vertical_walk_road_1', 'vertical_walk_road_2', 'empty_road', 'vertical_road_0', 'empty_road'],
            ['stone_5', 'stone_5', 'stone_5', 'stone_5', 'stone_5', 'stone_5', 'stone_8', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'stone_2', 'stone_5', 'stone_5', 'stone_5', 'stone_5', 'stone_5', 'stone_5', 'stone_5', 'stone_5', 'stone_5', 'stone_5', 'stone_5', 'stone_5', 'stone_5', 'stone_5', 'stone_5', 'stone_5', 'stone_8', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'empty_road', 'vertical_road_0', 'empty_road'],
            ['horizontal_road_0', 'horizontal_walk_road_0', 'horizontal_road_0', 'horizontal_road_0', 'horizontal_road_0', 'horizontal_road_0', 'horizontal_road_0', 'corner_road_3', 'empty_road', 'corner_road_2', 'horizontal_road_0', 'horizontal_walk_road_0', 'horizontal_road_0', 'horizontal_road_0', 'horizontal_road_0', 'horizontal_road_0', 'horizontal_road_0', 'horizontal_walk_road_0', 'horizontal_road_0', 'horizontal_road_0', 'horizontal_road_0', 'horizontal_road_0', 'horizontal_road_0', 'horizontal_road_0', 'horizontal_road_0', 'horizontal_road_0', 'horizontal_walk_road_0', 'horizontal_road_0', 'corner_road_3', 'empty_road', 'corner_road_2', 'horizontal_road_0', 'horizontal_road_0', 'horizontal_road_0'],
            ['horizontal_road_1', 'horizontal_walk_road_1', 'horizontal_road_1', 'horizontal_road_1', 'horizontal_road_1', 'horizontal_road_1', 'horizontal_road_1', 'horizontal_road_1', 'horizontal_road_1', 'horizontal_road_1', 'horizontal_road_1', 'horizontal_walk_road_1', 'horizontal_road_1', 'horizontal_road_1', 'horizontal_road_1', 'horizontal_road_1', 'horizontal_road_1', 'horizontal_walk_road_1', 'horizontal_road_1', 'horizontal_road_1', 'horizontal_road_1', 'horizontal_road_1', 'horizontal_road_1', 'horizontal_road_1', 'horizontal_road_1', 'horizontal_road_1', 'horizontal_walk_road_1', 'horizontal_road_1', 'horizontal_road_1', 'horizontal_road_1', 'horizontal_road_1', 'horizontal_road_1', 'horizontal_road_1', 'horizontal_road_1'],
            ['horizontal_road_2', 'horizontal_walk_road_2', 'horizontal_road_2', 'horizontal_road_2', 'horizontal_road_2', 'horizontal_road_2', 'horizontal_road_2', 'horizontal_road_2', 'horizontal_road_2', 'horizontal_road_2', 'horizontal_road_2', 'horizontal_walk_road_2', 'horizontal_road_2', 'horizontal_road_2', 'horizontal_road_2', 'horizontal_road_2', 'horizontal_road_2', 'horizontal_walk_road_2', 'horizontal_road_2', 'corner_road_1', 'empty_road', 'corner_road_0', 'horizontal_road_2', 'horizontal_road_2', 'horizontal_road_2', 'horizontal_road_2', 'horizontal_walk_road_2', 'horizontal_road_2', 'empty_road', 'empty_road', 'horizontal_road_2', 'horizontal_road_2', 'horizontal_road_2', 'horizontal_road_2'],
            ['stone_3', 'stone_3', 'stone_3', 'stone_3', 'stone_3', 'stone_3', 'stone_3', 'stone_3', 'stone_3', 'stone_3', 'stone_3', 'stone_3', 'stone_3', 'stone_3', 'stone_3', 'stone_3', 'stone_3', 'stone_3', 'stone_6', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'stone_0', 'stone_3', 'stone_3', 'stone_3', 'stone_3', 'stone_6', 'circle_road_0', 'circle_road_1', 'stone_0', 'stone_3', 'stone_3', 'stone_3'],
            ['stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_walk_road_0', 'vertical_walk_road_1', 'vertical_walk_road_2', 'stone_1', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_2', 'stone_2', 'stone_5', 'stone_4', 'stone_4'],
            ['stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'stone_1', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_2', 'horizontal_road_2', 'parking_road', 'stone_1', 'stone_4'],
            ['stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'stone_1', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_2', 'horizontal_road_2', 'parking_road', 'stone_1', 'stone_4'],
            ['stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'stone_1', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_2', 'horizontal_road_2', 'parking_road', 'stone_1', 'stone_4'],
            ['stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'stone_1', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_2', 'horizontal_road_2', 'parking_road', 'stone_1', 'stone_4'],
        ]
        // 추가 레이어 패턴들을 여기에 추가할 수 있습니다
    ];
}

function applyLayerData(tileMapManager: TileMapManager, layerData: string[][][]) {
    layerData.forEach((layerPattern) => {
        // 각 패턴에 대한 새 레이어 생성
        const layerIndex = tileMapManager.addLayer();

        // 레이어의 각 타일 배치
        layerPattern.forEach((row, y) => {
            row.forEach((tileId, x) => {
                tileMapManager.placeTile(x, y, layerIndex, tileId);
            });
        });
    });
}