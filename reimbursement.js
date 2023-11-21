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

// Determine if a given date is a travel day
function isTravelDay(date, startDate, endDate) {
  return date.getTime() === startDate.getTime() || date.getTime() === endDate.getTime();
}

// Calculate reimbursement for each day of a project
function calculateDailyReimbursement(project, date) {
  const rateType = isTravelDay(date, parseDate(project.startDate), parseDate(project.endDate)) ? 'travel' : 'full';
  return rates[project.cityType][rateType];
}

// Main Calculation Functions

// Calculate the total reimbursement for a single project
function calculateProjectReimbursement(project, detailedBreakdown) {
  const start = parseDate(project.startDate);
  const end = parseDate(project.endDate);
  let reimbursement = 0;

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dailyReimbursement = calculateDailyReimbursement(project, d);
    reimbursement += dailyReimbursement;

    // Add details to the breakdown for transparency
    const formattedDate = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear() - 2000}`;
    detailedBreakdown.push(`${formattedDate}: ${dailyReimbursement} (${project.cityType.toUpperCase()} city, ${dailyReimbursement === rates[project.cityType].travel ? 'Travel' : 'Full'} day)`);
  }

  return reimbursement;
}

// Calculate the total reimbursement for a set of projects
function calculateReimbursement(projects) {
  let totalReimbursement = 0;
  let previousProjectEnd = null;
  let detailedBreakdown = [];

  projects.forEach(project => {
    // Adjust reimbursement if projects are consecutive
    if (previousProjectEnd && parseDate(project.startDate).getTime() === previousProjectEnd.getTime() + 86400000) {
      totalReimbursement -= rates[projects[projects.indexOf(project) - 1].cityType].travel;
    }

    totalReimbursement += calculateProjectReimbursement(project, detailedBreakdown);
    previousProjectEnd = parseDate(project.endDate);
  });

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
