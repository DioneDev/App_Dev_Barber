import React, {useEffect, useContext} from 'react';
import {Container, LoadingIcon} from './styles';
import AsyncStorage from '@react-native-community/async-storage';
import {useNavigation} from '@react-navigation/native';

import {UserContext} from '../../contexts/UserContext';
import Api from '../../Api';

import BarberLogo from '../../assets/barber.svg';

export default () => {

    const {dispatch: userDispatch} = useContext(UserContext);

    const navigation = useNavigation();

    useEffect(()=>{
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('token');
            // Validar o token
            if(token){
                let res = await Api.checkToken(token);

                if(res.token){

                    await AsyncStorage.setItem('token', res.token); // 1° Passo:Salva no AsyncStorage

                    userDispatch({      // 2° Passo: Salva no Context.
                        type:'setAvatar',
                        payload:{
                            avatar:res.data.avatar
                        }
                    });
    
                    navigation.reset({      // 3° Passo: Envia o usuário para MainTab.
                        routes:[{name:'MainTab'}]
                    });
                }else{
                    navigation.navigate('SignIn'); 
                }
            }else{
                navigation.navigate('SignIn');
            }

        }
        checkToken();
    }, []);

    return (
        <Container>
            <BarberLogo width="100%" height="160" />
            <LoadingIcon size="large" color="#ffffff" />
        </Container>
    );
}