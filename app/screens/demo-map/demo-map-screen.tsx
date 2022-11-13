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
  backgroundColor: "none",
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
  marginTop: 50,
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

    useEffect(() => {
      const fetchLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied")
          return
        }
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,

          timeInterval: 5,
        })
        setLocation(location)
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
    }, [])
    return (
      <View testID="DemoMapScreen" style={FULL}>
        <Screen style={CONTAINER} preset="scroll">
          <Header
            headerTx="demoScreen.howTo"
            leftIcon="menu"
            onLeftPress={() => navigation.toggleDrawer()}
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
                customMapStyle={[
                  {
                    elementType: "geometry",
                    stylers: [
                      {
                        color: "#ebe3cd",
                      },
                    ],
                  },
                  {
                    elementType: "labels.text.fill",
                    stylers: [
                      {
                        color: "#523735",
                      },
                    ],
                  },
                  {
                    elementType: "labels.text.stroke",
                    stylers: [
                      {
                        color: "#f5f1e6",
                      },
                    ],
                  },
                  {
                    featureType: "administrative",
                    elementType: "geometry.stroke",
                    stylers: [
                      {
                        color: "#c9b2a6",
                      },
                    ],
                  },
                  {
                    featureType: "administrative.land_parcel",
                    elementType: "geometry.stroke",
                    stylers: [
                      {
                        color: "#dcd2be",
                      },
                    ],
                  },
                  {
                    featureType: "administrative.land_parcel",
                    elementType: "labels.text.fill",
                    stylers: [
                      {
                        color: "#ae9e90",
                      },
                    ],
                  },
                  {
                    featureType: "landscape.natural",
                    elementType: "geometry",
                    stylers: [
                      {
                        color: "#dfd2ae",
                      },
                    ],
                  },
                  {
                    featureType: "poi",
                    elementType: "geometry",
                    stylers: [
                      {
                        color: "#dfd2ae",
                      },
                    ],
                  },
                  {
                    featureType: "poi",
                    elementType: "labels.text.fill",
                    stylers: [
                      {
                        color: "#93817c",
                      },
                    ],
                  },
                  {
                    featureType: "poi.park",
                    elementType: "geometry.fill",
                    stylers: [
                      {
                        color: "#a5b076",
                      },
                    ],
                  },
                  {
                    featureType: "poi.park",
                    elementType: "labels.text.fill",
                    stylers: [
                      {
                        color: "#447530",
                      },
                    ],
                  },
                  {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [
                      {
                        color: "#f5f1e6",
                      },
                    ],
                  },
                  {
                    featureType: "road.arterial",
                    elementType: "geometry",
                    stylers: [
                      {
                        color: "#fdfcf8",
                      },
                    ],
                  },
                  {
                    featureType: "road.highway",
                    elementType: "geometry",
                    stylers: [
                      {
                        color: "#f8c967",
                      },
                    ],
                  },
                  {
                    featureType: "road.highway",
                    elementType: "geometry.stroke",
                    stylers: [
                      {
                        color: "#e9bc62",
                      },
                    ],
                  },
                  {
                    featureType: "road.highway.controlled_access",
                    elementType: "geometry",
                    stylers: [
                      {
                        color: "#e98d58",
                      },
                    ],
                  },
                  {
                    featureType: "road.highway.controlled_access",
                    elementType: "geometry.stroke",
                    stylers: [
                      {
                        color: "#db8555",
                      },
                    ],
                  },
                  {
                    featureType: "road.local",
                    elementType: "labels.text.fill",
                    stylers: [
                      {
                        color: "#806b63",
                      },
                    ],
                  },
                  {
                    featureType: "transit.line",
                    elementType: "geometry",
                    stylers: [
                      {
                        color: "#dfd2ae",
                      },
                    ],
                  },
                  {
                    featureType: "transit.line",
                    elementType: "labels.text.fill",
                    stylers: [
                      {
                        color: "#8f7d77",
                      },
                    ],
                  },
                  {
                    featureType: "transit.line",
                    elementType: "labels.text.stroke",
                    stylers: [
                      {
                        color: "#ebe3cd",
                      },
                    ],
                  },
                  {
                    featureType: "transit.station",
                    elementType: "geometry",
                    stylers: [
                      {
                        color: "#dfd2ae",
                      },
                    ],
                  },
                  {
                    featureType: "water",
                    elementType: "geometry.fill",
                    stylers: [
                      {
                        color: "#b9d3c2",
                      },
                    ],
                  },
                  {
                    featureType: "water",
                    elementType: "labels.text.fill",
                    stylers: [
                      {
                        color: "#92998d",
                      },
                    ],
                  },
                ]}
                initialRegion={{
                  latitude: location?.coords?.latitude,
                  longitude: location?.coords?.longitude,
                  latitudeDelta: 0.0421,
                  longitudeDelta: 0.0421,
                }}
                showsCompass={true}
                showsUserLocation={true}
                userLocationAnnotationTitle={"asdasd"}
                showsMyLocationButton={true}
                followsUserLocation={true}
                cacheEnabled
                loadingEnabled
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
