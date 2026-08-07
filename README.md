# Student Performance Prediction

A responsive web application that predicts a student's academic performance based on various input factors.

## Features
- **Responsive Design:** Clean, modern UI accessible on desktop and mobile.
- **Student Information Form:** 12-field form to capture academic inputs.
- **Performance Prediction:** JavaScript-based logic using weighted calculations to predict final scores.
- **Result Output:** Displays predicted score, performance level (Good/Average/Poor), and personalized suggestions.
- **Analytics Dashboard:** Uses Chart.js to visualize mock data of score trends and factor impacts.

## Technologies Used
- HTML5
- CSS3 (Vanilla CSS, variables, flexbox/grid)
- JavaScript (Vanilla JS, DOM manipulation, localStorage)
- Chart.js (Data visualization)
- FontAwesome (Icons)
- Google Fonts (Poppins)

## Project Structure
```
student-performance-prediction/
├── index.html        (Home Page)
├── predict.html      (Prediction Form)
├── result.html       (Result Page)
├── analytics.html    (Analytics Dashboard)
├── about.html        (About Page)
├── contact.html      (Contact Page)
├── css/
│   └── style.css     (Global Styles)
└── js/
    └── script.js     (Core Logic & Charts)
```

## How to Run
Simply open `index.html` in any modern web browser. No server setup is required since it is a pure frontend application using `localStorage` for passing data between pages.
