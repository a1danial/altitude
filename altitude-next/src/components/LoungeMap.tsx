'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Lounge } from '@/lib/data';

const SOURCE_ID = 'lounges';
const LAYER_CLUSTER = 'layer-clusters';
const LAYER_CLUSTER_COUNT = 'layer-cluster-count';
const LAYER_SINGLE = 'layer-single';
const LAYER_SINGLE_LABEL = 'layer-single-label';

const WORLD_CENTER: [number, number] = [20, 15];
const WORLD_ZOOM = 1.2;
const FIT_PADDING = { top: 60, bottom: 60, left: 80, right: 80 };

type LoungeCollection = GeoJSON.FeatureCollection<GeoJSON.Point>;

function buildGeoJSON(lounges: Lounge[]): LoungeCollection {
  return {
    type: 'FeatureCollection',
    features: lounges.map(l => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [l.lon as number, l.lat as number] },
      properties: { id: l.id, code: l.code, name: l.name, term: l.term },
    })),
  };
}

/* The dark-v11 basemap carries far more detail than this design wants. Flatten it
   down to landmass, water and country borders so the gold markers stay dominant. */
function stripBasemap(map: mapboxgl.Map) {
  const layers = map.getStyle()?.layers;
  if (!layers) return;

  for (const layer of layers) {
    if ('source' in layer && layer.source === SOURCE_ID) continue;

    if (layer.id === 'background') {
      map.setPaintProperty(layer.id, 'background-color', '#0c0b0f');
    }

    if (layer.type === 'fill') {
      const isWater = layer.id.includes('water') || layer['source-layer'] === 'water';
      map.setPaintProperty(layer.id, 'fill-color', isWater ? '#09080d' : '#161410');
      map.setPaintProperty(layer.id, 'fill-opacity', 1);
    }

    if (layer.type === 'line') {
      const isAdmin = /admin|border|boundary/.test(layer.id);
      if (isAdmin) {
        map.setPaintProperty(layer.id, 'line-color', 'rgba(255,255,255,0.18)');
        map.setPaintProperty(layer.id, 'line-width', 0.5);
        map.setPaintProperty(layer.id, 'line-opacity', 0.7);
      } else {
        map.setLayoutProperty(layer.id, 'visibility', 'none');
      }
    }

    if (layer.type === 'symbol') {
      map.setLayoutProperty(layer.id, 'visibility', 'none');
    }
  }
}

function popupContent(props: Record<string, unknown>): HTMLElement {
  const el = document.createElement('div');
  const code = document.createElement('div');
  code.className = 'popup-code';
  code.textContent = String(props.code ?? '');
  const name = document.createElement('div');
  name.className = 'popup-name';
  name.textContent = String(props.name ?? '');
  const term = document.createElement('div');
  term.className = 'popup-term';
  term.textContent = String(props.term ?? '');
  el.append(code, name, term);
  return el;
}

function addLayers(map: mapboxgl.Map, data: LoungeCollection) {
  map.addSource(SOURCE_ID, {
    type: 'geojson',
    data,
    cluster: true,
    clusterMaxZoom: 9,
    clusterRadius: 60,
  });

  map.addLayer({
    id: LAYER_CLUSTER,
    type: 'circle',
    source: SOURCE_ID,
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': '#c9a96a',
      'circle-radius': ['step', ['get', 'point_count'], 18, 5, 22, 10, 26],
      'circle-opacity': 1,
      'circle-stroke-width': 3,
      'circle-stroke-color': 'rgba(232,210,160,0.4)',
    },
  });

  map.addLayer({
    id: LAYER_CLUSTER_COUNT,
    type: 'symbol',
    source: SOURCE_ID,
    filter: ['has', 'point_count'],
    layout: {
      'text-field': ['concat', ['get', 'point_count_abbreviated'], '+'],
      'text-font': ['DIN Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 13,
      'text-allow-overlap': true,
    },
    paint: { 'text-color': '#1a1408' },
  });

  map.addLayer({
    id: LAYER_SINGLE,
    type: 'circle',
    source: SOURCE_ID,
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': '#e8d2a0',
      'circle-radius': 14,
      'circle-opacity': 1,
      'circle-stroke-width': 3,
      'circle-stroke-color': 'rgba(232,210,160,0.35)',
    },
  });

  map.addLayer({
    id: LAYER_SINGLE_LABEL,
    type: 'symbol',
    source: SOURCE_ID,
    filter: ['!', ['has', 'point_count']],
    layout: {
      'text-field': ['get', 'code'],
      'text-font': ['DIN Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 10,
      'text-allow-overlap': true,
      'text-ignore-placement': true,
    },
    paint: { 'text-color': '#1a1408' },
  });

  map.on('click', LAYER_CLUSTER, e => {
    const feature = e.features?.[0];
    if (!feature || feature.geometry.type !== 'Point') return;
    const clusterId = feature.properties?.cluster_id as number;
    const source = map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource;
    const center = feature.geometry.coordinates as [number, number];
    source.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err || zoom == null) return;
      map.easeTo({ center, zoom: zoom + 0.5, duration: 600 });
    });
  });

  map.on('click', LAYER_SINGLE, e => {
    const feature = e.features?.[0];
    if (!feature || feature.geometry.type !== 'Point') return;
    new mapboxgl.Popup({ offset: 18, closeButton: true, maxWidth: '240px' })
      .setLngLat(feature.geometry.coordinates as [number, number])
      .setDOMContent(popupContent(feature.properties ?? {}))
      .addTo(map);
  });

  for (const layer of [LAYER_CLUSTER, LAYER_SINGLE]) {
    map.on('mouseenter', layer, () => { map.getCanvas().style.cursor = 'pointer'; });
    map.on('mouseleave', layer, () => { map.getCanvas().style.cursor = ''; });
  }
}

interface Props {
  lounges: Lounge[];
  /* false → pull back to the whole-world view instead of fitting to `lounges` */
  fit: boolean;
}

export function LoungeMap({ lounges, fit }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [ready, setReady] = useState(false);

  const data = useMemo(() => buildGeoJSON(lounges), [lounges]);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!containerRef.current || !token) return;
    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: WORLD_CENTER,
      zoom: WORLD_ZOOM,
      projection: 'mercator',
      attributionControl: false,
    });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');

    map.on('style.load', () => {
      stripBasemap(map);
      setReady(true);
    });

    return () => {
      setReady(false);
      mapRef.current = null;
      map.remove();
    };
  }, [token]);

  /* Card filter changed: swap the source data, then re-frame the viewport.
     Also runs on the first paint after style.load, which is where layers get added. */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    const source = map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource | undefined;
    if (source) source.setData(data);
    else addLayers(map, data);

    if (!fit || lounges.length === 0) {
      map.flyTo({ center: WORLD_CENTER, zoom: WORLD_ZOOM, duration: 1200, essential: true });
      return;
    }

    if (lounges.length === 1) {
      map.flyTo({
        center: [lounges[0].lon as number, lounges[0].lat as number],
        zoom: 5,
        duration: 1200,
        essential: true,
      });
      return;
    }

    const bounds = new mapboxgl.LngLatBounds();
    for (const l of lounges) bounds.extend([l.lon as number, l.lat as number]);
    map.fitBounds(bounds, { padding: FIT_PADDING, duration: 1200, essential: true });
  }, [data, lounges, fit, ready]);

  if (!token) {
    return (
      <div className="map-wrap map-wrap-empty">
        <p>Map unavailable — set <code>NEXT_PUBLIC_MAPBOX_TOKEN</code> to enable it.</p>
      </div>
    );
  }

  return (
    <div className="map-wrap">
      <div id="map" ref={containerRef} />
    </div>
  );
}
