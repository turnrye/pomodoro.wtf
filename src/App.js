/**
 * This code is junk, and you're best not to believe any of it is even working.
 * @flow
 */
import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import "./App.css";

const taskTime = 25 * 60;
const breakTime = 5 * 60;
const startTaskAction = "start_task";
const startBreakAction = "start_break";
let intervalId: IntervalID | null;

function App() {
  const [onTask, setOnTask] = useState(true);
  const [timerGoing, setTimerGoing] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(taskTime);

  // Listen for the service worker to tell us when the user interacted with one of the notification actions
  if ("serviceWorker" in window.navigator) {
    window.navigator.serviceWorker.addEventListener("message", event => {
      startTimer(!onTask);
    });
  }

  // Handle the basic setup and teardown at app time
  useEffect(() => {
    Notification.requestPermission();
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Send a notification
  const sendNotification = prevOnTask => {
    let config = {
      vibrate: [300, 50, 300],
      requireInteraction: true,
      renotify: true,
      tag: "pomodoro",
      title: "",
      lang: "en-US"
    };
    if (!prevOnTask) {
      config = {
        ...config,
        title: "Ready for next pomodoro",
        body: "Break's over, back to work!",
        actions: [{ action: startTaskAction, title: "Start Task" }]
      };
    } else {
      config = {
        ...config,
        title: "Pomodoro done",
        body: "Phew! Time for a break.",
        actions: [{ action: startBreakAction, title: "Start Break" }]
      };
    }
    if ("serviceWorker" in window.navigator) {
      window.navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(config.title, config);
      });
    }
  };

  // Reset the timer UI
  const reset = newOnTask => {
    clearInterval(intervalId);
    setTimerGoing(false);
    setSecondsLeft(newOnTask ? taskTime : breakTime);
  };

  // Start the timer UI
  const startTimer = newOnTask => {
    setTimerGoing(true);

    let endTime = new Date();
    endTime.setSeconds(endTime.getSeconds() + secondsLeft);
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      const delta = endTime - Date.now();
      if (delta <= 0) {
        setOnTask(newOnTask);
        reset(newOnTask);
        sendNotification(!newOnTask);
      } else {
        const diff = Math.floor(delta / 1000);
        if (diff !== secondsLeft) {
          setSecondsLeft(diff);
        }
      }
    }, 100);
  };
  return (
    <Grid
      container
      direction="column"
      justify="space-between"
      alignItems="center"
      className="outerGrid"
    >
      <Grid container direction="column" justify="center" alignItems="center">
        <h1 className="title">Pomodoro</h1>
        <h1>
          {Math.floor(secondsLeft / 60)
            .toString()
            .padStart(2, "0")}
          :{(secondsLeft % 60).toString().padStart(2, "0")}
        </h1>
        <Button
          onClick={() => startTimer(!onTask)}
          disabled={timerGoing}
          color="primary"
          variant="contained"
        >
          {onTask ? "Start Task" : "Start Break"}
        </Button>
        <Button onClick={() => reset(onTask)}>Reset</Button>
      </Grid>
      <Button href="https://twitter.com/turnrye">@turnrye</Button>
    </Grid>
  );
}

export default App;
