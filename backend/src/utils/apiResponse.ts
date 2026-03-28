export const apiResponse = (
  success: boolean,
  data: any = null,
  message = "",
  error: any = null,
) => ({
  success,
  data,
  message,
  error,
});
