const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

// Function to speak text
function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);

    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;

    window.speechSynthesis.speak(text_speak);
}

// Function to greet based on the time of day
function wishMe() {
    const day = new Date();
    const hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Master...");
    } else {
        speak("Good Evening Sir...");
    }
}

// Speech Recognition API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// Continuous recognition to avoid stopping after a command
recognition.continuous = true;
recognition.interimResults = false; // Capture only final results

// Start speech recognition and greet user when the page loads
window.addEventListener('load', () => {
    recognition.start(); // Start recognition immediately
    recognition.onstart = () => {
        console.log("Speech recognition started");
        speak("Initializing JARVIS...");
        wishMe();
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === 'not-allowed') {
            speak("Microphone access is blocked. Please allow microphone access in your browser settings.");
        }
    };
});

// Handle speech recognition results
recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript.trim();
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

// Restart recognition on end to ensure it keeps running
recognition.onend = () => {
    console.log("Speech recognition ended. Restarting...");
    recognition.start();
};

// Listen for the microphone button click
btn.addEventListener('click', () => {
    content.textContent = "Listening...";
    recognition.start();
});

// Function to handle recognized commands
function takeCommand(message) {
    if (message.includes('hey') || message.includes('hello')) {
        speak("Hello Sir, How May I Help You?");
    } else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening YouTube...");
    } else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...");
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        speak(`This is what I found on the internet regarding ${message}`);
    } else if (message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "").trim()}`, "_blank");
        speak(`This is what I found on Wikipedia regarding ${message}`);
    } else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        speak(`The current time is ${time}`);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
        speak(`Today's date is ${date}`);
    } else if (message.includes('calculator')) {
        speak("Opening Calculator...");
        window.open('Calculator:///'); // May not work in some browsers
    } else {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        speak(`I found some information for ${message} on Google`);
    }
}
