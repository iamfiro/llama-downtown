import React, { useEffect, useRef, useState } from 'react';
import { TileMapManager } from '../systems/TileMapManager';
import { Camera } from '../systems/Camera';
import { GameTime } from "../systems/time";
import {WORLD_HEIGHT, WORLD_WIDTH} from "../constants/game.ts";
import {setupGameLayers} from "../systems/layerManager.ts";

const DeterministicGame = () => {
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
                const GAME_WIDTH = window.innerWidth - 300;
                const GAME_HEIGHT = window.innerHeight;
                canvas.width = GAME_WIDTH;
                canvas.height = GAME_HEIGHT;

                ctx.imageSmoothingEnabled = false;

                tileMapManagerRef.current = new TileMapManager(WORLD_WIDTH, WORLD_HEIGHT);

                await tileMapManagerRef.current.loadTileset('/tilemap_packed.png');

                // 게임 시간 초기화
                gameTimeRef.current = new GameTime();
                cameraRef.current = new Camera(WORLD_WIDTH, WORLD_HEIGHT, GAME_WIDTH, GAME_HEIGHT);

                if (tileMapManagerRef.current) {
                    setupGameLayers(tileMapManagerRef.current);
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