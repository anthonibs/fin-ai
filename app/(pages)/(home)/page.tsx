import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SummaryCards from "./_components/summary-cards";
import Navbar from "@/app/_components/shared/navbar";
import TimeSelect from "./_components/time-select";
import { isMatch } from "date-fns";

const Home = async ({ searchParams }: { searchParams: { month: string } }) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/login");
  }

  const resolvedSearchParams = await searchParams;
  const monthIsInvalid = !resolvedSearchParams.month || !isMatch(resolvedSearchParams.month, "MM");

  if (monthIsInvalid) {
    return redirect("/?month=01");
  }

  return (
    <>
      <Navbar />

      <div className="space-y-6 p-6">
        <div className="flex justify-between p-6">
          <h1>Dashboard</h1>

          <TimeSelect />
        </div>
        <SummaryCards month={resolvedSearchParams.month} />
      </div>
    </>
  );
};

export default Home;
