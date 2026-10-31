import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Offer, City } from '../../types';
import 'leaflet/dist/leaflet.css';

const defaultIcon = L.icon({
  iconUrl: '/img/pin.svg',
  iconSize: [27, 39],
  iconAnchor: [13.5, 39],
});

const activeIcon = L.icon({
  iconUrl: '/img/pin-active.svg',
  iconSize: [27, 39],
  iconAnchor: [13.5, 39],
});

type MapProps = {
  offers: Offer[];
  city: City;
  selectedOfferId: string | null;
  className?: string;
};

function Map({ offers, city, selectedOfferId, className = 'cities__map' }: MapProps): JSX.Element {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    if (mapRef.current !== null && mapInstanceRef.current === null) {
      mapRef.current.innerHTML = '';

      const map = L.map(mapRef.current, {
        center: [city.location.latitude, city.location.longitude],
        zoom: city.location.zoom,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = {};
      }
    };
  }, [city]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) {
      return;
    }

    offers.forEach((offer) => {
      if (!markersRef.current[offer.id]) {
        const marker = L.marker(
          [offer.location.latitude, offer.location.longitude],
          { icon: defaultIcon }
        ).addTo(map);

        markersRef.current[offer.id] = marker;
      }
    });
  }, [offers]);

  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      if (id === selectedOfferId) {
        marker.setIcon(activeIcon);
        marker.setZIndexOffset(1000);
      } else {
        marker.setIcon(defaultIcon);
        marker.setZIndexOffset(0);
      }
    });
  }, [selectedOfferId]);

  return <div className={`map ${className}`} ref={mapRef} style={{ height: '100%' }} />;
}

export default Map;
