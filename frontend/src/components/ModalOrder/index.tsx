import Modal from 'react-modal';
import { FiX } from 'react-icons/fi';
import styles from './styles.module.scss';
import { OrderItemProp } from '../../pages/dashboard';

interface ModalOrderProps{
    isOpen: boolean;
    onRequestClose: () => void;
    order: OrderItemProp[];
    handleFinishOrder: (id: string) => void
}

export function ModalOrder({isOpen, onRequestClose, order, handleFinishOrder }:ModalOrderProps){
    const customStyle = {
        content:{
            top:'auto%',
            bottom: 'auto',
            left: '50%',
            right: 'auto',
            padding: '30px',
            transform: 'translate(-50%,50%)',
            backgroundColor: '#1d1d2e',
        }
    }
    return(
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyle}
        >
            <button 
                type='button'
                onClick={onRequestClose}
                className='react-modal-close'
                style={{ background: 'transparent', border: 0 }}
            >
                <FiX size={45} color='#f34748'/>
            </button>
            <div className={styles.container}>
                <h2>Detalhes do Pedido</h2>
                <span className={styles.table}>
                    Mesa: <strong>{order[0].order.table}</strong>
                </span>
                {order.map(item => (
                    <section key={item.id} className={styles.containerItem}>
                        <span>{item.amount} - {item.product.name}</span>
                        <span className={styles.description}>{item.product.description}</span>
                    </section>
                ))}

                <button
                    className={styles.buttonOrder}
                    onClick={() => handleFinishOrder(order[0].order_id)}
                >Concluir Pedido</button>
            </div>

        </Modal>
    )
}