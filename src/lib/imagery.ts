import { z } from "zod";

/**
 * Shared imagery map ensures every blueprint references a valid asset path with alt text.
 */
const imageAssetSchema = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number().min(1),
  height: z.number().min(1),
  aspect: z.enum(["16:9", "4:3", "1:1"]).default("16:9"),
});

const imageryData = {
  homeHero: {
    src: "/assets/img/ct/hero.jpg",
    alt: "Sprayer cab with GNSS overlay at sunrise",
    width: 1920,
    height: 1080,
    aspect: "16:9" as const,
  },
  aboutHero: {
    src: "/assets/img/about/3.png",
    alt: "Historic Coastal Tractor dealership photo",
    width: 1920,
    height: 1080,
    aspect: "16:9" as const,
  },
  servicesHero: {
    src: "/assets/img/service/1.png",
    alt: "Technician configuring rate control hardware",
    width: 1920,
    height: 1080,
    aspect: "16:9" as const,
  },
  productsHero: {
    src: "/assets/img/banner-2/1.png",
    alt: "Precision ag product collage",
    width: 1920,
    height: 1080,
    aspect: "16:9" as const,
  },
  partnerHero: {
    src: "/assets/img/ct/jake_barn.png",
    alt: "Dealership handshake in shop",
    width: 1920,
    height: 1080,
    aspect: "16:9" as const,
  },
  contactHero: {
    src: "/assets/img/ct/trucks.png",
    alt: "Fleet of support trucks",
    width: 1600,
    height: 900,
    aspect: "16:9" as const,
  },
  privacyHero: {
    src: "/assets/img/icon/5.svg",
    alt: "Shield icon representing privacy",
    width: 512,
    height: 512,
    aspect: "1:1" as const,
  },
  fleetTelematics: {
    src: "/assets/img/service/2.png",
    alt: "Dashboard with telematics map",
    width: 1600,
    height: 900,
    aspect: "16:9" as const,
  },
  waterManagement: {
    src: "/assets/img/service/3.png",
    alt: "Topo map overlay on irrigated field",
    width: 1600,
    height: 900,
    aspect: "16:9" as const,
  },
  seedingRateControl: {
    src: "/assets/img/service/4.png",
    alt: "Planter detail adjusting seed tubes",
    width: 1600,
    height: 900,
    aspect: "16:9" as const,
  },
  applicationControl: {
    src: "/assets/img/service/5.png",
    alt: "Sprayer nozzle with droplet pattern",
    width: 1600,
    height: 900,
    aspect: "16:9" as const,
  },
  sprayerRetrofits: {
    src: "/assets/img/service/6.png",
    alt: "Technician installing retrofit kit",
    width: 1600,
    height: 900,
    aspect: "16:9" as const,
  },
  agtechConsulting: {
    src: "/assets/img/service/7.png",
    alt: "Tablet showing agronomic dashboard",
    width: 1600,
    height: 900,
    aspect: "16:9" as const,
  },
  trimbleProduct: {
    src: "/assets/img/banner-2/2.png",
    alt: "Trimble guidance hardware on tractor",
    width: 1600,
    height: 900,
    aspect: "16:9" as const,
  },
  ravenProduct: {
    src: "/assets/img/banner-2/3.png",
    alt: "Raven display inside cab",
    width: 1600,
    height: 900,
    aspect: "16:9" as const,
  },
  ecorobotixProduct: {
    src: "/assets/img/banner-2/4.png",
    alt: "Ecorobotix smart sprayer in lettuce field",
    width: 1600,
    height: 900,
    aspect: "16:9" as const,
  },
  rtkPlusProduct: {
    src: "/assets/img/banner-2/5.png",
    alt: "RTK base station with coastline backdrop",
    width: 1600,
    height: 900,
    aspect: "16:9" as const,
  },
  agsupportProduct: {
    src: "/assets/img/banner-3/1.png",
    alt: "AgSupport platform dashboard mock",
    width: 1600,
    height: 900,
    aspect: "16:9" as const,
  },
  ravenHero: {
    src: "/assets/img/raven-brocure/sprayer.jpg",
    alt: "Raven-equipped air blast sprayer",
    width: 1920,
    height: 1080,
    aspect: "16:9" as const,
  },
} as const;

const imagerySchema = z.record(imageAssetSchema);

export type ImageAsset = z.infer<typeof imageAssetSchema>;
export type ImageryKey = keyof typeof imageryData;

export const imagery = imagerySchema.parse(imageryData);

export const getImagery = (key: ImageryKey): ImageAsset => {
  const asset = imagery[key];
  if (!asset) {
    throw new Error(`Missing imagery asset for ${key}`);
  }
  return asset;
};
