import React from 'react';

export interface DropdownContextProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export interface DropdownButtonProps {
    children: React.ReactNode;
    buttonId?: string;
}

export interface DropdownContentProps {
    children: React.ReactNode;
    rightAlign?: boolean;
}


export interface DropdownProps {
    children: React.ReactNode;
}