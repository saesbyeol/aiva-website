"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { PhoneMissed } from "lucide-react";

/**
 * Turns "missed calls cost money" from a claim into arithmetic the visitor
 * drives themselves.
 *
 * Every figure on screen is derived from the three inputs, so the section makes
 * no promise about results we have not measured. The assumptions stay visible
 * (and adjustable) rather than being folded into a headline number.
 */

const WEEKS_PER_MONTH = 4.33;

const DEFAULTS = { missed: 8, value: 90, convert: 30 };

export function MissedCallCalculator() {
  const t = useTranslations("voiceAgent.calc");
  const locale = useLocale();

  const [missed, setMissed] = React.useState(DEFAULTS.missed);
  const [value, setValue] = React.useState(DEFAULTS.value);
  const [convert, setConvert] = React.useState(DEFAULTS.convert);

  const money = React.useMemo(
    () =>
      new Intl.NumberFormat(locale === "en" ? "en-IE" : "hr-HR", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }),
    [locale]
  );

  const lostPerMonth = missed * WEEKS_PER_MONTH * (convert / 100);
  const monthly = lostPerMonth * value;

  return (
    <div className="border-border bg-bg-elevated overflow-hidden rounded-3xl border">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr]">
        {/* Inputs */}
        <div className="space-y-7 p-6 sm:p-8">
          <Slider
            label={t("missedLabel")}
            value={missed}
            min={1}
            max={40}
            onChange={setMissed}
            display={t("missedValue", { count: missed })}
          />
          <Slider
            label={t("valueLabel")}
            value={value}
            min={20}
            max={600}
            step={10}
            onChange={setValue}
            display={money.format(value)}
          />
          <Slider
            label={t("convertLabel")}
            value={convert}
            min={5}
            max={80}
            step={5}
            onChange={setConvert}
            display={`${convert} %`}
          />
        </div>

        {/* Result */}
        <div className="border-border bg-bg-secondary flex flex-col justify-center gap-2 border-t p-6 sm:p-8 lg:border-t-0 lg:border-l">
          <div className="text-fg-muted mb-1 flex items-center gap-2">
            <PhoneMissed className="h-4 w-4 shrink-0" aria-hidden="true" />
            <p className="text-label">{t("resultLabel")}</p>
          </div>

          {/* aria-live so a screen reader hears the figure change as the
              sliders move, rather than only on focus. */}
          <p
            className="text-fg text-[clamp(2.25rem,5vw,3.25rem)] leading-none font-extrabold tracking-tight tabular-nums"
            aria-live="polite"
          >
            {money.format(Math.round(monthly))}
          </p>
          <p className="text-fg-secondary text-small">
            {t("resultPerMonth", { jobs: Math.round(lostPerMonth) })}
          </p>

          <p className="text-fg-muted border-border mt-5 border-t pt-5 text-xs leading-relaxed">
            {t("disclaimer")}
          </p>
        </div>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (n: number) => void;
  display: string;
}) {
  const id = React.useId();
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-fg text-small font-medium">
          {label}
        </label>
        <span className="text-accent shrink-0 font-mono text-sm font-semibold tabular-nums">
          {display}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-accent w-full"
        // The filled portion of the track is painted from this custom property
        // rather than a wrapper element, so the native thumb stays draggable.
        style={{ ["--range-pct" as string]: `${pct}%` }}
      />
    </div>
  );
}
