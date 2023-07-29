import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import Container from '../../components/Container'
import Title from '../../components/Title'
import { getFromStorage } from '../../services/local_storage_service'
import { AuthStartStyles } from '../../styles/AuthStartStyles'

const Summary = () => {
    const [date,setSelectedDate] = useState();
    const [summary,setSummary] = useState("");
    useEffect(()=>{
        getFromStorage("selected_date").then((date)=>{
            
            if(date){
                setSelectedDate(date)
                getFromStorage("selected_summary").then((val)=>{
                    setSummary(val)
                })
            }
        })
    },[])
    return (
        <Container
            child={
                <View
                    style={{ flex: 1, alignItems: "center" }}
                >
                    <Title />
                    <View
                    style={{...AuthStartStyles.card,width : 350,height : 500 }}
                    >
                        <Text style={AuthStartStyles.text}>Date : {date}</Text>
                        <Text style={{color : "#00008B",flex:1}}>{summary}</Text>
                    </View>
                </View>
            }
        />
    )
}

export default Summary