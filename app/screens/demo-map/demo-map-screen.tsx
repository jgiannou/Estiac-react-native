import React, { FC, useEffect, useRef, useState } from "react"
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
import { LocationObject } from "expo-location"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: "none",
}
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingHorizontal: spacing[4],
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
  backgroundColor: "green",
  alignItems: "center",
  justifyContent: "center",
  margin: 0,
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
    const gotToInitialRegion = () => {
      console.log("mpike ref", location)
      return mapRef?.current?.animateToRegion(
        {
          latitude: location?.coords?.latitude,
          longitude: location?.coords?.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        },
        3000,
      )
    }

    useEffect(() => {
      const fetchLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied")
          return
        }
        let currentLocation = await Location.getCurrentPositionAsync({})

        setLocation(currentLocation)
        location && gotToInitialRegion()
      }
      const fetchStoreEstias = async () => {
        await estiaStore.getEstias()
        try {
          estias && getEstias(estiaStore?.estias)
        } catch (error) {
          console.log(error)
        }
      }
      fetchLocation()
      fetchStoreEstias()
    }, [estiaStore])
    const insets = useSafeAreaInsets()

    const mapRef = useRef(null)
    console.log(location)
    return (
      <SafeAreaView
        testID="DemoMapScreen"
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "flex-start",
          padding: 0,
        }}
        edges={["left", "right"]}
      >
        <Screen style={CONTAINER} preset="scroll">
          <Header
            headerTx="demoScreen.howTo"
            leftIcon="menu"
            onLeftPress={() => navigation.toggleDrawer()}
            rightIcon={"profile"}
            style={HEADER}
            titleStyle={HEADER_TITLE}
          />
          <MapView
            ref={mapRef}
            style={MAP}
            provider={PROVIDER_GOOGLE}
            // customMapStyle={[
            //   {
            //     elementType: "geometry",
            //     stylers: [
            //       {
            //         color: "#ebe3cd",
            //       },
            //     ],
            //   },
            //   {
            //     elementType: "labels.text.fill",
            //     stylers: [
            //       {
            //         color: "#523735",
            //       },
            //     ],
            //   },
            //   {
            //     elementType: "labels.text.stroke",
            //     stylers: [
            //       {
            //         color: "#f5f1e6",
            //       },
            //     ],
            //   },
            //   {
            //     featureType: "administrative",
            //     elementType: "geometry.stroke",
            //     stylers: [
            //       {
            //         color: "#c9b2a6",
            //       },
            //     ],
            //   },
            //   {
            //     featureType: "administrative.land_parcel",
            //     elementType: "geometry.stroke",
            //     stylers: [
            //       {
            //         color: "#dcd2be",
            //       },
            //     ],
            //   },
            //   {
            //     featureType: "administrative.land_parcel",
            //     elementType: "labels.text.fill",
            //     stylers: [
            //       {
            //         color: "#ae9e90",
            //       },
            //     ],
            //   },
            //   {
            //     featureType: "landscape.natural",
            //     elementType: "geometry",
            //     stylers: [
            //       {
            //         color: "#dfd2ae",
            //       },
            //     ],
            //   },
            //   {
            //     featureType: "poi",
            //     elementType: "geometry",
            //     stylers: [
            //       {
            //         color: "#dfd2ae",
            //       },
            //     ],
            //   },
            //   {
            //     featureType: "poi",
            //     elementType: "labels.text.fill",
            //     stylers: [
            //       {
            //         color: "#93817c",
            //       },
            //     ],
            //   },
            //   {
            //     featureType: "poi.park",
            //     elementType: "geometry.fill",
            //     stylers: [
            //       {
            //         color: "#a5b076",
            //       },
            //     ],
            //   },
            //   {
            //     featureType: "poi.park",
            //     elementType: "labels.text.fill",
            //     stylers: [
            //       {
            //         color: "#447530",
            //       },
            //     ],
            //   },
            //   {
            //     featureType: "road",
            //     elementType: "geometry",
            //     stylers: [
            //       {
            //         color: "#f5f1e6",
            //       },
            //     ],
            //   },
            //   {
            //     featureType: "road.arterial",
            //     elementType: "geometry",
            //     stylers: [
            //       {
            //         color: "#fdfcf8",
            //       },
            //     ],
            //   },
            //   {
            //     featureType: "road.highway",
            //     elementType: "geometry",
            //     stylers: [
            //       {
            //         color: "#f8c967",
            //       },
            //     ],
            //   },
            //   {
            //     featureType: "road.highway",
            //     elementType: "geometry.stroke",
            //     stylers: [
            //       {
            //         color: "#e9bc62",
            //       },
            //     ],
            //   },
            //   {
            //     featureType: "road.highway.controlled_access",
            //     elementType: "geometry",
            //     stylers: [
            //       {
            //         color: "#e98d58",
            //       },
            //     ],
            //   },
            //   {
            //     featureType: "road.highway.controlled_access",
            //     elementType: "geometry.stroke",
            //     stylers: [
            //       {
            //         color: "#db8555",
            //       },
            //     ],
            //   },
            //   {
            //     featureType: "road.local",
            //     elementType: "labels.text.fill",
            //     stylers: [
            //       {
            //         color: "#806b63",
            //       },
            //     ],
            //   },
            //   {
            //     featureType: "transit.line",
            //     elementType: "geometry",
            //     stylers: [
            //       {
            //         color: "#dfd2ae",
            //       },
            //     ],
            //   },
            //   {
            //     featureType: "transit.line",
            //     elementType: "labels.text.fill",
            //     stylers: [
            //       {
            //         color: "#8f7d77",
            //       },
            //     ],
            //   },
            //   {
            //     featureType: "transit.line",
            //     elementType: "labels.text.stroke",
            //     stylers: [
            //       {
            //         color: "#ebe3cd",
            //       },
            //     ],
            //   },
            //   {
            //     featureType: "transit.station",
            //     elementType: "geometry",
            //     stylers: [
            //       {
            //         color: "#dfd2ae",
            //       },
            //     ],
            //   },
            //   {
            //     featureType: "water",
            //     elementType: "geometry.fill",
            //     stylers: [
            //       {
            //         color: "#b9d3c2",
            //       },
            //     ],
            //   },
            //   {
            //     featureType: "water",
            //     elementType: "labels.text.fill",
            //     stylers: [
            //       {
            //         color: "#92998d",
            //       },
            //     ],
            //   },
            // ]}
            initialRegion={{
              latitude: 37.98381,
              longitude: 23.727539,
              latitudeDelta: 0.4,
              longitudeDelta: 0.4,
            }}
            showsCompass={true}
            showsUserLocation={true}
            userLocationAnnotationTitle={"asdasd"}
            showsMyLocationButton={true}
            followsUserLocation={true}
            zoomEnabled={true}
            loadingEnabled={true}
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
        </Screen>
      </SafeAreaView>
    )
  },
)
