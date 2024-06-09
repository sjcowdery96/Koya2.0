import React from 'react';

interface RatingProps {
    rating: number;
}

const Rating: React.FC<RatingProps> = ({ rating }) => {
    // Handle invalid input (optional)
    if (rating < 1 || rating > 5) {
        console.error("Invalid rating value. Please provide a number between 1 and 5.");
        return null; // Or display an error message
    }
    // string of stars based on rating
    const stars = '⭐️'.repeat(Math.floor(rating));

    return (
        <>
            {stars}
        </>
    );
};

export default Rating;
