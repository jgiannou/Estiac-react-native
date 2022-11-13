import React, { FC, useEffect, useState } from "react"
import { View, ViewStyle, TextStyle, ImageStyle } from "react-native"
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
import { RegisterForm } from "../../components/register-form"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"

const estiaCLogo = require("../../../assets/images/logo.png")
const bgImage = require("../../../assets/images/welcome-bg.jpg")

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = { flex: 1, backgroundColor: "white", padding: 0 }
const BACKGROUND: ViewStyle = {
  flex: 0.5,
  paddingHorizontal: spacing[4],
  paddingBottom: spacing[4],
  backgroundColor: "white",
}
const TEXT: TextStyle = {
  color: color.palette.black,
  fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = {
  marginTop: spacing[5],
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
  fontSize: 20,
  fontStyle: "italic",
  color: "red",
  alignSelf: "center",
}
const BOWSER: ImageStyle = {
  alignSelf: "center",
  maxWidth: 150,
  width: "100%",
  height: 50,
  resizeMode: "contain",
}
const BUTTON: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: color.palette.fancySkin,
  borderRadius: 25,
  marginBottom: spacing[4],
  width: 250,
}

const BUTTON_WITH_SHADOW: ViewStyle = {
  ...BUTTON,
  shadowColor: "#171717",
  shadowOffset: { width: -2, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
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
  padding: 5,
  margin: 0,
}

const FORM_ROW: ViewStyle = {
  width: "80%",

  marginVertical: spacing[2],
  padding: spacing[1],
  backgroundColor: "white",
}

const BUTTONS_VIEW: ViewStyle = {
  margin: 0,
  paddingTop: spacing[5],
  alignItems: "center",
  backgroundColor: "white",
  borderTopStartRadius: 50,
  borderTopEndRadius: 50,
  flex: 1,
}

export const WelcomeScreen: FC<StackScreenProps<NavigatorParamList, "welcome">> = observer(
  ({ navigation }) => {
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [showError, setShowError] = useState(false)
    const [registrationForm, setRegistrationForm] = useState(false)
    const [user, setUser] = useState<User>(undefined)
    const [showForm, setShowForm] = useState(false)

    const nextScreen = () => {
      navigation.navigate("demoMap")
    }
    const { authenticationStore, userStore } = useStores()

    const login = async () => {
      setRegistrationForm(false)
      await authenticationStore.login(email, password)
      authenticationStore.status == undefined ? setShowError(true) : setShowError(false)
      authenticationStore.isAuthenticationed && nextScreen()
    }
    const logout = () => {
      authenticationStore.logout
    }
    useEffect(() => {
      return () => {
        if (authenticationStore.isAuthenticationed) {
          userStore.getUserById(authenticationStore.id)
        }
        authenticationStore.resetStatus()
      }
    }, [authenticationStore.jwt])
    const insets = useSafeAreaInsets()

    return (
      <SafeAreaView
        testID="WelcomeScreen"
        style={{
          flex: 1,
          padding: 0,
          marginTop: -insets.top,
          marginBottom: 0,
          backgroundColor: "white",
        }}
        edges={["left", "right"]}
      >
        <Screen style={CONTAINER} preset="auto" backgroundColor={color.primary}>
          <GradientBackground colors={["#ffe259", "#ffa751"]} />
          <Header headerTx="welcomeScreen.poweredBy" style={HEADER} titleStyle={HEADER_TITLE} />
          <Image source={estiaCLogo} style={BOWSER} />
          {!registrationForm ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 0 }}>
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
              {showError && <Text style={ALMOST} text="Wrong email or password. Try Again!" />}
            </View>
          ) : (
            <RegisterForm />
          )}

          <View style={BUTTONS_VIEW}>
            <Button
              testID="next-screen-button"
              style={BUTTON_WITH_SHADOW}
              textStyle={CONTINUE_TEXT}
              tx={`welcomeScreen.${authenticationStore?.isAuthenticationed ? "logout" : "login"}`}
              onPress={authenticationStore?.isAuthenticationed ? logout : login}
            />
            {!registrationForm && (
              <Button
                testID="next-screen-button"
                style={BUTTON}
                textStyle={CONTINUE_TEXT}
                text="SIGN UP"
                onPress={() => setRegistrationForm(true)}
              />
            )}
          </View>
        </Screen>
      </SafeAreaView>
    )
  },
)
