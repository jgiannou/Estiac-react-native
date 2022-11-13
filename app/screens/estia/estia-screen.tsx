import React, { FC, useEffect, useState } from "react"
import { ScrollView, TextStyle, View, ViewStyle, Image } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Header, Screen } from "../../components"
import { NavigatorParamList } from "../../navigators"
import { spacing } from "../../theme"
import { useStores } from "../../models"
import { Button, Card, List, StyleService, Text, useStyleSheet } from "@ui-kitten/components"
import { ImageOverlay } from "./image-overlay"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"

const FULL: ViewStyle = { flex: 1, backgroundColor: "transparent" }
const CONTAINER: ViewStyle = {
  padding: 0,
  margin: 0,
}
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[5] - 1,
  paddingHorizontal: spacing[4],
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
    const styles = useStyleSheet(themedStyles)
    const [estia, setEstia] = useState(undefined)
    const { estiaId } = route.params

    const goBack = () => navigation.goBack()
    const onBookButtonPress = (): void => {}
    const { estiaStore } = useStores()

    const product = {
      details: ["Coffee", "Drink", "Food"],
      options: [
        { title: "Coffee", icon: "moon" },
        { title: "Bar", icon: "headphones" },
      ],
    }
    const renderImageItem = (info: any): React.ReactElement => (
      <Image style={styles.imageItem} source={{ uri: info?.item }} />
    )

    const renderDetailItem = (detail: string, index: number): React.ReactElement => (
      <Button key={index} style={styles.detailItem} appearance="outline" size="tiny">
        {detail}
      </Button>
    )

    const renderBookingFooter = (): React.ReactElement => (
      <View style={{ margin: 16 }}>
        <Text category="s1">Facilities</Text>
        <View style={styles.detailsList}>{product.details.map(renderDetailItem)}</View>
      </View>
    )

    useEffect(() => {
      const fetchEstia = async () => {
        return await estiaStore.getEstiaById(estiaId)
      }
      fetchEstia()
      setEstia(estiaStore.estia)
    }, [estiaId])

    const insets = useSafeAreaInsets()
    return (
      <SafeAreaView
        testID="EstiaScreen"
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "flex-start",
          padding: 0,
          marginTop: -insets.top,
        }}
        edges={["left", "right"]}
      >
        <Screen style={CONTAINER} preset="scroll">
          {/* <Header
            headerText={estia?.name}
            leftIcon="back"
            onLeftPress={goBack}
            rightIcon={"profile"}
            style={HEADER}
            titleStyle={HEADER_TITLE}
          /> */}
          <ScrollView style={styles.container}>
            {estia?.cover ? (
              <ImageOverlay style={styles.image} source={{ uri: estia?.cover }} />
            ) : (
              <View
                style={{
                  flex: 1,
                  height: 360,
                  width: "100%",
                  backgroundColor: "gray",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ textAlign: "center" }} category="h4">
                  {estia?.name}
                </Text>
              </View>
            )}
            <Card
              style={styles.bookingCard}
              appearance="filled"
              disabled={false}
              footer={renderBookingFooter}
            >
              <Text style={styles.title} category="h6">
                {estia?.name}
              </Text>
              <Text style={styles.rentLabel} appearance="hint" category="p2">
                Monthly Subscription
              </Text>
              <Text style={styles.priceLabel} category="h6">
                {estia?.price}€
              </Text>
              <Button style={styles.bookButton} onPress={onBookButtonPress}>
                SUBSCRIBE
              </Button>
            </Card>
            <Text style={styles.sectionLabel} category="s1">
              About
            </Text>
            <Text style={styles.description} appearance="hint">
              {estia?.description}
            </Text>
            {estia?.photos && (
              <>
                <Text style={styles.sectionLabel} category="s1">
                  Photos
                </Text>
                <List
                  contentContainerStyle={styles.imagesList}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={estia?.photos?.map((item) => item?.url)}
                  renderItem={renderImageItem}
                />
              </>
            )}
          </ScrollView>
        </Screen>
      </SafeAreaView>
    )
  },
)
const themedStyles = StyleService.create({
  container: {
    padding: 0,
    margin: 0,
  },
  image: {
    padding: 0,
    height: 360,
  },
  bookingCard: {
    marginTop: -80,
    margin: 16,
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowOffset: { width: 10, height: 20 },
    shadowRadius: 10,
    elevation: 3,
    backgroundColor: "background-basic-color-2",
  },
  title: {
    width: "65%",
  },
  rentLabel: {
    marginTop: 24,
  },
  priceLabel: {
    marginTop: 8,
  },
  bookButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
  },
  detailsList: {
    flexDirection: "row",
    marginVertical: 8,
  },
  detailItem: {
    borderRadius: 16,
  },
  optionList: {
    flexDirection: "row",
    marginVertical: 8,
  },
  optionItem: {
    marginHorizontal: 4,
    paddingHorizontal: 0,
  },
  description: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  sectionLabel: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  imagesList: {
    padding: 8,
    backgroundColor: "background-basic-color-2",
  },
  imageItem: {
    width: 180,
    height: 120,
    borderRadius: 8,
    marginHorizontal: 8,
  },
})
