// Handle form submission
document.getElementById('flamesForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    calculateFLAMES();
});

// Add event listeners for input validation
document.getElementById('name1').addEventListener('input', validateInputField);
document.getElementById('name2').addEventListener('input', validateInputField);

function validateInputField(event) {
    const input = event.target;
    const value = input.value;
    if (!/^[a-zA-Z\s]*$/.test(value)) {
        input.setCustomValidity('Please enter only letters.');
        input.reportValidity();
    } else {
        input.setCustomValidity('');
    }
}

async function calculateFLAMES() {
    // Update progress indicator
    updateProgressStep(2);

    // Clear previous content
    let processContainer = document.getElementById('processContainer');
    processContainer.innerHTML = '';

    // Hide the share button initially
    document.getElementById('shareBtn').style.display = 'none';

    // Get the names and process them
    let name1Input = document.getElementById('name1').value.trim();
    let name2Input = document.getElementById('name2').value.trim();

    let name1 = name1Input.toUpperCase().replace(/[^A-Z]/g, '');
    let name2 = name2Input.toUpperCase().replace(/[^A-Z]/g, '');

    // Validate the input
    if (!validateInput(name1) || !validateInput(name2)) {
        displayError('Please enter valid names containing only letters.');
        updateProgressStep(1);
        return;
    }

    // Display initial explanation
    await displayExplanation("Comparing letters in both names...");

    // Display names
    let namesDisplay = document.createElement('div');
    namesDisplay.classList.add('names-display');

    let name1Display = createNameDisplay(name1);
    let name2Display = createNameDisplay(name2);

    namesDisplay.appendChild(name1Display);
    namesDisplay.appendChild(name2Display);
    processContainer.appendChild(namesDisplay);

    // Pause for effect
    await delay(1000);

    // Cross out common letters with animations and explanations
    let remainingLettersCount = await crossOutCommonLetters(name1Display, name2Display);

    // Display remaining letters count
    await displayRemainingCount(remainingLettersCount);

    // Check if there are remaining letters
    if (remainingLettersCount <= 0) {
        displayError('No remaining letters to perform FLAMES calculation.');
        updateProgressStep(1);
        return;
    }

    // Pause before FLAMES elimination
    await delay(1500);

    // Display explanation
    await displayExplanation("Eliminating letters in FLAMES based on the remaining letters count...");

    // Animate FLAMES elimination with detailed explanations
    let result = await animateFlamesElimination(remainingLettersCount);

    // Display final result
    await displayFinalResult(result, name1Input, name2Input);

    // Update progress indicator
    updateProgressStep(3);

    // Show the share button
    document.getElementById('shareBtn').style.display = 'inline-block';
}

function validateInput(name) {
    return /^[A-Z]+$/.test(name) && name.length > 0;
}

function createNameDisplay(name) {
    let nameDiv = document.createElement('div');
    nameDiv.classList.add('name-item');
    for (let char of name) {
        let charSpan = document.createElement('span');
        charSpan.classList.add('name-letter');
        charSpan.innerText = char;
        nameDiv.appendChild(charSpan);
    }
    return nameDiv;
}

async function crossOutCommonLetters(name1Display, name2Display) {
    let name1Letters = Array.from(name1Display.querySelectorAll('.name-letter'));
    let name2Letters = Array.from(name2Display.querySelectorAll('.name-letter'));

    let totalLetters = name1Letters.length + name2Letters.length;

    for (let i = 0; i < name1Letters.length; i++) {
        let charSpan1 = name1Letters[i];
        for (let j = 0; j < name2Letters.length; j++) {
            let charSpan2 = name2Letters[j];
            if (charSpan1.innerText === charSpan2.innerText && !charSpan1.classList.contains('crossed') && !charSpan2.classList.contains('crossed')) {
                // Highlight the matching letters
                charSpan1.classList.add('highlight');
                charSpan2.classList.add('highlight');

                // Display explanation
                await displayExplanation(`Matching letters found: ${charSpan1.innerText}. Crossing them out...`);
                await delay(1000);

                // Remove highlighting and cross out letters
                charSpan1.classList.remove('highlight');
                charSpan2.classList.remove('highlight');

                charSpan1.classList.add('crossed');
                charSpan2.classList.add('crossed');

                // Update total letters
                totalLetters -= 2;

                await delay(500);
                break;
            }
        }
    }

    // Display explanation
    await displayExplanation(`Total remaining letters: ${totalLetters}`);

    return totalLetters;
}

async function displayRemainingCount(count) {
    let processContainer = document.getElementById('processContainer');

    let countDisplay = document.createElement('div');
    countDisplay.classList.add('remaining-count');
    countDisplay.innerText = `Remaining Letters Count: ${count}`;
    processContainer.appendChild(countDisplay);
}

async function animateFlamesElimination(count) {
    let processContainer = document.getElementById('processContainer');

    let flames = ['F', 'L', 'A', 'M', 'E', 'S'];

    // Create a container for the FLAMES letters
    let flamesDisplay = document.createElement('div');
    flamesDisplay.classList.add('flames-letter-container');

    let flamesLetters = [];

    flames.forEach((letter) => {
        let letterSpan = document.createElement('span');
        letterSpan.classList.add('flames-letter');
        letterSpan.innerText = letter;
        flamesDisplay.appendChild(letterSpan);
        flamesLetters.push(letterSpan);
    });

    processContainer.appendChild(flamesDisplay);

    let index = 0;

    while (flames.length > 1) {
        // Calculate the index of the letter to eliminate
        index = (index + count - 1) % flames.length;

        // Highlight the letter to eliminate
        flamesLetters.forEach(span => span.classList.remove('highlight'));
        flamesLetters[index].classList.add('highlight');

        // Display explanation
        await displayExplanation(`Counting to ${count}. Eliminating "${flamesLetters[index].innerText}" from FLAMES.`);
        await delay(1500);

        // Eliminate the letter
        flamesLetters[index].classList.add('eliminated');

        // Remove the eliminated letter from arrays
        flames.splice(index, 1);
        flamesLetters.splice(index, 1);

        // Update the display of remaining FLAMES letters
        await updateRemainingFlames(flamesLetters);

        // Pause before next elimination
        await delay(500);
    }

    let relationship = '';
    switch (flames[0]) {
        case 'F':
            relationship = 'Friends';
            break;
        case 'L':
            relationship = 'Love';
            break;
        case 'A':
            relationship = 'Affection';
            break;
        case 'M':
            relationship = 'Marriage';
            break;
        case 'E':
            relationship = 'Enemies';
            break;
        case 'S':
            relationship = 'Siblings';
            break;
    }

    return relationship;
}

async function updateRemainingFlames(flamesLetters) {
    // Since we are manipulating the same elements in the DOM, they update automatically
    await delay(300);
}

async function displayFinalResult(result, name1Input, name2Input) {
    let processContainer = document.getElementById('processContainer');

    // Display explanation
    await displayExplanation(`The final remaining letter is "${result.charAt(0)}", which means...`);

    await delay(1000);

    let finalResult = document.createElement('div');
    finalResult.id = 'finalResult';

    let resultIcon = '🔥';

    finalResult.innerHTML = `${resultIcon} Relationship: <span>${result}</span>! ${resultIcon}`;
    processContainer.appendChild(finalResult);

    // Fade in the final result
    await delay(500);
    finalResult.style.opacity = 1;

    // Prepare the image template content
    prepareImageTemplate(result, name1Input, name2Input);
}

function prepareImageTemplate(result, name1, name2, branding = 'www.yourwebsite.com') {
    const resultImageElement = document.querySelector('#resultImage .image-template');
    if (!resultImageElement) {
        console.error('Result image element not found');
        return;
    }

    // Map relationship results to icons and colors
    const relationshipData = {
        'Friends': { icon: '🤝', color: '#00cec9' },
        'Love': { icon: '❤️', color: '#e84393' },
        'Affection': { icon: '💖', color: '#fdcb6e' },
        'Marriage': { icon: '💍', color: '#6c5ce7' },
        'Enemies': { icon: '😠', color: '#d63031' },
        'Siblings': { icon: '👫', color: '#0984e3' },
    };

    // Get the icon and color for the result
    const { icon, color } = relationshipData[result] || { icon: '🔥', color: '#ffffff' };

    // Sanitize the names and result to prevent XSS attacks
    const sanitizedResult = sanitizeText(result);
    const sanitizedName1 = sanitizeText(name1);
    const sanitizedName2 = sanitizeText(name2);

    // Create the image template content
    resultImageElement.innerHTML = `
        <div class="image-content" style="border: 5px solid ${color};">
            <h1>🔥 FLAMES 🔥</h1>
            <p>The Relationship between</p>
            <p class="names-text">${sanitizedName1} <span>&amp;</span> ${sanitizedName2}</p>
            <p>is:</p>
            <p class="result-text" style="color: ${color};">${icon} ${sanitizedResult} ${icon}</p>
            <div class="branding">${branding}</div>
        </div>
    `;
}

function sanitizeText(text) {
    if (!text) return '';
    return text.toString()
               .replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;")
               .replace(/"/g, "&quot;")
               .replace(/'/g, "&#039;");
}

async function displayExplanation(text) {
    let processContainer = document.getElementById('processContainer');

    // Remove previous explanation if exists
    let existingExplanation = processContainer.querySelector('.explanation');
    if (existingExplanation) {
        existingExplanation.remove();
    }

    let explanation = document.createElement('div');
    explanation.classList.add('explanation');
    explanation.innerText = text;
    processContainer.appendChild(explanation);

    await delay(500);
}

function displayError(message) {
    let processContainer = document.getElementById('processContainer');
    processContainer.innerHTML = '';

    let errorDiv = document.createElement('div');
    errorDiv.classList.add('error-message');
    errorDiv.innerText = message;
    processContainer.appendChild(errorDiv);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateProgressStep(step) {
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((element, index) => {
        if (index === step - 1) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }
    });
}

// Share Button Functionality
document.getElementById('shareBtn').addEventListener('click', function() {
    // Generate the image using html2canvas
    const resultImageContainer = document.getElementById('resultImage');
    const resultImageElement = document.querySelector('#resultImage .image-template');

    if (!resultImageElement) {
        console.error('Result image element not found');
        return;
    }

    // Temporarily display the image template for capturing
    resultImageContainer.style.display = 'block';

    html2canvas(resultImageElement, { useCORS: true }).then(canvas => {
        // Hide the image template after capturing
        resultImageContainer.style.display = 'none';

        // Create a link to download the image
        const link = document.createElement('a');
        link.download = 'flames-result.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(error => {
        console.error('Error generating image:', error);
    });
});
