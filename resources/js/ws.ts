
export type Message = {
    event : string;
    message: any

}

export const buildMessage = (msg:string,event:string):Message=>{
    return {
        event:event,
        message:msg,
    }
}