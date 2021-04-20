const logClock = (name, time) => {
    console.log(`${name}: ${time.hours}:${time.minutes}:${time.seconds}`);
}

const asDoubleDigit = num => ((num < 10) ? ("0" + num) : num.toString())

const updateClockDom = (domElement, clock)=>{
    domElement.find("h1.hours").html(asDoubleDigit(clock.hours));
    domElement.find("h1.mins").html(asDoubleDigit(clock.minutes));
    domElement.find("h1.secs").html(asDoubleDigit(clock.seconds));
}

const assignSendController = (worker, domElement)=>{
    domElement.on('click', function(e){
        e.preventDefault()
        worker.postMessage({
            action: 'send'
        });
    })
}

const assignVelocityController = (worker, domElements)=>{
    let velocity = 1.0;
    let delta = 1.0;
    let maximum = 100;
    const delayAnimation = 1500;

    (function () {
        domElements.increase.on('click', function (e) {
            e.preventDefault();
            let notification = $(this).parent().find(".notification");
            let notifMessage;

            if ((velocity + delta) < maximum) {
                velocity += delta;
                console.log("Increasing velocity to " + velocity);
                notifMessage = `<p>Incrementando a ${velocity.toFixed(1)}</p>`;
                worker.postMessage({
                    action: 'setVelocity',
                    velocity: velocity
                });
            }
            
            notification.html(notifMessage).addClass("appear");
            setTimeout(()=>{notification.removeClass("appear")}, delayAnimation);
            
        });
        domElements.decrease.on('click', function (e) {
            e.preventDefault();
            let notification = $(this).parent().find(".notification");
            let notifMessage;

            if ((velocity - delta) > 0) {
                velocity -= delta;
                console.log("Decreasing  to " + velocity);
                notifMessage = `<p>Decrementando a ${velocity.toFixed(1)}</p>`;
                worker.postMessage({
                    action: 'setVelocity',
                    velocity: velocity
                });
            }

            notification.html(notifMessage).addClass("appear");
            setTimeout(()=>{notification.removeClass("appear")}, delayAnimation);
        });

        
    })();
}

var workerM = new Worker('./js/clock.js');
var worker1 = new Worker('./js/clock.js');
var worker2 = new Worker('./js/clock.js');
var worker3 = new Worker('./js/clock.js');

//Reloj Maestro
workerM.onmessage = function (e) {
    let clockM = e.data;
    // logClock('Master Clock', clockM);
    updateClockDom($(".clock#clock-m"), clockM);
}
//Reloj 1
worker1.onmessage = function (e) {
    let clock1 = e.data;
    // logClock('Clock 1', clock1);
    updateClockDom($(".clock#clock-1"), clock1);
}
//Reloj 2
worker2.onmessage = function (e) {
    let clock2 = e.data;
    // logClock('Clock 2', clock2);
    updateClockDom($(".clock#clock-2"), clock2);
}
//Reloj 3
worker3.onmessage = function (e) {
    let clock3 = e.data;
    // logClock('Clock 3', clock3);
    updateClockDom($(".clock#clock-3"), clock3);
}

export default function main() {
    workerM.postMessage({
        name: "Reloj Maestro"
    });
    worker1.postMessage({
        name: "Reloj 1",
        destAddr: {
            port: 5500,
            ip: "localhost"
        }
    });
    worker2.postMessage({
        name: "Reloj 2"
    });
    worker3.postMessage({
        name: "Reloj 3"
    });

    assignVelocityController(workerM, {
        increase: $(".clock#clock-m .increase"),
        decrease: $(".clock#clock-m .decrease")
    });

    assignVelocityController(worker1, {
        increase: $(".clock#clock-1 .increase"),
        decrease: $(".clock#clock-1 .decrease")
    });

    assignVelocityController(worker2, {
        increase: $(".clock#clock-2 .increase"),
        decrease: $(".clock#clock-2 .decrease")
    });

    assignVelocityController(worker3, {
        increase: $(".clock#clock-3 .increase"),
        decrease: $(".clock#clock-3 .decrease")
    });
}