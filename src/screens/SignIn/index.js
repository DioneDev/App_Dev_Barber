import React, {useState, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

import {UserContext} from '../../contexts/UserContext';

import {Container,
        InputArea,
        CustomButton,
        CustomButtonText,
        SignMessageButton,
        SignMessageButtonText,
        SignMessageButtonTextBold
        } from './styles';

import Api from '../../Api';
import SignInput from '../../components/SignInput';
import BarberLogo from '../../assets/barber.svg';
import EmailIcon from '../../assets/email.svg';
import LockIcon from '../../assets/lock.svg';


export default () => {

    const {dispatch: userDispatch} = useContext(UserContext);

    const navigation = useNavigation();

    const [emailField, setEmailField] = useState('');
    const [passwordField, setPasswordField] = useState('');

    const handleSignClick = async () => {
        if(emailField != '' && passwordField != ''){ // Verifica se campos estão preenchidos.
            let json = await Api.signIn(emailField, passwordField);

            if(json.token){
                await AsyncStorage.setItem('token', json.token); // 1° Passo:Salva no AsyncStorage

                userDispatch({      // 2° Passo: Salva no Context.
                    type:'setAvatar',
                    payload:{
                        avatar:json.data.avatar
                    }
                });

                navigation.reset({      // 3° Passo: Envia o usuário para MainTab.
                    routes:[{name:'MainTab'}]
                });

            }else{
                alert("E-mail ou senha não encontrado! " + ":(")
            }
        }else{
            alert("Por favor, preencha os campos!")
        }
    }

    const handleMessageButtonClick = () => {
        navigation.reset({
            routes:[{name: 'SignUp'}]
        });
    }
    
    return (
        <Container>
           <BarberLogo width="100%" height="160" /> 

           <InputArea>
                <SignInput 
                    IconSvg={EmailIcon}
                    placeholder="Email" 
                    value={emailField}
                    onChangeText={t => setEmailField(t)}
                />

                <SignInput 
                    IconSvg={LockIcon}
                    placeholder="Senha"
                    value={passwordField}
                    onChangeText={t => setPasswordField(t)}
                    password={true}
                />

                <CustomButton onPress={handleSignClick}>
                    <CustomButtonText>Login</CustomButtonText>
                </CustomButton>
           </InputArea>

           <SignMessageButton onPress={handleMessageButtonClick} >
               <SignMessageButtonText>Ainda não possui uma conta?</SignMessageButtonText>
               <SignMessageButtonTextBold>Cadastre-se</SignMessageButtonTextBold>
           </SignMessageButton>

        </Container>
    );
}