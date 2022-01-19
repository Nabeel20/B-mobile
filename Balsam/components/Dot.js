import * as React from 'react';
import { View } from 'react-native';

export default function Dot(props) {
    let dot_type = props.type;
    let color = '#313131';
    if (dot_type === 'error') {
        color = 'red';
    }
    if (dot_type === 'secondary') {
        color = 'teal';
    }
    return (
        <View
            style={{
                backgroundColor: color,
                width: 10,
                height: 10,
                borderRadius: 10,
                margin: 8,
            }}
        />
    );
}
