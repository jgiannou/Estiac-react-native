import React, { FC, useEffect, useState } from "react"
import { View, ViewStyle, TextStyle, ImageStyle, SafeAreaView, ImageBackground } from "react-native"
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
import { Avatar } from "react-native-ui-lib"

const FULL: ViewStyle = { flex: 1 }

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.palette.white,
  paddingHorizontal: spacing[4],
}
const TAGLINE: TextStyle = {
  color: "#BAB6C8",
  fontSize: 15,
  lineHeight: 22,
  marginBottom: spacing[4] + spacing[1],
}
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[5] - 1,
  paddingHorizontal: 0,
}
const BOLD: TextStyle = { fontWeight: "bold" }

const HEADER_TITLE: TextStyle = {
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}
const BUTTONS_VIEW: ViewStyle = {}

export const ProfileScreen: FC<StackScreenProps<NavigatorParamList, "profile">> = observer(
  ({ navigation }) => {
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [showError, setShowError] = useState(false)
    const [user, setUser] = useState<User>(undefined)
    const [showForm, setShowForm] = useState(false)

    const { userStore } = useStores()

    return (
      <View testID="WelcomeScreen" style={FULL}>
        <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
          <Header
            headerTx="demoScreen.howTo"
            leftIcon="menu"
            onLeftPress={() => navigation?.getParent("LeftDrawer").openDrawer()}
            onRightPress={() => navigation?.getParent("RightDrawer").openDrawer()}
            rightIcon={"profile"}
            style={HEADER}
            titleStyle={HEADER_TITLE}
          />
          <View style={BUTTONS_VIEW}>
            <Avatar animate source={{ uri: userStore?.user?.avatarSrc }} size={100} />
            <Text style={TAGLINE} text={userStore?.user?.username} />
            <Text style={TAGLINE} text={userStore?.user?.email} />
          </View>
        </Screen>
      </View>
    )
  },
)
