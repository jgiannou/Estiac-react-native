import React, { FC, useEffect, useState } from "react"
import { ActivityIndicator, Dimensions, TextStyle, View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Header, Screen, GradientBackground, Text } from "../../components"
import { NavigatorParamList } from "../../navigators"
import { color, spacing } from "../../theme"
import * as Location from "expo-location"
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps"
import { useStores } from "../../models"
import { StyledMapMarker } from "../../components/styled-map-marker/styled-map-marker"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.palette.white,
  paddingHorizontal: spacing[4],
}
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[5] - 1,
  paddingHorizontal: 0,
}
const HEADER_TITLE: TextStyle = {
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}
const MAP_WRAPPER: ViewStyle = {
  flex: 1,
  backgroundColor: "#fff",
  alignItems: "center",
  justifyContent: "center",
}
const MAP: TextStyle = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
}

const LOADER_CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}

const LOADER = {
  flexDirection: "row",
  justifyContent: "space-around",
  padding: 10,
}

export const DemoMapScreen: FC<StackScreenProps<NavigatorParamList, "demoMap">> = observer(
  ({ navigation }) => {
    const [location, setLocation] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)
    const [estias, setEstias] = useState([])

    const { estiaStore } = useStores()

    const getEstias = (estias) => {
      const newEstias = estias.map(async (estia) => {
        let location = await Location.geocodeAsync(estia?.address)
        return {
          ...estia,
          latitude: location[0]?.latitude,
          longitude: location[0]?.longitude,
        }
      })
      Promise.all(newEstias).then(setEstias)
    }

    useEffect(() => {
      ;(async () => {
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied")
          return
        }
        let location = await Location.getCurrentPositionAsync({})
        setLocation(location)
        await estiaStore.getEstias()
        getEstias(estiaStore?.estias)
      })()
    }, [estiaStore.estias])
    return (
      <View testID="DemoMapScreen" style={FULL}>
        <GradientBackground colors={["#422443", "#281b34"]} />
        <Screen style={CONTAINER} preset="scroll" backgroundColor={color.palette.white}>
          <Header
            headerTx="demoScreen.howTo"
            leftIcon="menu"
            onLeftPress={() => navigation.getParent("LeftDrawer").openDrawer()}
            onRightPress={() => navigation.getParent("RightDrawer").openDrawer()}
            rightIcon={"profile"}
            style={HEADER}
            titleStyle={HEADER_TITLE}
          />
          <View style={MAP_WRAPPER}>
            {!location ? (
              <Screen style={LOADER_CONTAINER}>
                <ActivityIndicator size="large" />
                <Text preset="default" style={{ color: "black" }} text="Loading" />
              </Screen>
            ) : (
              <MapView
                style={MAP}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                  latitude: location?.coords?.latitude,
                  longitude: location?.coords?.longitude,
                  latitudeDelta: 0.0421,
                  longitudeDelta: 0.0421,
                }}
              >
                <>
                  {estias.length > 0 &&
                    estias?.map((estia, index) => {
                      return (
                        <Marker
                          key={index}
                          coordinate={{
                            latitude: estia?.latitude,
                            longitude: estia?.longitude,
                          }}
                          onPress={() => navigation.navigate("estia", { estiaId: estia?.id })}
                        >
                          <StyledMapMarker text={estia?.name} image={estia?.avatar} />
                        </Marker>
                      )
                    })}
                </>
              </MapView>
            )}
          </View>
        </Screen>
      </View>
    )
  },
)
