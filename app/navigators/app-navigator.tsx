/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import React, { useEffect, useState } from "react"
import { useColorScheme } from "react-native"
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { WelcomeScreen, DemoScreen, DemoListScreen } from "../screens"
import { navigate, navigationRef, useBackButtonHandler } from "./navigation-utilities"
import { DemoMapScreen } from "../screens/demo-map/demo-map-screen"
import { EstiaScreen } from "../screens/estia/estia-screen"
import { useStores } from "../models"
import { observer } from "mobx-react-lite"
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer"
import { ProfileScreen } from "../screens/profile/profile-screen"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 */
export type NavigatorParamList = {
  welcome: undefined
  profile: undefined
  demo: undefined
  demoList: undefined
  demoMap: undefined
  estia: { estiaId: number }
  rightDrawer: undefined
  leftDrawer: undefined
  // 🔥 Your screens go here
}

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const LeftDrawer = createDrawerNavigator<NavigatorParamList>()
const RightDrawer = createDrawerNavigator<NavigatorParamList>()
const Stack = createNativeStackNavigator()

const AppStack = () => {
  const { authenticationStore } = useStores()

  return (
    <LeftDrawer.Navigator
      id="LeftDrawer"
      screenOptions={{
        headerShown: false,
        drawerPosition: "left",
      }}
      initialRouteName="demoMap"
      drawerContent={(props) => (
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          <DrawerItem label="Logout" onPress={() => authenticationStore.logout()} />
        </DrawerContentScrollView>
      )}
    >
      <LeftDrawer.Screen
        name="demoMap"
        component={DemoMapScreen}
        options={{ drawerLabel: "Map" }}
      />
      <LeftDrawer.Screen
        name="estia"
        component={EstiaScreen}
        options={{
          drawerItemStyle: {
            display: "none",
          },
        }}
      />
      <LeftDrawer.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          drawerItemStyle: {
            display: "none",
          },
        }}
      />
      {/** 🔥 Your screens go here */}
    </LeftDrawer.Navigator>
  )
}
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="welcome"
    >
      <Stack.Screen name="welcome" component={WelcomeScreen} />
    </Stack.Navigator>
  )
}

const RightDrawerScreen = () => {
  const { authenticationStore } = useStores()
  return (
    <RightDrawer.Navigator
      initialRouteName="demoMap"
      id="RightDrawer"
      screenOptions={{ drawerPosition: "right", headerShown: false }}
      drawerContent={() => (
        <DrawerContentScrollView>
          <DrawerItem label="Profile" onPress={() => navigate("profile")} />
          <DrawerItem label="Logout" onPress={() => authenticationStore.logout()} />
        </DrawerContentScrollView>
      )}
    >
      <RightDrawer.Screen name="rightDrawer" component={AppStack} />
    </RightDrawer.Navigator>
  )
}

interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer((props: NavigationProps) => {
  const colorScheme = useColorScheme()
  const { authenticationStore } = useStores()
  useBackButtonHandler(canExit)

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      {authenticationStore.isAuthenticationed ? <RightDrawerScreen /> : <AuthStack />}
    </NavigationContainer>
  )
})

AppNavigator.displayName = "AppNavigator"

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = ["welcome"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
