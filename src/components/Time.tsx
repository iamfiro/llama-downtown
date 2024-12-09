import {GameTime} from "../systems/time.ts";
import {useEffect, useState} from "react";
import style from './Time.module.scss';

interface SpriteRegion {
    gameTimeRef: React.MutableRefObject<GameTime>;
}

const Time = ({gameTimeRef}: SpriteRegion) => {
    const [currentTime, setCurrentTime] = useState(gameTimeRef.current.getTime());

    useEffect(() => {
        // Update time every second (1000ms)
        const intervalId = setInterval(() => {
            gameTimeRef.current.update();
            setCurrentTime(gameTimeRef.current.getTime());
        }, 100);

        return () => clearInterval(intervalId);
    }, [gameTimeRef]);

    return (
        <article className={style.container}>
            <span>현재 시간</span>
            <h2>{currentTime}</h2>
        </article>
    )
}

export default Time;