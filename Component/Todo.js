import React from 'react';
// import firestore from '@react-native-firebase/firestore';
import { List } from 'react-native-paper';
import { Text, View } from 'react-native';
import { NativeBaseProvider, Input } from 'native-base';

function Todo({ id, title, complete }) {
    // async function toggleComplete() {
    //     await firestore()
    //         .collection('todos')
    //         .doc(id)
    //         .update({
    //             complete: !complete,
    //         });
    // }

    return (
        <NativeBaseProvider >
            <Text>{title}</Text>

        </NativeBaseProvider>

    );
}

export default React.memo(Todo);