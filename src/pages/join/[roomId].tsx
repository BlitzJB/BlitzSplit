import React from "react";
import { type NextPage } from "next"
import { api } from "~/utils/api";
import { useRouter } from 'next/router';
import { signIn } from "next-auth/react";



const JoinRoom: NextPage = () => {

    const joinRoomMutation = api.rooms.joinRoom.useMutation();
    const router = useRouter();
    const { roomId } = router.query;

    if (!roomId) return (<>Oops Error!</>)

    
    return (<>
        <button onClick={e => {
            joinRoomMutation.mutate(
                { id: roomId as string },
                {
                    onSuccess(data, variables, context) {
                        router.push(`/rooms/${data.id}`)
                    },
                    onError(error, variables, context) {
                        if (error.data?.code === "UNAUTHORIZED") {
                            signIn("google")
                        }
                    }
                }
            )
        }}>
            Join Room!
        </button>
    </>)
}

export default JoinRoom;