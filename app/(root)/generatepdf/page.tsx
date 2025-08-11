import { auth } from "@/auth";
import JobsList from "@/components/generatePdf/JobsList";
import PromptForm from "@/components/generatePdf/PromptForm";

import { redirect } from "next/navigation";
import { FaFilePdf } from "react-icons/fa";

const GeneratepdfPage = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }
  return (
    <div className="min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <FaFilePdf className="h-10 w-10 text-primary" />
            <h1 className="ai-gradient-text">AI PDF Generator</h1>
          </div>
          <div className="mt-2 max-w-2xl mx-auto text-lg text-gray-100">
            Turn your ideas into professionally formatted PDF documents
            instantly. Just describe what you need.
          </div>
        </header>

        <main className="max-w-3xl mx-auto space-y-10">
          <PromptForm />
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-100">
              Generation History
            </h2>
            <JobsList />
          </div>
        </main>
      </div>
    </div>
  );
};

export default GeneratepdfPage;
