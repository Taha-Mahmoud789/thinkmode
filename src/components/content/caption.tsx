/** Figure caption for images inside article bodies. */
export function Caption({ children }: { children: React.ReactNode }) {
  return (
    <figcaption className="-mt-4 mb-8 text-center text-[0.82rem] italic leading-relaxed text-text-tertiary">
      {children}
    </figcaption>
  );
}
