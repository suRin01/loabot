import { Message } from "@remote-kakao/core";


export class RoomCacher {
    private roomList:Message[] = [];

    public insertRoom = (room:Message)=>{
        let isReserved = this.roomList.find((reservedRoom)=>{
            if(reservedRoom.room.id === room.room.id){
                return reservedRoom;
            }
            return undefined;
        })
        if(isReserved === undefined){
            this.roomList.push(room);
        }
    }

    public getRoom = (roomName:string):Message=>{
        const searchedRoom = this.roomList.find(room => {
            if(room.room.name === roomName){
                return room;
            }
            return undefined;
        });

        if(searchedRoom === undefined){
            throw new Error("Can't find excat room.");
        }

        return searchedRoom;
    }
    
    public getAllRoom = ():Message[]=>{
        return this.roomList;
    }
}