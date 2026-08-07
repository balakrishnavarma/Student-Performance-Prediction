// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('show')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Initialize Analytics Charts if on analytics page
    if (document.getElementById('performanceChart')) {
        initCharts();
    }

    // Handle Prediction Form Submission
    const predictForm = document.getElementById('predictForm');
    if (predictForm) {
        predictForm.addEventListener('submit', handlePrediction);
    }

    // Render Results if on result page
    if (document.getElementById('scoreResult')) {
        renderResults();
    }
});

// Handle Prediction Form
function handlePrediction(e) {
    e.preventDefault();

    // Get form values
    const data = {
        name: document.getElementById('studentName').value,
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        grade: document.getElementById('grade').value,
        studyHours: parseFloat(document.getElementById('studyHours').value),
        attendance: parseFloat(document.getElementById('attendance').value),
        prevScore: parseFloat(document.getElementById('prevScore').value),
        assignment: parseFloat(document.getElementById('assignment').value),
        internal: parseFloat(document.getElementById('internal').value),
        backlogs: parseInt(document.getElementById('backlogs').value),
        sleepHours: parseFloat(document.getElementById('sleepHours').value),
        activities: document.getElementById('activities').value
    };

    // Calculate prediction based on weighted formula
    const predictedScore = calculateScore(data);
    
    // Save to localStorage to access on result page
    localStorage.setItem('studentData', JSON.stringify(data));
    localStorage.setItem('predictedScore', predictedScore.toFixed(1));

    // Redirect to result page
    window.location.href = 'result.html';
}

// Logic to calculate score
function calculateScore(data) {
    // Weighted Average approach
    // Base weight distribution (total 100):
    // prevScore: 40%
    // attendance: 20%
    // studyHours: 15% (max 10 hours = 100%)
    // assignment: 10%
    // internal: 15%

    let studyScore = (data.studyHours / 10) * 100;
    if (studyScore > 100) studyScore = 100;

    let baseScore = (data.prevScore * 0.40) + 
                    (data.attendance * 0.20) + 
                    (studyScore * 0.15) + 
                    (data.assignment * 0.10) + 
                    (data.internal * 0.15);

    // Modifiers
    // Backlogs penalty: -5% per backlog
    baseScore -= (data.backlogs * 5);

    // Sleep modifier: 7-9 hours is optimal (+2%), otherwise 0 or penalty
    if (data.sleepHours >= 7 && data.sleepHours <= 9) {
        baseScore += 2;
    } else if (data.sleepHours < 5) {
        baseScore -= 3;
    }

    // Activities: High participation +3%, Low +1%, None 0
    if (data.activities === 'high') baseScore += 3;
    if (data.activities === 'low') baseScore += 1;

    // Constrain to 0-100
    if (baseScore > 100) baseScore = 100;
    if (baseScore < 0) baseScore = 0;

    return baseScore;
}

function determineLevel(score) {
    if (score >= 75) return { text: 'Good', class: 'level-good' };
    if (score >= 50) return { text: 'Average', class: 'level-average' };
    return { text: 'Poor', class: 'level-poor' };
}

function generateSuggestions(score, data) {
    const suggestions = [];

    if (score >= 85) {
        suggestions.push("Excellent work! Keep maintaining your current study habits.");
        suggestions.push("Consider mentoring other students or taking advanced courses.");
    }

    if (data.attendance < 75) {
        suggestions.push("Your attendance is low. Try to attend more classes regularly to understand concepts better.");
    }

    if (data.studyHours < 3) {
        suggestions.push("Increase your daily self-study hours. Consistency is key to better grades.");
    }

    if (data.backlogs > 0) {
        suggestions.push("Focus on clearing your backlogs before taking on extra workload.");
    }

    if (data.sleepHours < 6) {
        suggestions.push("Ensure you get at least 7-8 hours of sleep for optimal cognitive function and memory retention.");
    }

    if (suggestions.length === 0) {
        suggestions.push("Keep up the good work and stay focused on your goals!");
    }

    return suggestions;
}

function renderResults() {
    const scoreStr = localStorage.getItem('predictedScore');
    const dataStr = localStorage.getItem('studentData');

    if (!scoreStr || !dataStr) {
        window.location.href = 'predict.html';
        return;
    }

    const score = parseFloat(scoreStr);
    const data = JSON.parse(dataStr);

    // Update UI
    document.getElementById('studentNameDisplay').textContent = data.name || 'Student';
    document.getElementById('scoreResult').textContent = score + '%';
    
    // Animate score circle
    const circle = document.getElementById('scoreCircle');
    circle.style.background = `conic-gradient(var(--primary-color) ${score}%, var(--bg-color) ${score}%)`;

    // Level
    const level = determineLevel(score);
    const levelEl = document.getElementById('performanceLevel');
    levelEl.textContent = `Performance: ${level.text}`;
    levelEl.className = `performance-level ${level.class}`;

    // Suggestions
    const suggestions = generateSuggestions(score, data);
    const suggestionsList = document.getElementById('suggestionsList');
    suggestionsList.innerHTML = '';
    suggestions.forEach(s => {
        const li = document.createElement('li');
        li.textContent = s;
        suggestionsList.appendChild(li);
    });
}

// Chart.js Initialization for Analytics Page
function initCharts() {
    // Mock Data
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const performanceData = [65, 68, 72, 75, 80, 85];
    const attendanceData = [80, 85, 82, 90, 95, 92];

    const ctxPerformance = document.getElementById('performanceChart').getContext('2d');
    new Chart(ctxPerformance, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Predicted Score',
                data: performanceData,
                borderColor: '#007BFF',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { display: true, text: 'Score Trend Over Time' }
            }
        }
    });

    const ctxFactors = document.getElementById('factorsChart').getContext('2d');
    new Chart(ctxFactors, {
        type: 'bar',
        data: {
            labels: ['Attendance', 'Study Hours', 'Assignments', 'Internal Marks'],
            datasets: [{
                label: 'Impact on Score (%)',
                data: [35, 25, 20, 20],
                backgroundColor: [
                    'rgba(40, 167, 69, 0.7)',
                    'rgba(0, 123, 255, 0.7)',
                    'rgba(255, 193, 7, 0.7)',
                    'rgba(220, 53, 69, 0.7)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { display: true, text: 'Key Factors Impact' }
            }
        }
    });
}
