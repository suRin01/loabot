import { TCPServer } from "../src/service/tcpServer";
import { getTodayExportaionIsland } from "../src/utils/axiosLostarkApi";
import * as net from 'node:net'





(async ()=>{
    /*
    console.log("test script start")

    console.log("testing prokion")

    const eventList = await getTodayExportaionIsland();
    let responseText = `오늘 모험섬\n\n`;
    eventList.forEach((event)=>{
        responseText += `${event.name}(${event.startTime.map(x => x.getHours()).join("시, ")}시): ${event.reward}\n`
    })

    console.log(responseText)
    */



    console.log("testing tcp server")
    const server = new TCPServer(9090);

    const packetHandler = (data: Buffer)=>{
        console.log("client sent this message.")
        console.log(data.toString());
        server.broadcastmessage(data.toString() + " is dead")
    }
    server.setPacketHandler(packetHandler);

    server.listen();
    /*

    // 서버 5000번 포트로 접속
    var socket = net.connect({port : 9090});
    socket.on('connect', function(){
        console.log('connected to server!');
        
        // 1000ms의 간격으로 banana hong을 서버로 요청
        setInterval(function(){
            socket.write('banana hong!');
        }, 1000);
    });

    // 서버로부터 받은 데이터를 화면에 출력
    socket.on('data', function(chunk){
        console.log('recv:' + chunk);
    });
    // 접속이 종료됬을때 메시지 출력
    socket.on('end', function(){
        console.log('disconnected.');
    });
    // 에러가 발생할때 에러메시지 화면에 출력
    socket.on('error', function(err){
        console.log(err);
    });
    // connection에서 timeout이 발생하면 메시지 출력
    socket.on('timeout', function(){
        console.log('connection timeout.');
    });

    */

    /*
    setTimeout(() => {
        server.setPacketHandler((data: Buffer)=>{
            console.log("new handler here")
            console.log(data.toString());
            server.broadcastmessage(data.toString() + " is alive")
    
        });
    }, 5000);
    */
    

})()