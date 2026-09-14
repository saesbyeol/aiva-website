import "react";

/**
 * The ConvAI embed registers <elevenlabs-convai> as a custom element at
 * runtime. React has no way to know its props, so declare the one attribute we
 * set; anything else would be a guess. React 19 moved JSX into the `react`
 * module, so this augments there rather than the old global namespace.
 */
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & { "agent-id": string };
    }
  }
}
