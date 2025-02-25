import { Briefcase, GraduationCap, Mail, Phone, Tags } from 'lucide-react';
import type { ResumeCardProps } from '../types';

export function ResumeCard({ resume }: ResumeCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full">
      <div className="border-b pb-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{resume?.name || "N/A"}</h2>
        <div className="flex flex-wrap gap-4 mt-2">
          {resume?.email && (
            <div className="flex items-center text-gray-600">
              <Mail className="w-4 h-4 mr-2" />
              <span>{resume.email}</span>
            </div>
          )}
          {resume?.phone && (
            <div className="flex items-center text-gray-600">
              <Phone className="w-4 h-4 mr-2" />
              <span>{resume.phone}</span>
            </div>
          )}
        </div>
      </div>

      {resume?.skills?.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <Tags className="w-5 h-5 mr-2 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {resume?.experience?.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Experience</h3>
          </div>
          {resume.experience.map((exp, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-800">{exp.position || "N/A"}</h4>
                <span className="text-sm text-gray-500">{exp.duration || "N/A"}</span>
              </div>
              <p className="text-gray-600">{exp.company || "N/A"}</p>
              <ul className="mt-2 list-disc list-inside text-gray-600 text-sm">
                {exp.description?.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {resume?.education?.length > 0 && (
        <div>
          <div className="flex items-center mb-3">
            <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Education</h3>
          </div>
          {resume.education.map((edu, index) => (
            <div key={index} className="mb-2 last:mb-0">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-800">{edu.degree || "N/A"}</h4>
                <span className="text-sm text-gray-500">{edu.year || "N/A"}</span>
              </div>
              <p className="text-gray-600">{edu.institution || "N/A"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
