import { Request, Response } from "express";
import { AdditemService } from "../../services/order/AddItemService";

class AddItemController{
    async handle(req: Request, res: Response){
        const {order_id, product_id, amount } = req.body;
        const addItem = new AdditemService();
        const item = await addItem.execute({
            order_id,
            product_id,
            amount,
        });
        return res.json(item);
    }
}

export{ AddItemController }