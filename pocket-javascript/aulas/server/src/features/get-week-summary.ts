import { and, count, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "../db";
import { goals, goalsCompletions } from "../db/schema";
import dayjs from "dayjs";

export async function getWeekSummary() {
	const firstDayOfWeek = dayjs().startOf("week").toDate();
	const lastDayOfWeek = dayjs().endOf("week").toDate();

	const goalsCreatedUpToWeek = db.$with("goals_created_up_to_week").as(
		db
			.select({
				id: goals.id,
				title: goals.title,
				desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
				createdAt: goals.createdAt,
			})
			.from(goals)
			.where(lte(goals.createdAt, lastDayOfWeek)),
	);

	const goalsCompletedInWeek = db.$with("goals_completed_in_week").as(
		db
			.select({
				id: goals.id,
				title: goals.title,
				completedAt: goalsCompletions.createdAt,
				completedAtDate: sql /*sql*/`
          DATE(${goalsCompletions.createdAt}).
          `.as("completedAtDate"),
			})
			.from(goalsCompletions)
			.innerJoin(goals, eq(goals.id, goalsCompletions.goalId))
			.where(
				and(
					gte(goalsCompletions.createdAt, firstDayOfWeek),
					lte(goalsCompletions.createdAt, lastDayOfWeek),
				),
			),
	);

	return {
		summary: "teste",
	};
}
