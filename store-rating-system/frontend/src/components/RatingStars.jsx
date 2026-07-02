import React, { useState } from 'react';

// interactive when onChange is provided, read-only otherwise
const RatingStars = ({ value = 0, onChange, size = 'text-xl', readOnly = false }) => {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div className={`inline-flex gap-0.5 ${size}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          onClick={() => !readOnly && onChange && onChange(star)}
          className={`${readOnly ? 'cursor-default' : 'cursor-pointer'} leading-none ${
            star <= display ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default RatingStars;
