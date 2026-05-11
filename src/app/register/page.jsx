"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

const RegisterPage = () => {
  const { emailPassRegister, loading, error, googleLogin } = useAuth();
  const [formdata, setFormData] = useState({
    name: "",
    email: "",
    pass: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await emailPassRegister(formdata.name, formdata.email, formdata.pass);
    } catch (error) {
      throw error;
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-8 text-3xl font-bold text-slate-900">Register</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Name
            </label>
            <input
              id="name"
              value={formdata.name}
              onChange={(e) =>
                setFormData({
                  ...formdata,
                  name: e.target.value,
                })
              }
              type="text"
              name="name"
              placeholder="john@example.com"
              required
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formdata.email}
              onChange={(e) =>
                setFormData({
                  ...formdata,
                  email: e.target.value,
                })
              }
              placeholder="john@example.com"
              required
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formdata.pass}
              onChange={(e) =>
                setFormData({
                  ...formdata,
                  pass: e.target.value,
                })
              }
              placeholder="••••••••"
              required
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center justify-between text-sm text-slate-600">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="size-4 rounded border-slate-300"
              />
              Remember me
            </label>

            <a href="#" className="font-medium text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {loading ? "Wait..." : "Register"}
          </button>
          {error && <p className="text-red-600">{error}</p>}
        </form>

        <div className="my-6 flex items-center gap-3">
          <hr className="w-full border-slate-300" />
          <span className="text-sm text-slate-500">or</span>
          <hr className="w-full border-slate-300" />
        </div>

        <button
          onClick={googleLogin}
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <FcGoogle className="text-xl" />
          Sign in with Google
        </button>
        <div className=" mt-6 text-center mx-auto flex items-center justify-center gap-1">
          <p>Already have an account?</p>
          <Link
            href="/login"
            className="underline  block text-blue-600 cursor-pointer"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;
