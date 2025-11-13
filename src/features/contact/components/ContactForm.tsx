"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, type ReactElement } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { contactFormSchema, type ContactFormData } from "../schemas/form";

interface ContactFormProps {
  readonly variant?: "default" | "embedded";
  readonly context?: string;
  readonly successCopy?: string;
}

/**
 * Validated contact form used on the marketing site.
 */
export const ContactForm = ({
  variant = "default",
  context = "general",
  successCopy = "Thanks! We will be in touch within one business day.",
}: ContactFormProps): ReactElement => {
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const isEmbedded = variant === "embedded";
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      context,
    },
    mode: "onBlur",
  });

  useEffect(() => {
    setValue("context", context);
  }, [context, setValue]);

  const onSubmit = async (data: ContactFormData): Promise<void> => {
    setStatus("idle");
    void data;
    await new Promise((resolve) => setTimeout(resolve, 700));
    // TODO: Wire WorkOS/Supabase action once backend is ready.
    reset();
    setStatus("success");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <input type="hidden" {...register("context")} value={context} />
      <div
        className={cn(
          "grid gap-4",
          isEmbedded ? "md:grid-cols-1" : "md:grid-cols-2",
        )}
      >
        <Field label="Name" name="contact-name" error={errors.name?.message}>
          {(fieldId) => (
            <Input
              id={fieldId}
              placeholder="Jane Grower"
              {...register("name")}
              disabled={isSubmitting}
            />
          )}
        </Field>
        <Field label="Email" name="contact-email" error={errors.email?.message}>
          {(fieldId) => (
            <Input
              id={fieldId}
              type="email"
              placeholder="hello@coastalpass.services"
              {...register("email")}
              disabled={isSubmitting}
            />
          )}
        </Field>
      </div>
      <Field label="Phone" name="contact-phone" error={errors.phone?.message}>
        {(fieldId) => (
          <Input
            id={fieldId}
            placeholder="831-555-0000"
            {...register("phone")}
            disabled={isSubmitting}
          />
        )}
      </Field>
      <Field
        label="Message"
        name="contact-message"
        error={errors.message?.message}
      >
        {(fieldId) => (
          <Textarea
            id={fieldId}
            rows={5}
            placeholder="Tell us about your fleet..."
            {...register("message")}
            disabled={isSubmitting}
          />
        )}
      </Field>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
        {status === "success" ? (
          <p className="text-sm font-semibold text-brand-primary">
            {successCopy}
          </p>
        ) : null}
      </div>
    </form>
  );
};

interface FieldProps {
  readonly label: string;
  readonly name: string;
  readonly error?: string | undefined;
  readonly children: (fieldId: string) => ReactElement;
}

const Field = ({ label, name, error, children }: FieldProps): ReactElement => (
  <div className="space-y-2">
    <Label className="text-sm font-semibold text-brand-heading" htmlFor={name}>
      {label}
    </Label>
    {children(name)}
    {error ? <p className="text-sm text-brand-destructive">{error}</p> : null}
  </div>
);
