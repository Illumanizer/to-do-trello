import Board from "@/components/Board";
import Header from "@/components/Header";
import { auth } from "@clerk/nextjs";

export default function Home() {
  const { userId } = auth();

  return (
    <main>
      <Header />
      <Board userId={userId} />
    </main>
  );
}
