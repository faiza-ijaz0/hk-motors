// Uses Google's no-API-key embed endpoint, so nothing else needs
// configuring.
const MAP_QUERY = "H3W5+HRJ, Murree Rd, Saddar, Rawalpindi, 46000";

export function GoogleMap() {
  return (
    <div className="border-border bg-muted relative aspect-21/9 w-full overflow-hidden rounded-2xl border">
      <iframe
        title="HK Motors location"
        src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`}
        className="absolute inset-0 h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
