import { z } from "zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { createGoal } from "../../features/create-goal";

export const createGoalRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/goals",
		{
			schema: {
				body: z.object({
					title: z.string(),
					desiredWeeklyFrequency: z.number().int().min(1).max(7),
				}),
			},
		},
		async (request) => {
			const { title, desiredWeeklyFrequency } = request.body;

			await createGoal({
				title,
				desiredWeeklyFrequency,
			});
		},
	);
};
