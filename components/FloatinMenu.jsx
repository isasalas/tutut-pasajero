import { View, Text } from 'react-native'
import React from 'react'
import { FAB } from 'react-native-paper'

export default function FloatinMenu({navigation}) {

    const [expandedMenu, setExpandedMenu] = React.useState(false);

    const handlePressMenu = () => setExpandedMenu(!expandedMenu);

    return (
        <FAB.Group
            fabStyle={{
                backgroundColor: '#121212CF',
                marginBottom: 30, 
                zIndex:10
            }}
            open={expandedMenu}
            visible
            icon={expandedMenu ? 'close' : 'menu'}
            actions={[
                {
                    icon: 'map-marker-distance',
                    label: 'Rutas',
                    onPress: () => navigation.push('linea'),
                },
                {
                    icon: 'bus-stop',
                    label: 'Disponibilidad',
                    onPress: () => navigation.push('disp'),
                },
            ]}
            onStateChange={handlePressMenu}
            onPress={() => {
                if (expandedMenu) {
                    // do something if the speed dial is open
                }
            }}
        />
    )
}