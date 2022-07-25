/*
  Sleep Process
    Args: msec
    Return: void

    Note: 1000 msec == 1 sec
*/
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
