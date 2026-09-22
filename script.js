// =========================================================
// OUT-VOID DEVELOPMENT DURATION
// =========================================================

const outvoidStartDate = new Date(2026, 4, 17);
const today = new Date();

const durationElements = document.querySelectorAll(
    "#outvoid-duration, #outvoid-duration-page"
);

function getProjectDuration(startDate, currentDate) {
    let months =
        (currentDate.getFullYear() - startDate.getFullYear()) * 12 +
        (currentDate.getMonth() - startDate.getMonth());

    if (currentDate.getDate() < startDate.getDate()) {
        months--;
    }

    if (months < 1) {
        const milliseconds = currentDate - startDate;
        const days = Math.floor(
            milliseconds / (1000 * 60 * 60 * 24)
        );

        return `${days} DAYS`;
    }

    return `${months}+ MONTHS`;
}

durationElements.forEach((element) => {
    element.textContent =
        getProjectDuration(outvoidStartDate, today);
});


// =========================================================
// MOTION PREFERENCES
// =========================================================

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


// =========================================================
// PAGE LOAD INTRO
// =========================================================

const heroElements = document.querySelectorAll(
    [
        ".hero__top",
        ".hero__intro",
        ".hero__title span",
        ".hero__description",
        ".hero__scroll",
        ".project-hero__top",
        ".project-hero__status",
        ".project-hero__heading h1",
        ".project-hero__heading p",
        ".project-hero__info"
    ].join(", ")
);

heroElements.forEach((element, index) => {
    element.classList.add("hero-enter");

    element.style.setProperty(
        "--hero-delay",
        `${Math.min(index * 70, 420)}ms`
    );
});

requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
});


// =========================================================
// REVEAL ON SCROLL
// =========================================================

const revealElements = document.querySelectorAll(
    [
        ".projects__header",
        ".timeline__year",
        ".project__content",
        ".about__header",
        ".about__intro",
        ".about__details",
        ".contact__top",
        ".contact__links",
        ".project-media",
        ".project-section__label",
        ".project-section__content",
        ".project-gallery__header",
        ".project-gallery__item",
        ".project-play > *",
        ".project-next > *"
    ].join(", ")
);

revealElements.forEach((element, index) => {
    element.classList.add("reveal");

    element.style.setProperty(
        "--reveal-delay",
        `${(index % 4) * 65}ms`
    );
});

if (prefersReducedMotion) {
    revealElements.forEach((element) => {
        element.classList.add("is-visible");
    });
} else {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -8% 0px"
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
}


// =========================================================
// HEADER + PAGE SCROLL PROGRESS
// =========================================================

const header = document.querySelector(".header");

const scrollProgress = document.createElement("div");

scrollProgress.className = "scroll-progress";
scrollProgress.setAttribute("aria-hidden", "true");

document.body.prepend(scrollProgress);

let ticking = false;

function updateScrollEffects() {
    const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop;

    const scrollHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

    const progress =
        scrollHeight > 0
            ? Math.min(scrollTop / scrollHeight, 1)
            : 0;

    scrollProgress.style.transform =
        `scaleX(${progress})`;

    if (header) {
        header.classList.toggle(
            "header--scrolled",
            scrollTop > 30
        );
    }

    updateTimelineProgress();
    updateActiveNavigation();

    ticking = false;
}

function requestScrollUpdate() {
    if (ticking) return;

    ticking = true;

    requestAnimationFrame(updateScrollEffects);
}

window.addEventListener(
    "scroll",
    requestScrollUpdate,
    { passive: true }
);

window.addEventListener(
    "resize",
    requestScrollUpdate
);


// =========================================================
// TIMELINE PROGRESS
// =========================================================

const timelineProjects =
    document.querySelectorAll(".timeline .project");

function updateTimelineProgress() {
    if (!timelineProjects.length) return;

    const triggerPoint =
        window.innerHeight * 0.62;

    timelineProjects.forEach((project) => {
        const rect =
            project.getBoundingClientRect();

        const projectProgress =
            (triggerPoint - rect.top) /
            Math.max(rect.height, 1);

        const clampedProgress =
            Math.min(
                Math.max(projectProgress, 0),
                1
            );

        project.style.setProperty(
            "--line-progress",
            `${clampedProgress * 100}%`
        );

        project.classList.toggle(
            "is-timeline-active",
            clampedProgress > 0.03
        );

        project.classList.toggle(
            "is-timeline-complete",
            clampedProgress >= 0.98
        );
    });
}


// =========================================================
// ACTIVE NAVIGATION
// =========================================================

const navigationSections = [
    "projects",
    "about",
    "contact"
]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

const navigationLinks =
    document.querySelectorAll(".header__nav a");

function updateActiveNavigation() {
    if (!navigationSections.length) return;

    const marker =
        window.innerHeight * 0.42;

    let currentSection = null;

    navigationSections.forEach((section) => {
        const rect =
            section.getBoundingClientRect();

        if (
            rect.top <= marker &&
            rect.bottom > marker
        ) {
            currentSection = section.id;
        }
    });

    navigationLinks.forEach((link) => {
        const href =
            link.getAttribute("href") || "";

        const isActive =
            currentSection &&
            href.endsWith(`#${currentSection}`);

        link.classList.toggle(
            "is-active",
            Boolean(isActive)
        );
    });
}


// =========================================================
// INITIAL STATE
// =========================================================

updateScrollEffects();