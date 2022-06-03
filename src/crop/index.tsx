import ReactCrop, {Crop} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import "./index.css"
import {useEffect, useState,useMemo} from "react";
import {Area, ImageMap} from '@qiuz/react-image-map';
import { Button, message } from 'antd';

const CROP: Crop = {
    unit: '%',
    x: 0,
    y: 20,
    height: 12,
    width: 33
};
// @ts-ignore
export default function CropDemo({imgUrl}) {
    const [img, setImg] = useState<string>(imgUrl);
    const [crop, setCrop] = useState<Crop>(CROP)
    const [mapArea, setMapArea] = useState<Area[]>([]);
    useEffect(() => {
        const cropBoxEle: HTMLElement | null = document.querySelector('.ReactCrop');
        const handle = (e: any) => {
            const cropEle: HTMLElement | null = document.querySelector('.ReactCrop__crop-selection');
            if (e.target === cropEle) {
                addSubArea('add')();
            }
        };
        if (cropBoxEle) {
            cropBoxEle.addEventListener('dblclick', handle);
            return () => cropBoxEle.removeEventListener('dblclick', handle);
        }
    })

    const onCropChange = (crop: any, percentCrop: any) => {
        setCrop(percentCrop);
    };
    const addSubArea =
        (type: string, index: number = 0) =>
            () => {
                let newArea = {},
                    mapAreaNew: any;
                if (type === 'add') {
                    const {x, y, width, height} = crop;
                    newArea = {
                        width: `${width}%`,
                        height: `${height}%`,
                        left: `${x}%`,
                        top: `${y}%`
                    };
                    mapAreaNew = [...mapArea, newArea];
                } else {
                    mapArea.splice(index, 1);
                    mapAreaNew = [...mapArea];
                }
                setMapArea(mapAreaNew);
                // setMapAreaString(JSON.stringify(mapAreaNew));
                // setMapAreaFormatString(JSON.stringify(mapAreaNew, null, 4));
            };

    const onMapClick = (area: Area, index: number) => {
        const tip = `click map ${index + 1}`;
        console.log(tip, area);
    };
    const ImageMapComponent = useMemo(
        () => (
            <ImageMap
                className="usage-map"
                src={img}
                onMouseDown={() => message.info('onMouseDown')}
                map={mapArea}
                alt="React Image Map"
                onMapClick={onMapClick}
            />
        ),
        [mapArea, img]
    );
    return (

        <div className="images-map-content">
            <div className="crop-box">
                <div className="map-box">
                    <div className="map-box-img">
                        <ReactCrop crop={crop} ruleOfThirds onChange={onCropChange}>
                            <img src={img}/>
                        </ReactCrop>
                    </div>
                    <div className="map-box-img">{ImageMapComponent}</div>
                </div>
            </div>
        </div>
    )
}