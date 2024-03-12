import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  ProCard,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProList,
  QueryFilter,
} from "@ant-design/pro-components";
import { PageContainer } from "@ant-design/pro-layout";
import { Tabs } from "antd";
import { UpOutlined, DownOutlined, CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";

import "leaflet/dist/leaflet.css";
import "leaflet.fullscreen/Control.FullScreen.css";
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js';
import L from "leaflet";
import "leaflet-side-by-side";
// import MarkerClusterGroup from "react-leaflet-cluster";
import {
  MapContainer,
  FeatureGroup,
  TileLayer,
  Marker,
  Rectangle,
} from "react-leaflet";
import { FullscreenControl } from 'react-leaflet-fullscreen';
import { EditControl } from "react-leaflet-draw"
import drawLocales from 'leaflet-draw-locales'
drawLocales('ru')
// Настройка дополнительных текстов подсказок
if (L.drawLocal && L.drawLocal.edit && L.drawLocal.edit.toolbar && L.drawLocal.edit.toolbar.buttons) {
  L.drawLocal.edit.toolbar.buttons.remove = 'Удалить (Del)';
}

if (L.drawLocal && L.drawLocal.draw && L.drawLocal.draw.toolbar && L.drawLocal.draw.toolbar.buttons) {
  L.drawLocal.draw.toolbar.buttons.polyline = 'Нарисовать полилинию (L)';
  L.drawLocal.draw.toolbar.buttons.rectangle = 'Нарисовать прямоугольник (R)';
}
import './custom-leaflet-draw.css';
//@ts-ignore
import useLeafletMapTools from './useLeafletMapTools';
import CustomTileLayer from "./CustomTileLayer";
import CustomControl from "./CustomControl";
import Minimap from "./Minimap";

const TableList = () => {
  const data = [
    {
      title: "Title_1",
    },
    {
      title: "Title_2",
    },
    {
      title: "Title_3",
    },
    {
      title: "Title_4",
    },
    {
      title: "Title_5",
    },
  ];

  const [isSideBySide, setIsSideBySide] = useState(false);

  const [showFilter, setShowFilter] = useState<boolean>(true);

  const [form] = ProForm.useForm();

  const tabsItem = [
    {
      key: "main",
      label: "Основное",
      children: (
        <div >
          {showFilter ? (
            <QueryFilter split labelWidth="auto" span={30} submitter={false}>
              <ProFormSwitch
                initialValue={isSideBySide}
                // @ts-ignore
                onChange={setIsSideBySide}
                label="Сопоставление"
                name="isSideBySide"
              />
              <ProFormText label="Наименование" name="title" />
              <ProFormDateRangePicker label="Дата съемки" name="date" />
              <ProFormSelect label="Поставщики" name="suppliers" />
            </QueryFilter>
          ) : null}
          <ProList
            ghost
            grid={{ column: 1 }}
            pagination={{
              size: "small",
            }}
            dataSource={data}
            metas={{
              title: {},
            }}
          />
        </div>
      ),
    },
    {
      key: "additive",
      label: "Дополнительное",
      disabled: !isSideBySide,
      children: (
        <div>
          <ProList
            ghost
            grid={{ column: 1 }}
            pagination={{
              size: "small",
            }}
            dataSource={data}
            metas={{
              title: {},
            }}
          />
        </div>
      ),
    },
  ];

  const osmUrl =
    "https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}.png";
  const stamenUrl =
    "https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.png";

  const [osmLayer, setOsmLayer] = useState();
  const [stamenLayer, setStamenLayer] = useState();

  // const [sideBySide, setSidebySide] = useState(null);

  const [baseViewCoords, setBaseViewCoords] = useState([37.715, 44.8611]);
  const [map, setMap] = useState();

  /* SPLITTING MAPS */
  useEffect(() => {
    console.log(map);
    if (map) {
      // @ts-ignore
      L.Control.sideBySide(stamenLayer, osmLayer).addTo(map);
      setMap(map);
    }
  }, [osmLayer, stamenLayer]);

  useEffect(() => {
    console.log(map);

    if (map) {
      // @ts-ignore
      map.setView(baseViewCoords);

    // @ts-ignore
      setOsmLayer(L.tileLayer(osmUrl).addTo(map));
      // @ts-ignore
      setStamenLayer(L.tileLayer(stamenUrl).addTo(map));
    }
  }, [map, baseViewCoords]);

  const mapRef = useRef(null);
  const featureGroupRef = useRef(null);
  useLeafletMapTools(map, mapRef);

  const onCreated = (e: { layer: any; }) => {
    // Обработка созданного слоя
    const layer = e.layer;
    // Добавить слой в FeatureGroup
    // @ts-ignore
    featureGroupRef.current.addLayer(layer); 
  };

// Состояние для контроля видимости ProCard
  const [isProCardVisible, setIsProCardVisible] = useState(true); 

  // Функция для переключения видимости ProCard
  const toggleProCardVisibility = () => {
    setIsProCardVisible(!isProCardVisible);
  };

  useEffect(() => {
    if (!map) return;

    const customControl = new CustomControl({
      position: 'topright',
      // @ts-ignore
      onClick: toggleProCardVisibility,
      icon: isProCardVisible?<CaretRightOutlined /> : <CaretLeftOutlined />
    });

    customControl.addTo(map);
    // @ts-ignore
    map.invalidateSize();

    return () => {
      customControl.remove();
    };
  }, [map, isProCardVisible]);

  return (
    <PageContainer
      title={false}
      breadcrumbRender={false}
      style={{ background: "#f0f2f5", flex: "auto" }}
    >
      <ProCard style={{ position: "relative", marginTop: 16 }}>
        <ProCard
          layout="center"
          style={{ position: "relative", height: "80vh" }}
        >
          <MapContainer
            maxZoom={20}
            ref={mapRef}
            // @ts-ignore
            whenReady={(mapEvent) => {
              setMap(mapEvent.target);
              mapRef.current = mapEvent.target;
            }}
            attributionControl={false}
            // @ts-ignore
            center={baseViewCoords}
            zoom={13}
          >

            <CustomTileLayer
              url="https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}.png"
            />

            <FeatureGroup ref={featureGroupRef}>
              <EditControl
                position='topright'
                draw={{
                  rectangle: {
                    // @ts-ignore
                    tooltip: '',
                    repeatMode: true,
                  },
                }}
                onEdited={(e) => console.log(e)}
                onCreated={onCreated}
                onDeleted={(e) => console.log(e)}
                edit={{
                  featureGroup: featureGroupRef.current,
                  remove: true,
                }}
              />
             
            </FeatureGroup>
            <FullscreenControl 
            title="На весь экран" 
            titleCancel="Выйти из полноэкранного режима"
            position="topleft" />

          </MapContainer>
          <Minimap mainMap={mapRef.current} />
 
        </ProCard>
        {isProCardVisible && (
        <ProCard colSpan="35%" style={{height: "80vh", overflow: "auto" }}>
          <Tabs
            defaultActiveKey="main"
            // onChange={onTypeChange}
            className="sticky"
            tabBarExtraContent={
              <a
                style={{
                  display: "flex",
                  gap: 4,
                }}
                onClick={(e) => {
                  // e.preventDefault();
                  setShowFilter(!showFilter);
                }}
              >
                {showFilter ? (
                  <>
                    Свернуть
                    <UpOutlined />
                  </>
                ) : (
                  <>
                    Развернуть
                    <DownOutlined />
                  </>
                )}
              </a>
            }
            items={tabsItem}
          />
        </ProCard>
)}
      </ProCard>
    </PageContainer>
  );
};

export default TableList;