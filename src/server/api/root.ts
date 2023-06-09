import { createTRPCRouter } from "~/server/api/trpc";
import { roomRouter } from './routers/roomRouter';
import { paymentRouter } from "./routers/paymentRouter";
import { userRouter } from './routers/userRouter';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  rooms: roomRouter,
  payments: paymentRouter,
  users: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
