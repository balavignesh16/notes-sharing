import React, { useState, useMemo, useRef, useEffect } from 'react';

const inputClass = "appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm";

export default function SearchableDropdown({ options, onSelect, value }) {
    const [query, setQuery] = useState(value || '');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const filteredOptions = useMemo(() => {
        if (!query) {
            return options.slice(0, 100); // Limit initial display
        }
        return options.filter(option => 
            option.courseTitle.toLowerCase().includes(query.toLowerCase()) ||
            option.courseCode.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 100); // Limit search results
    }, [query, options]);

    const handleSelect = (option) => {
        const displayValue = `${option.courseCode} - ${option.courseTitle}`;
        setQuery(displayValue);
        onSelect(displayValue);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <input
                type="text"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    onSelect(''); // Clear selection while typing
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder="Search for a course by code or title"
                className={inputClass}
                required
            />
            {isOpen && filteredOptions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredOptions.map(option => (
                        <li
                            key={option.courseCode}
                            onClick={() => handleSelect(option)}
                            className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 cursor-pointer"
                        >
                            {option.courseCode} - {option.courseTitle}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
