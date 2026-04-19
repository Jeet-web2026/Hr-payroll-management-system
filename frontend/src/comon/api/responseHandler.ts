import { toast } from "sonner";

export function ResponseHandler(responseData: any) {
  const data = responseData.response?.data ?? responseData.data;
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  if (data?.success) {
    toast.success(responseData.response?.message, { position: "top-right", richColors: true });
    return;
  }

  if (data?.success === false) {
    const errorMessages = responseData.response?.message;

    if (Array.isArray(errorMessages)) {
      errorMessages.forEach((element: string, index: number) => {
        setTimeout(() => {
          toast.error(capitalize(element), {
            position: "top-right",
            richColors: true,
          });
        }, index * 800);
      });
    } else {
      toast.error(capitalize(errorMessages), {
        position: "top-right",
        richColors: true,
      });
    }
  }
}
