import { ChangeEvent, FormEvent, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { toast } from "react-toastify";
import { FiUpload } from "react-icons/fi";
import Header from "../../components/Header";
import { canSSRAuth } from "../../utils/canSSRAuth";
import styles from "./styles.module.scss";
import { setupAPIClient } from "../../services/api";


export default function Product({ categoryList }) {

    console.log(categoryList);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [imageAvatar, setImageAvatar] = useState(null);
    const [categories, setCategories] = useState(categoryList || [])
    const [categorySelected, setCategorySelected] = useState(0)

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

    function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if(!e.target.files){
            toast.warn('Insira uma image')
            return;
        }

        const image = e.target.files[0];

        if(!image){
            toast.error("Erro ao inserir image, tente novamente")
            return;
        }

        if(image.type === 'image/jpeg' || image.type === 'image/png'){
            const url = URL.createObjectURL(e.target.files[0]) 
            setImageAvatar(image);
            setAvatarUrl(url);
        }
        
    }

    function handleChangeCategory(event) {
        setCategorySelected(event.target.value);
    }

    async function handleRegister(event: FormEvent) {
        event.preventDefault();
        try {
            const data = new FormData();
            if(name === '' || price === '' || description === '' || imageAvatar === null) {
                toast.error('Preencha todos os campos!');
                return;
            }

            data.append('name', name);
            data.append('price', price);
            data.append('description', description);
            data.append('category_id', categories[categorySelected].id);
            data.append('file', imageAvatar);

            const apiClient = setupAPIClient();
            await apiClient.post('/product', data);

            toast.success('Produto cadastrado com sucesso!');

        } catch (err) {
            console.log(err.message);
            toast.error('Ops! Erro ao cadastrar!!!')
        }

        setName('');
        setPrice('');
        setDescription('');
        setAvatarUrl('');
        setImageAvatar(null);
        setCategorySelected(0);
    }

    return(
        <>
        <Head>
            <title>Novo Produto - Sujeito Pizzaria</title>
        </Head>
        <div>
            <Header />
            <main className={styles.container}>
                <h1>Novo Produto</h1>
                <form className={styles.form} onSubmit={handleRegister}>
                    <label className={styles.labelAvatar}>
                        <span>
                            <FiUpload size={30} color="#FFF"/>
                        </span>
                        <input type='file' accept="image/png, image/jpeg" onChange={handleFile}/>
                        {avatarUrl && (
                            <img 
                                className={styles.preview}
                                src={avatarUrl}
                                alt="Foto do produto"
                                width={250}
                                height={250}
                            />)
                        }

                    </label>
                    <select value={categorySelected} onChange={handleChangeCategory}>
                        {categories.map((item, index) => {
                            return(
                                <option key={item.id} value={index}>{item.name}</option>
                            )
                        })}
                    </select>
                    <input 
                        type='text'
                        placeholder="Digite o nome do produto"
                        className={styles.input}
                        value={name} onChange={(e) => setName(e.target.value)}
                    />
                    <input 
                        type='text'
                        placeholder="Digite o preço do produto"
                        className={styles.input}
                        value={price} onChange={(e) => setPrice(e.target.value)}
                    />
                    <textarea 
                        placeholder="Descreva seu produto"
                        className={styles.input}
                        value={description} onChange={(e) => setDescription(e.target.value)}
                    />
                    <button className={styles.buttonAdd} type="submit">Cadastrar</button>
                </form>
            </main>
        </div>
        </>
    );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get('/category');
    return {
        props: {
            categoryList: response.data
        }
    }
})