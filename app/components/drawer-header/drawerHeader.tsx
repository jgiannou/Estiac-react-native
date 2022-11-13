import { Layout, Avatar, StyleService, useStyleSheet } from "@ui-kitten/components"
import { View } from "react-native"
import { DrawerHeaderProps } from "./drawerHeader.props"

export const DrawerHeader = (props: DrawerHeaderProps) => {
  const styles = useStyleSheet(themedStyles)

  return (
    <Layout style={styles.header}>
      <View style={styles.profileContainer}>
        <Avatar size="giant" source={{ uri: props.url }} />
      </View>
    </Layout>
  )
}
const themedStyles = StyleService.create({
  header: {
    height: 128,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
})
