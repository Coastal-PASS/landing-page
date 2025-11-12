"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactElement } from "react";
import { Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const HERO_VIDEO_ID = "OqdMp-dZnjU";

/**
 * Marketing hero with CTA buttons and an optional embedded video dialog.
 */
export const HeroBanner = (): ReactElement => (
  <section className="relative isolate overflow-hidden bg-gradient-to-br from-brand-primary via-brand-primary to-brand-violet text-white">
    <Image
      src="/assets/img/ct/hero.jpg"
      alt="Coastal PASS team in the field"
      fill
      priority
      sizes="100vw"
      className="object-cover opacity-25"
    />
    <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-4 py-30 lg:flex-row lg:items-center">
      <div className="flex-1 space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-surface-muted">
          Empower Your Farm With Precision Technology
        </p>
        <h1 className="text-4xl font-bold leading-tight lg:text-5xl">
          Revolutionizing agriculture, one field at a time
        </h1>
        <p className="text-lg text-surface-muted">
          Coastal PASS blends innovative technology with expert service to boost
          agricultural efficiency and sustainability. Discover how our top-tier
          equipment and SaaS solutions transform daily operations.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="text-brand-heading"
          >
            <Link href="/contact">Get In Touch</Link>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="lg"
                variant="ghost"
                className="border border-white/40 text-white hover:bg-white/10"
              >
                <Play className="mr-2 h-4 w-4" aria-hidden /> Watch Video
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-3xl border-none bg-transparent p-0 shadow-none">
              <DialogHeader>
                <DialogTitle className="sr-only">
                  Coastal PASS overview video
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Walkthrough of Coastal PASS precision agriculture platform.
                </DialogDescription>
              </DialogHeader>
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${HERO_VIDEO_ID}?rel=0&autoplay=1`}
                  title="Coastal PASS overview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex-1">
        <div className="relative rounded-3xl bg-white/10 p-1 shadow-card backdrop:blur">
          <Image
            src="/assets/img/ct/t4-air-o-fan.jpg"
            alt="Precision agriculture equipment"
            width={640}
            height={480}
            className="rounded-[1.4rem]"
          />
        </div>
      </div>
    </div>
    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-brand-accent via-brand-fuchsia to-brand-violet" />
  </section>
);
