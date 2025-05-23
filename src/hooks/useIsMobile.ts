import { useState, useEffect } from 'react';

const getIsMobile = () => {
    if (typeof window === 'undefined') {
        return false;
    }
    return window.innerWidth < 768;
};

export const useIsMobile = (): boolean => {
    const [isMobile, setIsMobile] = useState(getIsMobile());

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(getIsMobile());
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
            handleResize();
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    return isMobile;
}; 