import React, { useEffect, useMemo } from 'react';
import { useLeafletContext } from '@react-leaflet/core';
import L from 'leaflet';

// @ts-ignore
const CustomTileLayer = ({ url }) => {
  const context = useLeafletContext();

  const CustomTileLayerClass = useMemo(() => L.TileLayer.extend({
    createTile: function (coords: any, done: (arg0: Error, arg1: HTMLImageElement) => void) {
      const tile = L.DomUtil.create('img', 'leaflet-tile');
      const tileUrl = this.getTileUrl(coords);
  
  
      tile.onload = () => {
        // @ts-ignore
        done(null, tile);
      };
      tile.onerror = () => {
        // @ts-ignore
        done(new Error('Tile loading failed'));
      };

      fetch(tileUrl, {
        method: 'GET',
        headers: { 'Accept-Encoding': 'gzip' }, 
        // headers: { 'service_name': 'track' },
      })
      .then(response => response.blob())
      .then(blob => {
        tile.src = URL.createObjectURL(blob);
      })
      .catch(error => console.error('Fetch error:', error)); // Error handling for fetch

      return tile;
    }
  }), []);

  useEffect(() => {
    // @ts-ignore
    const layer = new CustomTileLayerClass(url);
    const container = context.layerContainer || context.map;
    container.addLayer(layer);

    return () => {
      container.removeLayer(layer);
    };
  }, [url, context, CustomTileLayerClass]);

  return null;
};

export default CustomTileLayer;
