export function getCurrentItemIndex(array: any[]) {
  const currentDate = new Date().getTime();

  for (let i = 0; i < array.length; i++) {
    const { startAt, endAt } = array[i];
    // If Daily Tasks not started, we need send only first task
    if (i === 0 && new Date(startAt).getTime() > new Date().getTime()) {
      return i;
    }
    // If Daily Tasks ended, we need send only last task
    if (
      i === array.length - 1 &&
      new Date(endAt).getTime() <= new Date().getTime()
    ) {
      return i;
    }

    if (new Date(currentDate).getTime() <= new Date(endAt).getTime()) {
      return i;
    }

    return i;
  }
  return -1;
}
