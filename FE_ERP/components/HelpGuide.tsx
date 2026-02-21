import React, { useState } from "react";
import { HELP_GUIDES } from "../helpData";
import { Modal } from "./UI";

export const HelpGuide: React.FC<{ guideId: string }> = ({ guideId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const guide = HELP_GUIDES[guideId];

  if (!guide) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 active:scale-95 transition-all group"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="absolute right-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Panduan Bantuan
        </span>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`Bantuan: ${guide.title}`}
      >
        <div className="space-y-6 text-slate-700">
          <section>
            <h4 className="flex items-center gap-2 text-indigo-700 font-bold mb-2">
              <span className="p-1 bg-indigo-100 rounded text-indigo-600">
                📌
              </span>{" "}
              Deskripsi Fitur
            </h4>
            <p className="leading-relaxed">{guide.description}</p>
          </section>

          <section>
            <h4 className="flex items-center gap-2 text-indigo-700 font-bold mb-2">
              <span className="p-1 bg-indigo-100 rounded text-indigo-600">
                🎯
              </span>{" "}
              Tujuan Fitur
            </h4>
            <p className="leading-relaxed">{guide.purpose}</p>
          </section>

          <section>
            <h4 className="flex items-center gap-2 text-indigo-700 font-bold mb-2">
              <span className="p-1 bg-indigo-100 rounded text-indigo-600">
                🧭
              </span>{" "}
              Cara Menggunakan
            </h4>
            <ol className="list-decimal list-inside space-y-2">
              {guide.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </section>

          {guide.fields && (
            <section>
              <h4 className="flex items-center gap-2 text-indigo-700 font-bold mb-2">
                <span className="p-1 bg-indigo-100 rounded text-indigo-600">
                  🗂
                </span>{" "}
                Penjelasan Field
              </h4>
              <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                {Object.entries(guide.fields).map(([label, desc]) => (
                  <div key={label}>
                    <span className="font-semibold text-slate-800">
                      {label}:
                    </span>{" "}
                    {desc}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h4 className="flex items-center gap-2 text-indigo-700 font-bold mb-2">
              <span className="p-1 bg-indigo-100 rounded text-indigo-600">
                🔁
              </span>{" "}
              Alur Kerja
            </h4>
            <div className="p-3 bg-indigo-50 border-l-4 border-indigo-400 italic text-indigo-900 rounded">
              {guide.workflow}
            </div>
          </section>

          {guide.notes && (
            <section className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <h4 className="text-amber-800 font-bold mb-2 flex items-center gap-2">
                <span>⚠</span> Catatan Penting
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-amber-900">
                {guide.notes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </section>
          )}

          <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Mengerti
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
