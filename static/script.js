// Function to classify the image
function classifyImage() {
    const fileInput = document.getElementById('image-upload');
    const imageFile = fileInput.files[0];

    if (!imageFile) {
        alert('Please select an image before clicking Classify.');
        return;
    }

    const formData = new FormData();
    formData.append('file', imageFile);

    let classificationResult = ''; // Store the classification result

    // Make a POST request to the Flask backend to classify the image
    fetch('/', {
        method: 'POST',
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            // Get the classification result from the JSON response
            classificationResult = data.classification;

            // Display the classification result on the result page
            const resultElement = document.getElementById('result');
            resultElement.innerHTML = 'Classification Result: ' + classificationResult;

            goToResultPage();

            // Celebrate with the appropriate symbol and message
            celebrate(classificationResult);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Function to navigate to the result page (unchanged)
function goToResultPage() {
    // Show the result page and hide the home page
    document.getElementById('home-page').classList.remove('active');
    document.getElementById('result-page').classList.add('active');
}

// Function to navigate to the home page (unchanged)
function goToHomePage() {
    // Show the home page and hide the result page
    document.getElementById('result-page').classList.remove('active');
    document.getElementById('home-page').classList.add('active');
}

// Function to create an SVG "X" sign
function createXSymbol() {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.style.width = '4rem';
    svg.style.height = '4rem';
    svg.style.fill = '#ff3d00'; // Red

    // Create the "X" lines
    const line1 = document.createElementNS(svgNS, 'line');
    line1.setAttribute('x1', '10');
    line1.setAttribute('y1', '10');
    line1.setAttribute('x2', '90');
    line1.setAttribute('y2', '90');
    line1.setAttribute('stroke', 'currentColor');
    line1.setAttribute('stroke-width', '10');

    const line2 = document.createElementNS(svgNS, 'line');
    line2.setAttribute('x1', '90');
    line2.setAttribute('y1', '10');
    line2.setAttribute('x2', '10');
    line2.setAttribute('y2', '90');
    line2.setAttribute('stroke', 'currentColor');
    line2.setAttribute('stroke-width', '10');

    // Append the lines to the SVG
    svg.appendChild(line1);
    svg.appendChild(line2);

    return svg;
}

// Function to celebrate with a class name or an SVG "X" sign
function celebrate(classificationResult) {
    // Create a celebratory element
    const celebratoryElement = document.createElement('div');
    celebratoryElement.style.position = 'fixed';
    celebratoryElement.style.top = '50%';
    celebratoryElement.style.left = '50%';
    celebratoryElement.style.transform = 'translate(-50%, -50%)';
    celebratoryElement.style.textAlign = 'center';
    celebratoryElement.style.fontSize = '2rem';

    if (classificationResult === 'G86' || classificationResult === 'G92' || classificationResult === 'G94' || classificationResult === 'G96' || classificationResult === 'G97') {
        // Display the classification result as a larger class name
        celebratoryElement.textContent = 'You found a: ' + classificationResult;
        celebratoryElement.style.color = '#00e676'; // Green
    } else {
        // Display an SVG "X" sign
        const xSymbol = createXSymbol();
        celebratoryElement.appendChild(xSymbol);
    }

    // Append the celebratory element to the document body
    document.body.appendChild(celebratoryElement);

    // Automatically remove the celebratory element after a longer duration
    setTimeout(() => {
        document.body.removeChild(celebratoryElement);
    }, 4000); // Adjust the duration of the celebration as needed
}