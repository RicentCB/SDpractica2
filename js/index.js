const logClock = (name, time) => {
    console.log(`${name}: ${time.hours}:${time.minutes}:${time.seconds}`);
}

const asDoubleDigit = num => ((num < 10) ? ("0" + num) : num.toString())

const updateClockDom = (domElement, clock)=>{
    domElement.find("h1.hours").html(asDoubleDigit(clock.hours));
    domElement.find("h1.mins").html(asDoubleDigit(clock.minutes));
    domElement.find("h1.secs").html(asDoubleDigit(clock.seconds));
}

const assignEditController = (worker, domElement)=>{
    domElement.on('click', e=>{
        e.preventDefault();
        let currHours = Number(domElement.parent().find("h1.hours").html());
        let currMins = Number(domElement.parent().find("h1.mins").html());
        let currSecs = Number(domElement.parent().find("h1.secs").html());
        console.log(currHours);
        console.log(currMins);
        console.log(currSecs);
        //Detener Reloj
        worker.postMessage({
            action: 'stop'
        })
        $("#modal-edit-clock").addClass("show");
        //Editar reloj
        worker.postMessage({
            action: 'setTimeNoStart',
            time: {
                hours: 12,
                mins: 30,
                secs: 30,
            }
        })

    })
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

    (() => {
        domElements.increase.on('click',  e=>{
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
        domElements.decrease.on('click', e=>{
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
workerM.onmessage = e => {
    let clockM = e.data;
    // logClock('Master Clock', clockM);
    updateClockDom($(".clock#clock-m"), clockM);
}
//Reloj 1
worker1.onmessage = e => {
    let clock1 = e.data;
    // logClock('Clock 1', clock1);
    updateClockDom($(".clock#clock-1"), clock1);
}
//Reloj 2
worker2.onmessage = e => {
    let clock2 = e.data;
    // logClock('Clock 2', clock2);
    updateClockDom($(".clock#clock-2"), clock2);
}
//Reloj 3
worker3.onmessage = e => {
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
            port: 41231,
            ip: "localhost"
        }
    });
    worker2.postMessage({
        name: "Reloj 2"
    });
    worker3.postMessage({
        name: "Reloj 3"
    });

    assignEditController(workerM, $(".clock#clock-m .edit-clock"))
    assignVelocityController(workerM, {
        increase: $(".clock#clock-m .increase"),
        decrease: $(".clock#clock-m .decrease")
    });

    assignSendController(worker1, $(".clock#clock-1 .send-clock"));
    assignVelocityController(worker1, {
        increase: $(".clock#clock-1 .increase"),
        decrease: $(".clock#clock-1 .decrease")
    });

    assignSendController(worker2, $(".clock#clock-2 .send-clock"));
    assignVelocityController(worker2, {
        increase: $(".clock#clock-2 .increase"),
        decrease: $(".clock#clock-2 .decrease")
    });

    assignSendController(worker3, $(".clock#clock-3 .send-clock"));
    assignVelocityController(worker3, {
        increase: $(".clock#clock-3 .increase"),
        decrease: $(".clock#clock-3 .decrease")
    });
}