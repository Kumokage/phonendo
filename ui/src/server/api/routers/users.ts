import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  setPhonendoId: protectedProcedure
    .input(z.object({ userId: z.string(), phonendoId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: input.userId },
        data: {
          phonendo_id: input.phonendoId,
        },
      });
    }),
});
