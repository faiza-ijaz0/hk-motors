// DEMO GALLERY — sample albums and photos for client presentations.
//
// Seeded into Supabase by `npm run seed:demo` and, when
// DEMO_DATA_FALLBACK=true and Supabase is unreachable, served directly by
// `src/services/gallery.ts`. Replace by uploading real albums in
// /super-admin/gallery and running `npm run seed:demo -- --remove`.
//
// Photos: Unsplash (free Unsplash License), each reviewed by eye. Frames
// showing another dealership's signage were deliberately left out.

import { DEMO_TABLE, demoId, unsplash } from "./ids.ts";

type GalleryCategory = "cars" | "showroom" | "deliveries" | "events";

export type DemoAlbum = {
  id: string;
  slug: string;
  title: string;
  description: string;
  position: number;
};

export type DemoGalleryImage = {
  id: string;
  albumId: string;
  url: string;
  caption: string;
  category: GalleryCategory;
  position: number;
};

type AlbumInput = Omit<DemoAlbum, "id" | "position"> & {
  category: GalleryCategory;
  photos: [photoId: string, caption: string][];
};

const ALBUMS: AlbumInput[] = [
  {
    slug: "showroom-floor",
    title: "The Showroom",
    description:
      "A look around the display floor, customer lounge and consultation desks.",
    category: "showroom",
    photos: [
      [
        "photo-1764013290175-2b76e9a00b2e",
        "Performance and collector cars on the main display floor",
      ],
      [
        "photo-1643142314913-0cf633d9bbb5",
        "Consultation desks beside a freshly prepared crossover",
      ],
      [
        "photo-1644749700856-a82a92828a1b",
        "Doors open for a walk-around inspection on the showroom floor",
      ],
      [
        "photo-1692863211226-cbba732754c9",
        "Indoor stock hall — every vehicle under cover and climate-controlled",
      ],
      [
        "photo-1585390062628-be8608aa7d83",
        "Executive sedans and SUVs in the premium display bay",
      ],
      [
        "photo-1788178243401-854e12eeb8b1",
        "Luxury SUVs and a sports coupe in the gallery wing",
      ],
    ],
  },
  {
    slug: "customer-handovers",
    title: "Handover Day",
    description: "Keys, paperwork and the moment a new owner drives away.",
    category: "deliveries",
    photos: [
      [
        "photo-1653565217811-85b41bcd1edb",
        "Keys handed over after the final walk-through",
      ],
      [
        "photo-1533558701576-23c65e0272fb",
        "A new owner's smart key, ready for the first drive",
      ],
      [
        "photo-1761014586544-53fe5e1f1e25",
        "Transfer complete — keys change hands",
      ],
      [
        "photo-1643792801605-1f8081811439",
        "Collecting the keys at the delivery bay",
      ],
      [
        "photo-1727893512947-8bdc773ceb02",
        "The final step of every HK Motors delivery",
      ],
    ],
  },
  {
    slug: "events-and-meets",
    title: "Events & Meets",
    description:
      "Car meets, launches and community drives we've hosted or joined.",
    category: "events",
    photos: [
      [
        "photo-1588287960086-c4a332155b15",
        "Hundreds of enthusiasts at the season-opening car meet",
      ],
      [
        "photo-1639927665800-9d4a9e378f63",
        "Crowds gather around a performance coupe at the launch evening",
      ],
      [
        "photo-1546933751-fd57fb7ef1fc",
        "Owners and visitors at the open-air community meet",
      ],
      [
        "photo-1765520886441-842b0ee20945",
        "Custom builds on show at the indoor exhibition",
      ],
      [
        "photo-1653323983899-68e850d891cd",
        "Weekend meet — enthusiasts, coffee and conversation",
      ],
    ],
  },
  {
    slug: "detailing-studio",
    title: "Detailing Studio",
    description:
      "How every vehicle is cleaned, corrected and protected before it's listed.",
    category: "cars",
    photos: [
      [
        "photo-1633014041037-f5446fb4ce99",
        "Snow-foam pre-wash before hand detailing",
      ],
      [
        "photo-1708805282683-50a060eba80f",
        "Wheel and tyre deep-clean with soft detailing brushes",
      ],
      [
        "photo-1605437241278-c1806d14a4d9",
        "Interior finish — leather cleaned, conditioned and inspected",
      ],
      [
        "photo-1694678505383-676d78ea3b96",
        "Two-bucket hand wash to keep paintwork swirl-free",
      ],
      [
        "photo-1632823469850-2f77dd9c7f93",
        "Paint protection film fitted to the front end",
      ],
    ],
  },
  {
    slug: "featured-vehicles",
    title: "Featured Vehicles",
    description: "Highlights from vehicles that have passed through our doors.",
    category: "cars",
    photos: [
      [
        "photo-1742697167580-af91e3ead35e",
        "Toyota Fortuner heading out on a mountain road",
      ],
      ["photo-1654689289571-07f69459ae35", "Kia Sportage at golden hour"],
      [
        "photo-1702757329688-073f16ff8893",
        "Lexus RX — the spindle grille up close",
      ],
      [
        "photo-1704940225548-1420f7fed72f",
        "Hyundai Tucson photographed for its listing",
      ],
      [
        "photo-1646029642262-022158ff5794",
        "Hyundai Tucson on a test drive at sunset",
      ],
      [
        "photo-1551836989-b4622a17a792",
        "Mercedes-Benz C-Class AMG Line in the autumn light",
      ],
      [
        "photo-1761315087712-4b1bd53ce39b",
        "Honda Civic, lowered and freshly detailed",
      ],
    ],
  },
];

export const demoAlbums: DemoAlbum[] = ALBUMS.map((album, i) => ({
  id: demoId(DEMO_TABLE.albums, i + 1),
  slug: album.slug,
  title: album.title,
  description: album.description,
  position: i,
}));

export const demoGalleryImages: DemoGalleryImage[] = ALBUMS.flatMap(
  (album, albumIndex) =>
    album.photos.map(([photo, caption], photoIndex) => ({
      id: demoId(
        DEMO_TABLE.galleryImages,
        (albumIndex + 1) * 100 + photoIndex + 1,
      ),
      albumId: demoAlbums[albumIndex]!.id,
      url: unsplash(photo, 1200),
      caption,
      category: album.category,
      position: photoIndex,
    })),
);
