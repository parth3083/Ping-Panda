import React from "react";
import MaxWidth from "../../components/MaxWidth";
import Heading from "../../components/Heading";
import { Check } from "lucide-react";
import ShinyButton from "../../components/ShinyButton";
import MockDiscordUI from "@/components/MockDiscordUI";
import { AnimatedList } from "@/components/magicui/animated-list";
import DiscordMessages from "@/components/DiscordMessages";

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

      <section className="relative bg-brand-50 pb-4">
        <div className="absolute inset-x-0 buttom-24 top-24 bg-brand-700"></div>
        <div className="relative mx-auto">
          <MaxWidth className="relative">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <MockDiscordUI>
                
                <AnimatedList>
                <DiscordMessages
                    avatarSrc="/brand-asset-profile-picture.png"
                    avatarAlt="PingPanda Avatar"
                    username="PingPanda"
                    timeStamp="Today at 12:35PM"
                    badgeText="SignUp"
                    badgeColor="#43b581"
                    title="👤 New user signed up"
                    content={{
                      name: "Mateo Ortiz",
                      email: "m.ortiz19@gmail.com",
                    }}
                  />
                  <DiscordMessages
                    avatarSrc="/brand-asset-profile-picture.png"
                    avatarAlt="PingPanda Avatar"
                    username="PingPanda"
                    timeStamp="Today at 12:35PM"
                    badgeText="Revenue"
                    badgeColor="#faa61a"
                    title="💰 Payment received"
                    content={{
                      amount: "$49.00",
                      email: "zoe.martinez2001@email.com",
                      plan: "PRO",
                    }}
                  />
                  <DiscordMessages
                    avatarSrc="/brand-asset-profile-picture.png"
                    avatarAlt="PingPanda Avatar"
                    username="PingPanda"
                    timeStamp="Today at 5:11AM"
                    badgeText="Milestone"
                    badgeColor="#5865f2"
                    title="🚀 Revenue Milestone Achieved"
                    content={{
                      recurringRevenue: "$5.000 USD",
                      growth: "+8.2%",
                    }}
                  />

                </AnimatedList>
            </MockDiscordUI>
            </div>
          </MaxWidth>
        </div>
      </section>
      <section></section>
      <section></section>
    </>
  );
}

export default page;
