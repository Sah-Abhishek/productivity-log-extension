// Timer state
let startTime = null;
let isRunning = false;
let pausedTime = 0;

// Function to calculate elapsed time
function getElapsedTime() {
    if (!isRunning && pausedTime > 0) return pausedTime;
    if (!startTime) return 0;
    return Math.floor((Date.now() - startTime) / 1000);
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case 'START_TIMER':
            if (!isRunning) {
                isRunning = true;
                startTime = Date.now() - (message.currentTime * 1000); // Resume from current time
                pausedTime = message.currentTime;
            }
            sendResponse({ success: true });
            break;

        case 'PAUSE_TIMER':
            isRunning = false;
            pausedTime = message.currentTime; // Store the current time
            startTime = null;
            sendResponse({ success: true });
            break;

        case 'GET_TIMER_STATE':
            sendResponse({
                isRunning,
                currentTime: getElapsedTime()
            });
            break;

        case 'RESET_TIMER':
            isRunning = false;
            startTime = null;
            pausedTime = 0;
            sendResponse({ success: true });
            break;
    }
    return true; // Required for async response
});

// Listen for the keyboard command
chrome.commands.onCommand.addListener((command) => {
    if (command === "open-popup") {
        chrome.action.openPopup();
    }
});

// Listen for popup connections
// chrome.runtime.onConnect.addListener((port) => {
//     if (port.name === "popup") {
//         port.onDisconnect.addListener(() => {
//             // Handle popup close if needed
//         });
//     }
// });