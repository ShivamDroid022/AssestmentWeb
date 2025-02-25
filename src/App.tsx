import  { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ResumeCard } from './components/ResumeCard';
import { Brain } from 'lucide-react';
import type { ParsedResume } from './types';


function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);

    try {
      const fileText = await extractTextFromFile(file);

      const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
   
      const response = await fetch(
       `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: "Extract structured resume details (Name, Email, Phone, Skills, Experience, Education) from the following text:" },
                  { text: fileText }
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      console.log("API Response:", data); // Debugging

      const extractedText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      if (!extractedText) {
        throw new Error("No text extracted from the API.");
      }

      const parsedData = parseExtractedText(extractedText);
      setParsedResume(parsedData);
    } catch (error) {
      console.error("Error parsing resume:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const extractTextFromFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const parseExtractedText = (text: string): ParsedResume => {
    console.log("Extracted Raw Text:", text); // Debugging

    const nameMatch = text.match(/Name:\s*(.+)/i);
    const emailMatch = text.match(/Email:\s*(\S+@\S+\.\S+)/i);
    const phoneMatch = text.match(/Phone:\s*([\d\s\-()+]+)/i);
    const skillsMatch = text.match(/Skills:\s*(.+)/i);
    const experienceMatch = text.match(/Experience:\s*((?:.|\n)+)Education:/i);
    const educationMatch = text.match(/Education:\s*((?:.|\n)+)/i);

    return {
      name: nameMatch?.[1] || "Unknown",
      email: emailMatch?.[1] || "No Email Found",
      phone: phoneMatch?.[1] || "No Phone Found",
      skills: skillsMatch ? skillsMatch[1].split(",").map((s) => s.trim()) : [],
      experience: experienceMatch
        ? experienceMatch[1].split("\n").map((exp) => ({
            company: exp.split("-")[0]?.trim() || "Unknown Company",
            position: "Unknown Position",
            duration: exp.split("-")[1]?.trim() || "Unknown Duration",
            description: [exp],
          }))
        : [],
      education: educationMatch
        ? educationMatch[1].split("\n").map((edu) => ({
            institution: edu.split("-")[0]?.trim() || "Unknown Institution",
            degree: "Unknown Degree",
            year: edu.split("-")[1]?.trim() || "Unknown Year",
          }))
        : [],
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Resume Parser</h1>
          <p className="text-lg text-gray-600">
            Upload your resume and let our AI extract the important information
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <FileUpload onFileUpload={handleFileUpload} />
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {parsedResume && !isLoading && (
          <div className="flex justify-center">
            <ResumeCard resume={parsedResume} />
          </div>
        )}
      </div>
    </div>
    
  );
  
}

export default App;
