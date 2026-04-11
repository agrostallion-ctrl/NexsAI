import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login"); // 👈 yaha se login page open hoga
}