import React from "react"
import { Image, View } from "react-native"

/**
 * A component which has a label and an input together.
 */
export function StyledMapMarker(props) {
  return (
    <View
      style={{
        width: 50,
        height: 50,
        borderRadius: 30,
        backgroundColor: props.image == "" && "#F3904F",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image source={{ uri: props.image }} style={{ width: 40, height: 40, borderRadius: 40 }} />
    </View>
  )
}
