import React from 'react';
import type { SortDirection } from '../../types';

interface SortIconProps extends React.SVGProps<SVGSVGElement> {
    direction?: SortDirection;
}

const SortIcon: React.FC<SortIconProps> = ({ direction, ...props }) => {
    if (direction === 'asc') {
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
                <path d="M12 4L6 10H18L12 4Z" fill="currentColor" />
            </svg>
        );
    }
    if (direction === 'desc') {
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
                <path d="M12 20L18 14H6L12 20Z" fill="currentColor" />
            </svg>
        );
    }
    // Neutral/unsorted state
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
             <path d="M12 8L18 14H6L12 8Z" fill="currentColor" className="opacity-30"/>
        </svg>
    );
};

export default SortIcon;
