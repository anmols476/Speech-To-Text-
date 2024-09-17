document.addEventListener('DOMContentLoaded', () => {
    // Create an instance of SpeechRecognition
    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    
    // Get references to various elements in the DOM
    const languageSelect = document.getElementById('language');
    const resultContainer = document.querySelector('.result p.resultText');
    const startListeningButton = document.querySelector('.btn.record');
    const recordButtonText = document.querySelector('.btn.record p');
    const clearButton = document.querySelector('.btn.clear');
    const downloadButton = document.querySelector('.btn.download');

    let recognizing = false; // State to track if recognition is active

    // Populate the language dropdown with available languages
    languages.forEach(language => {
        const option = document.createElement('option');
        option.value = language.code;
        option.text = language.name;
        languageSelect.add(option);
    });

    // Set up recognition properties
    recognition.continuous = true; // Keep recognizing speech until manually stopped
    recognition.interimResults = true; // Show interim results while speaking
    recognition.lang = languageSelect.value; // Set the default recognition language

    // Update recognition language when the selected language changes
    languageSelect.addEventListener('change', () => {
        recognition.lang = languageSelect.value;
    });

    // Add event listeners for button actions
    startListeningButton.addEventListener('click', toggleSpeechRecognition);
    clearButton.addEventListener('click', clearResults);

    // Disable download button initially since there's no result yet
    downloadButton.disabled = true;

    // Event handler for when recognition captures a result
    recognition.onresult = (event) => {
        // Get the latest speech recognition result
        const result = event.results[event.results.length - 1][0].transcript;
        resultContainer.textContent = result;
        downloadButton.disabled = false; // Enable download button since there's now a result
    };

    // Event handler for when recognition ends
    recognition.onend = () => {
        recognizing = false;
        startListeningButton.classList.remove('recording');
        recordButtonText.textContent = 'Start Listening'; // Update button text to indicate stopped state
    };

    // Add event listener to the download button
    downloadButton.addEventListener('click', downloadResult);

    // Function to toggle speech recognition on and off
    function toggleSpeechRecognition() {
        if (recognizing) {
            recognition.stop();
        } else {
            recognition.start();
        }

        recognizing = !recognizing; // Toggle the recognizing state
        startListeningButton.classList.toggle('recording', recognizing);
        recordButtonText.textContent = recognizing ? 'Stop Listening' : 'Start Listening'; // Update button text
    }

    // Function to clear the speech recognition results
    function clearResults() {
        resultContainer.textContent = ''; // Clear the text content
        downloadButton.disabled = true; // Disable the download button
    }

    // Function to download the speech recognition result as a text file
    function downloadResult() {
        const resultText = resultContainer.textContent;

        // Create a Blob object to hold the text data
        const blob = new Blob([resultText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        // Create an anchor element to facilitate the download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Your-Text.txt'; // Set the default filename
        a.style.display = 'none'; // Hide the anchor element

        document.body.appendChild(a); // Add the anchor to the DOM
        a.click(); // Trigger the download

        // Clean up by removing the anchor and revoking the object URL
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

});
