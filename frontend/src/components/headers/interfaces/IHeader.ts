import { MapSectionEnum } from "../../../domain/contexts/enums/MapSectionEnum";

export interface IHeader {
  OnSelect: (x: MapSectionEnum | string) => void;
}
