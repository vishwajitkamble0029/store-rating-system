import React from 'react';

const SortableHeader = ({ label, field, sortBy, sortOrder, onSort }) => {
  const isActive = sortBy === field;
  return (
    <th onClick={() => onSort(field)}>
      <span className="flex items-center gap-1">
        {label}
        <span className="text-xs">
          {isActive ? (sortOrder === 'ASC' ? '▲' : '▼') : '↕'}
        </span>
      </span>
    </th>
  );
};

export default SortableHeader;
