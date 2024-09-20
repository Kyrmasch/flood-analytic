import { forwardRef, useImperativeHandle } from "react";
import { useGetRegionQuery } from "../../../domain/store/api/geo";
import MapPolygon from "./Polygon";
import { getRandomColor } from "../../../utils/utils";

export interface IRegion {
  index: number;
}

export interface IRegionRef {}

const Region = forwardRef<IRegionRef, IRegion>((props, ref) => {
  const color = getRandomColor();

  const { data: geo } = useGetRegionQuery(
    { index: props.index },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  useImperativeHandle(ref, () => ({}));

  return (
    <>
      {geo && (
        <MapPolygon
          geometries={[geo?.features[0].geometry]}
          properties={geo.features[0].properties}
          options={{
            fillColor: color,
            color: color,
            fillOpacity: 0.08,
            weight: 1,
            dashArray: [],
          }}
        />
      )}
    </>
  );
});

export default Region;
