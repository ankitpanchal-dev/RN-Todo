import { View, Text, ScrollView, Alert, FlatList, TouchableOpacity, Dimensions, Pressable, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
// import { Appbar, TextInput } from 'react-native-paper';

import firestore from '@react-native-firebase/firestore';
// import Todo from './Todo';
// import { NativeBaseProvider } from 'native-base';
// import { Item } from 'react-native-paper/lib/typescript/components/List/List';
import * as Animatable from 'react-native-animatable'

import Icon from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
// import Entypo from 'react-native-vector-icons/Entypo'
import Octicons from 'react-native-vector-icons/Octicons'
import Ionicons from 'react-native-vector-icons/Ionicons'
// Icon.loadFont();
// import Drawer from './Drawer';
import { Button, NativeBaseProvider, VStack } from 'native-base'

import Collapsible from 'react-native-collapsible';


const styles = StyleSheet.create({
    button: {
        color: 'white',
        backgroundColor: 'darkcyan',
        padding: 10,
        textAlign: 'center',
        borderRadius: 5,
        // maxWidth:Dimensions.get
    },
    boldFont: {
        fontWeight: 'bold'
    }
})
export default function Todos() {
    const ref = firestore().collection('todos');
    const [todo, setTodo] = useState('');
    const [loading, setLoading] = useState(true);
    const [todos, setTodos] = useState([]);
    const [dark, setDark] = useState(true)
    const [isCollapsed, setCollapsed] = useState("")
    const today = new Date()
    const [todoObj, setTodoObj] = useState({
        title: '',
        complete: "",
        createdAt: today.toDateString(),
        description: ''
    })
    async function addTodo() {
        await ref.add(todoObj);
        Alert.alert("Todo Added !")
        setTodo('');
        // console.log("ref", ref)  
    }
    useEffect(() => {
        return ref.onSnapshot(querySnapshot => {
            const list = [];
            querySnapshot?.forEach(doc => {
                const { title, complete, createdAt, description } = doc.data();
                list.push({
                    id: doc.id,
                    title,
                    complete,
                    createdAt,
                    description
                });
            });

            setTodos(list);

            if (loading) {
                setLoading(false);
            }
        });
    }, []);

    const TodoItem = ({ item }) => {
        return (<TouchableOpacity
                activeOpacity={1}
                style={{
                    borderRadius: 7,
                    marginTop: 10,
                    borderColor: 'grey',
                    borderWidth: 1,
                    padding: 10,
                    backgroundColor: '#cedaed',

                }}
                onPress={() => setCollapsed(item.id)}>
           <Animatable.View animation="bounceInRight" duration={1000}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.boldFont}> {item.title}</Text>
                    {item.complete
                        ? <Text style={{ color: 'green', fontSize: 10, }} >Completed <Icon name="checkcircle" size={10} /></Text>
                        :
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}><Text style={{ color: 'red', fontSize: 10 }} >
                            Pending</Text><Text style={{ marginLeft: 2, color: 'red' }}><MaterialIcons name='pending-actions' size={10} /></Text>
                        </View>}


                </View>
           <Animatable.View animation="bounceInRight" duration={1000}>

                <Collapsible collapsed={item.id == isCollapsed ? false : true} >
                    <Text style={{ maxWidth: "70%", padding: 5, textAlign: 'left' }}> {item.description}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 10, paddingRight: 20 }}> {new Date(item.createdAt).toDateString()}</Text>
                    </View>
                    
                    <NativeBaseProvider >
                        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: "space-evenly" }} >
                            {item.complete?
                                <Button colorScheme={"success"} variant={"outline"} leftIcon={<MaterialIcons name='pending-actions' color={"#7da4e3"} size={26} />} />
                                :<Button colorScheme={"success"} variant={"outline"} leftIcon={<Ionicons name="ios-checkmark-done-circle" color={"green"} size={28}/>} />

                            }
                            <Button variant={"outline"} colorScheme="danger" leftIcon={<MaterialCommunityIcons name='delete-circle' color={"darkred"} size={28} />} /> 
                            <Button colorScheme={"yellow"} variant={"outline"} leftIcon={<MaterialCommunityIcons name='comment-edit' color={"darkred"} size={28} />} />
                        </View>

                    </NativeBaseProvider>
                </Collapsible>
                </Animatable.View>
                </Animatable.View>
                 {/* </Animatable.View> */}
            </TouchableOpacity >
            )
    }

    const themeChange = () => {
        setDark(() => !dark)
    }
    return (
        <View style={{ height: '100%', backgroundColor: dark ? "#2a2f42" : '#7da4e3' }}>


            <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity activeOpacity={0.8} >
                    <Text><Octicons name='three-bars' color="white" size={25} /> </Text>

                </TouchableOpacity>
                <Text style={{ fontSize: 20, color: 'white' }}> My Todos</Text>
                <Pressable onPress={themeChange}>
                    <Text style={styles.button}>{dark ? "light" : "dark"}</Text>
                </Pressable>
            </View>

            <View style={{ borderWidth: 1, borderColor: 'white', flex: 1, borderRadius: 25,marginVertical:5 }}>
                <FlatList
                    style={{ height: Dimensions.get('window').height * 0.80 }}
                    data={todos}
                    contentContainerStyle={{ padding: 15 }}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <TodoItem item={item} />}
                />

                <View style={{ minHeight: 60, justifyContent: 'center', position: 'relative', bottom: 5, flexDirection: 'column', flex: 1, }}>

                    {/* <Input mx="3" placeholder="Input" label={'New Todo'} value={todo} onChangeText={setTodo} /> */}
                    <Pressable onPress={addTodo} style={{ maxWidth: '100%', alignItems: 'center' }} >
                        <Text style={styles.button}>+ Add New Task</Text>
                    </Pressable>

                </View>
            </View>
        </View >
    )
}
