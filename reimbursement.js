// Constants and Helper Functions

// Define the reimbursement rates for different city types and day types
const rates = {
  low: { travel: 45, full: 75 },
  high: { travel: 55, full: 85 }
};

// Parse a date string in MM/DD/YY format into a Date object
function parseDate(dateString) {
  const [month, day, year] = dateString.split('/').map(Number);
  return new Date(year + 2000, month - 1, day);
}

// Main Calculation Functions

// Process projects to create a map of dates with their types and city costs
function createDatesMap(projects) {
  const datesMap = new Map();

  // Mark first and last days of each project as travel days, others as full
  projects.forEach(project => {
    const start = parseDate(project.startDate);
    const end = parseDate(project.endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const formattedDate = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear() - 2000}`;
      let dayType = (d.getTime() === start.getTime() || d.getTime() === end.getTime()) ? 'travel' : 'full';

      datesMap.set(formattedDate, { dayType, cityType: project.cityType });
    }
  });

  // Adjust for consecutive or overlapping projects
  for (let i = 0; i < projects.length - 1; i++) {
    const end = parseDate(projects[i].endDate);
    const nextStart = parseDate(projects[i + 1].startDate);

    // Check if projects are consecutive or overlapping
    if (end.getTime() >= nextStart.getTime() - 86400000) {
      const endFormatted = `${end.getMonth() + 1}/${end.getDate()}/${end.getFullYear() - 2000}`;
      const nextStartFormatted = `${nextStart.getMonth() + 1}/${nextStart.getDate()}/${nextStart.getFullYear() - 2000}`;

      datesMap.set(endFormatted, { dayType: 'full', cityType: projects[i].cityType });
      datesMap.set(nextStartFormatted, { dayType: 'full', cityType: projects[i + 1].cityType });
    }
  }

  return datesMap;
}

// Calculate the total reimbursement from the dates map
function calculateTotalReimbursement(datesMap, detailedBreakdown) {
  let totalReimbursement = 0;

  datesMap.forEach((value, key) => {
    const { dayType, cityType } = value;
    const dailyReimbursement = rates[cityType][dayType];
    totalReimbursement += dailyReimbursement;

    // Add details to the breakdown for transparency
    detailedBreakdown.push(`${key}: ${dailyReimbursement} (${cityType.toUpperCase()} city, ${dayType.charAt(0).toUpperCase() + dayType.slice(1)} day)`);
  });

  return totalReimbursement;
}

// Adjust the days adjacent to gaps between projects to be travel days
function adjustForGaps(projects, datesMap) {
  let previousProjectEnd = null;

  projects.forEach(project => {
    const start = parseDate(project.startDate);
    const end = parseDate(project.endDate);

    // Check for a gap before the start of the current project
    if (previousProjectEnd && (start.getTime() > previousProjectEnd.getTime() + 86400000)) {
      const dayBeforeStart = new Date(start.getTime() - 86400000);
      const formattedDayBefore = `${dayBeforeStart.getMonth() + 1}/${dayBeforeStart.getDate()}/${dayBeforeStart.getFullYear() - 2000}`;
      if (datesMap.has(formattedDayBefore)) {
        datesMap.set(formattedDayBefore, { dayType: 'travel', cityType: datesMap.get(formattedDayBefore).cityType });
      }
    }

    previousProjectEnd = new Date(end);
  });
}

// Calculate the total reimbursement for a set of projects
function calculateReimbursement(projects) {
  let detailedBreakdown = [];
  const datesMap = createDatesMap(projects);
  adjustForGaps(projects, datesMap);
  const totalReimbursement = calculateTotalReimbursement(datesMap, detailedBreakdown);

  return { totalReimbursement, detailedBreakdown };
}

// UI Interaction Functions

// Display project sets on the webpage
function displayProjectSets(projectSets) {
  const projectSetsDiv = document.getElementById('projectSets');
  projectSetsDiv.innerHTML = '<h2>Project Sets:</h2>';

  projectSets.forEach((projects, index) => {
    let projectDetails = `<h3>Set ${index + 1}:</h3><ul>`;
    projects.forEach(project => {
      projectDetails += `<li>${project.cityType.toUpperCase()} City - From ${project.startDate} to ${project.endDate}</li>`;
    });
    projectDetails += '</ul>';
    projectSetsDiv.innerHTML += projectDetails;
  });
}

// Calculate and display reimbursements for all project sets
function calculateReimbursements() {
  let output = '';
  projectSets.forEach((projects, index) => {
    const { totalReimbursement, detailedBreakdown } = calculateReimbursement(projects);
    output += `Set ${index + 1}: Total Reimbursement = $${totalReimbursement}\n`;
    output += 'Detailed Breakdown:\n';
    output += detailedBreakdown.join('\n') + '\n\n';
  });

  document.getElementById('output').innerText = output;
}

// Define the project sets
const projectSets = [
  [
      { cityType: 'low', startDate: '9/1/15', endDate: '9/3/15' }
  ],
  [
      { cityType: 'low', startDate: '9/1/15', endDate: '9/1/15' },
      { cityType: 'high', startDate: '9/2/15', endDate: '9/6/15' },
      { cityType: 'low', startDate: '9/6/15', endDate: '9/8/15' }
  ],
  [
      { cityType: 'low', startDate: '9/1/15', endDate: '9/3/15' },
      { cityType: 'high', startDate: '9/5/15', endDate: '9/7/15' },
      { cityType: 'high', startDate: '9/8/15', endDate: '9/8/15' }
  ],
  [
      { cityType: 'low', startDate: '9/1/15', endDate: '9/1/15' },
      { cityType: 'low', startDate: '9/1/15', endDate: '9/1/15' },
      { cityType: 'high', startDate: '9/2/15', endDate: '9/2/15' },
      { cityType: 'high', startDate: '9/2/15', endDate: '9/3/15' }
  ]
];

// Display the project sets upon script load
displayProjectSets(projectSets);
