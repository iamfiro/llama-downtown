// App.tsx
import { useEffect, useRef, useState } from "react";
import { GameTime } from "./engine/time";

function App() {
	const [currentTime, setCurrentTime] = useState<string>("");
	const [currentDate, setCurrentDate] = useState<string>("");
	const gameTimeRef = useRef<GameTime>(new GameTime(new Date(2024, 0, 1), 90));

	useEffect(() => {
		// 게임 시간 업데이트를 위한 애니메이션 프레임
		let animationFrameId: number;

		const updateTime = () => {
			const gameTime = gameTimeRef.current;
			gameTime.update();

			setCurrentTime(gameTime.getTime());
			setCurrentDate(gameTime.getDate());

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
		<div className="p-4">
			<div className="mb-4">
				<h2 className="text-xl font-bold mb-2">게임 시간 시스템</h2>
				<div className="text-lg">현재 시간: {currentTime}</div>
				<div className="text-lg">현재 날짜: {currentDate}</div>
			</div>
		</div>
	);
}

export default App;