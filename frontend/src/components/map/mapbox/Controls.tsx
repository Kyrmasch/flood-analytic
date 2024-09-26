import mapboxgl, { Map } from "mapbox-gl";

export interface IControls {
  map: Map | null;
  navigation: boolean;
  geolocate: boolean;
  fullscreen: boolean;
  scale: boolean;
}

export const addControls = (props: IControls) => {
  if (!props.map) return;

  if (props.navigation) {
    const nav = new mapboxgl.NavigationControl();
    props.map?.addControl(nav, "top-left");
  }

  if (props.geolocate) {
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });
    props.map?.addControl(geolocate, "top-right");
  }

  if (props.fullscreen) {
    const fullscreenControl = new mapboxgl.FullscreenControl();
    props.map?.addControl(fullscreenControl, "top-right");
  }

  if (props.scale) {
    const scale = new mapboxgl.ScaleControl({
      maxWidth: 80,
      unit: "metric",
    });
    props.map?.addControl(scale, "bottom-left");
  }
};
