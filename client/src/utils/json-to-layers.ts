import { Group, Tile as TileLayer } from "ol/layer";
import BaseLayer from "ol/layer/Base";
import { TileWMS } from "ol/source";
import { ImageTile, Tile } from "ol";
import { e } from "@/components/utils/crypto";
import { fetchGis } from "./fetcher";

export interface Layer {
  id: string;
  type: "layer";
  label: string;
  url: string;
  paramLayers: string;
  styles?: string;
  cql?: string;
  visible: boolean;
  maxResolution?: number;
  zIndex?: number;
}
export interface LayerGroup {
  id: string;
  type: "group";
  label: string;
  children: LayerUnit[];
}
export type LayerUnit = Layer | LayerGroup;

const BISAG_WMS_URLS = [
  "wms24",
  "ows61",
  "wms61",
  "wms62",
  "wms71",
  "wms144",
  "wms109",
  "wms190",
];

export const makeOlObject = (obj: LayerUnit): BaseLayer => {
  if (obj.type === "layer") {
    const sourceUrl = BISAG_WMS_URLS.some((it) => it === obj.url)
      ? process.env.NEXT_PUBLIC_GEOSERVER_URL + obj.url
      : obj.url;
    return new TileLayer({
      source: new TileWMS({
        crossOrigin: "anonymous",
        url: sourceUrl,
        // url: "http://localhost:8585/gis/localwms",
        tileLoadFunction: tileLoader,
        params: {
          // format_options: "dpi:180",
          // version: "1.3.0",
          TILED: true,
          LAYERS: obj.paramLayers,
          STYLES: obj.styles || "",
          CQL_FILTER: obj.cql,
        },
      }),
      properties: { id: obj.id, name: obj.label },
      visible: obj.visible,
      zIndex: obj.zIndex,
      maxResolution: obj.maxResolution,
    });
  }
  const children = obj.children.map(makeOlObject);
  const group = new Group({
    properties: { id: obj.id, name: obj.label },
    layers: children,
  });
  return group;
};

export const tileLoader = async (imageTile: Tile, src: string) => {
  if (imageTile instanceof ImageTile) {
    const res = await fetchGis(await eQuery(src));
    if (res.status !== 200) {
      return;
    }
    const blob = await res.blob();
    const imageElement = imageTile.getImage();
    if (imageElement instanceof HTMLImageElement) {
      const imageUrl = URL.createObjectURL(blob);
      imageElement.onload = () => {
        URL.revokeObjectURL(imageUrl);
      };
      imageElement.src = imageUrl;
    }
  }
};

export const isBisagWmsUrl = (url: string) =>
  BISAG_WMS_URLS.some((it) => url.includes(it));

export const eQuery = async (url: string) => {
  if (!isBisagWmsUrl(url)) {
    return url;
  }
  const uri = new URL(url);
  const baseUrl = uri.origin + uri.pathname;
  const queryString = uri.search.substring(1);
  return `${baseUrl}?data=${encodeURIComponent(await e(queryString))}`;
};
