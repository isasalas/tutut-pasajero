import { View, SafeAreaView, Dimensions } from 'react-native'
import React from 'react'
import axios from 'axios'
import { urlApi, urlLinea } from '../utils/ApiData'
import { Appbar, FAB, Switch } from 'react-native-paper';
import { mapStyleDark } from '../utils/mapStyle';
import MapView, { Marker, Polyline } from 'react-native-maps';
import DropDownPicker from 'react-native-dropdown-picker';
import FloatinMenu from '../components/FloatinMenu';

export default function LineasScreen({ navigation }) {
    const [lineas, setLineas] = React.useState([])
    const [linea, setLinea] = React.useState(0)
    const [ruta, setRuta] = React.useState()
    const [cord, setCord] = React.useState([])
    const [isSwitchOn, setIsSwitchOn] = React.useState(true);
    const [open, setOpen] = React.useState(false);
    const [expandedMenu, setExpandedMenu] = React.useState(false);
    const [items, setItems] = React.useState([]);
    const [labelAppBar, setLabelAppBar] = React.useState('Ida');

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
                mostrarRuta(re.data, linea)
            }).catch((e) => { console.log(e) })
    }, [])

    React.useEffect(() => {

        if (linea !== null && lineas.length > 0) {
            console.log('ola')
            mostrarRuta(lineas, linea)
            if (isSwitchOn) { setLabelAppBar('Ida') }
            else { setLabelAppBar('Vuelta') }
        }
    }, [isSwitchOn, linea, ruta])

    const mostrarRuta = (lineasDat, index) => {
        if (isSwitchOn) {
            setRuta(lineasDat[index].ida)
            var cordenadas = lineasDat[index].ida.route.map((e) => {
                return { latitude: e.lat, longitude: e.lng }
            })
        } else {
            setRuta(lineasDat[index].vuelta)
            var cordenadas = lineasDat[index].vuelta.route.map((e) => {
                return { latitude: e.lat, longitude: e.lng }
            })
        }
        setCord(cordenadas)

    }

    const onToggleSwitch = () => {
        //console.log(linea)
        if (linea !== null) {


            // mostrarRuta(lineas)
            setIsSwitchOn(!isSwitchOn)
        }
    };

    const handlePressMenu = () => setExpandedMenu(!expandedMenu);

    if (!lineas[0] && !items) <></>
    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: "#121212",
        }}>
            <View style={{
                flex: 1,
                backgroundColor: "#121212",
                flexDirection: 'column',
                alignSelf: 'flex-end',
                opacity: 0,
                zIndex: -1
            }}/> 

            <Appbar
                style={{
                    paddingHorizontal: 10,
                    opacity: 1,
                    elevation: 0,
                    zIndex: 5,
                    backgroundColor: "#121212CF",
                    //shadowOpacity: 0.5,
                    //shadowRadius:5,
                    borderRadius: 100,
                    marginRight: 85,
                    marginLeft: 15,
                    marginBottom: 30,
                    alignItems: 'center',
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
                        value={linea}
                        items={items}
                        setOpen={setOpen}
                        setValue={(e) => {
                            setLinea(e);
                            //mostrarRuta(lineas, e());
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


            {ruta ?
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
                    customMapStyle={ruta ? mapStyleDark : null}
                >
                    <Polyline
                        coordinates={cord}
                        strokeColor="#4c8ff5"
                        //fillColor="rgba(255, 0, 0, 0.5)"
                        strokeWidth={4}
                    ></Polyline>

                    <Marker
                        title='salida'
                        coordinate={{
                            latitude: ruta.origin.location.lat,
                            longitude: ruta.origin.location.lng
                        }}
                    >
                    </Marker>
                    {ruta.waypoints.map(marker => (
                        (marker.waypoint.stopover === true) ?
                            <Marker
                                key={marker.waypoint.location.lat}
                                coordinate={{
                                    latitude: marker.waypoint.location.lat,
                                    longitude: marker.waypoint.location.lng
                                }}
                                pinColor='#ff860d'
                            /> : null
                    )
                    )}
                    <Marker
                        title='llegada'
                        pinColor='#ffd70d'
                        coordinate={{
                            latitude: ruta.destination.location.lat,
                            longitude: ruta.destination.location.lng
                        }}
                    />
                </MapView> : null}
            <FloatinMenu navigation={navigation} />
        </SafeAreaView>
    )
}
/*
        <List.Section
            // style={{backgroundColor:"#ffffff00"}}
            >
                <List.Accordion
                    //style={{backgroundColor:"#ffffff00"}}
                    title="Lineas"
                    left={props => <List.Icon {...props} icon="bus" />}
                    expanded={expanded}
                    onPress={handlePress}>
                    {lineas.map((linea) => (
                        <List.Item
                            key={linea.id}
                            title={linea.name}
                            description={linea.id}
                            left={props => <List.Icon icon="bus" color={`#${linea.color.bottom}`}
                                style={{
                                    backgroundColor: `#${linea.color.top}41`,
                                    borderRadius: 14
                                }} />}
                            //left=<MySvgMinibus bottom='#124578' top='#124578' />
                            onPress={() => {

                                setLinea(linea)
                                if (isSwitchOn) {
                                    setRuta(linea.ida)
                                    var cordenadas = linea.ida.route.map((e) => {
                                        return { latitude: e.lat, longitude: e.lng }
                                    })
                                } else {
                                    setRuta(linea.vuelta)
                                    var cordenadas = linea.vuelta.route.map((e) => {
                                        return { latitude: e.lat, longitude: e.lng }
                                    })
                                }
                                setCord(cordenadas)
                                handlePress()
                            }}
                        //right={props => <List.Icon icon="arrow-right" />}
                        />

                    ))}
                </List.Accordion>
            </List.Section>
            */
/*{lineas.map((linea) => (
                <List.Item
                    key={linea.id}
                    title={linea.name}
                    description={linea.id}
                    left={props => <List.Icon icon="bus" color={`#${linea.color.bottom}`}
                        style={{
                            backgroundColor: `#${linea.color.top}`,
                            borderRadius: 10
                        }} />}
                    //left=<MySvgMinibus bottom='#124578' top='#124578' />
                    onPress={() => { navigation.push('interno'); }}
                    right={props => <List.Icon icon="arrow-right" />}
                />

            ))}*/