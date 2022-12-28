import { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import togeojson from "togeojson";
import fileLayer from "leaflet-filelayer";

fileLayer(null, L, togeojson);

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
          return L.circleMarker(latlng, { style: style });
        }
      }
    });
    control.addTo(map);
    control.loader.on("data:loaded", function (e) {
      var layer = e.layer;
      console.log(layer);
    });
  }, [map]);

  return null;
}
