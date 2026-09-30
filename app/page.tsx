import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

const Home = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/login");
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div>
        <h1>Welcome to the Home Page</h1>
        <br />
        <UserButton />

        <br />

        <Link href="/transactions">Go to Transactions</Link>
      </div>
    </div>
  );
};

export default Home;
