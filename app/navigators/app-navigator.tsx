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
  DrawerItemList,
} from "@react-navigation/drawer"
import { ProfileScreen } from "../screens/profile/profile-screen"
import {
  Drawer,
  DrawerItem,
  Layout,
  Text,
  IndexPath,
  BottomNavigation,
  BottomNavigationTab,
  Avatar,
  Icon,
} from "@ui-kitten/components"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { DrawerHeader } from "../components/drawer-header/drawerHeader"
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
  logout: undefined
  // 🔥 Your screens go here
}

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const appStack = createNativeStackNavigator()
const RightDrawer = createDrawerNavigator<NavigatorParamList>()
const authStack = createNativeStackNavigator()
const bottomStack = createBottomTabNavigator()

const AuthStack = () => {
  return (
    <authStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="welcome"
    >
      <authStack.Screen name="welcome" component={WelcomeScreen} />
    </authStack.Navigator>
  )
}

const AppStack = () => {
  return (
    <appStack.Navigator
      id="appStack"
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="demoMap"
    >
      <appStack.Screen name="demoMap" component={TabNavigator} />
      <appStack.Screen name="estia" component={EstiaScreen} />
      <appStack.Screen name="profile" component={ProfileScreen} />
      {/** 🔥 Your screens go here */}
    </appStack.Navigator>
  )
}

const DrawerContent = ({ navigation, state }) => {
  const { authenticationStore, userStore } = useStores()
  return (
    <Drawer
      header={<DrawerHeader url={userStore.user.avatarSrc} />}
      selectedIndex={state.index}
      onSelect={(index) => {
        navigation.navigate(state.routeNames[index?.row])
      }}
    >
      <DrawerItem title="Home" />
      <DrawerItem title="Profile" />
      <DrawerItem title="Logout" onPress={() => authenticationStore.logout()} />
    </Drawer>
  )
}

const LeftDrawerScreen = () => {
  const MockLogout = () => {
    return <></>
  }
  return (
    <RightDrawer.Navigator
      initialRouteName="demoMap"
      id="leftDrawer"
      screenOptions={{ drawerPosition: "left", headerShown: false }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <RightDrawer.Screen name="demoMap" component={DemoMapScreen} />
      <RightDrawer.Screen name="profile" component={ProfileScreen} />
      <RightDrawer.Screen name="logout" component={MockLogout} />
    </RightDrawer.Navigator>
  )
}
const MapIcon = (props) => <Icon name="map" {...props} />
const ListIcon = (props) => <Icon name="list" {...props} />
const BottomTabBar = ({ navigation, state }) => {
  return (
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={(index) => navigation.navigate(state.routeNames[index])}
    >
      <BottomNavigationTab icon={MapIcon} />
      <BottomNavigationTab icon={ListIcon} />
    </BottomNavigation>
  )
}

const TabNavigator = () => (
  <bottomStack.Navigator
    screenOptions={{ headerShown: false }}
    tabBar={(props) => <BottomTabBar {...props} />}
  >
    <bottomStack.Screen name="Map" component={LeftDrawerScreen} />
    <bottomStack.Screen name="List" component={LeftDrawerScreen} />
  </bottomStack.Navigator>
)

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
      {authenticationStore.isAuthenticationed ? <AppStack /> : <AuthStack />}
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
