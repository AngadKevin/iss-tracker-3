import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Platform,
    StatusBar,
    ImageBackground,
    Image,
    Alert
} from "react-native";
import axios from "axios"
export default class IssInfoScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            location: {}
        }
    }
    componentDidMount() {
        this.getisslocation()
        try {
            setInterval(async () => {
                this.getisslocation()
            }, 5000);
        }
        catch (error) {
            console.log(error)
        }
    }
    getisslocation = () => {
        axios.get('https://api.wheretheiss.at/v1/satellites/25544').then(response => {
            this.setState({
                location: response.data
            })
        }).catch(error => {
            Alert.alert(error)
        })
    }
    render() {
        if (Object.keys(this.state.location).length === 0) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    <Text>Loading</Text>
                </View>
            )
        }
        else {
            return (
                <View>
                    <Text>Latitude: {this.state.location.latitude}</Text>
                    <Text>Longitude: {this.state.location.longitude}</Text>
                    <Text>Altitude: {this.state.location.altitude}</Text>
                    <Text>Velocity: {this.state.location.velocity}</Text>
                </View>
            )
        }
    }
}