import React from 'react'
import { View } from 'react-native'
import Container from '../components/Container'
import Title from '../components/Title'
import Button from '../components/Button'
import { useRouter } from 'expo-router'

const CareGiverHome = () => {
    const router = useRouter()
    return (
        <Container child={<View
            style={{ flex: 1, alignItems: "center" }}
        >
            <Title/>

            <Button 
            onPressed={()=>{
                router.push("face_recognition/AddMemmory")
            }}
            text={"Add Memmory"}
            />

            <Button onPressed={()=>{

            }}
            text={"Memmories"}
            />

        </View>} />
    )
}

export default CareGiverHome