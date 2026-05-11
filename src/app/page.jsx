"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function Home() {
  const { currentUser, loading, task, addTask, error, success } = useAuth();
console.log(currentUser)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    teamSize: "",
  });
  console.log("task" , task)


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) return;

    await addTask(
      {
        title: formData.title,
        description: formData.description,
        teamSize: Number(formData.teamSize),
        createdAt: Date.now(),
      },
      currentUser?.uid,
    );

    setFormData({
      title: "",
      description: "",
      teamSize: "",
    });
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading...</p>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="rounded-lg bg-red-50 px-4 py-3 text-red-600">No User</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* User Banner */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
            {currentUser?.displayName?.charAt(0) || "U"}
          </div>

          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            {currentUser?.displayName || "User"}
          </h1>

          <p className="mt-1 text-sm text-slate-500">{currentUser?.email}</p>

          <div className="mt-5 rounded-xl bg-slate-100 px-4 py-3">
            <p className="text-sm text-slate-500">Total task</p>
            <p className="text-2xl font-bold text-slate-900">{task?.length}</p>
          </div>
        </section>

        {/* Add Task Box */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-slate-900">
            Add New Task
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Task title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />

            <textarea
              placeholder="Task description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />

            <input
              type="number"
              placeholder="Team size"
              value={formData.teamSize}
              onChange={(e) =>
                setFormData({ ...formData, teamSize: e.target.value })
              }
              required
              min="1"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Add Task
            </button>
          </form>

          {success && <p className="mt-4 text-sm text-green-600">{success}</p>}
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </section>

        {/* Task List Box */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-slate-900">
            My task
          </h2>

          {task?.length === 0 ? (
            <p className="rounded-lg bg-slate-100 px-4 py-3 text-center text-sm text-slate-500">
              No task found
            </p>
          ) : (
            <div className="space-y-3">
              {task?.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <h3 className="font-semibold text-slate-900">
                    {item.task?.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-600">
                    {item.task?.description}
                  </p>

                  <p className="mt-3 text-sm font-medium text-blue-600">
                    Team Size: {item.task?.teamSize}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
