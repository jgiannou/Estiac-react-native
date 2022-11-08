import React, { useState } from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { color, spacing, typography } from "../../theme"
import { Button, FormRow, TextField } from "../../components"
import { useStores } from "../../models"

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
const BUTTON: ViewStyle = {
  paddingVertical: spacing[5],
  paddingHorizontal: spacing[4],
  backgroundColor: color.palette.fancySkin,
  borderRadius: 25,
  marginTop: spacing[4],
  marginBottom: spacing[4],
  width: 250,
}
const CONTINUE_TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: typography.primary,
  fontSize: 16,
  letterSpacing: 2,
  fontWeight: "bold",
}
export const RegisterForm = () => {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  })

  const { authenticationStore } = useStores()

  const register = async () => {
    await authenticationStore.register(formState.username, formState.email, formState.password)
  }
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <FormRow preset="soloRound" style={FORM_ROW}>
        <TextField
          placeholder={"Username"}
          onChangeText={(username) =>
            setFormState((prev) => {
              return { ...prev, username: username }
            })
          }
          value={formState.username}
          inputStyle={FORM_TEXT_FIELD_INPUT}
          style={FORM_TEXT_FIELD}
        />
      </FormRow>
      <FormRow preset="soloRound" style={FORM_ROW}>
        <TextField
          placeholder={"Email"}
          onChangeText={(email) =>
            setFormState((prev) => {
              return { ...prev, email: email }
            })
          }
          value={formState.email}
          inputStyle={FORM_TEXT_FIELD_INPUT}
          style={FORM_TEXT_FIELD}
        />
      </FormRow>
      <FormRow preset="soloRound" style={FORM_ROW}>
        <TextField
          placeholder={"Password"}
          onChangeText={(password) =>
            setFormState((prev) => {
              return { ...prev, password: password }
            })
          }
          value={formState.password}
          inputStyle={FORM_TEXT_FIELD_INPUT}
          style={FORM_TEXT_FIELD}
        />
      </FormRow>
      <Button
        testID="next-screen-button"
        style={BUTTON}
        textStyle={CONTINUE_TEXT}
        text="SIGN UP"
        onPress={register}
      />
    </View>
  )
}
