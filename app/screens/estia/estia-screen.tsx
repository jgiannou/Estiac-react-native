import React, { FC, useEffect, useState } from "react"
import { ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Header, Screen, GradientBackground, Text, AutoImage } from "../../components"
import { NavigatorParamList } from "../../navigators"
import { color, spacing } from "../../theme"
import { useStores } from "../../models"

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

export const EstiaScreen: FC<StackScreenProps<NavigatorParamList, "estia">> = observer(
  ({ route, navigation }) => {
    const [estia, setEstia] = useState(undefined)
    const { estiaId } = route.params

    const goBack = () => navigation.goBack()
    const { estiaStore } = useStores()

    const IMAGE: ImageStyle = {
      alignSelf: "center",
      maxWidth: "100%",
      width: "100%",
      resizeMode: "cover",
    }

    useEffect(() => {
      setEstia(estiaStore.getEstiaById(estiaId))
    }, [estiaStore])
    return (
      <View testID="EstiaScreen" style={FULL}>
        <GradientBackground colors={["#422443", "#281b34"]} />
        <Screen style={CONTAINER} preset="scroll" backgroundColor={color.palette.white}>
          <Header
            headerText={estia?.name}
            leftIcon="back"
            onLeftPress={goBack}
            rightIcon={"profile"}
            style={HEADER}
            titleStyle={HEADER_TITLE}
          />
          <AutoImage source={{ uri: estia?.avatar }} style={IMAGE} />
          <Text text={estia?.description} style={{ color: "black", marginVertical: spacing[2] }} />
        </Screen>
      </View>
    )
  },
)
