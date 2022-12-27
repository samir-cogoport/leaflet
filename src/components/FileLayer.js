import { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import togeojson from "togeojson";
import fileLayer from "leaflet-filelayer";
import shipIcon from '../data/ic-ship.svg';


fileLayer(null, L, togeojson);
const shippingPathIcon = new L.Icon({
    iconUrl: shipIcon,
    iconSize: [32, 32], 
    iconAnchor: [16, 34], 
  });
const style = {
  color: "red",
  opacity: 1.0,
  fillOpacity: 1.0,
  weight: 2,
  clickable: false
};

export default function FileLayer() {
  const map = useMap();

  useEffect(() => {
    const control = L.Control.fileLayerLoad({
      fitBounds: true,
      position:'bottomright',
      layerOptions: {
        style: style,
        pointToLayer: function (data, latlng) {
          return L.circleMarker(latlng, { style: style,icon:shippingPathIcon  });
        }
      }
    });
    control.addTo(map);
  }, [map]);

  return null;
}
