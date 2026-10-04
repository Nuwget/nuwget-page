import { Fragment } from "react";

/** Renders `inline code` spans found in README text. */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split("`").map((part, i) =>
        i % 2 ? (
          <code
            key={i}
            className="rounded bg-violet/15 px-1.5 py-0.5 font-mono text-[0.86em] text-lavender"
          >
            {part}
          </code>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
