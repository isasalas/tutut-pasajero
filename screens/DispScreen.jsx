import { View, SafeAreaView, Dimensions } from 'react-native'
import React from 'react'
import axios from 'axios'
import { urlApi, urlInterno, urlLinea, urlViaje } from '../utils/ApiData'
import { Appbar, FAB, List, Switch, Text } from 'react-native-paper';
import { mapStyleDark } from '../utils/mapStyle';
import MapView, { Marker, Polyline } from 'react-native-maps';
import DropDownPicker from 'react-native-dropdown-picker';
import FloatinMenu from '../components/FloatinMenu';
import Socket from '../components/Socket.io'

export default function DispScreen({ navigation }) {
    const [lineas, setLineas] = React.useState([])
    const [indexLinea, setIndexLinea] = React.useState()
    const [ruta, setRuta] = React.useState(null)
    const [cord, setCord] = React.useState([])
    const [isSwitchOn, setIsSwitchOn] = React.useState(true);
    const [open, setOpen] = React.useState(false);
    const [items, setItems] = React.useState([]);
    const [labelAppBar, setLabelAppBar] = React.useState('Ida');
    const [viajes, setViajes] = React.useState([]);
    const [viaje, setViaje] = React.useState(null);
    const [gps, setGps] = React.useState()

    React.useEffect(() => {
        axios.get(urlApi + urlLinea)
            .then((re) => {
                var dat = re.data.map((datito, i) => {
                    return {
                        label: datito.name,
                        value: i
                    }
                })
                setItems(dat)
                setLineas(re.data)
                //mostrarRuta(re.data)
            }).catch((e) => { console.log(e) })
    }, [])

    React.useEffect(() => {
        if (indexLinea !== null && lineas.length > 0) {
            axios.get(urlApi + urlViaje)
                .then((re) => {
                    var ints = re.data.filter((viaje) => {
                        if (viaje.interno.lineaId === lineas[indexLinea].id
                            && new Date(viaje.vuelta.destination.time) >= new Date()) {
                            return viaje
                        }
                    })
                    setViajes(ints)
                }).catch((e) => { console.log(e) })
            if (isSwitchOn) { setLabelAppBar('Ida') }
            else { setLabelAppBar('Vuelta') }
        }
    }, [indexLinea])

    React.useEffect(() => {
        if (viaje && viajes.length > 0) {
            mostrarRuta(viaje)
            if (isSwitchOn) { setLabelAppBar('Ida') }
            else { setLabelAppBar('Vuelta') }
        }
    }, [viaje, isSwitchOn])

    React.useEffect(() => {
        Socket.on("gps", gpsNew => {
            if (viaje != null
                && gpsNew.internoId === viaje.internoId
                && ruta != null
                && new Date() >= new Date(ruta.origin.time)
                && new Date() < new Date(ruta.destination.time)) {
                console.log('aolaa')
                setGps(gpsNew)
            }
        })
        return () => { Socket.off() }
    }, [viaje, ruta, gps])

    const mostrarRuta = (viaje) => {

        if (isSwitchOn) {
            setRuta(viaje.ida)
            var cordenadas = viaje.ida.route.map((e) => {
                return { latitude: e.lat, longitude: e.lng }
            })
        } else {
            setRuta(viaje.vuelta)
            var cordenadas = viaje.vuelta.route.map((e) => {
                return { latitude: e.lat, longitude: e.lng }
            })
        }
        setCord(cordenadas)
    }

    const onToggleSwitch = () => {
        //console.log(linea)
        if (indexLinea !== null) {
            // mostrarRuta(lineas)
            setIsSwitchOn(!isSwitchOn)
        }
    };


    if (!lineas[0] && !items) <></>
    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: "#121212",
        }}>
            {!viaje ? <View style={{

                paddingHorizontal: 20,
                borderRadius: 30,
                flex: 1,
                backgroundColor: "#121212CF",
                flexDirection: 'column',
                margin: 15,
                justifyContent: 'center',

            }}>
                <Text>{'Selecciona una linea y mira sus vehiculos diponibles'/*lineas[parseInt(indexLinea)].name*/}</Text>
                {viajes ? viajes.map((dat) => (
                    <List.Item
                        onPress={() => {
                            setViaje(dat);
                        }}
                        key={dat.id}
                        title={"Interno: " + dat.interno.name}
                        description={
                            new Date(dat.ida.origin.time).getHours().toString().padStart(2, '0') + ":" + new Date(dat.ida.origin.time).getMinutes().toString().padStart(2, '0')
                            + " - "
                            + new Date(dat.vuelta.destination.time).getHours().toString().padStart(2, '0') + ":" + new Date(dat.vuelta.destination.time).getMinutes().toString().padStart(2, '0')
                        }
                        right={props => <List.Icon {...props} icon="eye" />}
                    />
                )) : null}
            </View> : <View style={{
                flex: 1,
                backgroundColor: "#121212",
                flexDirection: 'column',
                alignSelf: 'flex-end',
                opacity: 0,
                zIndex: -1
            }} />}

            <Appbar
                style={{
                    paddingHorizontal: 10,
                    opacity: 1,
                    elevation: 0,
                    zIndex: 0,
                    backgroundColor: "#121212CF",
                    //shadowOpacity: 0.5,
                    //shadowRadius:5,
                    borderRadius: 100,
                    marginRight: 85,
                    marginLeft: 15,
                    marginBottom: 30,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                <View style={{
                    zIndex: 4,
                    flex: 5
                }}>
                    <DropDownPicker
                        theme='DARK'
                        style={{
                            backgroundColor: "#12121200",
                            borderRadius: 14,
                            borderWidth: 0
                        }}
                        open={open}
                        value={indexLinea}
                        items={items}
                        setOpen={setOpen}
                        setValue={(e) => {
                            setIndexLinea(e);
                            //mostrarRuta(lineas, e());
                            setViaje(null);
                            setRuta(null);
                            setGps(null)
                        }}
                        setItems={setItems}
                        onChangeValue={() => {
                            //console.log(linea)
                            // console.log(lineas[parseInt(linea)].name)
                        }}
                    />
                </View>
                <Appbar.Content style={{
                    zIndex: 4,
                    flex: 3,
                }}
                    titleStyle={{ fontSize: 17 }}
                    title={labelAppBar} />
                <Switch style={{
                    flex: 2,
                    margin: 10
                }}
                    value={isSwitchOn}
                    onValueChange={onToggleSwitch} />
            </Appbar>


            <MapView
                showsUserLocation={true}
                initialRegion={{
                    latitude: -17.783390,
                    longitude: -63.180249,
                    latitudeDelta: 0.1022,
                    longitudeDelta: 0.0521,
                }}
                userInterfaceStyle={'dark'}
                style={{
                    zIndex: -1,
                    position: 'absolute',
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height,
                }}
                customMapStyle={mapStyleDark}
            >
                {ruta ? <Polyline
                    coordinates={cord}
                    strokeColor="#4c8ff5"
                    //fillColor="rgba(255, 0, 0, 0.5)"
                    strokeWidth={4}
                ></Polyline> : null}

                {ruta ? <Marker
                    title={
                        new Date(ruta.origin.time).getHours().toString().padStart(2, '0') + ":" + new Date(ruta.origin.time).getMinutes().toString().padStart(2, '0')

                    }
                    coordinate={{
                        latitude: ruta.origin.location.lat,
                        longitude: ruta.origin.location.lng
                    }}
                >
                </Marker> : null}
                {ruta ? ruta.waypoints.map(marker => (
                    (marker.waypoint.stopover === true) ?
                        <Marker
                            title={
                                new Date(marker.time).getHours().toString().padStart(2, '0') + ":" + new Date(marker.time).getMinutes().toString().padStart(2, '0')
                            }
                            key={marker.waypoint.location.lat}
                            coordinate={{
                                latitude: marker.waypoint.location.lat,
                                longitude: marker.waypoint.location.lng
                            }}
                            pinColor='#ff860d'
                        /> : null
                )
                ) : null}
                {ruta ? <Marker
                    title={
                        new Date(ruta.destination.time).getHours().toString().padStart(2, '0') + ":" + new Date(ruta.destination.time).getMinutes().toString().padStart(2, '0')

                    }
                    pinColor='#ffd70d'
                    coordinate={{
                        latitude: ruta.destination.location.lat,
                        longitude: ruta.destination.location.lng
                    }}
                /> : null}

                {gps != null
                    && viaje != null
                    && new Date() >= new Date(ruta.origin.time)
                    && new Date() <= new Date(ruta.destination.time) ?
                    <Marker
                        title={viaje.interno.name}
                        //icon={{ url: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png', scaledSize: { width: 35, height: 35 } }}
                        coordinate={{ latitude: gps.location.latitude, longitude: gps.location.longitude }}
                        pinColor='#ffffff'
                    /> : null}


            </MapView>
            <FloatinMenu navigation={navigation} />
        </SafeAreaView>
    )
}