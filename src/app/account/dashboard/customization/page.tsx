"use client";

import { useState } from "react";
import HeroSectionCustomizationDialog from "./_component/dialogs/hero-section-dialog";

export default function SettingsPage() {
  const [sectionsAvailiable, setSectionsAvailable] = useState([
    "Hero Section",
  ]);
  return (
    <section className="space-y-5">
      <h2 className="font-medium text-2xl">Customization</h2>
      <section>
        <h3 className="text-lg font-medium mb-1 underline underline-offset-2">Sections Customization</h3>
        <div>
          <p className="text-sm text-muted-foreground">
            Customize the sections of your web page.
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Available sections: <span className="font-semibold">{sectionsAvailiable.join(", ")}</span>
          </p>
        </div>
        <section className="flex items-center gap-4">
          <HeroSectionCustomizationDialog />
          {/* Add other customization dialogs here as needed */}
        </section>
      </section>
    </section>
  );
}
