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
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type _3DType = "MAP" | "THREE";

const MeteoStantionsSection: React.FC<ISection> = (props) => {
  const { data: stantions } = useGetMeteoStantionsQuery(null, {
    refetchOnMountOrArgChange: true,
  });

  const _typeRender: _3DType = "MAP";

  const poput = new Popup({ closeOnClick: false });

  const modelAltitude = 0;
  const modelRotate = [Math.PI / 2, 0, 0];

  const addThreeJSModelsForStations = (
    map: mapboxgl.Map,
    stations: FeatureCollection<Point>
  ) => {
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();

    const directionalLight1 = new THREE.DirectionalLight(0xffffff);
    directionalLight1.position.set(0, -70, 100).normalize();
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff);
    directionalLight2.position.set(0, 70, 100).normalize();
    scene.add(directionalLight2);

    const loader = new GLTFLoader();
    const stationTransforms: { model: THREE.Object3D; transformMatrix: any }[] =
      [];
    let isModelLoaded = false;

    loader.load(
      "https://docs.mapbox.com/mapbox-gl-js/assets/34M_17/34M_17.gltf",
      (gltf) => {
        stations.features.forEach((feature) => {
          const modelOrigin = feature.geometry.coordinates as [number, number];

          const modelAsMercatorCoordinate =
            mapboxgl.MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude);

          const modelTransform = {
            translateX: modelAsMercatorCoordinate.x,
            translateY: modelAsMercatorCoordinate.y,
            translateZ: modelAsMercatorCoordinate.z,
            rotateX: modelRotate[0],
            rotateY: modelRotate[1],
            rotateZ: modelRotate[2],
            scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
          };

          const rotationX = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(1, 0, 0),
            modelTransform.rotateX
          );
          const rotationY = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(0, 1, 0),
            modelTransform.rotateY
          );
          const rotationZ = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(0, 0, 1),
            modelTransform.rotateZ
          );

          const l = new THREE.Matrix4()
            .makeTranslation(
              modelTransform.translateX,
              modelTransform.translateY,
              modelTransform.translateZ
            )
            .scale(
              new THREE.Vector3(
                modelTransform.scale,
                -modelTransform.scale,
                modelTransform.scale
              )
            )
            .multiply(rotationX)
            .multiply(rotationY)
            .multiply(rotationZ);

          const stationModel = gltf.scene.clone();
          stationModel.matrixAutoUpdate = true;
          stationModel.applyMatrix4(l);

          stationTransforms.push({
            model: stationModel,
            transformMatrix: l,
          });

          scene.add(stationModel);
        });

        isModelLoaded = true;
      }
    );

    const renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: map.painter.context.gl,
      antialias: true,
    });

    renderer.autoClear = false;

    return {
      id: "3d-models",
      type: "custom",
      renderingMode: "3d",
      onAdd: () => {
        console.log("3D model layer added.");
      },
      render: (_: WebGLRenderingContext, matrix: number[]) => {
        if (!isModelLoaded) {
          return;
        }

        const m = new THREE.Matrix4().fromArray(matrix);

        stationTransforms.forEach(({ model, transformMatrix }) => {
          const combinedMatrix = m.clone().multiply(transformMatrix);
          model.matrixWorld = combinedMatrix;
        });

        camera.projectionMatrix = m;

        renderer.resetState();
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
      if (_typeRender.toString() == "MAP") {
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
      } else if (_typeRender.toString() == "THREE") {
      }
    }
  };

  const addStyle = (_map: Map) => {
    if (_typeRender.toString() == "MAP") {
    } else if (_typeRender.toString() == "THREE") {
      const customLayer = addThreeJSModelsForStations(_map, stantions as any);
      _map.addLayer(customLayer as any, "waterway-label");
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
          addStyle={addStyle}
        />
      )}
    </>
  );
};

export default MeteoStantionsSection;
