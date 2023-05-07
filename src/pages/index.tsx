import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { TextField } from "@blitzss/ui/src/forms/legacy"
import { UseQueryResult } from "@tanstack/react-query";
import { api } from "~/utils/api";
import { SharingRoom } from "@prisma/client";
import React from "react";
import { useRouter } from "next/router";

const Home: NextPage = () => {

  const getRoomsQuery = api.rooms.getRooms.useQuery();

  if (getRoomsQuery.error?.data?.code === "UNAUTHORIZED") {
    signIn("google")
  }

  const router = useRouter();

  return (<>
    <button 
      className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
      onClick={() => {
        router.push("/rooms/create")
      }}
    >Create Room</button>
    <Rooms getRoomsQuery={getRoomsQuery} />

  </>);
};

export default Home;

interface RoomsProps {
  getRoomsQuery: UseQueryResult<SharingRoom[], any>
}

const Rooms: React.FC<RoomsProps> = ({ getRoomsQuery }) => {

  if (getRoomsQuery.isLoading) return (<>Loading...</>)
  if (getRoomsQuery.isError) return (<>Oops Error!</>)

  return (<>
    {
      getRoomsQuery.data?.map((room) => {
        return (
          <div key={room.id}>
            <Link href={`/rooms/${room.id}`}>
              {room.name}
            </Link>
          </div>
        )
      })
    }
  </>)
}