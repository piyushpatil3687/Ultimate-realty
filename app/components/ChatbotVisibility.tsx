"use client";

import { usePathname } from "next/navigation";
import Chatbot from "./Chatbot";

export default function ChatbotVisibility() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return <Chatbot />;
}
