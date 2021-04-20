class Clock {
    constructor(hours = getRandom(24), mins = getRandom(60), secs = getRandom(60)) {
        let now = new Date();
        let offset = new Date(now.getTime())
        now.setHours(hours);
        now.setMinutes(mins);
        now.setSeconds(secs);
        this._now = now.getTime();
        this._offset = offset.getTime();
    }
    get currentTime() {
        let now = Date.now();
        let delta = now - this._offset;
        this._offset = now;

        this._now = this._now + delta;

        return new Date(this._now);
    }
    setTime(h, m, s) {
        let newTime = this.currentTime;
        newTime.setHours(h);
        newTime.setMinutes(m);
        newTime.setSeconds(s);
        this._now = newTime.getTime();
    }
}

const getRandom = maxNum => (Math.floor(Math.random() * maxNum));

var internal_clock = new Clock();
var last_value = internal_clock.currentTime;

function mainLoop() {
    return setInterval(function () {
        last_value = internal_clock.currentTime;
    }, 1);
}

var mlHandler = mainLoop();

onmessage = function execState(e) {
    if (e.data[0] === 'getTime') {
        postMessage(last_value);
    } else if (e.data[0] === 'setTime') {
        clearInterval(mlHandler);
        mlHandler = mainLoop();
    }
}