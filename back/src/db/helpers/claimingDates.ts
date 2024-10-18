import { BadRequestError, BadRequestErrorKeys } from '../../server/errors';

export const addOneMonth = (date: Date) => {
  const inputDate = new Date(date);
  const day = inputDate.getDate();
  const year = inputDate.getFullYear();
  let month = inputDate.getMonth() + 1;
  let nextYear = year;

  if (month === 12) {
    nextYear++;
    month = 1;
  } else {
    month++;
  }

  const newDate = new Date(nextYear, month - 1, day);
  return newDate;
};

export const addDays = (date: Date, days: number) => {
  const newDate = new Date(date);

  newDate.setDate(newDate.getDate() + days);

  return newDate;
};

export const getClaimingDates = ({
  claimingDates,
  oldClaimingDates,
  questEndAt,
}: {
  claimingDates: {
    start?: Date;
    end?: Date;
  };
  oldClaimingDates?: {
    start?: Date;
    end?: Date;
  };
  questEndAt: Date;
}) => {
  const result: {
    start: Date;
    end: Date;
  } = { start: addDays(questEndAt, 3), end: addOneMonth(questEndAt) };

  if (claimingDates.start && new Date(claimingDates.start).getTime() < new Date(questEndAt).getTime()) {
    throw new BadRequestError(
      BadRequestErrorKeys.NotValidDataProvided,
      `claimingStartAt can't be less than questEndAt`,
    );
  }

  if (
    claimingDates.start &&
    claimingDates.end &&
    new Date(claimingDates.start).getTime() > new Date(claimingDates.end).getTime()
  ) {
    throw new BadRequestError(
      BadRequestErrorKeys.NotValidDataProvided,
      `claimingEndAt can't be less than claimingStartAt`,
    );
  }

  if (claimingDates.start && new Date(claimingDates.start).getTime() >= new Date(questEndAt).getTime()) {
    result.start = claimingDates.start;
  }

  if (claimingDates.end && new Date(claimingDates.end).getTime() > new Date(result.start).getTime()) {
    result.end = claimingDates.end;
  }

  if (result.start.getTime() > result.end.getTime()) {
    throw new BadRequestError(
      BadRequestErrorKeys.NotValidDataProvided,
      `claimingStartAt can't be greater than claimingEndAt`,
    );
  }

  return result;
};
