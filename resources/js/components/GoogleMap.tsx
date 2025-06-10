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
        // Validate coordinates first
        if (isNaN(latitude)) {
            console.error('Invalid latitude:', latitude);
            return;
        }
        if (isNaN(longitude)) {
            console.error('Invalid longitude:', longitude);
            return;
        }

        const initMap = () => {
            if (!mapRef.current) return;

            const location = {
                lat: Number(latitude),
                lng: Number(longitude)
            };

            try {
                const map = new window.google.maps.Map(mapRef.current, {
                    zoom: zoom,
                    center: location,
                    mapTypeControl: true,
                    streetViewControl: true,
                    fullscreenControl: true,
                });

                new window.google.maps.Marker({
                    position: location,
                    map,
                    animation: window.google.maps.Animation.DROP,
                });
            } catch (error) {
                console.error('Error initializing map:', error);
            }
        };

        if (window.google?.maps) {
            initMap();
            return;
        }

        window.initMap = initMap;

        if (!scriptLoadedRef.current && !document.querySelector('script#google-maps-script')) {
            const script = document.createElement('script');
            script.id = 'google-maps-script';
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
            script.async = true;
            script.defer = true;
            script.onerror = () => {
                console.error('Failed to load Google Maps script');
            };
            document.head.appendChild(script);
            scriptLoadedRef.current = true;
        }

        return () => {
            // Cleanup
            if (window.initMap === initMap) {
                window.initMap = () => {};
            }
        };
    }, [latitude, longitude, apiKey, zoom]);

    return (
        <div
            ref={mapRef}
            className="w-full rounded overflow-hidden border border-neutral-200"
            style={{ height }}
        />
    );
}
