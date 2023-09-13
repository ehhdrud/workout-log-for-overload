'use client';
import { useState } from 'react';
import '../../styles/log-page.css';

const Log = () => {
    const [workout, setWorkout] = useState<string>('');

    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            // func...
        }
    };

    return (
        <div>
            <input
                type="text"
                value={workout}
                id="workoutInput"
                placeholder="workout name..."
                onChange={(e) => setWorkout(e.target.value)}
                onKeyDown={handleKeyPress}
            />
        </div>
    );
};

export default Log;
