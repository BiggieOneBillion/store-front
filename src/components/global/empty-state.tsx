"use client";

import { PackageOpen, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  onSecondaryAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  secondaryActionLabel,
  secondaryActionHref,
  onSecondaryAction,
}: EmptyStateProps) {
  const defaultIcon = <PackageOpen className="h-12 w-12 text-muted-foreground" />;

  return (
    <div className="flex items-center justify-center h-[300px] p-4">
      <Card className="max-w-md w-full shadow-none">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {icon || defaultIcon}
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        {(actionLabel || secondaryActionLabel) && (
          <CardContent className="flex flex-col gap-2">
            {actionLabel && (
              <>
                {actionHref ? (
                  <Button asChild className="gap-2">
                    <Link href={actionHref}>
                      <Plus className="h-4 w-4" />
                      {actionLabel}
                    </Link>
                  </Button>
                ) : (
                  <Button onClick={onAction} className="gap-2">
                    <Plus className="h-4 w-4" />
                    {actionLabel}
                  </Button>
                )}
              </>
            )}
            {secondaryActionLabel && (
              <>
                {secondaryActionHref ? (
                  <Button asChild variant="outline" className="gap-2">
                    <Link href={secondaryActionHref}>
                      <Search className="h-4 w-4" />
                      {secondaryActionLabel}
                    </Link>
                  </Button>
                ) : (
                  <Button
                    onClick={onSecondaryAction}
                    variant="outline"
                    className="gap-2"
                  >
                    <Search className="h-4 w-4" />
                    {secondaryActionLabel}
                  </Button>
                )}
              </>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
