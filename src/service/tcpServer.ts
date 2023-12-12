import * as net from 'node:net'



export class TCPServer {
    private server?:net.Server;
    private socketList:net.Socket[] = [];
    private port:number = 7050;

    private handler:(arg0: Buffer)=>void = (arg0: Buffer)=>{return;};
    constructor(port: number = 7050){
        this.port = port;
        this.server = net.createServer();
        this.server.addListener("connection", (socket: net.Socket)=>{
            socket.on("connect", ()=>{
                console.log("connected");
            })
            socket.on("end", ()=>{
                console.log("ended");
            })
            socket.on("error", (err:Error)=>{
                console.log(err);
            })
            socket.on("data", (data)=>{
                this.handler(data);
            })
            
            this.socketList.push(socket);
        })
    }

    public broadcastmessage = (message:string)=>{
        this.socketList.forEach(socket=>{
            socket.write(message);
        })
    }

    public setPacketHandler = (handler:(arg0: Buffer)=>void)=>{
        this.handler = handler;
    }

    public listen = ()=>{
        this.server?.listen(this.port);
    }
    
}
