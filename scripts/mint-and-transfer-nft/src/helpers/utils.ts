/*
  Sleep Process
    Args: msec<number>
    Return: void

    Note: 1000 msec == 1 sec
*/
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
