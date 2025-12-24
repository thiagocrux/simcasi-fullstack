export const mockApiCall = (
  success: boolean = true,
  data?: unknown,
  delay: number = 2000
) => {
  return new Promise((resolve, reject) => {
    const defaultData = {
      success: true,
      data: null,
      errors: {} as Record<string, string[]>,
    };

    setTimeout(() => {
      // Simulates a success case
      if (success) {
        resolve(data ?? defaultData);
        return;
      }

      // Simulates an error
      reject(new Error('MockApiCall'));
    }, delay);
  });
};
