import { redirect } from "next/navigation";

/**
 * Root page redirects to /team.
 */
export default function Home() {
  redirect("/team");
}
