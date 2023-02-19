import { changeTab } from "./tabs";
import { addProjectBtnFunctionality, getProjectData } from "./project-form";

// Launch page function //

function launchPage() {
  document.title = "To-Do App";

  navFunctionality();
  addProjectDropDownContent();
  addProjectBtnFunctionality();
  getProjectData();
  changeTab("inbox-main", "Inbox", false);
}

// Add project dropDownContent //

function addProjectDropDownContent() {
  const slideDown = document.querySelector(".slide-down");
  const dropdownContent = document.querySelector(".dropdown-content");

  slideDown.addEventListener("click", () => {
    if (!dropdownContent.classList.contains("show")) {
      slideDown.classList.add("show");
      dropdownContent.classList.add("show");
    } else {
      slideDown.classList.remove("show");
      dropdownContent.classList.remove("show");
    }
  });
}

// Add nav functionality //

function navFunctionality() {
  const menu = document.querySelector(".menu");
  const main = document.querySelector(".main");

  const openNav = () => {
    if (!menu.classList.contains("open")) {
      menu.classList.add("open");
      main.classList.add("open");
    } else {
      closeNav();
    }
  };

  const closeNav = () => {
    menu.classList.remove("open");
    main.classList.remove("open");
  };

  const menuBtn = document.getElementById("menu-btn");

  menuBtn.addEventListener("click", openNav);
}

export default launchPage;
