import React from "react";
import { LngLatLike, Map, Popup } from "mapbox-gl";
import "leaflet/dist/leaflet.css";
import { ISection } from "./ISection";
import MapBox from "../../../components/map/mapbox/Map";
import { useGetMeteoStantionsQuery } from "../../../domain/store/api/geo";
import { addPolygon } from "../../../components/map/mapbox/Polygon";
import { convertPointsToCircles } from "../../../components/map/utils";
import { FeatureCollection, Point } from "geojson";
import * as THREE from "three";
import mapboxgl from "mapbox-gl";

type _3DType = "MAP" | "THREE";

const MeteoStantionsSection: React.FC<ISection> = (props) => {
  const { data: stantions } = useGetMeteoStantionsQuery(null, {
    refetchOnMountOrArgChange: true,
  });

  const _typeRender: _3DType = "MAP";

  const poput = new Popup({ closeOnClick: false });

  const addThreeJSModelsForStations = (
    map: mapboxgl.Map,
    stations: FeatureCollection<Point>
  ) => {
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();

    const renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: map.painter.context.gl,
      antialias: true,
    });
    renderer.autoClear = false;

    stations.features.forEach((feature) => {
      const [lng, lat] = feature.geometry.coordinates as [number, number];
      const mercatorCoord = mapboxgl.MercatorCoordinate.fromLngLat(
        [lng, lat],
        0
      );

      const scale = mercatorCoord.meterInMercatorCoordinateUnits();

      // Создаем цилиндр для метеостанции
      const geometry = new THREE.CylinderGeometry(0.01, 0.01, 50, 32);
      const material = new THREE.MeshBasicMaterial({ color: "#007cbf" });
      const cylinder = new THREE.Mesh(geometry, material);

      // Устанавливаем позицию и масштаб
      cylinder.position.set(mercatorCoord.x, mercatorCoord.y, mercatorCoord.z);
      cylinder.scale.set(scale, scale, scale);

      scene.add(cylinder);
    });

    return {
      id: "meteo-stations-3d-layer",
      type: "custom",
      renderingMode: "3d",
      onAdd: () => {},
      render: (_: any, matrix: any) => {
        // Обновляем проекционную матрицу камеры
        camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);

        // Рендерим сцену
        renderer.state.reset();
        renderer.render(scene, camera);

        map.triggerRepaint();
      },
    };
  };

  const animateCircles = (
    _map: mapboxgl.Map,
    geojson: FeatureCollection<Point>
  ) => {
    let t = 0;
    const minHeight = 90; // Минимальная высота
    const maxHeight = 100; // Максимальная высота
    const range = maxHeight - minHeight; // Разница между максимумом и минимумом

    const animate = () => {
      t += 0.02;

      geojson.features.forEach((feature) => {
        const height = minHeight + ((Math.sin(t) + 1) / 2) * range;
        feature.properties!.height = height;
      });

      (
        _map.getSource("meteo-stations-circles") as mapboxgl.GeoJSONSource
      ).setData(geojson);

      requestAnimationFrame(animate);
    };

    animate();
  };

  const addLayer = (_map: Map) => {
    addPolygon("district", {
      map: _map!,
      geometries: [props.geo.features[0].geometry],
      options: undefined,
      properties: props.geo.features[0].properties,
    });

    if (stantions && poput) {
      _map.addSource("meteo-stations", {
        type: "geojson",
        data: stantions as GeoJSON.GeoJSON,
      });

      _map.addLayer({
        id: "meteo-stations-layer",
        type: "circle",
        source: "meteo-stations",
        paint: {
          "circle-radius": 6,
          "circle-color": "#007cbf",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      if (_typeRender == "MAP") {
        const circleStations: FeatureCollection =
          convertPointsToCircles(stantions);
        if (!_map.getSource("meteo-stations-circles")) {
          _map.addSource("meteo-stations-circles", {
            type: "geojson",
            data: circleStations as GeoJSON.GeoJSON,
          });
        }
        _map.addLayer({
          id: "meteo-stations-cylinders",
          type: "fill-extrusion",
          source: "meteo-stations-circles",
          paint: {
            "fill-extrusion-height": ["get", "height"],
            "fill-extrusion-color": "#00aaff",
            "fill-extrusion-opacity": 1,
          },
        });
        animateCircles(_map, circleStations as FeatureCollection<any>);
      } else if (_typeRender == "THREE") {
        const customLayer = addThreeJSModelsForStations(_map, stantions as any);
        _map.addLayer(customLayer as any);
      }
    }
  };

  return (
    <>
      {stantions && (
        <MapBox
          geoJson={props.geo}
          center={
            [
              props.geo.features[0].properties.x,
              props.geo.features[0].properties.y,
            ] as LngLatLike
          }
          zoom={6.8}
          addLayer={addLayer}
        />
      )}
    </>
  );
};

export default MeteoStantionsSection;
