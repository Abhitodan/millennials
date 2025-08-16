// Game variables
let gameData = {
    name: '',
    partners: [],
    cars: [],
    jobs: [],
    locations: [],
    homes: ['Mansion', 'Apartment', 'Shack', 'House'],
    kids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    magicNumber: 0,
    results: {}
};

// DOM elements
const mashForm = document.getElementById('mashForm');
const inputSection = document.getElementById('inputSection');
const numberSection = document.getElementById('numberSection');
const resultsSection = document.getElementById('resultsSection');
const numberButtons = document.querySelectorAll('.number-btn');
const playAgainBtn = document.getElementById('playAgainBtn');
const shareResultBtn = document.getElementById('shareResultBtn');

// Progress steps
const progressSteps = document.querySelectorAll('.progress-step');

// Initialize game
function initializeGame() {
    mashForm.addEventListener('submit', handleFormSubmit);
    
    numberButtons.forEach(btn => {
        btn.addEventListener('click', handleNumberSelection);
    });
    
    playAgainBtn.addEventListener('click', resetGame);
    shareResultBtn.addEventListener('click', shareResults);
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Collect all input data
    gameData.name = document.getElementById('yourName').value.trim();
    gameData.partners = [
        document.getElementById('partner1').value.trim(),
        document.getElementById('partner2').value.trim(),
        document.getElementById('partner3').value.trim()
    ];
    gameData.cars = [
        document.getElementById('car1').value.trim(),
        document.getElementById('car2').value.trim(),
        document.getElementById('car3').value.trim()
    ];
    gameData.jobs = [
        document.getElementById('job1').value.trim(),
        document.getElementById('job2').value.trim(),
        document.getElementById('job3').value.trim()
    ];
    gameData.locations = [
        document.getElementById('location1').value.trim(),
        document.getElementById('location2').value.trim(),
        document.getElementById('location3').value.trim()
    ];
    
    // Validate inputs
    if (!validateInputs()) {
        return;
    }
    
    // Move to number selection
    showNumberSelection();
}

// Validate all inputs
function validateInputs() {
    const allInputs = [
        gameData.name,
        ...gameData.partners,
        ...gameData.cars,
        ...gameData.jobs,
        ...gameData.locations
    ];
    
    for (let input of allInputs) {
        if (!input || input.length < 1) {
            alert('Please fill in all fields!');
            return false;
        }
    }
    
    return true;
}

// Show number selection section
function showNumberSelection() {
    updateProgressStep(2);
    inputSection.style.display = 'none';
    numberSection.style.display = 'block';
    
    // Add animation
    numberSection.style.opacity = '0';
    numberSection.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        numberSection.style.transition = 'all 0.5s ease';
        numberSection.style.opacity = '1';
        numberSection.style.transform = 'translateY(0)';
    }, 100);
}

// Handle number selection
function handleNumberSelection(e) {
    gameData.magicNumber = parseInt(e.target.getAttribute('data-number'));
    
    // Add visual feedback
    e.target.style.transform = 'scale(1.2) rotate(10deg)';
    e.target.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
    
    setTimeout(() => {
        calculateResults();
        showResults();
    }, 1000);
}

// Calculate MASH results using the magic number
function calculateResults() {
    // Create master list of all options
    const allOptions = {
        homes: [...gameData.homes],
        partners: [...gameData.partners],
        cars: [...gameData.cars],
        jobs: [...gameData.jobs],
        locations: [...gameData.locations],
        kids: [...gameData.kids]
    };
    
    // Perform MASH elimination for each category
    gameData.results = {
        home: eliminateOptions(allOptions.homes, gameData.magicNumber),
        partner: eliminateOptions(allOptions.partners, gameData.magicNumber),
        car: eliminateOptions(allOptions.cars, gameData.magicNumber),
        job: eliminateOptions(allOptions.jobs, gameData.magicNumber),
        location: eliminateOptions(allOptions.locations, gameData.magicNumber),
        kids: eliminateOptions(allOptions.kids, gameData.magicNumber)
    };
}

// MASH elimination algorithm
function eliminateOptions(options, magicNumber) {
    if (options.length === 0) return '';
    if (options.length === 1) return options[0];
    
    const workingOptions = [...options];
    let currentIndex = 0;
    
    while (workingOptions.length > 1) {
        // Count magic number positions and eliminate
        currentIndex = (currentIndex + magicNumber - 1) % workingOptions.length;
        workingOptions.splice(currentIndex, 1);
        
        // Adjust index if we're at the end
        if (currentIndex >= workingOptions.length) {
            currentIndex = 0;
        }
    }
    
    return workingOptions[0];
}

// Show results section
function showResults() {
    updateProgressStep(3);
    numberSection.style.display = 'none';
    resultsSection.style.display = 'block';
    
    // Populate results
    document.getElementById('resultHome').textContent = gameData.results.home;
    document.getElementById('resultPartner').textContent = gameData.results.partner;
    document.getElementById('resultCar').textContent = gameData.results.car;
    document.getElementById('resultJob').textContent = gameData.results.job;
    document.getElementById('resultLocation').textContent = gameData.results.location;
    document.getElementById('resultKids').textContent = gameData.results.kids;
    
    // Add animation
    resultsSection.style.opacity = '0';
    resultsSection.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        resultsSection.style.transition = 'all 0.5s ease';
        resultsSection.style.opacity = '1';
        resultsSection.style.transform = 'translateY(0)';
    }, 100);
    
    // Add sparkle effect to results
    addSparkleEffect();
}

// Add sparkle animation effect
function addSparkleEffect() {
    const resultValues = document.querySelectorAll('.result-value');
    resultValues.forEach((element, index) => {
        setTimeout(() => {
            element.style.animation = 'sparkle 1s ease-in-out';
        }, index * 200);
    });
}

// Update progress step indicator
function updateProgressStep(step) {
    progressSteps.forEach((progressStep, index) => {
        if (index + 1 <= step) {
            progressStep.classList.add('active');
        } else {
            progressStep.classList.remove('active');
        }
    });
}

// Reset game to start over
function resetGame() {
    // Reset all data
    gameData = {
        name: '',
        partners: [],
        cars: [],
        jobs: [],
        locations: [],
        homes: ['Mansion', 'Apartment', 'Shack', 'House'],
        kids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        magicNumber: 0,
        results: {}
    };
    
    // Reset form
    mashForm.reset();
    
    // Reset sections
    inputSection.style.display = 'block';
    numberSection.style.display = 'none';
    resultsSection.style.display = 'none';
    
    // Reset progress
    updateProgressStep(1);
    
    // Reset number buttons
    numberButtons.forEach(btn => {
        btn.style.transform = '';
        btn.style.background = '';
    });
}

// Share results functionality
function shareResults() {
    const resultText = `🔮 My MASH Results 🔮\n\n` +
        `I will live in a: ${gameData.results.home}\n` +
        `I will marry: ${gameData.results.partner}\n` +
        `I will drive a: ${gameData.results.car}\n` +
        `My job will be: ${gameData.results.job}\n` +
        `I will live in: ${gameData.results.location}\n` +
        `Number of kids: ${gameData.results.kids}\n\n` +
        `Play MASH yourself at Millennial Games!`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My MASH Fortune',
            text: resultText
        });
    } else {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(resultText).then(() => {
            alert('Your fortune has been copied to clipboard!');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = resultText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Your fortune has been copied to clipboard!');
        });
    }
}

// Add CSS animation for sparkle effect
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); text-shadow: 0 0 20px #F1C40F; }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initializeGame);