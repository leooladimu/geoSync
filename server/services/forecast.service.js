/**
 * Generates seasonal forecasts for connections based on vulnerability windows
 * and current energy patterns.
 */

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Energy level mapping by season and individual profile
function getEnergyLevel(profile, currentMonth) {
  const { vulnerabilityWindow, season } = profile;
  const { startMonth, endMonth } = vulnerabilityWindow;

  // Check if currently in vulnerability window
  const inWindow = isInWindow(currentMonth, startMonth, endMonth);

  if (inWindow) {
    return "low";
  }

  // Peak energy is typically in the opposite season from birth season
  const peakSeason = getOppositeSeason(season);
  const currentSeason = getCurrentSeason(currentMonth);

  if (currentSeason === peakSeason) {
    return "peak";
  }

  // Rising energy leading up to peak
  if (isApproachingSeason(currentMonth, peakSeason)) {
    return "rising";
  }

  // Otherwise dipping
  return "dipping";
}

function isInWindow(month, startMonth, endMonth) {
  if (startMonth <= endMonth) {
    return month >= startMonth && month <= endMonth;
  }
  return month >= startMonth || month <= endMonth;
}

function getCurrentSeason(month) {
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "fall";
  return "winter";
}

function getOppositeSeason(season) {
  const opposites = {
    spring: "fall",
    summer: "winter",
    fall: "spring",
    winter: "summer",
  };
  return opposites[season];
}

function isApproachingSeason(currentMonth, targetSeason) {
  const seasonMonths = {
    spring: [3, 4, 5],
    summer: [6, 7, 8],
    fall: [9, 10, 11],
    winter: [12, 1, 2],
  };

  const targetMonths = seasonMonths[targetSeason];
  const currentIndex = targetMonths.indexOf(currentMonth);

  // If we're 1-2 months before the target season
  if (currentIndex > 0 && currentIndex <= 2) {
    return true;
  }

  // Handle year wrap for winter
  if (
    targetSeason === "winter" &&
    (currentMonth === 10 || currentMonth === 11)
  ) {
    return true;
  }

  return false;
}

function assessMismatchRisk(userA, userB) {
  // Both low = high risk
  if (userA.energyLevel === "low" && userB.energyLevel === "low") {
    return "high";
  }

  // One low, one peak = moderate risk
  if (
    (userA.energyLevel === "low" && userB.energyLevel === "peak") ||
    (userA.energyLevel === "peak" && userB.energyLevel === "low")
  ) {
    return "moderate";
  }

  // Both in vulnerability windows = high risk
  if (userA.inVulnerabilityWindow && userB.inVulnerabilityWindow) {
    return "high";
  }

  return "low";
}

function generateRecommendations(userA, userB, riskLevel) {
  const recommendations = [];

  if (riskLevel === "high") {
    recommendations.push(
      "Schedule important conversations for when both energy levels rise",
    );
    recommendations.push("Lean on external support systems during this period");
    recommendations.push("Postpone major decisions if possible");
  } else if (riskLevel === "moderate") {
    recommendations.push("The higher-energy partner takes lead in planning");
    recommendations.push("Use async communication for sensitive topics");
  } else {
    recommendations.push(
      "Good window for relationship growth and deep conversations",
    );
  }

  // Specific recommendations based on energy patterns
  if (userA.energyLevel === "low" && userB.energyLevel !== "low") {
    recommendations.push(
      "Partner B provides stability while Partner A recharges",
    );
  }
  if (userB.energyLevel === "low" && userA.energyLevel !== "low") {
    recommendations.push(
      "Partner A provides stability while Partner B recharges",
    );
  }

  return recommendations;
}

function generateScripts(userA, userB, riskLevel) {
  const scripts = [];

  if (riskLevel === "high") {
    scripts.push(
      "I'm noticing we're both in a low-energy period. Let's table this for a few days.",
    );
    scripts.push(
      "This feels like it's about timing more than substance. Can we check back next week?",
    );
  }

  if (userA.energyLevel === "low" && userB.energyLevel !== "low") {
    scripts.push(
      "I'm in my recharge window. Can you hold space while I process?",
    );
  }

  if (userB.energyLevel === "low" && userA.energyLevel !== "low") {
    scripts.push(
      "I can see you're in your low period. What do you need from me right now?",
    );
  }

  return scripts;
}

/**
 * generateForecast(profileA, profileB, startMonth, startYear) → 3-month forecast array
 */
function generateForecast(
  profileA,
  profileB,
  startMonth = null,
  startYear = null,
) {
  const currentDate = new Date();
  const month = startMonth || currentDate.getMonth() + 1;
  const year = startYear || currentDate.getFullYear();

  const forecast = [];

  for (let i = 0; i < 3; i++) {
    const forecastMonth = ((month - 1 + i) % 12) + 1;
    const forecastYear = year + Math.floor((month - 1 + i) / 12);

    const userA = {
      energyLevel: getEnergyLevel(profileA, forecastMonth),
      inVulnerabilityWindow: isInWindow(
        forecastMonth,
        profileA.vulnerabilityWindow.startMonth,
        profileA.vulnerabilityWindow.endMonth,
      ),
    };

    const userB = {
      energyLevel: getEnergyLevel(profileB, forecastMonth),
      inVulnerabilityWindow: isInWindow(
        forecastMonth,
        profileB.vulnerabilityWindow.startMonth,
        profileB.vulnerabilityWindow.endMonth,
      ),
    };

    const mismatchRisk = assessMismatchRisk(userA, userB);
    const recommendations = generateRecommendations(userA, userB, mismatchRisk);
    const scripts = generateScripts(userA, userB, mismatchRisk);

    forecast.push({
      month: forecastMonth,
      year: forecastYear,
      userA,
      userB,
      mismatchRisk,
      recommendations,
      scripts,
    });
  }

  return forecast;
}

module.exports = { generateForecast };
