"use client";
import dynamic from "next/dynamic";

const AIChat = dynamic(() => import("@/components/AIChat"), { ssr: false });

export default function GlobalAIChat() {
  return <AIChat lessonTitle="IdeaToProgram" language="python" />;
}
