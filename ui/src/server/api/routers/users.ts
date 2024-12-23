import { Role } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  setPhonendoId: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        phonendoId: z.number(),
        isDoctor: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const role = input.isDoctor ? Role.DOCTOR : Role.PATIENT;
      return await ctx.db.user.update({
        where: { id: input.userId },
        data: {
          phonendo_id: input.phonendoId,
          role: role,
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
  getDoctorPatientsData: protectedProcedure
    .input(z.object({ doctorId: z.number() }))
    .query(async ({ ctx, input }) => {
      const patients = (
        (await ctx.db.journalRecord.findMany({
          where: {
            doctor_id: input.doctorId,
          },
          distinct: "patient_id",
          select: {
            patient_id: true,
          },
        })) ?? []
      )
        .map((v) => v.patient_id)
        .filter((v) => v != null);
      return (
        (await ctx.db.user.findMany({
          where: {
            phonendo_id: {
              in: patients,
            },
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
              take: 1,
            },
          },
        })) ?? []
      );
    }),
});
