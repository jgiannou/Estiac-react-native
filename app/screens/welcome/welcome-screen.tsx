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
  backgroundColor: color.background,
  paddingHorizontal: spacing[4],
}
const TEXT: TextStyle = {
  color: color.palette.black,
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
const FORM_TEXT_FIELD_INPUT: TextStyle = {
  fontSize: 17,
  lineHeight: 17,
  paddingVertical: spacing[0],
  marginVertical: spacing[0],
}
const FORM_TEXT_FIELD: ViewStyle = {
  paddingVertical: spacing[0],
  marginVertical: spacing[0],
  padding: 0,
  margin: 0,
}

const FORM_ROW: ViewStyle = {
  marginVertical: spacing[2],
  padding: spacing[1],
}

export const WelcomeScreen: FC<StackScreenProps<NavigatorParamList, "welcome">> = observer(
  ({ navigation }) => {
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [showError, setShowError] = useState(false)
    const [user, setUser] = useState<User>(undefined)
    const nextScreen = () => {
      navigation.navigate("demoMap")
    }
    const { userStore } = useStores()
    const login = async () => {
      await userStore.getUser(password, email)
      user.status == undefined ? setShowError(true) : setShowError(false)
    }
    const logout = () => {
      userStore.resetUser()
    }
    useEffect(() => {
      setUser(userStore.user)
      if (userStore?.isAuth === true && user?.jwt != "") {
        nextScreen()
      }
    }, [userStore?.isAuth, user?.status])
    return (
      <View testID="WelcomeScreen" style={FULL}>
        <GradientBackground colors={["#FFEFPQ", "#FFFFFF"]} />
        <Screen style={CONTAINER} preset="fixed" backgroundColor={color.transparent}>
          <Header headerTx="welcomeScreen.poweredBy" style={HEADER} titleStyle={HEADER_TITLE} />
          <Text style={TITLE} preset="header" tx="welcomeScreen.readyForLaunch" />
          <Image source={estiaCLogo} style={BOWSER} />
          <FormRow preset="soloRound" style={FORM_ROW}>
            <TextField
              placeholder={"Email"}
              onChangeText={(email) => setEmail(email)}
              value={email}
              inputStyle={FORM_TEXT_FIELD_INPUT}
              style={FORM_TEXT_FIELD}
            />
          </FormRow>
          <FormRow preset="soloRound" style={FORM_ROW}>
            <TextField
              placeholder={"Password"}
              onChangeText={(password) => setPassword(password)}
              value={password}
              inputStyle={FORM_TEXT_FIELD_INPUT}
              style={FORM_TEXT_FIELD}
            />
          </FormRow>
          <Button
            testID="next-screen-button"
            style={CONTINUE}
            textStyle={CONTINUE_TEXT}
            tx={`welcomeScreen.${userStore?.isAuth ? "logout" : "login"}`}
            onPress={userStore?.isAuth ? logout : login}
          />
          {showError && <Text style={ALMOST} text="Wrong email or password. Try Again!" />}
        </Screen>
      </View>
    )
  },
)
