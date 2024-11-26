import { ReactNode } from "react";
import { MapSectionEnum } from "../../../domain/contexts/enums/MapSectionEnum";

export interface IHeader {
  child?: ReactNode;
  OnSelect: (x: MapSectionEnum | string) => void;
}
