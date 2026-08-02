import { useCurrentUser } from "./userData";

export function useRoleLabel(): string | undefined {
  const { data: currentUser } = useCurrentUser();

  if (currentUser?.role === 'admin') {
    return 'Companies';
  }
  if (currentUser?.role === 'hr') {
    return 'Employees';
  }

  return undefined;
}