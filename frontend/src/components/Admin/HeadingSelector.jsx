import React from 'react';

const HeadingSelector = ({ value, onChange, name, className = "" }) => {
    const options = [
        { value: 'h1', label: 'H1' },
        { value: 'h2', label: 'H2' },
        { value: 'h3', label: 'H3' },
        { value: 'h4', label: 'H4' },
        { value: 'h5', label: 'H5' },
        { value: 'h6', label: 'H6' },
        { value: 'p', label: 'P' },
        { value: 'span', label: 'SPAN' },
    ];

    return (
        <select
            name={name}
            value={value || 'h1'}
            onChange={onChange}
            className={`px-2 py-1 text-xs font-bold border border-gray-300 rounded bg-white focus:outline-none focus:border-tss-red transition-colors ${className}`}
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
};

export default HeadingSelector;
