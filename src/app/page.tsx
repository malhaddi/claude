import { redirect } from "next/navigation";

// The dashboard has no standalone landing page yet; send users straight to
// the first section.
export default function Home() {
  redirect("/instagram");
}
