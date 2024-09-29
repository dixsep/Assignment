import { createRequest, updateRequest, deleteRequest, getRequests, getRequestById, markCompleteRequest} from "../models/roomServiceModel";
import type { Request, Response} from "express";
import {  Router } from "express";

const router = Router();

router.post('/requests', async (req , res) => {

    try{
        const newRequest = await createRequest(req.body);
        res.status(201).json(newRequest);

    }catch(err){
        res.status(500).json({
            message : 'Error posting request'
        })
    }
})

router.get("/requests/:id", async (req : Request, res : Response) => {
    try{

        const request = await getRequestById(req.params.id);
        res.status(201).json(request);

    }catch(err){
        res.status(500).json({
            message : 'Error getting request'
        })
    }
});

router.get("/requests", async (req,res) => {
    try{

        const requests = await getRequests();
        res.status(201).json(requests);

    }catch(err){
        res.status(200).json({
            message : 'Error getting requests'
        })
    }
});

router.put("/requests/:id", async (req : Request,res : Response) => {

     try{

        const updatedRequest = await updateRequest(req.params.id, req.body);

        if(updatedRequest){

            res.json(updatedRequest);

        }else{
            res.status(404).json({
                message : 'Request not found'
            })
        }

      }catch (error) {
        res.status(500).json({ message: 'Error updating request' });
      }
})

router.delete("/requests/:id", async (req : Request,res : Response) => {
    try{
        const deleted = await deleteRequest(req.params.id);

        if(deleted){

            res.status(204).json({
                message : 'Deleted Successfully'
            })

        }else{
            res.status(404).json({
                message : 'Request Not Found'
            })
        }
    }catch(err){
        res.status(500).json({
            message : 'Error deleting request'
        })
    }
})

router.post("/requests/:id/complete", async (req : Request, res : Response) => {
    try{

        const marked = await markCompleteRequest(req.params.id);

        if(marked){
            res.status(201).json(marked);
        }else{
            res.status(404).json({
                message : 'Request Not Found'
            })
        }
    }catch(err){

        res.status(500).json({
            message : 'Error marking the request complete'
        })
    }
});

export default router;
