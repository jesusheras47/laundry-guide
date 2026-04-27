// ── LAUNDRY CARE SYMBOL GUIDE ────────────────
// main.js
// Handles: card expand/collapse, search/filter,
//          nav active state, year update
// ─────────────────────────────────────────────

"use strict";

// ── 1. FILL CARD DESCRIPTIONS ────────────────
// Reads data-desc from each card and puts the
// text into the empty .card-desc paragraph
// ─────────────────────────────────────────────
const cards = document.querySelectorAll(".icon-card");

cards.forEach(function (card) {
  const desc = card.getAttribute("data-desc");
  const descParagraph = card.querySelector(".card-desc");

  if (desc && descParagraph) {
    descParagraph.textContent = desc;
  }
});

// ── 2. TAP TO EXPAND / COLLAPSE ──────────────
// Clicking a card expands it showing description
// Clicking the same card collapses it
// Clicking a different card collapses the previous
// ─────────────────────────────────────────────
let lastExpandedCard = null;

cards.forEach(function (card) {
  card.addEventListener("click", function () {
    const isExpanded = card.classList.contains("expanded");

    if (lastExpandedCard && lastExpandedCard !== card) {
      lastExpandedCard.classList.remove("expanded");
    }

    if (isExpanded) {
      card.classList.remove("expanded");
      lastExpandedCard = null;
    } else {
      card.classList.add("expanded");
      lastExpandedCard = card;
    }
  });

  card.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      card.click();
    }
  });
});

// ── 3. SEARCH AND FILTER ─────────────────────
// As user types in search input:
// - hides cards that do not match
// - updates the visible count
// - hides sections that have no visible cards
// - collapses any expanded card
// - shows a no results message if nothing matches
// ─────────────────────────────────────────────
const searchInput = document.getElementById("searchInput");
const searchCount = document.getElementById("searchCount");
const sections = document.querySelectorAll(".section");
const TOTAL_CARDS = cards.length;

searchInput.addEventListener("input", function () {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  cards.forEach(function (card) {
    const name = card.getAttribute("data-name") || "";
    const desc = card.getAttribute("data-desc") || "";
    const searchableText = name.toLowerCase() + " " + desc.toLowerCase();
    const isMatch = query === "" || searchableText.includes(query);

    if (isMatch) {
      card.classList.remove("search-hidden");
      visibleCount++;
    } else {
      card.classList.add("search-hidden");
      card.classList.remove("expanded");
    }
  });

  sections.forEach(function (section) {
    const visibleCards = section.querySelectorAll(
      ".icon-card:not(.search-hidden)",
    );
    if (visibleCards.length === 0) {
      section.classList.add("section-hidden");
    } else {
      section.classList.remove("section-hidden");
    }
  });

  if (query === "") {
    searchCount.textContent = TOTAL_CARDS + " icons";
  } else {
    searchCount.textContent =
      visibleCount + " result" + (visibleCount !== 1 ? "s" : "");
  }
});

// ── 4. ACTIVE NAV TAB ON SCROLL ──────────────
// Highlights the correct nav tab as user scrolls
// Clicking a tab scrolls smoothly to that section
// ─────────────────────────────────────────────
const navTabs = document.querySelectorAll(".nav-tab");

const observerOptions = {
  root: null,
  rootMargin: "-25% 0px -65% 0px",
  threshold: 0,
};

const sectionObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      const sectionId = entry.target.id;

      navTabs.forEach(function (tab) {
        tab.classList.remove("active");
      });

      const activeTab = document.querySelector(
        '.nav-tab[href="#' + sectionId + '"]',
      );
      if (activeTab) {
        activeTab.classList.add("active");
      }
    }
  });
}, observerOptions);

sections.forEach(function (section) {
  sectionObserver.observe(section);
});

navTabs.forEach(function (tab) {
  tab.addEventListener("click", function (event) {
    event.preventDefault();

    const targetId = tab.getAttribute("href").replace("#", "");
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// ── 5. COPYRIGHT YEAR AUTO UPDATE ────────────
// Automatically updates the copyright year
// in the footer so it never goes out of date
// ─────────────────────────────────────────────

const currentYearSpan = document.getElementById("currentYear");

if (currentYearSpan) {
  currentYearSpan.textContent = new Date().getFullYear();
}
