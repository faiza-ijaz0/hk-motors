// Uses Google's no-API-key embed endpoint, so nothing else needs
// configuring. City-level on purpose: no verified street address has been
// provided yet — swap in the exact showroom address once confirmed.
const MAP_QUERY = "Dubai, United Arab Emirates";

export function GoogleMap() {
  return (
    <div className="border-border bg-muted relative aspect-21/9 w-full overflow-hidden rounded-2xl border">
      <iframe
        title="Map of Dubai, United Arab Emirates"
        src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`}
        className="absolute inset-0 h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
