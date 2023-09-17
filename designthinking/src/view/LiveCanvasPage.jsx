import { useState, useEffect, useRef } from 'react';

export const LiveCanvasPage = () => {
    const [fluid, setFluid] = useState(window.location.hash);
    const iframeRef = useRef(null);
    useEffect(() => {
        const handleHashChange = () => {
            setFluid(window.location.hash);
            if (iframeRef.current) {
                iframeRef.current.contentWindow?.location.reload();
            }
        };

      
        window.addEventListener('hashchange', handleHashChange);

       
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);  

    return (
        <>
            <iframe 
                ref={iframeRef}
                id="canvas_iframe" 
                className="canvas-content" 
                border="0"
                src={`${window.location.protocol}//${window.location.host}/share/index.html${fluid}`}
                // src="http://localhost:3000"
            />
        </>
    );
};
