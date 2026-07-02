import React, { useState, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';

const SearchBar = ({ onSearch, placeholder = 'Search...' }) => {
  const [value, setValue] = useState('');
  const debounced = useDebounce(value, 400);

  useEffect(() => {
    onSearch(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <div className="relative w-full sm:w-72">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="input pl-9"
      />
    </div>
  );
};

export default SearchBar;
