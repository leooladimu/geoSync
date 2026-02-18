const ENERGY_RANK = { low: 0, dipping: 1, rising: 2, peak: 3 };

function expandWindow(startMonth, endMonth) {
  const months = new Set();
  if (startMonth <= endMonth) {
    for (let m = startMonth; m <= endMonth; m++) months.add(m);
  } else {
    for (let m = startMonth; m <= 12; m++) months.add(m);
    for (let m = 1; m <= endMonth; m++) months.add(m);
  }
  return months;
}

function getEnergyLevel(derived, month) {
  const { vulnerabilityWindow } = derived;
  const { startMonth, endMonth } = vulnerabilityWindow;
  const vulnMonths = expandWindow(startMonth, endMonth);
  const peakStart = ((startMonth + 5) % 12) + 1;
  const peakEnd = ((endMonth + 5) % 12) + 1;
  const peakMonths = expandWindow(peakStart, peakEnd);
  const risingStart = ((peakStart - 3 + 12) % 12) + 1;
  const risingEnd = ((peakStart - 2 + 12) % 12) + 1;
  const risingMonths = expandWindow(risingStart, risingEnd);
  if (vulnMonths.has(month)) return month === startMonth ? "dipping" : "low";
  if (peakMonths.has(month)) return "peak";
  if (risingMonths.has(month)) return "rising";
  for (let i = 1; i <= 2; i++) {
    const prev = ((month - 1 - i + 12) % 12) + 1;
    if (peakMonths.has(prev)) return "dipping";
  }
  return "rising";
}

function getMismatchRisk(energyA, energyB) {
  if (energyA === "low" && energyB === "low") return "high";
  const diff = Math.abs(ENERGY_RANK[energyA] - ENERGY_RANK[energyB]);
  if (diff <= 1) return "low";
  if (diff === 2) return "moderate";
  return "high";
}

function generateRecommendations(
  energyA,
  energyB,
  mismatchRisk,
  profileA,
  profileB,
) {
  const recommendations = [];
  const scripts = [];

  if (energyA === "low" && energyB === "low") {
    recommendations.push(
      "You're both in a low-energy window. Don't mistake shared fatigue for relationship problems.",
      "Lean on external support this month.",
      "Minimize big decisions.",
    );
    scripts.push(
      "Instead of: 'We need to talk about us.' Try: 'I'm feeling low this month. How are you doing?'",
    );
    return { recommendations, scripts };
  }
  if (
    (energyA === "low" || energyA === "dipping") &&
    (energyB === "peak" || energyB === "rising")
  ) {
    recommendations.push(
      "A is in a low window, B is energized. Let B take the lead this month.",
      "A: Don't confuse seasonal low energy with relationship doubt.",
      "B: Hold your expansion energy — A can't match it right now.",
    );
    scripts.push(
      "B to A: 'I've got you this month. Tell me what you need.'",
      "A to B: 'I'm not at my best right now — it's not about us.'",
    );
  }
  if (
    (energyA === "peak" || energyA === "rising") &&
    (energyB === "low" || energyB === "dipping")
  ) {
    recommendations.push(
      "B is in a low window. A leads on logistics this month.",
      "B: Your seasonal low may make stable things feel stale. Don't make permanent decisions from a temporary state.",
      "A: Resist the urge to accelerate.",
    );
    scripts.push(
      "A to B: 'You don't have to be on right now. I've got us.'",
      "B to A: 'I know I'm quieter than usual — I just need time to come back to myself.'",
    );
  }
  if (energyA === "peak" && energyB === "peak") {
    recommendations.push(
      "You're both at peak energy. Great for growth — but watch for over-commitment.",
      "Best window for addressing anything unresolved.",
      "Don't make promises your future selves can't keep.",
    );
    scripts.push(
      "Before any big commitment: 'How will we feel about this in January?'",
    );
  }
  if (profileA.stressBaseline === "freeze" && energyA === "low") {
    recommendations.push(
      "A's freeze response will be amplified this month. Extra space, not extra pressure.",
    );
  }
  if (profileB.stressBaseline === "fight-flight" && energyB === "low") {
    recommendations.push(
      "B's fight-flight response may create conflict this month to generate stimulation. Recognize the pattern before reacting.",
    );
  }
  return { recommendations, scripts };
}

function generate(profileA, profileB, month, year) {
  const energyA = getEnergyLevel(profileA, month);
  const energyB = getEnergyLevel(profileB, month);
  const mismatchRisk = getMismatchRisk(energyA, energyB);
  const { recommendations, scripts } = generateRecommendations(
    energyA,
    energyB,
    mismatchRisk,
    profileA,
    profileB,
  );
  return {
    month,
    year,
    userA: {
      energyLevel: energyA,
      inVulnerabilityWindow: expandWindow(
        profileA.vulnerabilityWindow.startMonth,
        profileA.vulnerabilityWindow.endMonth,
      ).has(month),
    },
    userB: {
      energyLevel: energyB,
      inVulnerabilityWindow: expandWindow(
        profileB.vulnerabilityWindow.startMonth,
        profileB.vulnerabilityWindow.endMonth,
      ).has(month),
    },
    mismatchRisk,
    recommendations,
    scripts,
  };
}

function generateRange(profileA, profileB, startMonth, startYear, months = 3) {
  const forecasts = [];
  for (let i = 0; i < months; i++) {
    const total = startMonth + i;
    const month = ((total - 1) % 12) + 1;
    const year = startYear + Math.floor((total - 1) / 12);
    forecasts.push(generate(profileA, profileB, month, year));
  }
  return forecasts;
}

module.exports = { generate, generateRange };
