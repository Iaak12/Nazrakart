import React from 'react';

const DynamicHeading = ({ tag: Tag = 'h1', children, className = "", ...props }) => {
    // Ensure we only use valid tags to avoid rendering issues
    const validTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div'];
    const FinalTag = validTags.includes(Tag?.toLowerCase()) ? Tag : 'h1';

    return (
        <FinalTag className={className} {...props}>
            {children}
        </FinalTag>
    );
};

export default DynamicHeading;
