"use client";

import { useState } from "react";

type Consultation = {
  symptoms: string;
  possibleCauses: string;
  remedies: string;
  lifestyle: string;
  precautions: string;
  date: string;
};

export default function DashboardPage() {
  const [consultations, setConsultations] = useState<Consultation[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("consultations") || "[]");
    }
    return [];
  });

  const [reminders, setReminders] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("reminders") || "[]");
    }
    return [];
  });

  const [newReminder, setNewReminder] = useState("");

  const deleteConsultation = (index: number) => {
    const updated = consultations.filter((_, i) => i !== index);
    setConsultations(updated);
    localStorage.setItem("consultations", JSON.stringify(updated));
  };

  const clearAllConsultations = () => {
    setConsultations([]);
    localStorage.setItem("consultations", JSON.stringify([]));
  };

  const addReminder = () => {
    if (!newReminder.trim()) return;

    const updated = [...reminders, newReminder];
    setReminders(updated);
    localStorage.setItem("reminders", JSON.stringify(updated));
    setNewReminder("");
  };

  const deleteReminder = (index: number) => {
    const updated = reminders.filter((_, i) => i !== index);
    setReminders(updated);
    localStorage.setItem("reminders", JSON.stringify(updated));
  };

  const clearAllReminders = () => {
    setReminders([]);
    localStorage.setItem("reminders", JSON.stringify([]));
  };

  const totalConsultations = consultations.length;
  const totalReminders = reminders.length;
  const lastConsultation =
    consultations.length > 0
      ? new Date(
          consultations[consultations.length - 1].date
        ).toLocaleDateString()
      : "N/A";

  return (
    <section className="py-20 bg-[#f4f9ff] min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold mb-4">
            Your Health Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your consultations and daily wellness reminders.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-gray-500 text-sm">Total Consultations</h3>
            <p className="text-3xl font-bold text-blue-600">
              {totalConsultations}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-gray-500 text-sm">Active Reminders</h3>
            <p className="text-3xl font-bold text-teal-600">
              {totalReminders}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-gray-500 text-sm">Reports Generated</h3>
            <p className="text-3xl font-bold">
              {totalConsultations}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-gray-500 text-sm">Last Consultation</h3>
            <p className="text-xl font-semibold">
              {lastConsultation}
            </p>
          </div>
        </div>

        {/* Reminder Section */}
        <div className="bg-white p-8 rounded-3xl shadow-lg mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              Daily Health Reminders
            </h2>
            {reminders.length > 0 && (
              <button
                onClick={clearAllReminders}
                className="text-red-500 text-sm"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="flex gap-4 mb-6">
            <input
              type="text"
              value={newReminder}
              onChange={(e) => setNewReminder(e.target.value)}
              placeholder="Add new reminder..."
              className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={addReminder}
              className="px-6 py-3 rounded-xl text-white"
              style={{
                background: "linear-gradient(135deg,#2563eb,#14b8a6)",
              }}
            >
              Add
            </button>
          </div>

          {reminders.length === 0 ? (
            <p className="text-gray-500">No reminders added yet.</p>
          ) : (
            <ul className="space-y-3">
              {reminders.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-[#f4f9ff] p-4 rounded-xl"
                >
                  <span>{item}</span>
                  <button
                    onClick={() => deleteReminder(index)}
                    className="text-red-500 text-sm"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Consultation History */}
        <div className="bg-white p-8 rounded-3xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              Consultation History
            </h2>
            {consultations.length > 0 && (
              <button
                onClick={clearAllConsultations}
                className="text-red-500 text-sm"
              >
                Clear All
              </button>
            )}
          </div>

          {consultations.length === 0 ? (
            <p className="text-gray-500">
              No consultations yet.
            </p>
          ) : (
            <div className="grid gap-6">
              {consultations.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#f4f9ff] p-6 rounded-2xl relative"
                >
                  <button
                    onClick={() => deleteConsultation(index)}
                    className="absolute top-4 right-4 text-red-500 text-sm"
                  >
                    Delete
                  </button>

                  <p className="text-sm text-gray-400 mb-2">
                    {new Date(item.date).toLocaleString()}
                  </p>

                  <h3 className="font-semibold mb-2">Symptoms:</h3>
                  <p className="text-gray-600 mb-4">
                    {item.symptoms}
                  </p>

                  <h3 className="font-semibold text-blue-600">
                    Possible Causes:
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {item.possibleCauses}
                  </p>

                  <h3 className="font-semibold text-teal-600">
                    Remedies:
                  </h3>
                  <p className="text-gray-600">
                    {item.remedies}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}