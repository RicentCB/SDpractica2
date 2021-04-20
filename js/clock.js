class Clock {
    constructor(hours = getRandom(24), mins = getRandom(60), secs = getRandom(60)) {
        hours %= 24;
        mins %= 60;
        secs %= 60;
        this._seconds = hours * 60 * 60 + mins * 60 + secs;
    }
    get time() {
        let hours = Math.floor(this._seconds / (60 * 60));
        let minutes = Math.floor((this._seconds - hours * 60 * 60) / 60);
        let seconds = this._seconds - minutes * 60 - hours * 60 * 60;
        return {
            hours: hours,
            minutes: minutes,
            seconds: seconds
        };
    }
    setTime(hours, mins, secs) {
        hours %= 24;
        mins %= 60;
        secs %= 60;
        this._seconds = hours * 60 * 60 + mins * 60 + secs;
    }
    advance(){
        this._seconds = (this._seconds + 1) % (24 * 60 * 60);
    }
}

const getRandom = maxNum => (Math.floor(Math.random() * maxNum));

var internal_clock = new Clock();

function mainLoop() {
    const velocity = 0.7;
    return setInterval(function () {
        internal_clock.advance();
        postMessage(internal_clock.time);
    }, Math.round(1000 * velocity));
}

var mlHandler = mainLoop();

onmessage = function execState(e) {
    if (e.data[0] === 'getTime') {
        postMessage(internal_clock.time);
    } else if (e.data[0] === 'setTime') {
        clearInterval(mlHandler);
        mlHandler = mainLoop();
    }
}