import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

/* 

model SharingRoom {
    id       String   @id @default(cuid())
    name     String
    createdById String
    createdBy User     @relation(fields: [createdById], references: [id], onDelete: Cascade)
    members    User[]  @relation("SharingRoomMembers")
}
*/

export const roomRouter = createTRPCRouter({
    createRoom: protectedProcedure
        .input(z.object({
            name: z.string(),
        }))
        .mutation(({ input, ctx }) => {
            return ctx.prisma.sharingRoom.create({
                data: {
                    name: input.name,
                    createdBy: {
                        connect: {
                            id: ctx.session.user.id,
                        },
                    },
                    members: {
                        connect: {
                            id: ctx.session.user.id,
                        }
                    },
                },
            });
        }),
    getRooms: protectedProcedure
        .query(({ ctx }) => {
            return ctx.prisma.sharingRoom.findMany({
                where: {
                    OR: [
                        {
                            createdById: ctx.session.user.id,
                        },
                        {
                            members: {
                                some: {
                                    id: ctx.session.user.id,
                                },
                            },
                        },
                    ],
                },
                include: {
                    members: true
                }
            });
        }),
    getRoom: protectedProcedure
        .input(z.object({
            id: z.string(),
        }))
        .query(({ input, ctx }) => {
            return ctx.prisma.sharingRoom.findFirst({
                where: {
                    id: input.id,
                    OR: [
                        {
                            createdById: ctx.session.user.id,
                        },
                        {
                            members: {
                                some: {
                                    id: ctx.session.user.id,
                                },
                            },
                        },
                    ],
                },
                include: {
                    members: true,
                    createdBy: true
                }
            });
        }),
    joinRoom: protectedProcedure
        .input(z.object({
            id: z.string(),
        }))
        .mutation(({ input, ctx }) => {
            return ctx.prisma.sharingRoom.update({
                where: {
                    id: input.id,
                },
                data: {
                    members: {
                        connect: {
                            id: ctx.session.user.id,
                        },
                    },
                },
            });
        }),
    leaveRoom: protectedProcedure
        .input(z.object({
            id: z.string(),
        }))
        .mutation(({ input, ctx }) => {
            return ctx.prisma.sharingRoom.update({
                where: {
                    id: input.id,
                },
                data: {
                    members: {
                        disconnect: {
                            id: ctx.session.user.id,
                        },
                    },
                },
            });
        }),
    deleteRoom: protectedProcedure
        .input(z.object({
            id: z.string(),
        }))
        .mutation(({ input, ctx }) => {
            return ctx.prisma.sharingRoom.delete({
                where: {
                    id: input.id,
                },
            });
        }),
    updateRoom: protectedProcedure
        .input(z.object({
            id: z.string(),
            name: z.string(),
        }))
        .mutation(({ input, ctx }) => {
            return ctx.prisma.sharingRoom.update({
                where: {
                    id: input.id,
                },
                data: {
                    name: input.name,
                },
            });
        }),
})