

$(document).ready(function(){
    console.log("Script")

    let clock1 = new Clock(24, 59, 10);
    console.log(clock1);
    for (let i = 0; i < 60; i++) {
        clock1.update();
    }
    console.log(clock1);
})