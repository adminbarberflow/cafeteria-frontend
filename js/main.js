"use strict";

const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".main-navigation");
const navigationLinks = navigation?.querySelectorAll("a");
const currentYearElement = document.querySelector("#current-year");

function toggleNavigation() {
    if (!menuButton || !navigation) {
        return;
    }

    const isOpen = navigation.classList.toggle("is-open");

    menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

    menuButton.setAttribute(
        "aria-label",
        isOpen
            ? "Fechar menu de navegação"
            : "Abrir menu de navegação"
    );
}

function closeNavigation() {
    if (!menuButton || !navigation) {
        return;
    }

    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute(
        "aria-label",
        "Abrir menu de navegação"
    );
}

function updateCurrentYear() {
    if (!currentYearElement) {
        return;
    }

    currentYearElement.textContent =
        String(new Date().getFullYear());
}

menuButton?.addEventListener(
    "click",
    toggleNavigation
);

navigationLinks?.forEach((link) => {
    link.addEventListener(
        "click",
        closeNavigation
    );
});

document.addEventListener(
    "keydown",
    (event) => {
        if (event.key === "Escape") {
            closeNavigation();
        }
    }
);

updateCurrentYear();
