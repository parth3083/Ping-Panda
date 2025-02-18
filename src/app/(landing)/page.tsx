import React from "react";
import MaxWidth from "../components/MaxWidth";
import Heading from "../components/Heading";
import { Check } from "lucide-react";
import ShinyButton from "../components/ShinyButton";

function page() {
  return (
    <>
      <section className="relative py-24 sm:py-32 bg-brand-25">
        <MaxWidth>
          <div className="relative mx-auto flex flex-col gap-10 items-center text-center">
            <div>
              <Heading>
                <span>Real-Time SaaS Insights,</span>
                <br />
                <span className="relative bg-gradient-to-r from-brand-700 to-brand-800 text-transparent bg-clip-text">
                  Delivered to Your Discord
                </span>
              </Heading>
            </div>
            <p className="text-base/7 text-gray-600 max-w-prose text-center text-pretty">
              Ping Panda is the easiest way to monitor you SaaS. Get instant
              notifications for{" "}
              <span className="font-semibold text-gray-700">
                sales, new users, or any other event
              </span>{" "}
              sent directly to Discord.
            </p>
            <ul className="space-y-2 text-base/7 flex flex-col items-start text-left text-gray-600">
              {[
                "Real-time Discord alerts for the crtical events",
                "Buy once, use forever",
                "Track sales, new users, or any other event",
              ].map((items, index) => (
                <li key={index} className="flex gap-1.5 items-center text-left">
                  <Check className="size-5 shrink-0 text-brand-700" />
                  {items}
                </li>
              ))}
            </ul>

            <div className="w-full max-w-80">
              <ShinyButton
                href="/sign-up"
                className="capitalize relative h-14 w-full text-base shadow-xl transition-shadow duration-300 hover:shadow-xl"
              >
                start free for today
              </ShinyButton>
            </div>
          </div>
        </MaxWidth>
      </section>
      <section></section>
      <section></section>
      <section></section>
    </>
  );
}

export default page;
