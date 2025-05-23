import { useState, useEffect } from 'react';

const MOBILE_WIDTH_THRESHOLD = 768;

export const useIsMobile = (): boolean => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkDeviceSize = () => {
            setIsMobile(window.innerWidth < MOBILE_WIDTH_THRESHOLD);
        };

        checkDeviceSize(); // Check on initial mount

        window.addEventListener('resize', checkDeviceSize);

        return () => {
            window.removeEventListener('resize', checkDeviceSize);
        };
    }, []);

    return isMobile;
}; 