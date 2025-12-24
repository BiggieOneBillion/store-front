"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import HeroSectionCustomization from "../hero-section-customization";

export default function HeroSectionCustomizationDialog() {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Hero Section</Button>
        </DialogTrigger>
        <section className="overflow-y-auto max-h-[90vh]">
          <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh] ">
            <DialogHeader>
              <DialogTitle>Customize Hero Section</DialogTitle>
            </DialogHeader>
            <HeroSectionCustomization />
            {/* <DialogClose asChild>
            <Button variant="secondary" className="mt-4">
              Close
            </Button>
          </DialogClose> */}
          </DialogContent>
        </section>
      </Dialog>
    </>
  );
}
