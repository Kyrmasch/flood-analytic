import { FeatureCollection, Point } from "geojson";

export const convertPointsToPolygons = (geojson: FeatureCollection<Point>) => {
  return {
    ...geojson,
    features: geojson.features.map((feature: any) => {
      const [lng, lat] = feature.geometry.coordinates;
      const size = 0.0001; // Размер полигона
      return {
        ...feature,
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [lng - size, lat - size],
              [lng + size, lat - size],
              [lng + size, lat + size],
              [lng - size, lat + size],
              [lng - size, lat - size],
            ],
          ],
        },
      };
    }),
  };
};

export const convertPointsToCircles = (
  geojson: FeatureCollection<Point>,
  radius = 0.00003, // Радиус в градусах
  points = 64 // Количество точек для аппроксимации круга
) => {
  return {
    type: "FeatureCollection",
    features: geojson.features.map((feature) => {
      const [lng, lat] = feature.geometry.coordinates; // Центр точки
      const coordinates = [];

      for (let i = 0; i < points; i++) {
        const angle = (i / points) * 2 * Math.PI; // Угол в радианах
        const dx = (radius * Math.cos(angle)) / Math.cos((lat * Math.PI) / 180); // Корректируем долготу
        const dy = radius * Math.sin(angle); // Широта без изменений
        coordinates.push([lng + dx, lat + dy]);
      }

      // Замыкаем полигон
      coordinates.push(coordinates[0]);

      return {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [coordinates],
        },
        properties: {
          height: 80, // Высота цилиндра
        },
      };
    }),
  } as FeatureCollection;
};
