import {React, useState,useEffect} from 'react';
import { MapContainer, TileLayer ,LayersControl,ScaleControl,ZoomControl,GeoJSON,Polyline, CircleMarker, Marker} from 'react-leaflet';
import ReactDOMServer from "react-dom/server";
import 'maplibre-gl';
import '@maplibre/maplibre-gl-leaflet/leaflet-maplibre-gl';
import LocationButton from '../LocationButton';
import cPortJsonData from '../../data/World_Port_Index+(1)+(1).geojson.json';
// import postalCode from '../../data/geonames-postal-code.geojson.json'
import airPortJsonData from '../../data/features.json'
import countriesJson from '../../data/custom.geo (5).json';
// import polyGons from '../../data/abc.json'
// import railsPoints from '../../data/expors (1).geojson.json'
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'react-leaflet-markercluster/dist/styles.min.css';
// import countries from '../../data/countries.geojson.json'
import L from 'leaflet';
// import RoutingMachine from '../RoutingMachine';
// import routes from '../../data/fin_sea.json';
import routes from '../../data/uniqueRoutes.json'
// import 'Leaflet.TileLayer.MBTiles'
import './styles.css';
import shipIcon from '../../data/ic-ship.svg';
import truckIcon from '../../data/ic-truck.svg';
import air from '../../data/ic-air.svg';
import "leaflet.motion/dist/leaflet.motion.js";
import demoRoute from '../../data/demoRoute.json'
import Fullscreen from 'react-leaflet-fullscreen-plugin';
import "leaflet.animatedmarker/src/AnimatedMarker";
import {lineString, bezierSpline} from '@turf/turf';
const {overlay,tileLayer,markerOptions} = require('../../util/assets')
const center = [22.366904, 77.534981];
// const shortPath =
// [[1.85, -78.81666666670003],
// [-1.001694, -91.060472],
// [-16.691278, -179.84419400000002],
// [-16.765444, 179.935],
// [-16.8166666667, 179.3]]

// for(let i=1;i<shortPath.length;i++) {
//     if(shortPath[i][1] - shortPath[i-1][1] >= 200) {
//         shortPath[i][1] -= 360;
//     }
// }

const customPath = [[18.740849187479427,72.5889015197754],[18.532504133541487,71.9736671447754],[17.57087992254944,69.9521827697754],[17.403109542186247,68.4140968322754],[16.772608630130165,65.5576515197754],[15.717146051649944,61.8222999572754],[14.996269657813299,59.1855812072754],[14.61363550586799,54.9668312072754],[13.675530329736626,51.6269874572754],[12.69077599238401,48.4629249572754],[12.046466172387982,45.7822608947754],[12.304380456022919,44.2002296447754],[12.73367296681467,43.40921401977539],[14.400771563795455,41.7832374572754],[17.57087992254944,40.4209327697754],[18.990524166984617,39.45413589477539],[21.05622032051235,38.8828468322754],[21.238547899443454,38.97949218750001]];
const shippingPathIcon = new L.Icon({
    iconUrl: shipIcon,
    iconSize: [32, 32], 
    iconAnchor: [16, 34], 
  });
const roadPathIcon = new L.Icon({
    iconUrl: truckIcon,
    iconSize: [32, 32], 
    iconAnchor: [16, 26], 
  });
  const airIcon = new L.Icon({
    iconUrl: air,
    iconSize: [32, 32], 
    iconAnchor: [16, 34], 
  });

const roadFrom = L.motion.polyline(demoRoute.roadFrom.path, {
    color: "#1eb041",weight:2,dashArray: '1,3'
}, {
    auto: true,
    duration: 5000,
    easing: L.Motion.Ease.easeInOutQuart
}, {
    removeOnEnd: true,
    icon: roadPathIcon,
});
const shippingPath = L.motion.polyline(demoRoute.mainRoute.path, {
    color: "#0ABBF5",weight:2,
    }, {
        duration: 12000,
        easing: L.Motion.Ease.easeInOutQuart
    }, {
        removeOnEnd: true,
        icon: shippingPathIcon,
    });
const roadTo = L.motion.polyline(demoRoute.roadTo.path, {
    color: "#1eb041",weight:2,dashArray: '2,4'
}, {
    duration: 5000,
    easing: L.Motion.Ease.easeInOutQuart
}, {
    removeOnEnd: true,
    icon: roadPathIcon,
});
const airPath = L.motion.polyline(demoRoute.air.path, {
    color: "purple",weight:2,
}, {
    duration: 10000,
    easing: L.Motion.Ease.easeInOutQuart
}, {
    // removeOnEnd: true,
    icon: airIcon,
});
const sqGroup = L.motion.seq([
    roadFrom, shippingPath, roadTo
]);


const Map = ({setAlertInfo,cPorts,countries,airPorts,isClustered,showPath,cRoutes,curLoc, setCurLoc,seaRouteData}) => {
    const [map, setMap] = useState(null);
    const [zoom, setZoom] = useState(5);
    console.log(curLoc, 'curloc');
    // const mb = L.tileLayer.mbTiles('../../data/countries-raster.mbtiles', {
	// 	minZoom: 0,
	// 	maxZoom: 6
	// })
    // const getPortDetails = (feature, layer) => {
    //     layer.bindPopup(ReactDOMServer.renderToString(<Button >+Add to queue</Button>)).click();
    //   }

    // const onEachPortFeature = (feature, layer) => {
    //     layer.on('click', function (e) {
    //         getPortDetails(feature, layer);
    //         this.openPopup();
    //       });
    //     //   layer.on('mouseout', function () {
    //     //     this.closePopup();
    //     //   });
    // }
    const getPolygonName = (feature, layer) => {
        layer.bindPopup(feature?.properties?.name_en);
    }
    const onEachPolygonFeature =(feature, layer)=> {
          layer.setStyle({
            // fillColor: '#eb4034',
            weight: 1,
            // color: '#eb4034',
            fillOpacity: 0,
          });
        layer.on('mouseover', function (e) {
        L.DomEvent.stopPropagation(e);
          getPolygonName(feature, layer);
          this.openPopup();
        });
    };
    const pointToLayer = (feature, latlng) => {
        const div = document.createElement("div");
        div.innerHTML = "+Add to queue";
        div.className = 'add-to-queue';
        div.onclick = () =>  {
            setCurLoc((prev) => ([...prev, {name:feature.properties.PORT_NAME,coordinates:[latlng.lat,latlng.lng]}]))
            map.closePopup();
        }
        return L.circleMarker(latlng, {
            fillColor:feature?.properties?.PORT_NAME ? '#000d37' : '#ff5722',
            color:'#f6f7f9',
            weight:1,
            radius:6,
            fillOpacity:0.95,
        }).bindPopup(div)

    }

    const handleShowPorts = (data) => {
        return <GeoJSON data={data}  pointToLayer={pointToLayer} />
    }

    // const handleClickOnMap = (e) => {
    //     setAlertInfo({text:`lat: ${e.latlng.lat}, lng: ${e.latlng.lng}`,severity:'info',duration:5000})        
    // }
    // const customPopup =new  L.Popup(ReactDOMServer.renderToString(<CustomPopup curLoc={curLoc}/>)); 
    
    const whenCreated = (map) => {
        // map.on('contextmenu',(e) => {
        //     console.log('rightclick',e);
        //     customPopup.setLatLng(e.latlng);
        //     map.openPopup(customPopup);
        // });
        map.on('zoomend',() => {
            setZoom(map.getZoom());
        })
        setMap(map);
    }
    useEffect(() => {
        if(isClustered) {
            map.flyTo(center,1);
        }
    },[isClustered,map])

    useEffect(() => {
        if(showPath && map) {
            sqGroup.addLayer(airPath, true);
            sqGroup.addTo(map);
        }
        else{
            map?.removeLayer(sqGroup);
        }
    },[showPath,map])

    // useEffect(() => {
    //     if(map) {
    //         const key = 'plLZXQlJHwYmvtwLqzhu';
    //         const gl = L.maplibreGL({
    //             attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
    //             style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${key}`
    //         });
    //         gl.addTo(map);
    //             //     mb.addTo(map);
    //             // mb.on('databaseloaded', function(ev) {
    //             //     console.info('MBTiles DB loaded', ev);
    //             // });
    //     }
    // },[map]);
   useEffect(() => {
    if(seaRouteData.length > 0 && map) {
        const curve = bezierSpline(lineString(seaRouteData.slice(-1)[0]));
        const route =curve.geometry.coordinates;
        L.polyline(route,{color:'cyan',weight:3}).addTo(map);
    }
   },[map,seaRouteData])
    console.log(zoom,'zoom');
    return (
        <MapContainer
            preferCanvas={true}
            zoomControl={false}
            whenCreated={whenCreated}
            whenReady={() => setAlertInfo({text:"Map is ready!!",severity:"success",duration:500})}
            // fullscreenControl={true}
            center={center}
            zoom={5}
            scrollWheelZoom={true}
            minZoom={1}
            maxZoom={19}
        >
            <ZoomControl position={'topright'} />
            <LayersControl position="topright">
            {tileLayer.map((layer, idx) => {
                return (
                    <LayersControl.BaseLayer
                    key={idx}
                    checked={!idx}
                    name={layer.name}
                    >
                        <TileLayer
                            attribution={layer.attribution}
                            url={layer.url}
                        />
                    </LayersControl.BaseLayer>
                )
            })}
            {overlay.map((layer,idx) => {
                return (
                    <LayersControl.Overlay key={idx} checked={!idx} name={layer.name}>
                        <TileLayer
                            attribution={layer.attribution}
                            url={layer.url}
                            minZoom={7}
                            maxZoom={layer?.maxZoom || 18}
                            opacity={0.5}
                            transparent={true}
                            zIndex={-1}
                        />
                    </LayersControl.Overlay>
                )
            })}
            </LayersControl>

           {airPorts && (isClustered ? <MarkerClusterGroup>{handleShowPorts(airPortJsonData)}</MarkerClusterGroup> :handleShowPorts(airPortJsonData)) }

           {countries && <GeoJSON data={countriesJson} onEachFeature={onEachPolygonFeature} weight={1} /> }
           {/* {(countries && data) ? (Object.values(data || {})).map((countryJson) => {
            return <GeoJSON data={countryJson} onEachFeature={onEachPolygonFeature} weight={1} />
           }) :null} */}

            <LocationButton map={map} setAlertInfo={setAlertInfo}/>
            <ScaleControl imperial={false} value={10}/>
            {/* <RoutingMachine /> */}

            {showPath && (Object.values(demoRoute) || []).map(({type,waypoints,path}) => {
                return <>
                    <Polyline pathOptions={{color:'gray',weight:6,opacity:0.5}} positions={path} />
                    {waypoints.map((latlng) => {
                        return <CircleMarker center={latlng} {...markerOptions(type)}/>;
                    })}
                </>;
            })}
            {cRoutes && routes.map(({sea}) => {
                return !sea?.path ? null : (<>
                    <Polyline pathOptions={{color:'black',weight:1,opacity:1}} positions={sea.path} />
                    <CircleMarker center={sea.path[0]} radius={3} fillColor='#000d37' color='#fffff' weight={3}/>
                    <CircleMarker center={sea.path.slice(-1)[0]} radius={3} fillColor='#000d37' weight={3}/>
                </>);
            })}
            {(zoom > 2 && curLoc && curLoc.length > 0 ) && <>
                {curLoc.map(({coordinates}) => {
                    return <CircleMarker center={coordinates} radius={7} fillColor='#000d37' color='cyan' weight={5}/>
                })}
            </>}
            {seaRouteData && seaRouteData.length > 0 && <>
                {seaRouteData.map((route) => {
                    return route && route.length > 1 ? <><Polyline pathOptions={{color:'#000d37',weight:1}} positions={route}/>
                     </>: null;
                })}
            </>
            }
            <Fullscreen />
            {(cPorts && zoom > 2) && (isClustered ? <MarkerClusterGroup>{handleShowPorts(cPortJsonData)}</MarkerClusterGroup> :handleShowPorts(cPortJsonData)) }
        </MapContainer>
    );
}

export default Map;





// console.log(getLeafletIcon(shipIcon, [32, 64], [32, 64]), 'icon');
			// const line = L.polyline(
			// 	[
			// 		[18.6851, 73.94136],
			// 		[18.68576, 73.94149],
			// 		[18.68649, 173.94165],
			// 	],
			// 	{
			// 		color  : '#02929b',
			// 		weight : 1.5,
			// 	},
			// ).addTo(map);

			// const animatedMarker = L.animatedMarker(line.getLatLngs(), {
			// 	autoStart : true,
			// 	icon      : getLeafletIcon(IcMLocation, [32, 64], [32, 64]),
			// });

			// map.addLayer(animatedMarker);