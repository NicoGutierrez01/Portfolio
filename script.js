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