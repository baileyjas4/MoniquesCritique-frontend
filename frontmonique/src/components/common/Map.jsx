import { useEffect, useRef } from 'react';
import { renderToString } from 'react-dom/server';
import mapboxgl from 'mapbox-gl';
import { MdLocationOn, MdRestaurant, MdLocalCafe, MdLocalBar, MdFastfood } from 'react-icons/md';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function Map({ places = [], center, zoom = 12, onMarkerClick }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    // Determine initial center
    let initialCenter = center;
    if (!initialCenter && places.length > 0) {
      const firstPlace = places[0];
      initialCenter = [
        firstPlace.location?.coordinates?.lng || -84.388,
        firstPlace.location?.coordinates?.lat || 33.749
      ];
    } else if (!initialCenter) {
      initialCenter = [-84.388, 33.749]; // Default to Atlanta
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialCenter,
      zoom: zoom
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for each place
    places.forEach((place) => {
      const lng = place.location?.coordinates?.lng;
      const lat = place.location?.coordinates?.lat;

      if (!lng || !lat) return;

      // Create marker element with icon
      const el = document.createElement('div');
      el.className = 'map-marker';
      el.innerHTML = '<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>';
      el.style.cursor = 'pointer';
      el.style.color = '#e74c3c';

      // Get category icon as SVG string
      const getCategoryIcon = (category) => {
        const iconMap = {
          'restaurant': '<svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>',
          'cafe': '<svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor"><path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"/></svg>',
          'coffee_shop': '<svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor"><path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"/></svg>',
          'bar': '<svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor"><path d="M21 5V3H3v2l8 9v5H6v2h12v-2h-5v-5l8-9zM7.43 7 5.66 5h12.69l-1.78 2H7.43z"/></svg>',
          'other': '<svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor"><path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1zm15.03-7c0-8-15.03-8-15.03 0h15.03zM1.02 17h15v2h-15z"/></svg>'
        };
        return iconMap[category] || iconMap['other'];
      };

      // Get image URL
      const imageUrl = place.images?.[0] || place.photos?.[0];

      // Create popup HTML with image, name, price, and view button
      const popupHTML = `
        <div class="map-popup-card">
          <div class="map-popup-image">
            ${imageUrl 
              ? `<img src="${imageUrl}" alt="${place.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                 <div class="map-popup-icon" style="display:none;">${getCategoryIcon(place.category)}</div>`
              : `<div class="map-popup-icon">${getCategoryIcon(place.category)}</div>`
            }
          </div>
          <div class="map-popup-content">
            <h3>${place.name}</h3>
            <div class="map-popup-details">
              <span class="map-popup-category">${place.category}</span>
              ${place.priceRange ? `<span class="map-popup-price">${place.priceRange}</span>` : ''}
            </div>
            ${place.averageRating > 0 ? `
              <div class="map-popup-rating">
                <span class="rating-stars">${'★'.repeat(Math.floor(place.averageRating))}${'☆'.repeat(5 - Math.floor(place.averageRating))}</span>
                <span class="rating-value">${place.averageRating.toFixed(1)}</span>
              </div>
            ` : ''}
            <button class="map-popup-button" data-place-id="${place._id}">View Details</button>
          </div>
        </div>
      `;

      // Create popup
      const popup = new mapboxgl.Popup({ 
        offset: 25,
        maxWidth: '300px',
        className: 'map-popup-container'
      }).setHTML(popupHTML);

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current);

      // Add click handler to the button inside popup
      popup.on('open', () => {
        const button = document.querySelector(`[data-place-id="${place._id}"]`);
        if (button && onMarkerClick) {
          button.addEventListener('click', () => {
            onMarkerClick(place);
          });
        }
      });

      markers.current.push(marker);
    });

    // Fit bounds to show all markers
    if (places.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      places.forEach(place => {
        const lng = place.location?.coordinates?.lng;
        const lat = place.location?.coordinates?.lat;
        if (lng && lat) {
          bounds.extend([lng, lat]);
        }
      });
      map.current.fitBounds(bounds, { padding: 50 });
    } else if (places.length === 1) {
      const place = places[0];
      const lng = place.location?.coordinates?.lng;
      const lat = place.location?.coordinates?.lat;
      if (lng && lat) {
        map.current.setCenter([lng, lat]);
        map.current.setZoom(14);
      }
    }
  }, [places, onMarkerClick]);

  return <div ref={mapContainer} className="map-container" />;
}

export default Map;
