export class GameTime {
    private currentDate: Date;
    private gameSpeed: number; // 실제 시간 대비 게임 시간의 속도
    private isPaused: boolean;
    private lastUpdate: number;

    constructor(initialDate: Date = new Date(2024, 0, 1), gameSpeed: number = 1) {
        this.currentDate = initialDate;
        this.gameSpeed = gameSpeed;
        this.isPaused = false;
        this.lastUpdate = Date.now();
    }

    // 게임 시간 업데이트
    update(): void {
        if (this.isPaused) return;

        const now = Date.now();
        const deltaTime = now - this.lastUpdate;
        const gameTimeDelta = deltaTime * this.gameSpeed;

        this.currentDate = new Date(this.currentDate.getTime() + gameTimeDelta);
        this.lastUpdate = now;
    }

    getTime(): string {
        return this.currentDate.toLocaleTimeString();
    }

    // 게임 시간 조작 메서드들
    pause(): void {
        this.isPaused = true;
    }

    resume(): void {
        this.isPaused = false;
        this.lastUpdate = Date.now();
    }

    setGameSpeed(speed: number): void {
        if (speed < 0) throw new Error("Game speed cannot be negative");
        this.gameSpeed = speed;
    }

    getDate(): string {
        return this.currentDate.toLocaleDateString();
    }

    getFullDateTime(): string {
        return this.currentDate.toLocaleString();
    }

    // 게임 내 시간 수동 조정
    addHours(hours: number): void {
        this.currentDate = new Date(this.currentDate.getTime() + hours * 60 * 60 * 1000);
    }

    addDays(days: number): void {
        this.currentDate = new Date(this.currentDate.getTime() + days * 24 * 60 * 60 * 1000);
    }

    setTime(hours: number, minutes: number, seconds: number = 0): void {
        this.currentDate.setHours(hours, minutes, seconds);
    }

    // 게임 내 시간 비교 메서드
    isNight(): boolean {
        const hours = this.currentDate.getHours();
        return hours >= 20 || hours < 6;
    }

    isBetweenHours(startHour: number, endHour: number): boolean {
        const currentHour = this.currentDate.getHours();
        return currentHour >= startHour && currentHour < endHour;
    }
}