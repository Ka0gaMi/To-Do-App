import launchPage from "./page";
import { changeTab } from "./tabs";

launchPage();

const inboxBtn = document.getElementById("inbox");

inboxBtn.addEventListener("click", () => {
  changeTab("inbox-main", "Inbox", false);
});

const todayBtn = document.getElementById("today");

todayBtn.addEventListener("click", () => {
  changeTab("today-main", "Today");
});

const upcomingBtn = document.getElementById("upcoming");

upcomingBtn.addEventListener("click", () => {
  changeTab("upcoming-main", "Upcoming");
});
