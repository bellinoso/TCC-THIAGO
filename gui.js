const startStopButton = document.getElementById("startStopButton");
let isRoutineRunning = false;

startStopButton.addEventListener("click", function () {
    if (isRoutineRunning) {
        stopRoutine();
        startStopButton.textContent = "Start";
        startStopButton.style.backgroundColor = "green";
    } else {
        startRoutine();
        startStopButton.textContent = "Stop";
        startStopButton.style.backgroundColor = "red";
    }
    isRoutineRunning = !isRoutineRunning;
});