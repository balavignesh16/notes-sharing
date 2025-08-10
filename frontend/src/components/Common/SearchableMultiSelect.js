import React, { useState, useMemo, useRef, useEffect } from 'react';

const inputClass = "appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm";

export default function SearchableMultiSelect({ options, selected, onChange, placeholder }) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const filteredOptions = useMemo(() => {
        const selectedSet = new Set(selected);
        return options.filter(option => 
            !selectedSet.has(option) && (
                option.toLowerCase().includes(query.toLowerCase())
            )
        ).slice(0, 50); // Limit results for performance
    }, [query, options, selected]);

    const handleSelect = (option) => {
        onChange([...selected, option]);
        setQuery('');
        setIsOpen(false);
    };

    const handleDeselect = (optionToRemove) => {
        onChange(selected.filter(option => option !== optionToRemove));
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div className={`${inputClass} flex flex-wrap items-center gap-2 p-1`}>
                {selected.map(option => (
                    <span key={option} className="flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 text-sm font-medium px-2 py-0.5 rounded-full">
                        {option.split(' - ')[1] || option}
                        <button type="button" onClick={() => handleDeselect(option)} className="text-indigo-500 hover:text-indigo-700">
                            &times;
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder || "Search to add..."}
                    className="flex-grow bg-transparent outline-none border-none p-1"
                />
            </div>
            {isOpen && filteredOptions.length > 0 && (
                <ul className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredOptions.map(option => (
                        <li
                            key={option}
                            onClick={() => handleSelect(option)}
                            className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 cursor-pointer"
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

