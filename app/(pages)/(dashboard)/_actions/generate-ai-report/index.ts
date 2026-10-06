"use server";

import { db } from "@/app/_lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { OpenAI } from "openai";
import { generateAiReportSchema } from "./schema";

export const generateAiReport = async ({ month }: { month: string }): Promise<string> => {
  generateAiReportSchema.parse({ month });

  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const clerk = await clerkClient();
  const userClerk = await clerk.users.getUser(userId);

  const hasPremiumPlan = userClerk.publicMetadata?.subscriptionPlan === "premium";

  if (!hasPremiumPlan) {
    throw new Error("User does not have a premium plan");
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const currentYear = new Date().getFullYear();
  const formattedMonth = month.padStart(2, "0");

  const startDate = new Date(`${currentYear}-${formattedMonth}-01T00:00:00Z`);
  const endDate = new Date(startDate);
  endDate.setUTCMonth(endDate.getUTCMonth() + 1);

  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
  });

  if (transactions.length === 0) {
    return "Nenhuma transação encontrada para o mês selecionado.";
  }

  const transactionsString = transactions
    .map((t) => `${t.date.toLocaleDateString("pt-BR")}-${t.type}-R$${t.amount}-${t.category}`)
    .join("; ");

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Você é um especialista em finanças pessoais. Gere um relatório detalhado com insights sobre as finanças do usuário, incluindo dicas e orientações práticas de como melhorar a vida financeira dele. O usuário enviará as transações divididas por ponto e vírgula no formato {DATA}-{TIPO}-{VALOR}-{CATEGORIA}.",
      },
      {
        role: "user",
        content: `Aqui estão minhas transações: ${transactionsString}`,
      },
    ],
  });

  const reportText = completion.choices[0]?.message?.content ?? "";

  const usage = completion.usage;
  if (usage && "prompt_tokens_details" in usage) {
    const cachedTokens = usage.prompt_tokens_details?.cached_tokens || 0;
    console.log(`Tokens totais: ${usage.total_tokens} | Do cache (desconto): ${cachedTokens}`);
    console.log(
      `Tokens usados no prompt: ${usage.prompt_tokens} | Tokens usados na conclusão: ${usage.completion_tokens}`
    );
  }

  return reportText;
};
