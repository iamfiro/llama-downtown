import { useEffect, useRef } from "react";
import { GameTime } from "./engine/time";
import './global.scss';
import style from './app.module.scss';
import Game from "./components/Game.tsx";

function App() {
	const gameTimeRef = useRef<GameTime>(new GameTime(new Date(2024, 0, 1), 90));

	useEffect(() => {
		// 게임 시간 업데이트를 위한 애니메이션 프레임
		let animationFrameId: number;

		const updateTime = () => {
			const gameTime = gameTimeRef.current;
			gameTime.update();

			animationFrameId = requestAnimationFrame(updateTime);
		};

		// 초기 업데이트 시작
		animationFrameId = requestAnimationFrame(updateTime);

		// 클린업 함수
		return () => {
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
			}
		};
	}, []);

	return (
		<div className={style.container}>
			<Game />
		</div>
	);
}

export default App;