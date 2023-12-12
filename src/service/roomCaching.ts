import { Message } from "@remote-kakao/core";


class RoomCacher {
    private roomList:Message[] = [];

    public insertRoom = (room:Message)=>{
        this.roomList.push(room);
    }

    public getRoom = (roomName:string):Message=>{
        const searchedRoom = this.roomList.find(room => {
            if(room.room.name === roomName){
                return room;
            }
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