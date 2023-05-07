import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";


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

export const paymentRouter = createTRPCRouter({
    createPayment: protectedProcedure
        .input(z.object({
            note: z.string(),
            amount: z.number(),
            roomId: z.string(),
        }))
        .mutation(({ input, ctx }) => {
            return ctx.prisma.sharedPayment.create({
                data: {
                    note: input.note,
                    amount: input.amount,
                    room: {
                        connect: {
                            id: input.roomId,
                        }
                    },
                    payer: {
                        connect: {
                            id: ctx.session.user.id,
                        },
                    },
                },
            });
        }),
    getPayments: protectedProcedure
        .input(z.object({
            roomId: z.string(),
        }))
        .query(({ input, ctx }) => {
            return ctx.prisma.sharedPayment.findMany({
                where: {
                    roomId: input.roomId,
                },
                include: {
                    payer: true,
                    room: {
                        include: {
                            members: true,
                        },
                    },
                }
            });
        }),
})