import React from 'react';

export default function FullPageSpinner() {
    return (
        <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );
}
