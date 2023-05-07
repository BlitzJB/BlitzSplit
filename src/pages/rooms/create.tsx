import React from "react";
import { type NextPage } from 'next';
import { TextField } from "~/blitzforms/v1";
import { api } from "~/utils/api";
import { useRouter } from "next/router";


const CreateRoom: NextPage = () => {

    const [roomName, setRoomName] = React.useState<string>("");
    const createRoomMutation = api.rooms.createRoom.useMutation();
    const router = useRouter();

    return (<>
        <h1 className="font-bold text-xl">Create Room</h1>
        <TextField
            label="Room Name"
            value={roomName}
            setValue={setRoomName}
        />
        <button onClick={e => createRoomMutation.mutate(
            { name: roomName }, 
            { 
                onSuccess(data, variables, context) {
                    router.push(`/rooms/${data.id}`)
                },
            }
        )} className="px-4 py-2 bg-green-400 rounded-md">Create</button>
    </>)
}

export default CreateRoom;