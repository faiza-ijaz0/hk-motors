import {
  Award,
  Briefcase,
  Mail,
  Milestone,
  Quote,
  UserRound,
} from "lucide-react";

import { FadeIn } from "@/components/shared/fade-in";
import { PageHero } from "@/components/shared/page-hero";
import { siteConfig } from "@/config/site";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Meet Our CEO | ${siteConfig.name}`,
  description:
    "Meet the CEO of HK Motors — biography, experience, achievements, and a personal message.",
};

const experience = [
  {
    title: "Early Beginnings",
    description:
      "A lifelong fascination with performance vehicles took root long before HK Motors existed — spending as much time under the hood as behind the wheel.",
  },
  {
    title: "Industry Experience",
    description:
      "Years spent across dealership floors and service operations, learning firsthand what the industry gets right — and where it falls short of customers.",
  },
  {
    title: "Founding HK Motors",
    description:
      "Set out to build the dealership experience that had always felt missing: transparent, meticulous, and genuinely built around the car and the customer.",
  },
  {
    title: "Leading Today",
    description:
      "Continues to guide HK Motors' growth and standards personally, from the vehicles sourced to the way every customer is treated.",
  },
];

const achievements = [
  {
    icon: Award,
    title: "Built a Trusted Name",
    description:
      "Grew HK Motors into a name enthusiasts and first-time buyers alike trust for premium vehicle retail.",
  },
  {
    icon: Milestone,
    title: "Set a Certification Standard",
    description:
      "Established a rigorous inspection and certification process applied to every vehicle before it's listed.",
  },
  {
    icon: UserRound,
    title: "Built on Loyalty",
    description:
      "Cultivated a customer base that keeps coming back — and keeps sending friends and family through the door.",
  },
  {
    icon: Briefcase,
    title: "Full-Service Growth",
    description:
      "Expanded HK Motors from a sales floor into a full-service automotive experience, end to end.",
  },
];

export default function CeoPage() {
  return (
    <>
      <PageHero
        eyebrow="Leadership"
        title="Meet Our CEO"
        description="The vision, standards, and personal commitment behind HK Motors."
      />

      {/* CEO Image + intro */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="grid gap-10 lg:grid-cols-[340px_1fr] lg:gap-16">
            {/* Placeholder portrait — swap for a real photo via a `next/image`
                once one is available. Deliberately not using the showroom
                logo image here, since that would misrepresent it as a
                photo of a person. */}
            <div className="border-border from-card to-background shadow-luxury relative aspect-[3/4] w-full max-w-xs self-start overflow-hidden rounded-2xl border bg-gradient-to-b lg:max-w-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <UserRound className="text-muted-foreground size-24" />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl">
                  Founder & CEO
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">HK Motors</p>
              </div>

              <div className="border-primary text-muted-foreground border-l-2 pl-4 italic">
                <Quote className="text-primary mb-2 size-5" />
                <p>
                  &ldquo;We built HK Motors on the idea that buying a car should
                  feel like joining a community of people who care about the
                  same things you do — performance, craftsmanship, and
                  honesty.&rdquo;
                </p>
              </div>

              {/* Biography */}
              <div className="text-muted-foreground space-y-4 text-sm sm:text-base">
                <p className="text-primary tracking-luxury text-xs font-medium uppercase not-italic">
                  Biography
                </p>
                <p>
                  With a career spent around performance and luxury vehicles,
                  our CEO founded HK Motors to bring a more personal, more
                  transparent approach to an industry that often feels neither.
                  That philosophy still shapes every decision the team makes —
                  from which vehicles we source to how we treat every customer
                  who walks through the door.
                </p>
                <p>
                  Today, that vision continues to guide HK Motors as it grows: a
                  dealership built on trust, driven by a genuine passion for the
                  cars we sell.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Experience */}
      <section className="border-border bg-card border-t">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-primary tracking-luxury text-xs font-medium uppercase">
              The Journey
            </p>
            <h2 className="font-display mt-2 text-2xl sm:text-3xl">
              Experience
            </h2>
          </FadeIn>

          <div className="mt-10 space-y-8">
            {experience.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.05}>
                <div className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="border-primary bg-background flex size-9 shrink-0 items-center justify-center rounded-full border-2">
                      <Briefcase className="text-primary size-4" />
                    </div>
                    {index < experience.length - 1 && (
                      <div className="bg-border mt-2 w-px flex-1" />
                    )}
                  </div>
                  <div className="pb-2">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                      {item.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="border-border border-t">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-primary tracking-luxury text-xs font-medium uppercase">
              Recognition
            </p>
            <h2 className="font-display mt-2 text-2xl sm:text-3xl">
              Achievements
            </h2>
          </FadeIn>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {achievements.map((achievement, index) => (
              <FadeIn key={achievement.title} delay={index * 0.05}>
                <div className="border-border bg-card flex h-full gap-4 rounded-2xl border p-6">
                  <achievement.icon className="text-primary size-6 shrink-0" />
                  <div>
                    <p className="font-medium">{achievement.title}</p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Message */}
      <section className="border-border bg-card border-t">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="border-border shadow-luxury bg-background relative rounded-2xl border p-8 sm:p-12">
              <Mail className="text-primary size-8" />
              <p className="text-primary tracking-luxury mt-4 text-xs font-medium uppercase">
                A Message From Our CEO
              </p>
              <div className="text-muted-foreground mt-4 space-y-4 text-base leading-relaxed sm:text-lg">
                <p>
                  Thank you for taking the time to learn a little more about who
                  we are. HK Motors was never meant to be just another
                  dealership — it was built to be the place I always wished
                  existed when I was searching for a car myself: honest,
                  meticulous, and genuinely glad to see you walk through the
                  door.
                </p>
                <p>
                  Every vehicle we sell, every service we offer, and every
                  conversation our team has with a customer is held to that same
                  standard. That&apos;s not a marketing line — it&apos;s the
                  reason I started this company, and it&apos;s what I personally
                  hold our entire team to, every day.
                </p>
                <p>
                  Whether you&apos;re here to browse, to ask a question, or to
                  bring home your next car, I&apos;m glad you&apos;re here.
                  Welcome to HK Motors.
                </p>
              </div>
              <p className="font-display mt-8 text-xl">Founder & CEO</p>
              <p className="text-muted-foreground text-sm">HK Motors</p>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
