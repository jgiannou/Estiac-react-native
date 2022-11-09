import React, { FC, useEffect, useState } from "react"
import {
  Animated,
  ImageSourcePropType,
  ImageStyle,
  ListRenderItemInfo,
  ScrollView,
  TextStyle,
  View,
  ViewStyle,
  Image,
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Header, Screen, GradientBackground, AutoImage } from "../../components"
import { NavigatorParamList } from "../../navigators"
import { color, spacing } from "../../theme"
import { useStores } from "../../models"
import { Button, Card, Icon, List, StyleService, Text, useStyleSheet } from "@ui-kitten/components"
import { ImageOverlay } from "./image-overlay"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.palette.white,
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
      <Image style={styles.imageItem} source={{ uri: info.item }} />
    )

    const renderOptionItemIcon = (style: ImageStyle, icon: string): React.ReactElement => (
      <Icon {...style} name={icon} />
    )

    const renderOptionItem = (option: any, index: number): React.ReactElement => (
      <Button
        key={index}
        style={styles.optionItem}
        appearance="ghost"
        size="small"
        // accessoryLeft={(style: ImageStyle) => renderOptionItemIcon(style, option.icon)}
      >
        {option.title}
      </Button>
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
    console.log(estia)
    return (
      <View testID="EstiaScreen" style={FULL}>
        {/* <GradientBackground colors={["#422443", "#281b34"]} />
        <Screen style={CONTAINER} preset="scroll" backgroundColor={color.palette.white}>
          <Header
            headerText={estia?.name}
            leftIcon="back"
            onLeftPress={goBack}
            rightIcon={"profile"}
            style={HEADER}
            titleStyle={HEADER_TITLE}
          />

          <Carousel loop autoplay={true} containerStyle={{ height: 500 }} allowAccessibleLayout>
            {estia?.photos.map((item, index) => {
              return <AutoImage source={{ uri: item?.url }} key={index} style={IMAGE} />
            })}
          </Carousel>

          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
          >
            <Fader visible={true} position={FaderPosition.BOTTOM} tintColor={undefined} />

            <Text
              text={estia?.description}
              style={{ color: "black", marginVertical: spacing[2] }}
            />
            <Text
              text={estia?.description}
              style={{ color: "black", marginVertical: spacing[2] }}
            />
            <Text
              text={estia?.description}
              style={{ color: "black", marginVertical: spacing[2] }}
            />
            <Text
              text={estia?.description}
              style={{ color: "black", marginVertical: spacing[2] }}
            />
            <Text
              text={estia?.description}
              style={{ color: "black", marginVertical: spacing[2] }}
            />
            <Text
              text={estia?.description}
              style={{ color: "black", marginVertical: spacing[2] }}
            />
          </Animated.ScrollView>
        </Screen> */}
        <ScrollView style={styles.container}>
          <ImageOverlay style={styles.image} source={{ uri: estia?.avatar }} />
          <Card
            style={styles.bookingCard}
            appearance="filled"
            disabled={true}
            footer={renderBookingFooter}
          >
            <Text style={styles.title} category="h6">
              {estia?.name}
            </Text>
            <Text style={styles.rentLabel} appearance="hint" category="p2">
              Monthly Subscription
            </Text>
            <Text style={styles.priceLabel} category="h6">
              15€
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
          <Text style={styles.sectionLabel} category="s1">
            Photos
          </Text>
          <List
            contentContainerStyle={styles.imagesList}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={estia?.photos?.map((item) => item.url)}
            renderItem={renderImageItem}
          />
        </ScrollView>
      </View>
    )
  },
)
const themedStyles = StyleService.create({
  container: {
    backgroundColor: "background-basic-color-2",
  },
  image: {
    height: 360,
  },
  bookingCard: {
    marginTop: -80,
    margin: 16,
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
