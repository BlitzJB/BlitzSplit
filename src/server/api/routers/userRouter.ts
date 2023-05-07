import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  updateUPIId: protectedProcedure
    .input(z.object({
      upiId: z.string(),
    }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          upiId: input.upiId,
        },
      });
    }),
  getMe: protectedProcedure
    .query(({ ctx }) => {
      return ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });
    })
});
