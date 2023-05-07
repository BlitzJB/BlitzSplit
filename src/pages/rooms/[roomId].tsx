import React from "react";
import { type NextPage } from 'next';
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { TextField } from "~/blitzforms/v1";
import QRCode from "react-qr-code";
import { signIn, useSession } from "next-auth/react";
import { SharedPayment, SharingRoom, User } from "@prisma/client";
import { QueriesDependentScreenLoader } from "~/blitzforms/v2";



const Room: NextPage = () => {

    const router = useRouter();
    const { roomId } = router.query;

    if (!roomId) return (<>Oops Error!</>)

    const getRoomQuery = api.rooms.getRoom.useQuery({ id: roomId as string });
    const getPaymentsQuery = api.payments.getPayments.useQuery({ roomId: roomId as string })
    const getMeQuery = api.users.getMe.useQuery()

    return (<>
        <QueriesDependentScreenLoader queries={[getRoomQuery, getPaymentsQuery, getMeQuery]} />   
        <div className="px-10">
            <AboutRoom roomId={roomId as string} />
            <CreateSharedPaymentForm />
            <ShowPayments />
            <Payout />
        </div>
    </>)
}

interface AboutRoomProps {
    roomId: string
}

const AboutRoom: React.FC<AboutRoomProps> = ({ roomId }) => {

    const getRoomQuery = api.rooms.getRoom.useQuery({ id: roomId });

    if (getRoomQuery.isLoading) return (<>Loading...</>)
    if (getRoomQuery.isError) {
        if (getRoomQuery.error.data?.code === "UNAUTHORIZED")
            signIn("google")
        return (<>Oops Error!</>)
    }
    if (!getRoomQuery.data) return (<>Oops Error!</>)

    const shareData = {
        title: "MDN",
        text: `JOIN ${window.location.origin}/join/${getRoomQuery.data.id}`,
        url: `${window.location.origin}/join/${getRoomQuery.data.id}`,
    };

    return (<>
        <h1>{getRoomQuery.data.name}</h1>
        <button onClick={e => {
            navigator.share(shareData)
        }}>Share join link</button>
        <div>
            {
                getRoomQuery.data.members.map((member) => {
                    return (<>
                        <div className="border px-2 py-1">
                            {member.name} {member.email} {member.id === getRoomQuery.data?.createdBy.id ? "(Owner)" : ""}
                        </div>
                    </>)
                })
            }
        </div>
        
    </>)
}

/* 
model SharedPayment {
    id       String      @id @default(cuid())
    note     String
    amount   Float
    roomId   String
    room     SharingRoom @relation(fields: [roomId], references: [id], onDelete: Cascade)
    payerId  String
    payer    User        @relation(fields: [payerId], references: [id], onDelete: Cascade)
}
*/

const CreateSharedPaymentForm = () => {

    const [note, setNote] = React.useState<string>("")
    const [amount, setAmount] = React.useState<number>(0)
    const createPaymentMutation = api.payments.createPayment.useMutation()
    
    const router = useRouter();
    const { roomId } = router.query;
    if (!roomId) return (<>Oops Error!</>)
    
    const getPaymentsQuery = api.payments.getPayments.useQuery({ roomId: roomId as string })
    
    return (<>
        <TextField value={note} setValue={setNote} label="Note" />
        <div className="text-xs font-medium mt-2">Amount</div>
        <input value={amount || undefined} onChange={e => setAmount(Number(e.target.value))} type="number" step="0.01" inputMode="numeric" className="border border-neutral-700 w-full py-2 px-2" />
        <button
            className="py-2 px-4 bg-green-500 text-white rounded-md mt-2"
            onClick={e => {
                createPaymentMutation.mutate(
                    {
                        note: note,
                        amount: amount,
                        roomId: roomId as string
                    }, 
                    {
                        onSuccess() {
                            getPaymentsQuery.refetch()
                            setNote("")
                            setAmount(0)
                        },
                        onError(error) {
                            console.log(error)
                            alert("Error creating payment! Panic!")
                        }
                    }
                )
            }}
        >
            {
                createPaymentMutation.isLoading ? "Sit Tight! Creating!" : "Create Payment"
            }
        </button>
    </>)
}

const ShowPayments = () => {

    const router = useRouter();
    const { roomId } = router.query;
    if (!roomId) return (<>Oops Error!</>)

    const getPaymentsQuery = api.payments.getPayments.useQuery({ roomId: roomId as string })

    if (getPaymentsQuery.isLoading) return (<>Loading...</>)
    if (getPaymentsQuery.isError) return (<>Oops Error!</>)
    if (!getPaymentsQuery.data) return (<>Oops Error!</>)

    return (<>
        <h2 className="font-medium text-xl">Payments so far</h2>
        <div>
            {
                getPaymentsQuery.data.map((payment) => {
                    return (<>
                        <div className="border px-2 py-1">
                            {payment.note} {payment.amount} By {payment.payer.name}(email: {payment.payer.email})
                        </div>
                    </>)
                })
            }
        </div>
    </>)
}

const Payout = () => {
    const router = useRouter();
    const { roomId } = router.query;
    if (!roomId) return (<>Oops Error!</>)

    const getPaymentsQuery = api.payments.getPayments.useQuery({ roomId: roomId as string })
    if (getPaymentsQuery.isLoading) return (<>Loading...</>)
    if (getPaymentsQuery.isError) return (<>Oops Error!</>)
    if (!getPaymentsQuery.data) return (<>Oops Error!</>)

    

    const invertPayments: Record<string, number> = {}
    getPaymentsQuery.data[0]?.room.members.forEach((member) => {
        invertPayments[member.id] = 0
    })
    getPaymentsQuery.data.forEach((payment) => {
        if (!invertPayments[payment.payerId]) {
            invertPayments[payment.payerId] = 0
        }
        invertPayments[payment.payerId] += payment.amount
    })

    const total = Object.values(invertPayments).reduce((a, b) => a + b, 0)
    const perPerson = total / Object.keys(invertPayments).length
    
    Object.keys(invertPayments).forEach((payerId) => {
        invertPayments[payerId] = (invertPayments[payerId] || 0) - perPerson
    })

    const copy: any = {...invertPayments}
    const responsibilities: any = {} 
    // proper annotation would be Record<string, Record<string, number>>
    // but setting that raises like a ton of "Object could be undefined" errors which I don't want to deal with right now

    // first sort by amount, use the largest in debt to pay the largest owed. +ve is owed, -ve is in debt
    Object.keys(copy).sort((a, b) => copy[a] - copy[b]).forEach((payerId) => {
        const amount = copy[payerId]
        if (amount > 0) {
            // payer is owed
            Object.keys(copy).sort((a, b) => copy[b] - copy[a]).forEach((payeeId) => {
                const payeeAmount = copy[payeeId]
                if (payeeAmount < 0) {
                    // payee is in debt
                    if (amount > Math.abs(payeeAmount)) {
                        // payee can pay off all debt
                        if (!responsibilities[payeeId]) {
                            responsibilities[payeeId] = {}
                        }
                        responsibilities[payeeId][payerId] = Math.abs(payeeAmount)
                        copy[payerId] = amount + payeeAmount
                        copy[payeeId] = 0
                    } else {
                        // payee can pay off some debt
                        if (!responsibilities[payeeId]) {
                            responsibilities[payeeId] = {}
                        }
                        responsibilities[payeeId][payerId] = amount
                        copy[payerId] = 0
                        copy[payeeId] = payeeAmount + amount
                    }
                }
            })
        }
    })
    

    

    

    return (<>
        <h2 className="font-medium text-xl">Balance so far</h2>
        {/* <button className="mt-10 px-4 py-2 bg-green-500 text-white rounded-md">Payout</button> */}
        {
            invertPayments && Object.keys(invertPayments).map((payerId) => {
                return (<>
                    <div className="border px-2 py-1">
                        {invertPayments[payerId]} to { getPaymentsQuery.data[0]?.room.members.find((member) => member.id === payerId)?.email }
                    </div>
                </>)
            })
        }
        <Payouts invertPayments={invertPayments} payments={getPaymentsQuery.data} />
    </>)
}

interface PayoutsProps {
    invertPayments: Record<string, number>
    payments: (SharedPayment & {
        room: SharingRoom & {
            members: User[];
        };
        payer: User;
    })[]
}

const Payouts: React.FC<PayoutsProps> = ({ invertPayments, payments }) => {

    const copy: any = {...invertPayments}
    const responsibilities: any = {} 
    // proper annotation would be Record<string, Record<string, number>>
    // but setting that raises like a ton of "Object could be undefined" errors which I don't want to deal with right now

    // first sort by amount, use the largest in debt to pay the largest owed. +ve is owed, -ve is in debt
    Object.keys(copy).sort((a, b) => copy[a] - copy[b]).forEach((payerId) => {
        const amount = copy[payerId]
        if (amount > 0) {
            // payer is owed
            Object.keys(copy).sort((a, b) => copy[b] - copy[a]).forEach((payeeId) => {
                const payeeAmount = copy[payeeId]
                if (payeeAmount < 0) {
                    // payee is in debt
                    if (amount > Math.abs(payeeAmount)) {
                        // payee can pay off all debt
                        if (!responsibilities[payeeId]) {
                            responsibilities[payeeId] = {}
                        }
                        responsibilities[payeeId][payerId] = Math.abs(payeeAmount)
                        copy[payerId] = amount + payeeAmount
                        copy[payeeId] = 0
                    } else {
                        // payee can pay off some debt
                        if (!responsibilities[payeeId]) {
                            responsibilities[payeeId] = {}
                        }
                        responsibilities[payeeId][payerId] = amount
                        copy[payerId] = 0
                        copy[payeeId] = payeeAmount + amount
                    }
                }
            })
        }
    })

    const getMeQuery = api.users.getMe.useQuery()
    if (getMeQuery.isLoading) return (<>Loading...</>)
    if (getMeQuery.isError) return (<>Oops Error!</>)
    if (!getMeQuery.data) return (<>Oops Error!</>)
    
    const router = useRouter()
    if (!getMeQuery.data.upiId) {
        router.push(`/complete?redirect=${router.asPath}`)
    }

    if (!responsibilities[getMeQuery.data.id]) return (<>Youre all set!</>)

    return (<>
        {
            Object.keys(responsibilities[getMeQuery.data.id]).map((payeeId: string) => {
                return (<>
                    <div className="border px-2 py-1">
                        <QRCode value={`upi://pay?pa=${payments[0]?.room.members.find((member) => member.id === payeeId)?.id}&am=${Math.round(responsibilities[getMeQuery.data?.id || ""][payeeId])}&cu=INR`} />
                    </div>
                </>)
            })
        }
    </>)

}

export default Room;