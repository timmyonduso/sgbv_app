import { useEffect, useRef } from 'react';

interface GoogleMapProps {
    latitude: number;
    longitude: number;
    apiKey: string;
    zoom?: number;
    height?: string;
}

declare global {
    interface Window {
        google: any;
        initMap: () => void;
    }
}

export default function GoogleMap({
                                      latitude,
                                      longitude,
                                      apiKey,
                                      zoom = 15,
                                      height = '400px'
                                  }: GoogleMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const scriptLoadedRef = useRef<boolean>(false);

    useEffect(() => {
        // Define initMap inside useEffect
        const initMap = () => {
            if (!mapRef.current) return;

            const location = { lat: latitude, lng: longitude };
            const map = new window.google.maps.Map(mapRef.current, {
                zoom: zoom,
                center: location,
                mapTypeControl: true,
                streetViewControl: true,
                fullscreenControl: true,
            });

            // Add a marker at the location
            new window.google.maps.Marker({
                position: location,
                map,
                animation: window.google.maps.Animation.DROP,
            });
        };

        // Initialize the map once we have coordinates
        if (latitude && longitude) {
            if (window.google?.maps) {
                initMap();
                return;
            }

            // Setup callback for when the script loads
            window.initMap = initMap;

            // Only load the script once
            if (!scriptLoadedRef.current && !document.querySelector('script#google-maps-script')) {
                const script = document.createElement('script');
                script.id = 'google-maps-script';
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
                script.async = true;
                script.defer = true;
                document.head.appendChild(script);
                scriptLoadedRef.current = true;
            }
        }
    }, [latitude, longitude, apiKey, zoom]);

    return (
        <div
            ref={mapRef}
            className="w-full rounded overflow-hidden border border-neutral-200"
            style={{ height }}
        />
    );
}
