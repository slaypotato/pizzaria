import Head from "next/head";
import { FormEvent, useState } from "react";
import { toast } from 'react-toastify';
import Header from "../../components/Header";
import { api } from "../../services/apiClient";
import { canSSRAuth } from "../../utils/canSSRAuth";
import styles from "./styles.module.scss";

export default function category(){

    const [name, setName] = useState('');

    async function handleRegister(event:FormEvent) {
        event.preventDefault();
        if(name === ''){
            toast.warn('Preencha o nome da categoria');
            return;
        }

        await api.post('/category', { name: name});

        toast.success('Categoria cadastrada com sucesso!!');
        setName('');
    }

    return(
        <>
        <Head>
            <title>Nova categoria - Sujeito Pizzaria</title>
        </Head>
        <div>
            <Header />
            <main className={styles.container}>
                <form className={styles.form} onSubmit={handleRegister}>
                    <input 
                        type="text"
                        placeholder="Digite o nome da categoria"
                        className={styles.input}
                        value={name} onChange={(e) => {setName(e.target.value)}}
                    />
                    <button type="submit" className={styles.buttonAdd}>Cadastrar</button>
                </form>
            </main>
        </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {}
    }
})