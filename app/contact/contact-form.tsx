"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(2000, "Message must be under 2000 characters"),
  // Honeypot — not shown to users
  website: z.string().max(0, "").optional(),
  budget: z.enum(["<10k", "10-25k", "25-50k", "50k+", "not-sure"]).optional(),
});

type FormData = z.infer<typeof schema>;

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = React.useState<Status>("idle");
  const [errorMsg, setErrorMsg] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // Honeypot check
    if (data.website) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      reset();
    } catch (e) {
      setStatus("error");
      setErrorMsg(
        e instanceof Error ? e.message : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="bg-bg-elevated rounded-2xl border border-border p-8 md:p-10">
      <h2 className="text-h3 font-bold text-fg mb-2">Send us a message</h2>
      <p className="text-sm text-fg-secondary mb-8">
        We respond within one business day.
      </p>

      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center gap-4 py-12"
          >
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-h4 font-bold text-fg mb-2">Message sent!</h3>
              <p className="text-body text-fg-secondary">
                Thanks for reaching out. We&apos;ll be in touch within one business
                day.
              </p>
            </div>
            <button
              onClick={() => setStatus("idle")}
              className="text-sm text-accent hover:text-accent-light transition-colors"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
            aria-label="Contact form"
          >
            {/* Honeypot — hidden from users, bots fill it */}
            <input
              type="text"
              {...register("website")}
              tabIndex={-1}
              aria-hidden="true"
              className="absolute opacity-0 pointer-events-none w-0 h-0"
              autoComplete="off"
            />

            {/* Name + Email row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field
                label="Full name"
                required
                error={errors.name?.message}
              >
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Alex Rivera"
                  className={inputClass(!!errors.name)}
                  aria-required="true"
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <FieldError id="name-error">{errors.name.message}</FieldError>
                )}
              </Field>

              <Field
                label="Work email"
                required
                error={errors.email?.message}
              >
                <input
                  {...register("email")}
                  type="email"
                  placeholder="alex@company.com"
                  className={inputClass(!!errors.email)}
                  aria-required="true"
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <FieldError id="email-error">{errors.email.message}</FieldError>
                )}
              </Field>
            </div>

            {/* Company */}
            <Field label="Company (optional)">
              <input
                {...register("company")}
                type="text"
                placeholder="Acme Inc."
                className={inputClass(false)}
              />
            </Field>

            {/* Budget */}
            <Field label="Estimated budget (optional)">
              <select {...register("budget")} className={inputClass(false)}>
                <option value="">Select a range</option>
                <option value="<10k">Under $10k</option>
                <option value="10-25k">$10k – $25k</option>
                <option value="25-50k">$25k – $50k</option>
                <option value="50k+">$50k+</option>
                <option value="not-sure">Not sure yet</option>
              </select>
            </Field>

            {/* Message */}
            <Field
              label="Tell us about your project"
              required
              error={errors.message?.message}
            >
              <textarea
                {...register("message")}
                rows={5}
                placeholder="Describe the problem you're trying to solve, or the outcome you're looking for..."
                className={cn(inputClass(!!errors.message), "resize-none")}
                aria-required="true"
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message && (
                <FieldError id="message-error">
                  {errors.message.message}
                </FieldError>
              )}
            </Field>

            {/* Error banner */}
            <AnimatePresence>
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{errorMsg}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send message
                </>
              )}
            </Button>

            <p className="text-xs text-fg-muted text-center">
              By submitting, you agree to our{" "}
              <a href="/privacy" className="underline hover:text-fg transition-colors">
                Privacy Policy
              </a>
              . No spam, ever.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function inputClass(hasError: boolean) {
  return cn(
    "w-full px-4 py-3 rounded-lg border bg-bg text-fg text-sm transition-all duration-200",
    "placeholder:text-fg-muted",
    "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent",
    hasError
      ? "border-red-500/50 focus:ring-red-500"
      : "border-border hover:border-border-strong"
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-fg-secondary">
        {label}
        {required && (
          <span className="text-accent ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="text-xs text-red-400 flex items-center gap-1 mt-1" role="alert">
      <AlertCircle className="w-3 h-3" />
      {children}
    </p>
  );
}
