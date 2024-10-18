import { FindConditions, ObjectID, ObjectLiteral, getManager, getRepository } from 'typeorm';
import { LoyaltyTask, TaskProgress } from '../entity';
import { DailyStatus, DailyTaskProgressBody } from '../types/interfaces/taskProgress/dailyTask.types';
import {
  LoyaltyProjectUsersScoreboard,
  LoyaltyProjectsScoreboard,
  LoyaltyTaskType,
  QuestStatus,
  QuestType,
  SuggestionStatus,
} from '../types/interfaces/loyalty';
import { DailyTaskBody, QuizLoyaltyTaskBody } from '../types/interfaces/loyalty/tasks';
import { Repository } from 'typeorm/repository/Repository';
import { QuizProgressBody, QuizTypesStatus } from '../types/interfaces/taskProgress/quiz.types';
import { TwitterTaskProgressBody } from '../types/interfaces/taskProgress/twitterUnlimited.types';
import { InviteTaskProgressBody } from '../types/interfaces/taskProgress/inviteTask.types';
import {
  GET_EARNED_POINTS,
  GET_ELIGIBLE_USERS_COUNT,
  GET_INVESTOR_SCOREBOARD_INFO,
  GET_MIN_PLACE_POINTS,
  GET_PARTICIPANTS,
  GET_PARTICIPATED_PROJECTS_COUNT,
  GET_PARTNER_PROJECT_PARTICIPANTS,
  GET_SCOREBOARD,
  GET_SCOREBOARD_PAGINATE,
  GET_TASKS_COMPLETION,
  GET_TASKS_COMPLETION_BY_DATES,
  GET_TASKS_COUNT_COMPLETION,
  GET_UNIQUE_INVESTORS_OF_LOYALTY_PROJECT,
  getCountAndGroupByProjectIdsQuery,
  getRandomForLuckyDrawQuery,
} from '../queries/taskProgressQueries';
import { ConflictError, ConflictErrorKeys } from '../../server/errors';

export class TaskProgressModel {
  async findOrCreateInviteTaskProgress(investorId: number, loyaltyTask: LoyaltyTask, body: InviteTaskProgressBody) {
    const repository: Repository<TaskProgress> = getRepository(TaskProgress);

    const taskProgress = await repository.findOne({
      where: {
        investorId,
        loyaltyTaskId: loyaltyTask.id,
      },
    });

    if (taskProgress) return taskProgress;

    return await repository.save({
      investorId,
      loyaltyTaskId: loyaltyTask.id,
      loyaltyProjectId: loyaltyTask.loyaltyProjectId,
      completedAt: new Date(),
      json: body,
    });
  }

  async getByLoyaltyTaskId(loyaltyTaskId: number): Promise<TaskProgress[] | []> {
    const taskProgresses = await getRepository(TaskProgress).find({
      where: {
        loyaltyTaskId,
      },
    });

    if (!taskProgresses) {
      return [];
    }
    return taskProgresses;
  }

  async findOrCreateDailyTaskProgress(investorId: number, loyaltyTask: LoyaltyTask) {
    const repository: Repository<TaskProgress> = getRepository(TaskProgress);

    const taskProgress = await repository.findOne({
      where: {
        investorId,
        loyaltyTaskId: loyaltyTask.id,
      },
    });

    if (taskProgress) return taskProgress;

    return await repository.save({
      investorId,
      loyaltyTaskId: loyaltyTask.id,
      loyaltyProjectId: loyaltyTask.loyaltyProjectId,
      json: [],
    });
  }
  async findOrCreateTaskProgressForCustomWebhook(investorId: number, loyaltyTask: LoyaltyTask, requestBody) {
    const repository: Repository<TaskProgress> = getRepository(TaskProgress);

    const taskProgress = await repository.findOne({
      where: {
        investorId,
        loyaltyTaskId: loyaltyTask.id,
      },
    });

    if (taskProgress) return taskProgress;

    return await repository.save({
      investorId,
      loyaltyTaskId: loyaltyTask.id,
      loyaltyProjectId: loyaltyTask.loyaltyProjectId,
      completedAt: new Date(),
      json: requestBody,
      earnedPoints: loyaltyTask.points,
    });
  }
  async updateOrCreateDailyTaskProgress(investorId: number, loyaltyTask: LoyaltyTask, requestBody: any) {
    const repository: Repository<TaskProgress> = getRepository(TaskProgress);

    const taskProgress = await repository.findOne({
      where: {
        investorId,
        loyaltyTaskId: loyaltyTask.id,
      },
      join: {
        alias: 'taskProgress',
        leftJoinAndSelect: {
          loyaltyTask: 'taskProgress.loyaltyTask',
        },
      },
    });

    const subTask = (loyaltyTask.body as DailyTaskBody).subTasks.find(
      (subTask) =>
        new Date(subTask.startAt).getTime() <= new Date().getTime() &&
        new Date().getTime() <= new Date(subTask.endAt).getTime(),
    );
    if (!subTask) return null;

    if (taskProgress) {
      const isDailySubTaskDuplicate: boolean = (taskProgress.json as DailyTaskProgressBody[]).filter((obj) => {
        return obj.id === requestBody.id;
      }).length
        ? true
        : false;

      if (isDailySubTaskDuplicate) {
        throw new ConflictError(ConflictErrorKeys.ConflictError, 'You have already completed this daily task');
      }

      if (loyaltyTask.type === LoyaltyTaskType.Daily) {
        (requestBody as DailyTaskProgressBody).status = DailyStatus.Confirmed;
        (taskProgress.json as DailyTaskProgressBody[]).push({
          ...requestBody,
          status: DailyStatus.Confirmed,
        });
        taskProgress.earnedPoints += subTask?.points || 0;
        taskProgress.completedAt = new Date();
      }

      await repository.update(taskProgress.id, {
        json: taskProgress.json,
        completedAt: new Date(),
        earnedPoints: taskProgress.earnedPoints ? taskProgress.earnedPoints : 0,
      });
      return taskProgress.completedAt;
    }

    if (loyaltyTask.type === LoyaltyTaskType.Daily) {
      (requestBody as DailyTaskProgressBody).status = DailyStatus.Confirmed;
    }

    const newTaskProgress: any = await repository.save({
      investorId,
      loyaltyTaskId: loyaltyTask.id,
      loyaltyProjectId: loyaltyTask.loyaltyProjectId,
      json: [requestBody],
      earnedPoints: subTask?.points || 0,
      completedAt: new Date(),
    });

    return await newTaskProgress;
  }

  async updateOrCreateQuizTaskProgress(
    investorId: number,
    loyaltyTask: LoyaltyTask,
    requestBody: any,
  ): Promise<TaskProgress> {
    const repository: Repository<TaskProgress> = getRepository(TaskProgress);
    let taskProgress = await repository.findOne({ investorId, loyaltyTaskId: loyaltyTask.id });

    const bodyItem = {
      id: taskProgress && taskProgress.json ? (taskProgress.json as QuizProgressBody[]).length : 0,
      answer: requestBody.answer,
      status: (loyaltyTask.body as QuizLoyaltyTaskBody).answers
        .map((a) => a.toLowerCase())
        .includes(requestBody.answer.toLowerCase())
        ? QuizTypesStatus.COMPLETED
        : QuizTypesStatus.INVALID,
    } as QuizProgressBody;

    const completed = bodyItem.status === QuizTypesStatus.COMPLETED;
    if (!taskProgress) {
      taskProgress = await repository.save({
        investorId,
        loyaltyTaskId: loyaltyTask.id,
        loyaltyProjectId: loyaltyTask.loyaltyProjectId,
        json: [bodyItem],
        earnedPoints: completed ? loyaltyTask.points : 0,
        completedAt: completed ? new Date() : null,
      });
      return taskProgress;
    }

    if (completed) {
      taskProgress.earnedPoints += loyaltyTask.points;
      taskProgress.completedAt = new Date();
    }

    (taskProgress.json as QuizProgressBody[]).push(bodyItem);
    await repository.save(taskProgress);
    return taskProgress;
  }

  async createImageUploadTaskProgress(investorId: number, loyaltyTask: LoyaltyTask, imgSrc: any) {
    const repository: Repository<TaskProgress> = getRepository(TaskProgress);
    return repository.save({
      investorId,
      loyaltyTaskId: loyaltyTask.id,
      loyaltyProjectId: loyaltyTask.loyaltyProjectId,
      json: {
        imgSrc,
      },
      earnedPoints: loyaltyTask.points,
      completedAt: new Date(),
    });
  }

  getSuggestionsByStatus(status: SuggestionStatus) {
    return getRepository(TaskProgress)
      .createQueryBuilder('taskProgress')
      .leftJoinAndSelect('taskProgress.loyaltyTask', 'loyaltyTask')
      .leftJoinAndSelect('taskProgress.investor', 'investor')
      .leftJoinAndSelect('loyaltyTask.loyaltyProject', 'loyaltyProject')
      .where('loyaltyTask.type = :type', { type: LoyaltyTaskType.Suggestion })
      .andWhere('taskProgress.json ::jsonb @> :json', { json: { status } })
      .getMany();
  }

  getSuggestionsByStatusAndIds(status: SuggestionStatus, ids: number[]) {
    return getRepository(TaskProgress)
      .createQueryBuilder('taskProgress')
      .leftJoinAndSelect('taskProgress.loyaltyTask', 'loyaltyTask')
      .where('loyaltyTask.type = :type', { type: LoyaltyTaskType.Suggestion })
      .andWhereInIds(ids)
      .andWhere('taskProgress.json ::jsonb @> :json', { json: { status } })
      .getMany();
  }

  getSuggestionTaskByBodyDescription(description: string) {
    return getRepository(TaskProgress)
      .createQueryBuilder('taskProgress')
      .leftJoinAndSelect('taskProgress.loyaltyTask', 'loyaltyTask')
      .where('loyaltyTask.type = :type', { type: LoyaltyTaskType.Suggestion })
      .andWhere('taskProgress.json ::jsonb @> :json', { json: { description } })
      .getOne();
  }

  getTwitterUnlimitedTasksForChecking() {
    return getRepository(TaskProgress)
      .createQueryBuilder('taskProgress')
      .leftJoinAndSelect('taskProgress.loyaltyTask', 'loyaltyTask')
      .where(`taskProgress.json ->> 'unlimitedEndAt' > NOW()`)
      .getMany();
  }

  getTwitterUnlimitedTaskByTweetId(tweetId: any, loyaltyTaskId: number, investorId: number) {
    return getRepository(TaskProgress)
      .createQueryBuilder('taskProgress')
      .where(`json ->> 'tweetId' = :tweetId`, { tweetId })
      .andWhere('loyaltyTaskId = :loyaltyTaskId', { loyaltyTaskId })
      .andWhere('investorId = :investorId', { investorId })
      .getOne();
  }

  async patchTwitterUnlimitedTasks(
    tweetId: any,
    loyaltyTaskId: number,
    investorId: number,
    propertiesToUpdate: Partial<TwitterTaskProgressBody>,
  ) {
    const old = await this.getTwitterUnlimitedTaskByTweetId(tweetId, loyaltyTaskId, investorId);

    const { affected } = await getRepository(TaskProgress)
      .createQueryBuilder()
      .update(TaskProgress)
      .set({ json: { ...(old?.json || {}), ...propertiesToUpdate } })
      .where(`json ->> 'tweetId' = :tweetId`, { tweetId })
      .andWhere('loyaltyTaskId = :loyaltyTaskId', { loyaltyTaskId })
      .andWhere('investorId = :investorId', { investorId })
      .execute();

    if (affected === 0) {
      return null;
    }

    const updatedEntity = await this.getTwitterUnlimitedTaskByTweetId(tweetId, loyaltyTaskId, investorId);
    return updatedEntity;
  }

  async getParticipants(loyaltyProjectId: number) {
    const manager = getManager();

    const [{ participants }] = await manager.query(GET_PARTICIPANTS, [loyaltyProjectId]);

    return participants;
  }

  async getPartnerProjectParticipants(partnerProjectId: number) {
    const manager = getManager();

    const [{ participants }] = await manager.query(GET_PARTNER_PROJECT_PARTICIPANTS, [partnerProjectId]);

    return participants;
  }

  async getTasksCountCompletion(loyaltyProjectId: number) {
    const manager = getManager();

    const data = await manager.query(GET_TASKS_COUNT_COMPLETION, [loyaltyProjectId]);

    return data as { tasksCount: number; completionCount: number }[];
  }

  async getTasksCompletion(loyaltyProjectId: number) {
    const manager = getManager();

    const data = await manager.query(GET_TASKS_COMPLETION, [loyaltyProjectId]);

    return data as { id: number; title: string; completionCount: number }[];
  }

  async getTasksCompletionByDates(loyaltyProjectId: number, startDate: Date, endDate: Date) {
    const manager = getManager();

    const data = await manager.query(GET_TASKS_COMPLETION_BY_DATES, [
      loyaltyProjectId,
      new Date(startDate).toUTCString(),
      new Date(endDate).toUTCString(),
    ]);

    return data as { id: number; title: string; completionCount: number; total: number }[];
  }

  getWithUniqueLoyaltyProjectIds(investorId: number) {
    return getRepository(TaskProgress)
      .createQueryBuilder('taskProgress')
      .leftJoinAndSelect('taskProgress.loyaltyProject', 'loyaltyProject')
      .where('taskProgress.investorId=:investorId', { investorId })
      .distinctOn(['taskProgress.loyaltyProjectId'])
      .getMany();
  }

  async getCountWithUniqueLoyaltyProjectIds(investorId: number) {
    const manager = getManager();

    const [{ projectsCount }] = await manager.query(GET_PARTICIPATED_PROJECTS_COUNT, [investorId]);

    return projectsCount;
  }

  async getEarnedPoints(loyaltyProjectId: number, investorId: number) {
    const manager = getManager();

    const [{ totalPoints }] = await manager.query(GET_EARNED_POINTS, [loyaltyProjectId, investorId]);

    return totalPoints as number;
  }

  async getScoreboard(
    linkTitle: string,
    investorId: number | undefined,
    page: number,
    pageSize: number,
    usePagination = true,
  ): Promise<{
    total: number;
    userInfo: LoyaltyProjectUsersScoreboard | null;
    scoreboard: LoyaltyProjectsScoreboard[];
    luckyDrawWinnersCount: number | null;
    eligibleUsersCount: number | null;
  } | null> {
    const manager = getManager();

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const query = usePagination ? GET_SCOREBOARD_PAGINATE : GET_SCOREBOARD;

    const params = usePagination
      ? [
          linkTitle,
          investorId || null,
          QuestType.LuckyDraw,
          QuestType.Guaranteed,
          take,
          skip,
          QuestStatus.Active,
          QuestStatus.Completed,
        ]
      : [
          linkTitle,
          investorId || null,
          QuestType.LuckyDraw,
          QuestType.Guaranteed,
          QuestStatus.Active,
          QuestStatus.Completed,
        ];

    const [response] = await manager.query(query, params);

    return response?.result || null;
  }

  async getInvestorScoreboardInfo(loyaltyProjectId: number, investorId: number) {
    const manager = getManager();

    const res = await manager.query(GET_INVESTOR_SCOREBOARD_INFO, [loyaltyProjectId, investorId]);

    return {
      place: res[0]?.place || 0,
      earnedPoints: res[0]?.earnedPoints,
    };
  }

  async getMinPlacePoints(questId: number, startPlace: number, endPlace: number) {
    const manager = getManager();

    const res = await manager.query(GET_MIN_PLACE_POINTS, [questId, startPlace, endPlace]);

    return res[0]?.minPoints || 0;
  }

  getCountAndGroupByProjectIds(loyaltyProjectIds: number[], days: number) {
    const manager = getManager();

    return manager.query(getCountAndGroupByProjectIdsQuery(loyaltyProjectIds, days)) as Promise<
      {
        loyaltyProjectId: number;
        count: number;
      }[]
    >;
  }

  getRandomForLuckyDraw(
    loyaltyProjectId: number,
    minTokenAmount: number,
    maxCount: number,
    excludedInvestorIds: number[],
  ) {
    const manager = getManager();

    return manager.query(getRandomForLuckyDrawQuery(excludedInvestorIds), [
      loyaltyProjectId,
      minTokenAmount,
      maxCount,
    ]) as Promise<
      {
        loyaltyProjectId: number;
        investorId: number;
        earnedPoints: number;
      }[]
    >;
  }

  async getLuckyDrawEligibleUsersCount(loyaltyProjectId: number, threshold: number) {
    const manager = getManager();

    const res = await manager.query(GET_ELIGIBLE_USERS_COUNT, [loyaltyProjectId, threshold]);

    return Number(res[0]?.count) || 0;
  }

  // Base Methods
  getOneByConditionsWithRelations(
    conditions?: string | ObjectLiteral | FindConditions<TaskProgress> | FindConditions<TaskProgress>[],
    relations?: string[],
  ) {
    return getRepository(TaskProgress).findOne({ where: conditions, relations });
  }

  getByConditionsWithRelations(
    conditions?: string | ObjectLiteral | FindConditions<TaskProgress> | FindConditions<TaskProgress>[],
    relations?: string[],
  ) {
    return getRepository(TaskProgress).find({
      where: conditions,
      relations,
      order: {
        loyaltyTaskId: 'ASC',
      },
    });
  }

  getByInvestor(investorId): Promise<TaskProgress[] | undefined> {
    return getRepository(TaskProgress).find({
      where: {
        investorId,
      },
    });
  }

  getByInvestorAndProjectId(investorId, loyaltyProjectId): Promise<TaskProgress[] | undefined> {
    return getRepository(TaskProgress).find({
      where: {
        investorId,
        loyaltyProjectId,
      },
    });
  }

  getCountByInvestorAndProjectId(investorId, loyaltyProjectId): Promise<number> {
    return getRepository(TaskProgress).count({
      where: {
        investorId,
        loyaltyProjectId,
      },
    });
  }

  getByInvestorAndTaskId(investorId, loyaltyTaskId): Promise<TaskProgress | undefined> {
    return getRepository(TaskProgress).findOne({
      where: {
        investorId,
        loyaltyTaskId,
      },
    });
  }

  async findAll() {
    const taskProgresses = await getRepository(TaskProgress)
      .createQueryBuilder('taskProgress')
      .leftJoinAndSelect('taskProgress.loyaltyProject', 'loyaltyProject')
      .leftJoinAndSelect('taskProgress.loyaltyTask', 'loyaltyTask')
      .getMany();

    return taskProgresses;
  }

  findById(id: number) {
    return getRepository(TaskProgress).findOne(id);
  }

  async save(progresses: TaskProgress[]) {
    return getRepository(TaskProgress).save(progresses);
  }

  deleteById(id: number) {
    return getRepository(TaskProgress).delete({ id });
  }

  deleteByConditions(
    conditions:
      | string
      | number
      | Date
      | ObjectID
      | string[]
      | number[]
      | Date[]
      | ObjectID[]
      | FindConditions<TaskProgress>,
  ) {
    return getRepository(TaskProgress).delete(conditions);
  }

  getCount(
    conditions?: string | ObjectLiteral | FindConditions<TaskProgress> | FindConditions<TaskProgress>[],
    relations?: string[],
  ) {
    return getRepository(TaskProgress).count({ where: conditions, relations });
  }

  async getByInviteCode(inviteCode: string) {
    const taskProgress = await getRepository(TaskProgress)
      .createQueryBuilder('taskProgress')
      .where("json->>'inviteCode' = :inviteCode", { inviteCode })
      .getOne();

    return taskProgress;
  }

  async getInviterTaskProgress(investorId: number, loyaltyProjectId: number) {
    const taskProgress = await getRepository(TaskProgress)
      .createQueryBuilder('taskProgress')
      .leftJoinAndSelect('taskProgress.loyaltyTask', 'loyaltyTask')
      .where('taskProgress.loyaltyProjectId = :loyaltyProjectId', { loyaltyProjectId })
      .andWhere(`json->'invitedInvestorIds' @> :invitedInvestorId::jsonb`, {
        invitedInvestorId: JSON.stringify([investorId]),
      })
      .getOne();

    return taskProgress;
  }

  async getInviterTaskProgressByInvitedInvestorId(invitedInvestorId: number) {
    const taskProgress = await getRepository(TaskProgress)
      .createQueryBuilder('taskProgress')
      .leftJoinAndSelect('taskProgress.loyaltyTask', 'loyaltyTask')
      .where(`json->'invitedInvestorIds' @> :invitedInvestorId::jsonb`, {
        invitedInvestorId: JSON.stringify([invitedInvestorId]),
      })
      .getOne();

    return taskProgress;
  }

  async getByInvestorAndTaskTypes(investorId: number, types: string[]) {
    const taskProgresses = await getRepository(TaskProgress)
      .createQueryBuilder('taskProgress')
      .leftJoinAndSelect('taskProgress.loyaltyTask', 'loyaltyTask')
      .where('loyaltyTask.type IN (:...types)', { types })
      .andWhere('taskProgress.investorId = :investorId', { investorId })
      .getMany();

    return taskProgresses;
  }

  async addInvitedInvestor(inviterInviteCode: string, invitedInvestorId: number) {
    const taskProgress = await getRepository(TaskProgress)
      .createQueryBuilder('taskProgress')
      .where("json->>'inviteCode' = :inviterInviteCode", { inviterInviteCode })
      .getOne();

    if (!taskProgress) {
      return undefined;
    }

    const json = taskProgress.json as InviteTaskProgressBody;
    const invitedInvestorIds =
      json.invitedInvestorIds && json.invitedInvestorIds.length > 0 ? json.invitedInvestorIds : [];

    if (!invitedInvestorIds.includes(invitedInvestorId)) {
      invitedInvestorIds.push(invitedInvestorId);
    }

    const result = await getRepository(TaskProgress)
      .createQueryBuilder()
      .update(TaskProgress)
      .where('id = :id', { id: taskProgress.id })
      .set({ json: { ...json, ...{ invitedInvestorIds } } })
      .returning('*')
      .execute();

    return result.raw[0];
  }

  removeTaskProgresses(taskProgresses: TaskProgress[]) {
    return getRepository(TaskProgress).remove(taskProgresses);
  }

  async findUniqueInvestorsIDsByLoyaltyProjectId(loyaltyProjectId: number): Promise<number[]> {
    const manager = getManager();
    const results = await manager.query(GET_UNIQUE_INVESTORS_OF_LOYALTY_PROJECT, [loyaltyProjectId]);
    return [...new Set(results.map((row: any) => row.investorId))] as number[];
  }

  async getUniqueQuestIdsSortedByDate(investorId: number) {
    const uniqueIds: number[] = [];
    const currDate = new Date();
    const today = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate(), 0, 0, 0);
    const taskProgresses = await getRepository(TaskProgress)
      .createQueryBuilder('taskProgress')
      .where('taskProgress.investorId = :investorId', { investorId })
      .andWhere('taskProgress.createdDate >= :today', { today })
      .orderBy('taskProgress.createdDate', 'ASC')
      // .distinctOn(['taskProgress.loyaltyProjectId'])
      .getMany();

    for (const taskProgress of taskProgresses) {
      if (!uniqueIds[taskProgress.loyaltyProjectId]) {
        uniqueIds.push(taskProgress.loyaltyProjectId);
      }
    }

    return uniqueIds;
  }
}

export const taskProgressModel = new TaskProgressModel();
