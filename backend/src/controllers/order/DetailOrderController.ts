import { Request, Response } from "express";
import { DetailOrderService } from "../../services/order/DetailOrderService";

class DetailOrderController {
    async handle(req: Request, res: Response) {
        const order_id = req.query.order_id as string;
        const detailOrder = new DetailOrderService();

        const items = await detailOrder.execute({order_id});

        return res.json(items);
        
    }
}

export { DetailOrderController }