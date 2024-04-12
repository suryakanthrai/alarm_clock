const currTime = document.getElementById("current-time");
const hourDropDownELement = document.getElementById("hourDropDown");
const minuteDropDownElement = document.getElementById("minuteDropDown");
const secondsDropDownElement = document.getElementById("secondsDropDown");
const setAlarmButtonElement = document.getElementById("setAlarm");
const AmorPmDropDownElement = document.getElementById("AmorPmDropDown");
const alarmContainerElement = document.getElementById("alarm-container");

// Adding hour, minute, second in DropDown Menu
window.addEventListener("DOMContentLoaded", (event) => {
  dropDownMenuItems(1, 12, hourDropDownELement);

  dropDownMenuItems(0, 59, minuteDropDownElement);

  dropDownMenuItems(0, 59, secondsDropDownElement);

  setInterval(getcurrentTime, 1000);

  fetchAlarm();
});

//Click Even Listener for setalarm button to get the given values
setAlarmButtonElement.addEventListener("click", getInputValues);

//Function to fetch current time
function getcurrentTime() {
  let time = new Date();
  time = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  currTime.innerHTML = time;

  return time;
}

//function for rendering the values in the option tag for hours,minutes and seconds
function dropDownMenuItems(startIndex, endIndex, element) {
  for (let i = startIndex; i <= endIndex; i++) {
    const optionElement = document.createElement("option");
    // optionElement.value = i < 10 ? "0" + i : i;
    optionElement.innerHTML = i < 10 ? "0" + i : i;
    element.appendChild(optionElement);
  }
}

//function to get the given input values
function getInputValues(event) {
  event.preventDefault();
  const hourValue = hourDropDownELement.value;
  const minutesValue = minuteDropDownElement.value;
  const secondsValue = secondsDropDownElement.value;
  const AmorPmValue = AmorPmDropDownElement.value;

  const alarmTime = convertToTime(
    hourValue,
    minutesValue,
    secondsValue,
    AmorPmValue
  );
  setAlarm(alarmTime);
}

//fetches time from the array
function fetchAlarm() {
  const alarms = checkAlarams();

  alarms.forEach((time) => {
    setAlarm(time, true);
  });
}

//check if the time is present in local storage or not
function checkAlarams() {
  let alarms = [];
  const isPresent = localStorage.getItem("alarms");
  if (isPresent) alarms = JSON.parse(isPresent);

  return alarms;
}

//saves the alarm to the array and sets it to the localstorage
function saveAlarm(time) {
  const alarms = checkAlarams();

  alarms.push(time);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

function convertToTime(hour, minute, second, amPm) {
  return `${parseInt(hour)}:${minute}:${second} ${amPm}`;
}

//sets the alarm for the rendering into the html and makes a call to render element to dom
function setAlarm(time, fetching = false) {
  const alarm = setInterval(() => {
    if (time === getcurrentTime()) {
      alert("Alarm Ringing");
    }
    console.log("running");
  }, 500);

  addAlaramToDom(time, alarm);
  if (!fetching) {
    saveAlarm(time);
  }
}

//Below function renders the selected alarm time to the document object model
function addAlaramToDom(time, intervalId) {
  const alarm = document.createElement("div");
  alarm.classList.add("alarm", "mb", "d-flex");
  alarm.innerHTML = `
              <div class="time">${time}</div>
              <button class="delete-alarm" data-id=${intervalId}>Delete</button>
              `;
  const deleteButton = alarm.querySelector(".delete-alarm");
  deleteButton.addEventListener("click", (e) =>
    deleteAlarm(e, time, intervalId)
  );
  //renders the alarm div container element as a child to the alarmContainerElement
  alarmContainerElement.appendChild(alarm);
}

//Deletes the alarm when the delete button is clicked and remove the element from the DOM
function deleteAlarm(event, time, intervalId) {
  const self = event.target;

  clearInterval(intervalId);

  const alarm = self.parentElement;
  console.log(time);

  deleteAlarmFromLocal(time);
  alarm.remove();
}

//Deletes the time from the local storage
function deleteAlarmFromLocal(time) {
  const alarms = checkAlarams();

  const index = alarms.indexOf(time);
  alarms.splice(index, 1);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}
