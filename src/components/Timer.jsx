import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Timer = () => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [comment, setComment] = useState('');

    // Connect to background script
    useEffect(() => {
        const port = chrome.runtime.connect({ name: "popup" });
        return () => port.disconnect();
    }, []);

    // Initialize timer state from background
    useEffect(() => {
        chrome.runtime.sendMessage({ action: 'GET_TIMER_STATE' }, (response) => {
            if (response) {
                setTime(response.currentTime);
                setIsRunning(response.isRunning);
            }
        });
    }, []);

    // Update time from background
    useEffect(() => {
        const intervalId = setInterval(() => {
            chrome.runtime.sendMessage({ action: 'GET_TIMER_STATE' }, (response) => {
                if (response) {
                    setTime(response.currentTime);
                    setIsRunning(response.isRunning);
                }
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const toggleTimer = () => {
        if (!isRunning) {
            chrome.runtime.sendMessage({ 
                action: 'START_TIMER',
                currentTime: time
            }, () => {
                setIsRunning(true);
            });
        } else {
            chrome.runtime.sendMessage({ 
                action: 'PAUSE_TIMER',
                currentTime: time
            }, () => {
                setIsRunning(false);
            });
        }
    };

    const handleKeyDown = (event) => {
        // Check if the focused element is the textarea
        if (event.target.tagName === 'TEXTAREA') {
            return; // Do nothing if the textarea is focused
        }

        if (event.code === 'Space') {
            event.preventDefault(); // Prevent the default space bar action (scrolling)
            toggleTimer();
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isRunning, time]); // Re-run effect on timer state changes

    const formatTime = (timeInSeconds) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;
        
        const formattedHours = hours > 0 ? `${hours.toString().padStart(2, '0')}:` : '';
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        
        return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
    };

    const handleSubmit = async () => {
        if (!selectedOption) {
            alert('Please select a study option');
            return;
        }
        
        const data = {
            duration: time,
            type: selectedOption,
            comments: comment
        }
        // Handle submission logic
        console.log(data);

        const token = localStorage.getItem('token');
        if(!token){
            console.log("You are not logged in");
            return false;
        }
        try{
            const response = await axios.post("http://localhost:3000/addSession", data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(response.status === 200){
                toast.success("Submitted Successfully");
            }else{
                toast.error("Failed to submit");
            }

        }catch(error){
            toast.error("There was an error");
            console.log("This is the error", error);
        }
        
        
        // Reset after submission
        chrome.runtime.sendMessage({ action: 'RESET_TIMER' }, () => {
            setIsRunning(false);
            setTime(0);
            setSelectedOption('');
            setComment('');
        });
    };

    return (
        <div className='flex flex-col items-center justify-center'>
            <button
                onClick={toggleTimer}
                className={`flex items-center justify-center flex-col w-44 h-44 rounded-full text-white font-extrabold m-5 ${
                    isRunning ? 'bg-red-500' : 'bg-customLightOrange'
                } transition duration-300 border border-black hover:scale-105`}
            >
                <div className='text-4xl text-black'>
                    {formatTime(time)}
                </div>
                <div className='mt-5 text-xl text-black'>
                    <div>{isRunning ? 'Stop' : 'Start'}</div>
                </div>
            </button>

            <div className="flex flex-col p-6 pb-2 bg-white rounded-lg shadow-md max-w-md mx-auto border border-black px-20 border-b-4 border-r-4">
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-bold mb-4">Log Form</h2>
                </div>
                <div className="flex items-center justify-center">
                    <div className="flex flex-col space-y-3 items-center justify-center">
                        {["Web Dev", "DSA", "Academics", "Others"].map(option => (
                            <div key={option} className="flex items-center">
                                <input
                                    type="radio"
                                    id={option}
                                    name="studyOption"
                                    value={option}
                                    className="hidden peer"
                                    checked={selectedOption === option}
                                    onChange={(e) => setSelectedOption(e.target.value)}
                                />
                                <label
                                    htmlFor={option}
                                    className="flex items-center justify-center cursor-pointer p-4 w-40 h-12 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-200 peer-checked:bg-customOrange peer-checked:text-white"
                                >
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className="ml-4">
                        <textarea
                            className="w-44 h-56 border border-gray-300 rounded-lg p-2 resize-none"
                            placeholder="Type your comments here..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                    </div>
                </div>
                <button 
                    onClick={handleSubmit}
                    className='py-3 border border-black m-5 text-xl font-bold hover:scale-110 transition rounded-xl'
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default Timer;
