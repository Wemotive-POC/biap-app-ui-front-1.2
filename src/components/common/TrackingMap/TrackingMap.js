import React, { useCallback, useEffect, useState } from "react";
import ScriptTag from "react-script-tag";
import axios from "axios";

const TrackingMap = (props) => {
  const {
    center = [28.62, 77.09],
    zoom = 15,
    zoomControl = true,
    search = true,
    hybrid = false,
    location,
    setLocation,
  } = props;
  const [apiKey, setApiKey] = useState();
  const [map, setMap] = useState();
  const [mapInitialised, setMapInitialised] = useState(false);
  const [script1Loaded, setScript1Loaded] = useState(false);
  const [script2Loaded, setScript2Loaded] = useState(false);

  var add,
    direction_plugin,
    c = 0,
    ll = [
      { lat: 28.63124010064198, lng: 77.46734619140625 },
      { lat: 28.63395214251842, lng: 77.4635696411133 },
      { lat: 28.634253476178397, lng: 77.45704650878908 },
      { lat: 28.634856140902432, lng: 77.44880676269533 },
      { lat: 28.635760131498788, lng: 77.44228363037111 },
      { lat: 28.637266765186347, lng: 77.43679046630861 },
      { lat: 28.637869412604015, lng: 77.43232727050783 },
      { lat: 28.639677334088308, lng: 77.42855072021486 },
      { lat: 28.640279967660007, lng: 77.42305755615236 },
      { lat: 28.640882597770116, lng: 77.41928100585939 },
      { lat: 28.640882597770116, lng: 77.41516113281251 },
      { lat: 28.640581283147768, lng: 77.40932464599611 },
      { lat: 28.63756808932784, lng: 77.40108489990236 },
      { lat: 28.635760131498788, lng: 77.39421844482423 },
      { lat: 28.634253476178397, lng: 77.38735198974611 },
      { lat: 28.631541442089226, lng: 77.37808227539064 },
    ];

  const ref = useCallback((node) => {
    if (!mapInitialised && node != null) {
      // eslint-disable-next-line
      const map = new mappls.Map(node, {
        center,
        zoom,
        zoomControl,
        search,
      });
      setMap(map);
      setMapInitialised(true);
    }
  }, []);

  function initMap1() {
    // eslint-disable-next-line
    map = new mappls.Map("map", {
      center: [28.09, 78.3],
      zoom: 5,
    });
    map.addListener("load", function () {
      /*direction plugin initialization*/
      var direction_option = {
        map: map,
        divWidth: "350px",
        start: { label: "start", geoposition: "28.63124010064198,77.46734619140625" },
        end: { label: "end", geoposition: "28.631541442089226,77.37808227539064" },
        steps: false,
        search: true,
        isDraggable: false,
        alternatives: false,
        callback: function (data) {},
      };

      // eslint-disable-next-line
      direction_plugin = mappls.direction(direction_option);
      add = setInterval(() => {
        c++;
        if (ll[c]) {
          direction_plugin.tracking({
            location: ll[c],
            label: "current location",
            icon: "../img/mkr_start.png",
            heading: false,
            reRoute: true,
            fitBounds: false,
            animationSpeed: 5,
            delay: 2000,
          });
          if (ll[c].lat === 28.631541442089226) {
            clearInterval(add);
            setTimeout(() => {
              alert("reached.");
            }, 500);
          }
        }
      }, 2000);
    });
  }

  useEffect(() => {
    axios.post("https://ref-seller-app-preprod.ondc.org/api/v1/auth/mmi/token").then((res) => {
      setApiKey(res.data.access_token);
    });
  }, []);

  useEffect(() => {
    if (!mapInitialised) return;
    const options = {
      // map,
      // callback: () => {},
      // search: true,
      // closeBtn: false,
      // topText: " ",
      // geolocation: true,
    };
    //  options.location = location?.lat && location?.lng ? location : { lat: 28.679079, lng: 77.06971 };
    // eslint-disable-next-line
    //  new mappls.placePicker(options);
  }, [mapInitialised, props]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ScriptTag
        isHydrating={true}
        type="text/javascript"
        src={`https://apis.mappls.com/advancedmaps/api/${apiKey}/map_sdk?layer=vector&v=3.0&callback=initMap1`}
        onLoad={() => setScript1Loaded(true)}
      />
      <ScriptTag
        isHydrating={true}
        type="text/javascript"
        src={`https://apis.mappls.com/advancedmaps/api/${apiKey}/map_sdk_plugins?v=3.0`}
        onLoad={() => setScript2Loaded(true)}
      />
      {script1Loaded && script2Loaded && <div id="map" ref={ref} />}
    </div>
  );
};

export default TrackingMap;
