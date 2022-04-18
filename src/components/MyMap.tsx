import React, { FC, ReactNode, useEffect, useRef, useState} from 'react'
import { useQuery } from 'react-query';
import { zoom, mapStyle } from '../settings/settings';
import {
    MapContainer,
    Marker,
    TileLayer,
    Tooltip,
  } from 'react-leaflet';
import { Icon } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';


const myIcon = new Icon({
 iconUrl: require('../assets/images/marker.png'),
 iconSize: [32,32]
});

const timeDivision = 24 * 60 * 6;

const MyMap: FC= () => {
    const { data } = useQuery<string[][]>('pointsData');
    const [ counter, setCounter ] = useState<number>(0);
    const [ latitude, setLatitude ] = useState<number>(data && data.length ? parseFloat(data[counter][5]) : 0);
    const [ longitude, setLongitude ] = useState<number>(data && data.length ? parseFloat(data[counter][4]) : 0);
    const [ pointTime, setPointTime ] = useState<number>(data && data.length ? Date.parse(data[counter][8]) : 0);
    const [ nextPointTime, setNextPointTime ] = useState<number>(data && data.length ? Date.parse(data[counter + 1][8]): 0);
    const [ markers, setMarkers ] = useState<Array<any>>([{
        latitude: latitude, 
        longitude: longitude,
        speed: data && data.length ? data[counter][3] : '', 
        timestamp: data && data.length ? data[counter][8] : ''
    }]);


    useEffect(() => {
        data && data.length > 0 && counter < data.length - 2 &&
        setTimeout(() => {
            setCounter(counter + 1); 
            const latitude = parseFloat(data[counter+1][5]);
            const longitude = parseFloat(data[counter+1][4]);
            const speed = data[counter][3];
            const timestamp = data[counter][8];
            setPointTime(Date.parse(data[counter+1][8]));
            setNextPointTime(Date.parse(data[counter+2][8]));
            setMarkers([{latitude: latitude, longitude: longitude, speed: speed, timestamp: timestamp}, ...markers]);
        }, Math.abs(+(nextPointTime) - +(pointTime)) / timeDivision);
    }, [counter]);
    
    return(
        <MapContainer center={{ lat: latitude, lng: longitude }} zoom={zoom} style={mapStyle}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerClusterGroup chunkedLoading>
                {markers.map((marker, index) => {
                    return (
                        <Marker 
                            key={index}
                            position={marker && marker.latitude && marker.longitude ? [marker?.latitude, marker?.longitude] : [0,0]}
                            icon={myIcon}
                        >
                            <Tooltip sticky>
                                <h4>speed: {marker.speed}</h4>
                                <h4>longitude: {marker.longitude}</h4>
                                <h4>latitude: {marker.latitude}</h4>
                                <h4>timestamp: {marker.timestamp}</h4>
                            </Tooltip>
                        </Marker>
                    )
                })}
            </MarkerClusterGroup>
        </MapContainer>  
    )
}

export default MyMap;