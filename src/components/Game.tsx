import React, { useEffect, useRef, useState } from 'react';
import style from './Game.module.scss';
import { TileMapManager } from '../systems/TileMapManager';
import { Camera } from '../systems/Camera';
import { GameTime } from "../systems/time.ts";

const Game: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameInitialized, setGameInitialized] = useState(false);

    const tileMapManagerRef = useRef<TileMapManager | null>(null);
    const gameTimeRef = useRef<GameTime | null>(null);
    const cameraRef = useRef<Camera | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || gameInitialized) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const initializeGame = async () => {
            try {
                // 브라우저 크기
                const GAME_WIDTH = window.innerWidth - 300;
                const GAME_HEIGHT = window.innerHeight;
                canvas.width = GAME_WIDTH;
                canvas.height = GAME_HEIGHT;
                canvas.style.width = `${GAME_WIDTH}px`;
                canvas.style.height = `${GAME_HEIGHT}px`;

                ctx.imageSmoothingEnabled = false;

                // 타일맵 매니저 초기화
                const WORLD_WIDTH = 25;  // 타일 단위
                const WORLD_HEIGHT = 19;
                tileMapManagerRef.current = new TileMapManager(WORLD_WIDTH, WORLD_HEIGHT);

                // 타일셋 이미지 로드
                await tileMapManagerRef.current.loadTileset('/tilemap.png');

                // 게임 타임 초기화
                gameTimeRef.current = new GameTime();

                // 카메라 초기화
                cameraRef.current = new Camera(WORLD_WIDTH, WORLD_HEIGHT, GAME_WIDTH, GAME_HEIGHT);

                // 타일 타입 등록
                // 지형 타일 (녹색 영역)
                for (let i = 0; i < 9; i++) {
                    tileMapManagerRef.current.registerTileType({
                        id: i,
                        walkable: true,
                        sprite: {
                            x: (i % 3) * 32,
                            y: Math.floor(i / 3) * 32,
                            width: 32,
                            height: 32
                        }
                    });
                }

                // 벽 타일 (회색 영역)
                for (let i = 0; i < 15; i++) {
                    tileMapManagerRef.current.registerTileType({
                        id: 100 + i,
                        walkable: false,
                        sprite: {
                            x: (i % 5) * 32,
                            y: 96 + Math.floor(i / 5) * 32,  // 96 = 3 * 32 (녹색 타일 영역 이후)
                            width: 32,
                            height: 32
                        }
                    });
                }

                // 레이어 추가
                const groundLayer = tileMapManagerRef.current.addLayer();  // 지형 레이어
                const wallLayer = tileMapManagerRef.current.addLayer();    // 벽 레이어

                // 바닥 타일 배치 (랜덤하게 녹색 타일 배치)
                for (let y = 0; y < WORLD_HEIGHT; y++) {
                    for (let x = 0; x < WORLD_WIDTH; x++) {
                        const randomGroundTile = Math.floor(Math.random() * 9);  // 0-8 사이의 랜덤 타일
                        tileMapManagerRef.current.placeTile(x, y, groundLayer, randomGroundTile);
                    }
                }

                // 벽 타일 배치 (맵 가장자리에 벽 배치)
                for (let x = 0; x < WORLD_WIDTH; x++) {
                    // 상단 벽
                    tileMapManagerRef.current.placeTile(x, 0, wallLayer, 100);
                    // 하단 벽
                    tileMapManagerRef.current.placeTile(x, WORLD_HEIGHT - 1, wallLayer, 100);
                }
                for (let y = 0; y < WORLD_HEIGHT; y++) {
                    // 좌측 벽
                    tileMapManagerRef.current.placeTile(0, y, wallLayer, 100);
                    // 우측 벽
                    tileMapManagerRef.current.placeTile(WORLD_WIDTH - 1, y, wallLayer, 100);
                }

                // 랜덤하게 몇 개의 벽 배치
                for (let i = 0; i < 20; i++) {
                    const x = Math.floor(Math.random() * (WORLD_WIDTH - 2)) + 1;
                    const y = Math.floor(Math.random() * (WORLD_HEIGHT - 2)) + 1;
                    const randomWallTile = 100 + Math.floor(Math.random() * 15);
                    tileMapManagerRef.current.placeTile(x, y, wallLayer, randomWallTile);
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

                // Clear canvas
                ctx.fillStyle = '#333';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                if (cameraRef.current && tileMapManagerRef.current) {
                    // 타일맵 렌더링
                    tileMapManagerRef.current.render(ctx, cameraRef.current);
                }

                requestAnimationFrame(gameLoop);
            };

            requestAnimationFrame(gameLoop);
        };

        initializeGame();
    }, [gameInitialized]);

    // Event handlers...
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
        cameraRef.current.setZoom(e.deltaY / 100, e.clientX - rect.left, e.clientY - rect.top);
    };

    return (
        <canvas
            ref={canvasRef}
            className={style.container}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
        />
    );
};

export default Game;