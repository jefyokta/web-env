import {handleEvent} from "./handle-event"
const host = window.location.hostname;
const port = window.location.port || "3000";
const ws = new WebSocket(`ws://${host}:${port}`);

ws.onopen = () =>{

    console.log("connected");
}

ws.onmessage = (event)=>{
    handleEvent(event.data)
}

