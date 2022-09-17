import { FormEvent, useContext, useState } from "react";
import Head from 'next/head';
import Image from 'next/image';
import Link from "next/link";
import { GetServerSideProps } from "next";
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import logoImg from '../../public/logo.svg';
import styles from '../../styles/home.module.scss';
import { canSSRGuest } from "../utils/canSSRGuest";
export default function Home() {
  const {signIn} = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    setLoading(true);
    
    let data = {
      email,
      password
    }
    if(email === '' || password === ''){
      toast.warn("Preencha o email e a senha")
      return;
    }
    signIn(data);
    
    setLoading(false)
  }

  return (
    <>
    <Head>
      <title>SujeitoPizza - Faça seu login</title>
    </Head>
    <div className={styles.container}>
      <Image src={logoImg} alt='Logo Sujeito Pizzaria'/>
      <div className={styles.login}>
        <form onSubmit={handleLogin}>
          <Input 
            placeholder='Digite seu email'
            type='text'
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder='Digite sua senha'
            type='password'
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <Button type='submit' loading={loading} >Acessar</Button>
        </form>
        <Link href='/signup'><a className={styles.text}>Não possui uma conta? Cadastre-se</a></Link>
      </div>
    </div>
    </>
  )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return{
    props: {}
  }
})