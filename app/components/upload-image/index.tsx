import React, { useState, useEffect } from "react"
import { Image, View, Platform, TouchableOpacity, Text, StyleSheet } from "react-native"
import { AntDesign } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { useStores } from "../../models"

export default function UploadImage() {
  const [image, setImage] = useState(null)
  const [imageStatus, setImageStatus] = useState(false)
  const { userStore } = useStores()
  const addImage = async () => {
    checkForCameraRollPermission()

    const _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!_image.cancelled) {
      setImage(_image.uri)
      console.log(image)
      try {
        await userStore.uploadUserAvatar(image)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const checkForCameraRollPermission = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync()
    console.log(status)
    if (status !== "granted") {
      alert("Please grant camera roll permissions inside your system's settings")
    } else {
      console.log("Media Permissions are granted")
    }
  }
  console.log("fsdsdf")

  return (
    <View style={imageUploaderStyles.container}>
      <Image
        source={image ? { uri: image } : { uri: userStore?.user?.avatarSrc }}
        style={{ width: 200, height: 200 }}
      />
      <View style={imageUploaderStyles.uploadBtnContainer}>
        <TouchableOpacity onPress={addImage} style={imageUploaderStyles.uploadBtn}>
          <Text>{image ? "Edit" : "Upload"} Image</Text>
          <AntDesign name="camera" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  )
}
const imageUploaderStyles = StyleSheet.create({
  container: {
    elevation: 2,
    height: 200,
    width: 200,
    backgroundColor: "#efefef",
    position: "relative",
    borderRadius: 999,
    overflow: "hidden",
  },
  uploadBtnContainer: {
    opacity: 0.7,
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "lightgrey",
    width: "100%",
    height: "25%",
  },
  uploadBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
})
