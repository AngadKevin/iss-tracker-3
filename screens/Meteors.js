import React, { Component } from 'react';
import { Text, View, Alert, FlatList, SafeAreaView, StyleSheet, Image, ImageBackground } from 'react-native';
import axois from "axois";

export default class MeteorScreen extends Component {
    constructor() {
        super();
        this.state = {
            meteors:{}
        }
    }
    componentDidMount() {
        this.getmeteordata()
    }
    getmeteordata = () => {
        axois.get("https://api.nasa.gov/neo/rest/v1/feed?api_key=Zd0lsize9kNnTvCHObraxrrSHcooy2IyTIxtKfOu").then(response => {
            this.setState({ meteors: response.data.near_earth_objects })
        }).catch((error) => {
            Alert.alert(error.message)
        })
    }
    keyExtractor = (index, item) => index.toString()
    renderItem = ({ item }) => {
        var meteor = item
        var bg, speed, size
        if (meteor.threatscore <= 30) {
            bg = require('../assets/meteor_bg1.png')
            speed = require('../assets/meteor_speed3.gif')
            size = 100
        } else if (meteor.threatscore <= 75) {
            bg = require('../assets/meteor_bg2.png')
            speed = require('../assets/meteor_speed3.gif')
            size = 150
        } else {
            bg = require('../assets/meteor_bg3.png')
            speed = require('../assets/meteor_speed3.gif')
            size = 200
        }
        return (<View>
            <ImageBackground source={bg}>
                <View>
                    <Image source={speed} style={{ height: size, width: size, alignSelf: "center" }} />
                    <View>
                        <Text>{item.name}</Text>
                    </View>
                </View>
            </ImageBackground>
        </View>)
    }
    render() {
        if (Object.keys(this.state.meteors).length === 0) {
            return (<View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                <Text>LOADING!!!</Text>
            </View>)
        }
        else {
            var meteor = Object.keys(this.state.meteors).map(meteorDate => {
                return this.state.meteors[meteorDate]
            })
            var met = [].concat.apply([], meteor)
            met.forEach(function (element) {
                var diameter = (element.estimated_diameter.kilometers.estimated_diameter_min + element.estimated_diameter.kilometers.estimated_diameter_max) / 2
                var threatscore = (diameter / element.close_approach_data[0].miss_distance.kilometers) * 100000000
                element.threatscore = threatscore
            });
            met.sort(function (a, b) {
                return b.threatscore - a.threatscore
            })
            met = met.slice(0, 5)
            return (
                <View style={styles.container}>
                    <SafeAreaView style={styles.droidSafeArea}>
                        <FlatList data={met}
                            renderItem={this.renderItem}
                            keyExtractor={this.keyExtractor}
                            horizontal={true} />
                    </SafeAreaView>
                </View>
            )
        }
    }
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    }
})