/**
 * Returns a string for a number rounded to 2 decimals and a percentage symbol.
 *
 * @param {Number} n    A number with/without decimals, and without commas.
 * @returns {String}
 */
function fmtPercent(n) {
  return (n * 100).toFixed(2) + "%";
}

/**
 * Returns a string with a dollar sign and a number rounded to 2 decimals.
 *
 * @param {*} n         A number with/without decimals, and without commas.
 * @returns {String}
 */
function fmtDollar(n) {
  return "$" + n.toFixed(2);
}

/**
 * Inserts a <p> tag containing txt as the child of parent.
 *
 * @param {HTMLElement} parent
 * @param {String} txt
 */
function appendParagraphText(parent, txt) {
  let child = document.createElement("p");
  child.innerText = txt;
  parent.append(child);
}

/**
 * Handles the calculation for the percentage rate required to achieve target.
 *
 * @returns
 */
function calculate() {
  let details = document.getElementById("yearly-details");
  details.innerHTML = "<summary>See process...</summary>";

  let startingSalary = +document
    .getElementById("starting-salary")
    .value.replace(",", "");
  let startingyear = +document
    .getElementById("starting-year")
    .value.replace(",", "");
  let targetSalary = +document
    .getElementById("target-salary")
    .value.replace(",", "");
  let targetYear = +document
    .getElementById("target-year")
    .value.replace(",", "");

  let salaryDiff = targetSalary - startingSalary;
  let yearDiff = targetYear - startingyear;
  let startingPercentage = salaryDiff / yearDiff / startingSalary;

  if (
    targetSalary <= 0 ||
    targetYear <= 0 ||
    startingSalary <= 0 ||
    startingyear <= 0
  ) {
    alert("All values must be greater than 0.");
    return;
  }

  if (salaryDiff <= 0) {
    alert("Your target salary must be larger than your starting salary.");
    return;
  }

  if (yearDiff <= 0) {
    alert("Your target year must be after your starting year.");
    return;
  }

  if (yearDiff > 100) {
    alert("Are you sure you're working for over 100 years?");
    return;
  }

  if (startingPercentage > 5) {
    alert(
      "Displaying abnormally large rate. Are you sure you entered the right numbers?"
    );
  }

  appendParagraphText(
    details,
    "Determined starting percentage as " + fmtPercent(startingPercentage)
  );

  // Loop to find the sentinel salary
  let currentSalary = startingSalary;
  for (let i = 0; i < yearDiff; i++) {
    currentSalary = currentSalary + currentSalary * startingPercentage;
  }
  let sentinelSalary = currentSalary;

  appendParagraphText(
    details,
    "Using the starting percentage leads us " +
      fmtDollar(sentinelSalary - targetSalary) +
      " away from our target."
  );

  appendParagraphText(details, "Finding most accurate percentage...");

  let testPercentage = startingPercentage;
  let testSalary = startingSalary;
  let lastFinalSalary = 0;
  let lastPercentage = 0;
  let loopCount = 0;
  while (sentinelSalary > targetSalary) {
    let loopDetails = document.createElement("details");
    let loopSummary = document.createElement("summary");
    loopSummary.innerText = "See loop " + ++loopCount;
    loopDetails.appendChild(loopSummary);

    currentSalary = testSalary;
    lastPercentage = testPercentage;
    testPercentage = testPercentage - 0.005 * testPercentage; // decrease to find the most accurate rate

    for (let i = 0; i < yearDiff; i++) {
      currentSalary = currentSalary + currentSalary * testPercentage;
      appendParagraphText(
        loopDetails,
        "Year " + (i + 1) + ": " + fmtDollar(currentSalary)
      );
    }

    lastFinalSalary = sentinelSalary;
    sentinelSalary = currentSalary;

    details.append(loopDetails);
    appendParagraphText(
      details,
      "To achieve " +
        fmtDollar(sentinelSalary) +
        " you need " +
        fmtPercent(testPercentage)
    );
  }

  appendParagraphText(
    details,
    "Second to last calculated percentage of " +
      fmtPercent(lastPercentage) +
      " rendered " +
      fmtDollar(lastFinalSalary) +
      ", which was closest to the target of " +
      fmtDollar(targetSalary)
  );

  let result = document.getElementById("result");
  if (result == null) {
    let form = document.getElementById("form");
    let firstResult = document.createElement("p");

    firstResult.id = "result";
    firstResult.classList.add("notice");

    firstResult.innerText =
      "Your raise must be at an estimated constant of " +
      fmtPercent(lastPercentage) +
      " per year to earn " +
      fmtDollar(targetSalary) +
      " by " +
      targetYear;

    form.appendChild(firstResult);
    return;
  }

  result.innerText =
    "Your raise must be at an estimated constant of " +
    fmtPercent(lastPercentage) +
    " per year to earn " +
    fmtDollar(targetSalary) +
    " by " +
    targetYear;
}
