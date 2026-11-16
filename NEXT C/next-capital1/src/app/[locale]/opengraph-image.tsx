import { TAILLE_PARTAGE, altPartage, imagePartage } from "@/lib/image-partage";

export const contentType = "image/png";

export function generateImageMetadata({ params }: { params: { locale: string } }) {
  return [{ id: "partage", alt: altPartage(params.locale), size: TAILLE_PARTAGE, contentType: "image/png" }];
}

export default function Image({ params }: { params: { locale: string } }) {
  return imagePartage(params.locale);
}
