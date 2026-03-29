export function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}
