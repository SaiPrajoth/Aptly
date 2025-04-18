"use client";
import React, { useActionState } from "react";
import Link from "next/link";
import { register } from "~/app/actions/auth";
function Page() {
  const [errorMessage, formAction, isPending] = useActionState(
    register,
    undefined,
  );
  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-5">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-center font-semibold text-gray-500">Sign Up</h1>
        <form name="sign-up" action={formAction} className="space-y-4">
          <div className="relative h-fit">
            <input
              name="email"
              type="string"
              className="w-full rounded-md border border-gray-300 px-2 pt-6 pb-2 font-light focus:border-black focus:outline-none"
            />
            <label className="absolute top-2.5 left-2 text-[12px] font-semibold">
              EMAIL
            </label>
          </div>
          <div className="relative h-fit">
            <input
              name="password"
              type="password"
              //   minLength={8}
              //   required
              className="w-full rounded-md border border-gray-300 px-2 pt-6 pb-2 focus:border-black focus:outline-none"
            />
            <label className="absolute top-2.5 left-2 text-[12px] font-semibold">
              PASSWORD
            </label>
          </div>

          <button
        
            className="w-full rounded-sm bg-black py-2 text-white hover:bg-gray-500 focus:bg-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Register
          </button>

          <p className="text-center">
            Have an account ?{" "}
            <Link
              className="text-black hover:text-violet-400 hover:underline"
              href={"sign-in"}
            >
              Login
            </Link>
          </p>

          {errorMessage && (
            <p className="text-center text-sm text-red-500">{errorMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Page;
