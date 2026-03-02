import { useEffect, useRef, useState } from 'react';

const useIntersectionObserver = (callback, dependencies = []) => {
    const observer = useRef(null);
    const [isIntersecting, setIsIntersecting] = useState(false);

    // The ref that we will attach to the target element (usually an empty div at the bottom of a list)
    const targetRef = useRef(null);

    useEffect(() => {
        // If an old observer exists, disconnect it
        if (observer.current) observer.current.disconnect();

        // Create the intersection observer
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setIsIntersecting(true);
                callback();
            } else {
                setIsIntersecting(false);
            }
        });

        // Observe the target element
        if (targetRef.current) {
            observer.current.observe(targetRef.current);
        }

        // Cleanup on unmount
        const currentRef = targetRef.current;
        return () => {
            if (currentRef) {
                observer.current.unobserve(currentRef);
            }
        };
        // We spread the user's dependencies so the effect re-runs if things like isLoading change
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callback, ...dependencies]);

    return { targetRef, isIntersecting };
};

export default useIntersectionObserver;
