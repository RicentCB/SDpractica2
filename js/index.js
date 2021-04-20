const logClock = (name, time)=>{
    console.log(`${name}: ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`);
}

const asDoubleDigit = num=> {
    if (num < 10)
        return "0" + num;
    else
        return num.toString();
}

var workerM = new Worker('./js/clock.js');
var worker1 = new Worker('./js/clock.js');
var worker2 = new Worker('./js/clock.js');
var worker3 = new Worker('./js/clock.js');

workerM.onmessage = function (e) {
    let clockM = e.data;
    logClock('Master Clock', clockM);
    //Reloj Maestro
    let domClockM = $(".clock#clock-m");
    domClockM.find("h1.hours").html(asDoubleDigit(clockM.getHours()));
    domClockM.find("h1.mins").html(asDoubleDigit(clockM.getMinutes()));
    domClockM.find("h1.secs").html(asDoubleDigit(clockM.getSeconds()));
}
worker1.onmessage = function (e) {
    let clock1 = e.data;
    logClock('Clock 1', clock1);
    //Reloj 1
    let domClock1 = $(".clock#clock-1");
    domClock1.find("h1.hours").html(asDoubleDigit(clock1.getHours()));
    domClock1.find("h1.mins").html(asDoubleDigit(clock1.getMinutes()));
    domClock1.find("h1.secs").html(asDoubleDigit(clock1.getSeconds()));
}
worker2.onmessage = function (e) {
    let clock2 = e.data;
    logClock('Clock 2', clock2);
    //Reloj 2
    let domClock2 = $(".clock#clock-2");
    domClock2.find("h1.hours").html(asDoubleDigit(clock2.getHours()));
    domClock2.find("h1.mins").html(asDoubleDigit(clock2.getMinutes()));
    domClock2.find("h1.secs").html(asDoubleDigit(clock2.getSeconds()));
}
worker3.onmessage = function (e) {
    let clock3 = e.data;
    logClock('Clock 3', clock3);
    //Reloj 3
    let domClock3 = $(".clock#clock-3");
    domClock3.find("h1.hours").html(asDoubleDigit(clock3.getHours()));
    domClock3.find("h1.mins").html(asDoubleDigit(clock3.getMinutes()));
    domClock3.find("h1.secs").html(asDoubleDigit(clock3.getSeconds()));
}

export default function main() {
    setInterval(function () {
        workerM.postMessage(["getTime"]);
        worker2.postMessage(["getTime"]);
        worker1.postMessage(["getTime"]);
        worker3.postMessage(["getTime"]);
    }, 1000);
}
