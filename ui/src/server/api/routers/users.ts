import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  setPhonendoId: protectedProcedure
    .input(z.object({ userId: z.string(), phonendoId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.update({
        where: { id: input.userId },
        data: {
          phonendo_id: input.phonendoId,
        },
      });
    }),
  getPatientData: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.user.findUnique({
        where: {
          id: input.userId,
        },
        include: {
          patient_journal_records: {
            orderBy: [
              {
                date: "desc",
              },
              {
                time: "desc",
              },
            ],
          },
        },
      });
    }),
});
