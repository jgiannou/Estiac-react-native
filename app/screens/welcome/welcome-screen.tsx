import React, { FC, useEffect, useState } from "react"
import { View, ViewStyle, TextStyle, ImageStyle, SafeAreaView } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {
  Button,
  Header,
  Screen,
  Text,
  GradientBackground,
  AutoImage as Image,
  FormRow,
  TextField,
} from "../../components"
import { color, spacing, typography } from "../../theme"
import { NavigatorParamList } from "../../navigators"
import { useStores } from "../../models"
import { User, UserModel } from "../../models/user/user"

const estiaCLogo = require("../../../assets/images/logo.png")

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}
const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
}
const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}
const TITLE_WRAPPER: TextStyle = {
  ...TEXT,
  textAlign: "center",
}
const TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
}
const ALMOST: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 26,
  fontStyle: "italic",
}
const BOWSER: ImageStyle = {
  alignSelf: "center",
  marginVertical: spacing[7],
  maxWidth: "100%",
  width: "100%",
  resizeMode: "contain",
}
const CONTENT: TextStyle = {
  ...TEXT,
  color: "#BAB6C8",
  fontSize: 15,
  lineHeight: 22,
  marginBottom: spacing[5],
}
const CONTINUE: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: color.palette.fancySkin,
  borderRadius: 20,
  marginTop: spacing[5],
  marginBottom: spacing[5],
}
const CONTINUE_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
}
const FOOTER: ViewStyle = { backgroundColor: color.transparent }
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
}

export const WelcomeScreen: FC<StackScreenProps<NavigatorParamList, "welcome">> = observer(
  ({ navigation }) => {
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [showError, setShowError] = useState(false)
    const [user, setUser] = useState<User>(undefined)
    const nextScreen = () => {
      navigation.navigate("demo")
    }
    const { userStore } = useStores()
    const login = async () => {
      await userStore.getUser(password, email)
      user.status == undefined ? setShowError(true) : setShowError(false)
    }
    useEffect(() => {
      setUser(userStore.user)
      if (userStore.isAuth === true) {
        nextScreen()
      }
    }, [userStore.isAuth, user.status])

    return (
      <View testID="WelcomeScreen" style={FULL}>
        <GradientBackground colors={["#FFEFPQ", "#FFFFFF"]} />
        <Screen style={CONTAINER} preset="fixed" backgroundColor={color.transparent}>
          <Header headerTx="welcomeScreen.poweredBy" style={HEADER} titleStyle={HEADER_TITLE} />
          <Text style={TITLE_WRAPPER}>
            <Text style={TITLE} text="Your new app, " />
            <Text style={ALMOST} text="almost" />
            <Text style={TITLE} text="!" />
          </Text>
          <Text style={TITLE} preset="header" tx="welcomeScreen.readyForLaunch" />
          <Image source={estiaCLogo} style={BOWSER} />
          <FormRow preset="soloRound">
            <TextField
              placeholder={email}
              onChangeText={(email) => setEmail(email)}
              label={"email"}
            />
            <TextField
              placeholder={password}
              onChangeText={(password) => setPassword(password)}
              label={"id"}
            />
          </FormRow>
          <Button
            testID="next-screen-button"
            style={CONTINUE}
            textStyle={CONTINUE_TEXT}
            tx="welcomeScreen.continue"
            onPress={login}
          />
          {showError && <Text style={ALMOST} text="Wrong email or password. Try Again!" />}
        </Screen>
        {/* <SafeAreaView style={FOOTER}>
          <View style={FOOTER_CONTENT}>
            <FormRow preset="middle">
              <TextField placeholder={email} onChangeText={(e) => setEmail(e)} label={"email"} />
              <TextField placeholder={password} onChangeText={(e) => setPassword(e)} label={"id"} />
            </FormRow>
            <Button
              testID="next-screen-button"
              style={CONTINUE}
              textStyle={CONTINUE_TEXT}
              tx="welcomeScreen.continue"
              onPress={login}
            />
          </View>
        </SafeAreaView> */}
      </View>
    )
  },
)
