import { notFound } from "next/navigation";
import PortfolioForm from "@/components/PortfolioForm";
import { getPortfolio } from "@/lib/getPortfolio";

export const metadata = { title: "Create Portfolio | Portfolio Generator" };
export const dynamic = "force-dynamic";

export default async function CreatePage({ searchParams }) {
  const { edit } = await searchParams; // the ?edit=... part of the URL

  let portfolio = null;
  if (edit) {
    portfolio = await getPortfolio(edit); // null if the id is wrong or missing
    if (!portfolio) notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900">
        {portfolio ? "Edit your portfolio" : "Create your portfolio"}
      </h1>
      <p className="mb-8 mt-2 text-gray-600">
        {portfolio
          ? "Change anything you like, then save. Your template choice stays the same."
          : "Fill in your information. After saving, you will choose a template."}
      </p>
      <PortfolioForm key={portfolio ? portfolio.id : "new"} portfolio={portfolio} />
    </div>
  );
}