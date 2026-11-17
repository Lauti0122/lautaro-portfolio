import { contact } from "./content";

// Datos del sitio para metadata, sitemap y datos estructurados.
// En producción se define NEXT_PUBLIC_SITE_URL con el dominio final; en Vercel,
// si falta, se usa el dominio de producción del proyecto.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const site = {
  name: "Lautaro Bua",
  title: "Desarrollo de software a medida en Mendoza | Lautaro Bua",
  description:
    "Software a medida para empresas y negocios: sistemas de gestión, tiendas online, chatbots de WhatsApp, automatizaciones e IA. Desarrollador full stack en Mendoza.",
  shortDescription:
    "Sistemas de gestión, tiendas online, chatbots de WhatsApp, automatizaciones e IA aplicada para empresas y negocios.",
  sameAs: [contact.linkedin, contact.github, contact.instagram],
};
