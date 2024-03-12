import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet-minimap';

// @ts-ignore
const Minimap = ({ mainMap }) => {
  const minimapRef = useRef(null);
  const requestRef = useRef(null);

  const animate = () => {
    if (!mainMap || !minimapRef.current) return;

    const mainMapCenter = mainMap.getCenter();
    // @ts-ignore
    const minimapCenter = minimapRef.current.getCenter();

    if (mainMapCenter && minimapCenter && !mainMapCenter.equals(minimapCenter)) {
      // @ts-ignore
      minimapRef.current.setView(mainMapCenter, mainMap.getZoom()-2);
    }

    // @ts-ignore
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (!mainMap) return;

    const minimap = new L.Map('minimap', {
      attributionControl: false,
      zoomControl: false,
      touchZoom: false,
      doubleClickZoom: false,
      scrollWheelZoom: false,
      dragging: true
    });
    // @ts-ignore
    minimapRef.current = minimap;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(minimap);
    minimap.setView(mainMap.getCenter(), mainMap.getZoom()-2);

    // @ts-ignore
    requestRef.current = requestAnimationFrame(animate);

// Обработчик перемещения миникарты
const onMinimapMove = () => {
  const center = minimap.getCenter();
  const zoom = minimap.getZoom()+2;
  mainMap.setView(center, zoom);
};

// Добавление обработчика событий на миникарту
minimap.on('drag', onMinimapMove);


// Обработчик двойного клика на миникарте
const onMinimapDblClick = (e: { latlng: any; }) => {
  const clickedLatLon = e.latlng; // Получение координат клика
  mainMap.setView(clickedLatLon, mainMap.getZoom()+2); // Перемещение основной карты
};

// Добавление обработчика событий на миникарту
minimap.on('dblclick', onMinimapDblClick);

    return () => {
      // Отписка от событий при размонтировании компонента
    minimap.off('drag', onMinimapMove);
    minimap.off('dblclick', onMinimapDblClick); 
    if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      if (minimapRef.current) {
        // @ts-ignore
        minimapRef.current.remove();
      }
    };
  }, [mainMap]);

  return (
    <div id="minimap" 
    style={{ 
      zIndex: 1000, 
      width: '25%', // Процент от ширины контейнера основной карты
      height: '20%', // Процент от высоты контейнера основной карты
      maxWidth: 200, // Максимальная ширина
      maxHeight: 200, // Максимальная высота
      position: 'absolute', 
      bottom: 10, 
      right: 10 
    }} 
    />
  );
};

export default Minimap;
