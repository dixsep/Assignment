import * as fs from 'fs/promises';
import * as lockfile from 'proper-lockfile';
import { v4 as uuidv4 } from 'uuid';

export interface roomServiceRequest {
    id : string;
    guestName : string;
    roomNo : number;
    requestDetails : string;
    priority : number;
    status: 'received' | 'in progress' | 'awaiting confirmation' | 'completed' | 'canceled'
};

const filePath = './data/requests.json';

const readRequests = async () : Promise<roomServiceRequest[]>  => {
    let release : any;

    try{
        //acquiring lock
        release = await lockfile.lock(filePath,{retries: 5});
        const fileData = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileData) as roomServiceRequest[];
    }
    catch(err){
        console.log('Error reading file: ', err);
        return [];
    }finally{
        //releasing lock
        if(release) release();
    }
};

const writeRequests = async (data : roomServiceRequest[]) : Promise<void> => {
    let release : any;

    try{
        release = await lockfile.lock(filePath, {retries : 5});
        const jsonData = JSON.stringify(data);
        await fs.writeFile(filePath, jsonData, 'utf8');
    }
    catch(err){
        console.log('Error writing file :', err);
    }finally {
        if(release) release();
    }
}

export const createRequest = async (request : Omit<roomServiceRequest, 'id'>) : Promise<roomServiceRequest> => {

    const requests = await readRequests();
    const newRequest : roomServiceRequest = {...request, id : uuidv4()};
    requests.push(newRequest);
    await writeRequests (requests);

    return newRequest;
}

export const getRequests = async () : Promise<roomServiceRequest[]> => {

    const requests : roomServiceRequest[] = await readRequests();

    //sorting requests based on priority order
    requests.sort((a,b) => a.priority < b.priority ? -1 : 1);

    return requests;
}

export const getRequestById = async (id : string) : Promise<roomServiceRequest | null> => {
    
    const requests : roomServiceRequest[] = await readRequests();
    const index = requests.findIndex((req) => req.id === id);
    if(index == -1)
    {
        return null;
    }
    return requests[index];
}

export const updateRequest = async (id: string, updatedRequest: Partial<roomServiceRequest>): Promise<roomServiceRequest | null> => {

    const requests = await readRequests();
    const index = requests.findIndex((req) => req.id === id);
    if(index == -1)
    {
        return null;
    }

    requests[index] = {...requests[index], ...updatedRequest};
    await writeRequests(requests);
    return requests[index];
};

export const deleteRequest = async (id : string) : Promise<boolean> => {

    const requests = await readRequests();
    const newRequests = requests.filter ((req) => req.id != id);

    if(newRequests.length == requests.length)
    {
        return false;
    }

    await writeRequests(newRequests);
    return true;
}

export const markCompleteRequest = async (id : string) : Promise<roomServiceRequest | null> => {

    const requests = await readRequests();
    const index = requests.findIndex((req) => req.id === id);

    if(index == -1)
    {
        return null;
    }
    requests[index].status = 'completed';
    await writeRequests(requests);
    return requests[index];
}