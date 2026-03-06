import React from 'react';
// import ReactQuill from 'react-quill-new';
// import 'react-quill-new/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange, placeholder, className = "" }) => {
    return (
        <div className={`rich-text-editor ${className}`}>
            <textarea
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-tss-red transition-colors min-h-[150px]"
            />
        </div>
    );
};

export default RichTextEditor;
