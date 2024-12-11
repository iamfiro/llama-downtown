import React, {useEffect, useRef, useState} from 'react';
import {TileMapManager} from '../systems/TileMapManager';
import {Camera} from '../systems/Camera';
import {GameTime} from "../systems/time";
import {WORLD_HEIGHT, WORLD_WIDTH} from "../constants/game.ts";
import {setupGameLayers} from "../systems/layerManager.ts";
import {AreaManager} from "../systems/AreaManager.ts";
import {AgentManager} from "../systems/AgentManager.ts";

const DeterministicGame = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [gameInitialized, setGameInitialized] = useState(false);

	const tileMapManagerRef = useRef<TileMapManager | null>(null);
	const areaManagerRef = useRef<AreaManager | null>(null);
	const gameTimeRef = useRef<GameTime | null>(null);
	const agentManagerRef = useRef<AgentManager | null>(null);
	const cameraRef = useRef<Camera | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || gameInitialized) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const initializeGame = async () => {
			try {
				const GAME_WIDTH = window.innerWidth - 300;
				const GAME_HEIGHT = window.innerHeight;
				canvas.width = GAME_WIDTH;
				canvas.height = GAME_HEIGHT;

				ctx.imageSmoothingEnabled = false;

				tileMapManagerRef.current = TileMapManager.getInstance(WORLD_WIDTH, WORLD_HEIGHT);

				await tileMapManagerRef.current.loadTileset('/tilemap_packed.png');

				// 게임 시간 초기화
				gameTimeRef.current = new GameTime();
				cameraRef.current = new Camera(WORLD_WIDTH, WORLD_HEIGHT, GAME_WIDTH, GAME_HEIGHT);

				if (tileMapManagerRef.current) {
					setupGameLayers(tileMapManagerRef.current);
				}

				areaManagerRef.current = new AreaManager();

				// 영역 정의
				areaManagerRef.current.addArea('plazza', '광장', [
					{x: 11, y: 2}, {x: 12, y: 2}, {x: 13, y: 2}, {x: 14, y: 2}, {x: 15, y: 2}, {x: 16, y: 2},
					{x: 11, y: 3}, {x: 12, y: 3}, {x: 13, y: 3}, {x: 14, y: 3}, {x: 15, y: 3}, {x: 16, y: 3},
					{x: 11, y: 4}, {x: 12, y: 4}, {x: 13, y: 4}, {x: 14, y: 4}, {x: 15, y: 4}, {x: 16, y: 4},
					{x: 11, y: 5}, {x: 12, y: 5}, {x: 13, y: 5}, {x: 14, y: 5}, {x: 15, y: 5}, {x: 16, y: 5},
					{x: 11, y: 6}, {x: 12, y: 6}, {x: 13, y: 6}, {x: 14, y: 6}, {x: 15, y: 6}, {x: 16, y: 6},
					{x: 11, y: 7}, {x: 12, y: 7}, {x: 13, y: 7}, {x: 14, y: 7}, {x: 15, y: 7}, {x: 16, y: 7},
					{x: 11, y: 8}, {x: 12, y: 8}, {x: 13, y: 8}, {x: 14, y: 8}, {x: 15, y: 8}, {x: 16, y: 8},
					{x: 11, y: 9}, {x: 12, y: 9}, {x: 13, y: 9}, {x: 14, y: 9}, {x: 15, y: 9}, {x: 16, y: 9},
				]);

				areaManagerRef.current.addArea('house_william', 'William 집', [
					{x: 15, y: 15}, {x: 16, y: 15}, {x: 17, y: 15},
					{x: 15, y: 16}, {x: 16, y: 16}, {x: 17, y: 16},
					{x: 15, y: 17}, {x: 16, y: 17}, {x: 17, y: 17},
					{x: 15, y: 18}, {x: 16, y: 18}, {x: 17, y: 18},
					{x: 15, y: 19}, {x: 16, y: 19}, {x: 17, y: 19},
				]);

				areaManagerRef.current.addArea('house_olivia', 'Olivia 집', [
					{x: 10, y: 15}, {x: 11, y: 15}, {x: 12, y: 15}, {x: 13, y: 15},
					{x: 10, y: 16}, {x: 11, y: 16}, {x: 12, y: 16}, {x: 13, y: 16},
					{x: 10, y: 17}, {x: 11, y: 17}, {x: 12, y: 17}, {x: 13, y: 17},
					{x: 10, y: 18}, {x: 11, y: 18}, {x: 12, y: 18}, {x: 13, y: 18},
					{x: 10, y: 19}, {x: 11, y: 19}, {x: 12, y: 19}, {x: 13, y: 19},
				]);

				areaManagerRef.current.addArea('house_liam', 'Liam 집', [
					{x: 1, y: 15}, {x: 2, y: 15}, {x: 3, y: 15}, {x: 4, y: 15}, {x: 5, y: 15}, {x: 6, y: 15}, {x: 7, y: 15}, {x: 8, y: 15},
					{x: 1, y: 16}, {x: 2, y: 16}, {x: 3, y: 16}, {x: 4, y: 16}, {x: 5, y: 16}, {x: 6, y: 16}, {x: 7, y: 16}, {x: 8, y: 16},
					{x: 1, y: 17}, {x: 2, y: 17}, {x: 3, y: 17}, {x: 4, y: 17}, {x: 5, y: 17}, {x: 6, y: 17}, {x: 7, y: 17}, {x: 8, y: 17},
					{x: 1, y: 18}, {x: 2, y: 18}, {x: 3, y: 18}, {x: 4, y: 18}, {x: 5, y: 18}, {x: 6, y: 18}, {x: 7, y: 18}, {x: 8, y: 18},
					{x: 1, y: 19}, {x: 2, y: 19}, {x: 3, y: 19}, {x: 4, y: 19}, {x: 5, y: 19}, {x: 6, y: 19}, {x: 7, y: 19}, {x: 8, y: 19},
				]);

				areaManagerRef.current.addArea('house_james', 'James 집', [
					{x: 18, y: 4}, {x: 19, y: 4}, {x: 20, y: 4},
					{x: 18, y: 5}, {x: 19, y: 5}, {x: 20, y: 5},
					{x: 18, y: 6}, {x: 19, y: 6}, {x: 20, y: 6},
					{x: 18, y: 7}, {x: 19, y: 7}, {x: 20, y: 7},
					{x: 18, y: 8}, {x: 19, y: 8}, {x: 20, y: 8},
					{x: 18, y: 9}, {x: 19, y: 9}, {x: 20, y: 9},
				]);

				areaManagerRef.current.addArea('house_isabella', 'Isabella 집', [
					{x: 22, y: 3}, {x: 23, y: 3}, {x: 24, y: 3}, {x: 25, y: 3}, {x: 26, y: 3},
					{x: 22, y: 4}, {x: 23, y: 4}, {x: 24, y: 4}, {x: 25, y: 4}, {x: 26, y: 4},
					{x: 22, y: 5}, {x: 23, y: 5}, {x: 24, y: 5}, {x: 25, y: 5}, {x: 26, y: 5},
					{x: 22, y: 6}, {x: 23, y: 6}, {x: 24, y: 6}, {x: 25, y: 6}, {x: 26, y: 6},
					{x: 22, y: 7}, {x: 23, y: 7}, {x: 24, y: 7}, {x: 25, y: 7}, {x: 26, y: 7},
					{x: 22, y: 8}, {x: 23, y: 8}, {x: 24, y: 8}, {x: 25, y: 8}, {x: 26, y: 8},
					{x: 22, y: 9}, {x: 23, y: 9}, {x: 24, y: 9}, {x: 25, y: 9}, {x: 26, y: 9},
				]);

				// 횡단 보도
				areaManagerRef.current.addArea('crosswalk_1', 'Crosswalk', [
					{x: 1, y: 11},
					{x: 1, y: 12},
					{x: 1, y: 13},
				]);

				areaManagerRef.current.addArea('crosswalk', 'Crosswalk', [
					{x: 11, y: 11},
					{x: 11, y: 12},
					{x: 11, y: 13},
				]);

				areaManagerRef.current.addArea('crosswalk_3', 'Crosswalk', [
					{x: 17, y: 11},
					{x: 17, y: 12},
					{x: 17, y: 13},
				]);

				areaManagerRef.current.addArea('crosswalk_4', 'Crosswalk', [
					{x: 26, y: 11},
					{x: 26, y: 12},
					{x: 26, y: 13},
				]);

				areaManagerRef.current.addArea('crosswalk_5', 'Crosswalk', [
					{x: 19, y: 15},
					{x: 20, y: 15},
					{x: 21, y: 15},
				]);

				areaManagerRef.current.addArea('crosswalk_6', 'Crosswalk', [
					{x: 28, y: 9},
					{x: 29, y: 9},
					{x: 30, y: 9},
				]);

				areaManagerRef.current.addArea('crosswalk_7', 'Crosswalk', [
					{x: 7, y: 9},
					{x: 8, y: 9},
					{x: 9, y: 9},
				]);

				areaManagerRef.current.addArea('crosswalk_8', 'Crosswalk', [
					{x: 7, y: 3},
					{x: 8, y: 3},
					{x: 9, y: 3},
				]);

				if (areaManagerRef.current) {
                    agentManagerRef.current = new AgentManager(areaManagerRef.current);
					await agentManagerRef.current.initialize();
                }

				setGameInitialized(true);
				startGameLoop();
			} catch (error) {
				console.error('Game initialization failed:', error);
			}
		};

		const startGameLoop = () => {
			let lastFrameTime = 0;
			const targetFPS = 60;
			const frameInterval = 1000 / targetFPS;

			const gameLoop = (timestamp: number) => {
				if (!canvas || !ctx) return;

				const deltaTime = timestamp - lastFrameTime;
				if (deltaTime < frameInterval) {
					requestAnimationFrame(gameLoop);
					return;
				}
				lastFrameTime = timestamp;

				ctx.fillStyle = '#333';
				ctx.fillRect(0, 0, canvas.width, canvas.height);

				if (cameraRef.current && tileMapManagerRef.current) {
					tileMapManagerRef.current.render(ctx, cameraRef.current);

					areaManagerRef.current?.render(ctx, cameraRef.current);
					agentManagerRef.current?.render(ctx, cameraRef.current);

					agentManagerRef.current?.update(deltaTime)
				}

				requestAnimationFrame(gameLoop);
			};

			requestAnimationFrame(gameLoop);
		};

		initializeGame();
	}, [gameInitialized]);

	const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
		if (!cameraRef.current) return;
		const canvas = canvasRef.current;
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		cameraRef.current.startDrag(e.clientX - rect.left, e.clientY - rect.top);
	};

	const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
		if (!cameraRef.current) return;
		const canvas = canvasRef.current;
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		cameraRef.current.drag(e.clientX - rect.left, e.clientY - rect.top);
	};

	const handleMouseUp = () => {
		if (!cameraRef.current) return;
		cameraRef.current.stopDrag();
	};

	const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
		e.preventDefault();
		if (!cameraRef.current) return;
		const canvas = canvasRef.current;
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		cameraRef.current.setZoom(e.deltaY / 104, e.clientX - rect.left, e.clientY - rect.top);
	};

	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.code === 'Space') {
				areaManagerRef.current?.toggleDebugMode();
			}
		};

		window.addEventListener('keypress', handleKeyPress);
		return () => window.removeEventListener('keypress', handleKeyPress);
	}, []);

	return (
		<canvas
			ref={canvasRef}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseUp}
			onWheel={handleWheel}
		/>
	);
};

export default DeterministicGame;