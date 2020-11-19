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
import PersonIcon from '../../assets/person.svg'


export default () => {

    const {dispatch: userDispatch} = useContext(UserContext);

    const navigation = useNavigation();

    const [nameField, setNameField] = useState('');
    const [emailField, setEmailField] = useState('');
    const [passwordField, setPasswordField] = useState('');

    const handleSignClick = async () => {
        if(nameField != '' && emailField != '' && passwordField != ''){
            let res = await Api.signUp(nameField, emailField, passwordField);
            
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
                alert("Erro: " + res.error);
            }
        }else{
            alert("Por favor, preencha os campos!")
        }
    }

    const handleMessageButtonClick = () => {
        navigation.reset({
            routes:[{name: 'SignIn'}]
        });
    }
    
    return (
        <Container>
           <BarberLogo width="100%" height="160" /> 

           <InputArea>

                <SignInput 
                    IconSvg={PersonIcon}
                    placeholder="Digite seu nome" 
                    value={nameField}
                    onChangeText={t => setNameField(t)}
                />

                <SignInput 
                    IconSvg={EmailIcon}
                    placeholder="Digite seu e-mail" 
                    value={emailField}
                    onChangeText={t => setEmailField(t)}
                />

                <SignInput 
                    IconSvg={LockIcon}
                    placeholder="Digite sua Senha"
                    value={passwordField}
                    onChangeText={t => setPasswordField(t)}
                    password={true}
                />

                <CustomButton onPress={handleSignClick}>
                    <CustomButtonText>Cadastrar</CustomButtonText>
                </CustomButton>
           </InputArea>

           <SignMessageButton onPress={handleMessageButtonClick} >
               <SignMessageButtonText>Já possui uma conta?</SignMessageButtonText>
               <SignMessageButtonTextBold>Fazer Login</SignMessageButtonTextBold>
           </SignMessageButton>

        </Container>
    );
}