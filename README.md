# Project Reimbursement Calculator

## Overview

The Project Reimbursement Calculator is a simple, yet powerful tool designed to calculate reimbursements for various projects based on specific rules. Each project is defined by its duration and whether it takes place in a high-cost or low-cost city. The calculator distinguishes between travel days and full days to compute the total reimbursement amount accurately.

## Features

- Calculates reimbursements for multiple project sets
- Distinguishes between high-cost and low-cost cities
- Differentiates between travel days and full days
- Provides a detailed breakdown of the daily reimbursement calculation
- User-friendly web interface enhanced with Bootstrap for better visual appeal

## How to Use

1. **Open the Application**: Load the `index.html` file in a web browser.
2. **View Project Sets**: Review the predefined project sets displayed on the page.
3. **Calculate Reimbursements**: Click the "Calculate Reimbursements" button to see the detailed calculation for each project set.
4. **Review Results**: The total reimbursement along with a detailed day-by-day breakdown for each project set will be displayed.

## Technical Details

- **Languages Used**: HTML, JavaScript (Vanilla)
- **External Libraries**: Bootstrap (via CDN) for styling
- **Date Handling**: Custom date parsing and manipulation to determine the type of each day (travel or full) within the project range

## Project Structure

- `index.html`: The main HTML file that hosts the UI.
- `reimbursement.js`: JavaScript file containing all the logic for calculating reimbursements and displaying the project sets.
- `README.md`: This file, explaining the project, its features, and how to use it.

## Future Enhancements

- Implement more robust date handling using libraries like `date-fns` or `moment.js`.
- Add functionality to input custom project sets via the UI.
- Introduce more interactive UI elements for a dynamic user experience.
- Implement backend services for handling larger data sets and more complex calculations.

## About

This project was created as part of a technical exercise to demonstrate coding proficiency, problem-solving skills, and the ability to deliver a functional and user-friendly application swiftly.
