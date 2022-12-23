const demoRoute = require('../data/demoRoute.json');
const  markerColor= {
  "sea":'rgb(12,187,245)',
  "truck":'#1eb041',
  "air":'purple',
};
module.exports = {
  tileLayer :  [
    {
      name:'cogo-map',
      url:'http://maps.dev.cogoport.io/hot/{z}/{x}/{y}.png',
      attribution:'cogoport limited'
    },
    {
      name:'stadia',
      url:'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
      attribution:''
     },
      { //style URL
        name:'maptiler',
        url:'https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=plLZXQlJHwYmvtwLqzhu',
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 1,
        attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
        crossOrigin: true
      }
    ,
  
 
{name:'bright',
url:'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png',
attribution:''},
{
  name:'satelite',
  url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  attribution:'',
  maxZoom:16,
},
{name:'voyager',url:'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',attribution:''},
    {
      name:'Basic',
      // attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
      url:'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
    },
    {
      name:'Dark basic',
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
      url:'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
  
    },
     {
      name:'No labels, positron',
      url:'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  },
    {
    name: "Osm Mapnik",
    attribution: '',
    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  },
  {
    name: "Dark",
    attribution: '',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png'
  },
  {name:'premium',
  url:'https://maptiles.p.rapidapi.com/en/map/v1/{z}/{x}/{y}.png?rapidapi-key=185229c8e1mshc895d614611193bp159780jsn771c4412b753', 
  attribution: '',
  maxZoom: 19,
  },
  {name:'stamen',attributoin:'',url:'http://{s}.sm.mapstack.stamen.com/(toner-background,$fff[difference],toner-lines[destination-in])/{z}/{x}/{y}.png'},
  {name:'blank',attribution:'',url:''}],
  overlay: [{name:'railway',attribution:'',url:''}]
  ,
  routeData : {"nhava_sheva-jabel_ali":[[18.95, 72.96666666665982],
[18.946197153725233, 72.94873435162634],
[18.928450537776325, 72.86505021480343],
[18.92464769150156, 72.84711789976996],
[19.953379687776323, 70.51729601480446],
[24.754129003725236, 59.64479388496548],
[25.782861, 57.31497200000001],
[25.8693777, 57.19359709999998],
[26.2731223, 56.627180899999985],
[26.359639, 56.50580600000001]
,
[26.15861717295958, 56.28770552353171]
,
[25.22051531343762, 55.269903300013]
,
[25.0194934863972, 55.051802823544705]],
"nhava_sheva-funchal": 
[[18.95, 72.9666666666598],
[18.92464769150156, 72.84711789976996],
[12.751222, 45.03994399999999],
[12.6745, 43.463278],
[29.927166, 32.566855000000004],
[31.232806, 32.284501000000006],
[31.531222, 31.919167000000016],
[37.089583, 11.039139000000006],
[37.349556, 9.745000000000005],
[36.925389, 3.8958609999999965]
,
[35.917111, -5.4708610000000135]
,
[35.790778, -5.934639000000004]
,
[32.6479728161362, -16.910705566406307]]
},
  demoRoute: {
    roadFrom:demoRoute.roadFrom,
  },
  markerOptions : (type) => {
    return {
        fillColor:markerColor[type],
        color:'#f6f7f9',
        weight:2,
        radius:5,
        fillOpacity:0.95,
    }
},
  getMidPoint: (latlng1,latlng2) => {
    const offsetX = latlng2[1] - latlng1[1],
	  offsetY = latlng2[0] - latlng1[0];
    const r = Math.sqrt( Math.pow(offsetX, 2) + Math.pow(offsetY, 2) ),
      theta = Math.atan2(offsetY, offsetX);

    const thetaOffset = (3.14/10);

    const r2 = (r/2)/(Math.cos(thetaOffset)),
      theta2 = theta + thetaOffset;

    const midpointX = (r2 * Math.cos(theta2)) + latlng1[1],
      midpointY = (r2 * Math.sin(theta2)) + latlng1[0];

    return [midpointY, midpointX];

  }
}
