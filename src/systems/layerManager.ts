import {TileMapManager} from './TileMapManager';

export function setupGameLayers(tileMapManager: TileMapManager) {
	// 먼저 기본 타일 타입들을 등록
	registerStoneGroundTile(tileMapManager);
	registerRoadTile(tileMapManager);
	registerRoadBloackingTile(tileMapManager);
	registerSideWalkTile(tileMapManager);
	registerRoomTile(tileMapManager);

	// 레이어 데이터를 생성하고 적용
	const layerData = generateLayerData();
	applyLayerData(tileMapManager, layerData);
}

function registerStoneGroundTile(tileMapManager: TileMapManager) {
	// 3x3 grass ground tiles 등록
	let tileIndex = 0;
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
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

function registerRoadBloackingTile(tileMapManager: TileMapManager) {
	// 도로를 막는 고깔 타일
	tileMapManager.registerTileType({
		id: 'cowl',
		walkable: false,
		sprite: {
			x: 16 * 10,
			y: 16 * 11,
			width: 16,
			height: 16,
		}
	});

	tileMapManager.registerTileType({
		id: 'cowl_red',
		walkable: false,
		sprite: {
			x: 16 * 8,
			y: 16 * 10,
			width: 16,
			height: 16,
		}
	});

	tileMapManager.registerTileType({
		id: 'road_block',
		walkable: false,
		sprite: {
			x: 16 * 6,
			y: 16 * 9,
			width: 16,
			height: 16,
		}
	});
}

function registerSideWalkTile(tileMapManager: TileMapManager) {
	// 우제통
	tileMapManager.registerTileType({
		id: 'mailbox',
		walkable: true,
		sprite: {
			x: 16 * 8,
			y: 16 * 11,
			width: 16,
			height: 16,
		}
	});

	// 가로등
	for (let i = 0; i < 2; i++) {
		tileMapManager.registerTileType({
			id: `lamp_${i}`,
			walkable: true,
			sprite: {
				x: 16 * 3,
				y: 16 * (6 + i),
				width: 16,
				height: 16,
			}
		});
	}

	// 초록색 가로등
	for (let i = 0; i < 2; i++) {
		tileMapManager.registerTileType({
			id: `green_lamp_${i}`,
			walkable: true,
			sprite: {
				x: 16 * 7,
				y: 16 * (6 + i),
				width: 16,
				height: 16,
			}
		});
	}

	// 신호등
	tileMapManager.registerTileType({
		id: `signal_bottom`,
		walkable: true,
		sprite: {
			x: 16 * 2,
			y: 16 * 7,
			width: 16,
			height: 16,
		}
	});
	tileMapManager.registerTileType({
		id: `signal`,
		walkable: true,
		sprite: {
			x: 16 * 4,
			y: 16 * 15,
			width: 16,
			height: 16,
		}
	});
}

function registerRoomTile(tileMapManager: TileMapManager) {
	// 3x3 wall tiles 등록
	let stoneTileIndex = 0;
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			tileMapManager.registerTileType({
				id: `stone_wall_${stoneTileIndex}`,
				walkable: false,
				sprite: {
					x: i * 16,
					y: j * 16 + (16 * 3),
					width: 16,
					height: 16
				}
			});
			stoneTileIndex++;
		}
	}

	tileMapManager.registerTileType({
		id: `stone_wall_${stoneTileIndex}`,
		walkable: true,
		sprite: {
			x: 16,
			y: 16 + (16 * 3),
			width: 16,
			height: 16
		}
	});

	// 3x3 wall tiles 등록
	let tileIndex = 0;
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			tileMapManager.registerTileType({
				id: `wall_${tileIndex}`,
				walkable: false,
				sprite: {
					x: i * 16 + (16 * 8),
					y: j * 16 + (16 * 3),
					width: 16,
					height: 16
				}
			});
			tileIndex++;
		}
	}

	tileMapManager.registerTileType({
		id: `wall_4`,
		walkable: true,
		sprite: {
			x: 1 * 16 + (16 * 8),
			y: 1 * 16 + (16 * 3),
			width: 16,
			height: 16
		}
	});

	// 2x2 Corner wall tiles 등록
	let cornerStoneTileIndex = 0;
	for (let i = 0; i < 2; i++) {
		for (let j = 0; j < 2; j++) {
			tileMapManager.registerTileType({
				id: `corner_stone_wall_${cornerStoneTileIndex}`,
				walkable: false,
				sprite: {
					x: i * 16 + (16 * 5),
					y: j * 16 + (16 * 3),
					width: 16,
					height: 16
				}
			});
			cornerStoneTileIndex++;
		}
	}

	// 2x2 Corner wall tiles 등록
	let cornerWallTileIndex = 0;
	for (let i = 0; i < 2; i++) {
		for (let j = 0; j < 2; j++) {
			tileMapManager.registerTileType({
				id: `corner_wall_${cornerWallTileIndex}`,
				walkable: false,
				sprite: {
					x: i * 16 + (16 * 13),
					y: j * 16 + (16 * 3),
					width: 16,
					height: 16
				}
			});
			cornerWallTileIndex++;
		}
	}

	//문
	tileMapManager.registerTileType({
		id: 'door_right',
		walkable: true,
		sprite: {
			x: 16 * 10,
			y: 16 * 15,
			width: 16,
			height: 16
		}
	});

	// 문 왼쪽
	tileMapManager.registerTileType({
		id: 'door_left',
		walkable: true,
		sprite: {
			x: 16 * 9,
			y: 16 * 15,
			width: 16,
			height: 16
		}
	});
}

function generateLayerData(): string[][][] {
	return [
		[
			['stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'stone_1', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'empty_road', 'vertical_road_0', 'empty_road'],
			['stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'stone_1', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'empty_road', 'vertical_road_0', 'empty_road'],
			['stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'stone_1', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'empty_road', 'vertical_road_0', 'empty_road'],
			['stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_walk_road_0', 'vertical_walk_road_1', 'vertical_walk_road_2', 'stone_1', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'empty_road', 'vertical_road_0', 'empty_road'],
			['stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'stone_1', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'empty_road', 'vertical_road_0', 'empty_road'],
			['stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'stone_1', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'empty_road', 'vertical_road_0', 'empty_road'],
			['stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'stone_1', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'empty_road', 'vertical_road_0', 'empty_road'],
			['stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'stone_1', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'empty_road', 'vertical_road_0', 'empty_road'],
			['stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'stone_1', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_road_0', 'vertical_road_1', 'vertical_road_2', 'bicycle_road', 'vertical_road_0', 'empty_road'],
			['stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_walk_road_0', 'vertical_walk_road_1', 'vertical_walk_road_2', 'stone_1', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_4', 'stone_7', 'vertical_walk_road_0', 'vertical_walk_road_1', 'vertical_walk_road_2', 'empty_road', 'vertical_road_0', 'empty_road'],
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
		],
		// 도로 막는 고깔
		[
			['', '', '', '', '', '', '', 'cowl', 'road_block', 'cowl', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'cowl', 'road_block', 'cowl', 'road_block', 'cowl', 'road_block'],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			['cowl', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'cowl'],
			['cowl_red', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'cowl_red'],
			['cowl', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'cowl'],
			[],
			[],
			[],
			[],
			[],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'cowl', 'road_block', 'cowl', '', '', '', '', '', '', 'cowl_red', 'cowl_red'],
			// 인도 잡다한 거
		],
		// 인도 물건
		[
			[],
			['', '', '', '', '', '', 'signal', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', 'signal_bottom', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
			[], [], [],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'green_lamp_0', ''],
			['', '', '', '', '', '', '', '', '', '', 'signal', '', '', '', '', '', '', '', '', '', '', 'green_lamp_1', '', '', '', '', '', 'signal'],
			['', '', '', '', '', '', '', '', '', '', 'signal_bottom', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'signal_bottom'],
			['lamp_0', '', '', '', '', '', 'lamp_0', '', '', '', 'green_lamp_0', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'green_lamp_0'],
			['lamp_1', '', '', '', '', '', 'lamp_1', '', '', '', 'green_lamp_1', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'green_lamp_1'],
			[], [],
			['lamp_0', '', '', '', '', '', '', '', '', '', '', '', 'signal', '', '', '', '', '', 'signal', '', '', '', '', '', '', '', '', 'green_lamp_0'],
			['lamp_1', '', '', '', '', '', '', '', '', '', '', '', 'signal_bottom', '', 'mailbox', '', '', '', 'signal_bottom', '', '', '', '', '', '', '', '', 'green_lamp_1'],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'signal', '', '', '', '', ''],
			['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'signal_bottom', '', '', '', '', ''],
		],
		// 집
		[
			[],
			['', '', '', '', '', '', '', '', '', '', '', '', 'stone_wall_0', 'stone_wall_3', 'stone_wall_3', 'stone_wall_3', 'stone_wall_3', 'stone_wall_3', 'stone_wall_3', 'stone_wall_3', 'stone_wall_6'],
			['', '', '', '', '', '', '', '', '', '', '', 'stone_wall_0', 'corner_stone_wall_3', 'stone_wall_4', 'stone_wall_4', 'stone_wall_4', 'corner_stone_wall_0', 'stone_wall_5', 'stone_wall_5', 'stone_wall_5', 'stone_wall_8', '', 'wall_0', 'wall_3', 'wall_3', 'wall_6'],
			['', '', '', '', '', '', '', '', '', '', '', 'stone_wall_1', 'stone_wall_4', 'stone_wall_4', 'stone_wall_4', 'stone_wall_4', 'stone_wall_7', '', '', '', '', '', 'wall_1', 'wall_4', 'wall_4', 'corner_wall_1', 'wall_6'],
			['', '', '', '', '', '', '', '', '', '', '', 'stone_wall_1', 'stone_wall_4', 'stone_wall_4', 'stone_wall_4', 'stone_wall_4', 'stone_wall_7', '', 'wall_0', 'wall_3', 'wall_6', '', 'wall_1', 'wall_4', 'wall_4', 'wall_4', 'wall_7'],
			['', '', '', '', '', '', '', '', '', '', '', 'stone_wall_1', 'stone_wall_4', 'stone_wall_4', 'stone_wall_4', 'stone_wall_4', 'stone_wall_7', '', 'wall_1', 'wall_4', 'wall_7', '', 'wall_1', 'wall_4', 'wall_4', 'wall_4', 'wall_7'],
			['', '', '', '', '', '', '', '', '', '', '', 'stone_wall_1', 'stone_wall_4', 'stone_wall_4', 'stone_wall_4', 'stone_wall_4', 'stone_wall_7', '', 'wall_1', 'wall_4', 'wall_7', '', 'wall_1', 'wall_4', 'wall_4', 'wall_4', 'wall_7'],
			['', '', '', '', '', '', '', '', '', '', '', 'stone_wall_1', 'stone_wall_4', 'stone_wall_4', 'stone_wall_4', 'stone_wall_4', 'stone_wall_7', '', 'wall_1', 'wall_4', 'wall_7', '', 'wall_1', 'wall_4', 'wall_4', 'wall_4', 'wall_7'],
			['', '', '', '', '', '', '', '', '', '', '', 'stone_wall_1', 'stone_wall_4', 'stone_wall_4', 'stone_wall_4', 'stone_wall_4', 'stone_wall_7', '', 'wall_1', 'wall_4', 'wall_7', '', 'wall_1', 'wall_4', 'wall_4', 'wall_4', 'wall_7'],
			['', '', '', '', '', '', '', '', '', '', '', 'stone_wall_2', 'stone_wall_5', 'door_left', 'door_right', 'stone_wall_5', 'stone_wall_8', '', 'wall_2', 'door_right', 'wall_8', '', 'wall_2', 'wall_5', 'door_right', 'wall_5', 'wall_8'],
			[], [], [], [], [],
			['', 'wall_0', 'wall_3', 'wall_3', 'wall_3', 'door_right', 'wall_3', 'wall_3', 'wall_6', '', 'wall_0', 'wall_3', 'door_right', 'wall_6', '', 'wall_0', 'door_right', 'wall_6'],
			['', 'wall_1', 'wall_4', 'wall_4', 'wall_4', 'wall_4', 'wall_4', 'wall_4', 'wall_7', '', 'wall_1', 'wall_4', 'wall_4', 'wall_7', '', 'wall_1', 'wall_4', 'wall_7'],
			['', 'wall_1', 'wall_4', 'wall_4', 'wall_4', 'wall_4', 'wall_4', 'wall_4', 'wall_7', '', 'wall_1', 'wall_4', 'wall_4', 'wall_7', '', 'wall_1', 'wall_4', 'wall_7'],
			['', 'wall_1', 'wall_4', 'wall_4', 'wall_4', 'wall_4', 'wall_4', 'wall_4', 'wall_7', '', 'wall_1', 'wall_4', 'wall_4', 'wall_7', '', 'wall_1', 'wall_4', 'wall_7'],
			['', 'wall_1', 'wall_4', 'wall_4', 'wall_4', 'wall_4', 'wall_4', 'wall_4', 'wall_7', '', 'wall_1', 'wall_4', 'wall_4', 'wall_7', '', 'wall_1', 'wall_4', 'wall_7'],
		],
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