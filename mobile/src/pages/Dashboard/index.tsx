import { useNavigation } from '@react-navigation/native';
import React, {useContext, useState} from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    SafeAreaView, 
    StyleSheet, 
    TextInput,
} from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../routes/app.routes';
import { api } from '../../services/api';

export default function  Dashboard() {
    const {signOut, user} = useContext(AuthContext);
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
    const [table, setTable] = useState('');

    async function openOrder() {
        if(table === ''){
            return;
        }
        try {
            const response = await api.post('/order', { table: Number(table) });
        
            // console.log(response.data);
            
            navigation.navigate('Order', { number: table, order_id: response.data.id });

            setTable('');
        } catch (error) {
            console.log('Error:' + error);
        }
        
    }

    return(
        <SafeAreaView style={styles.container}>
           <Text style={styles.title}>Novo Pedido</Text>
           <TextInput 
            placeholder='Numero da mesa'
            placeholderTextColor='#F0F0F0'
            style={styles.input}
            keyboardType='numeric'
            value={table}
            onChangeText={setTable}
           />
           <TouchableOpacity style={styles.button} onPress={openOrder}>
            <Text style={styles.buttonText}>Abrir Mesa</Text>
           </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        paddingVertical: 15,
        backgroundColor: '#1d1d2e',
    },
    title:{
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 24,
    },
    input:{
        width: '90%',
        height: 60,
        backgroundColor: '#101026',
        borderRadius: 4,
        paddingHorizontal: 8,
        textAlign: 'center',
        fontSize: 22,
        color: '#FFFFFF',
    },
    button:{
        width:'90%',
        height: 40,
        backgroundColor: '#3fffa3',
        borderRadius: 4,
        marginVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText:{
        fontSize: 18,
        color: '#101026',
        fontWeight: 'bold',
    },
});