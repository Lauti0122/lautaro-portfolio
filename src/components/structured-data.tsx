import { contact, projects, services } from "../content";
import { site, siteUrl } from "../site";

// Datos estructurados (schema.org) para que buscadores e IA entiendan quién
// es, qué ofrece y dónde trabaja
const data = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#persona`,
      name: site.name,
      jobTitle: "Desarrollador full stack",
      description: site.description,
      url: siteUrl,
      image: `${siteUrl}/me/milan.jpg`,
      email: `mailto:${contact.email}`,
      telephone: contact.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Mendoza",
        addressRegion: "Mendoza",
        addressCountry: "AR",
      },
      sameAs: site.sameAs,
      knowsAbout: [
        "Desarrollo de software a medida",
        "Comercio electrónico",
        "Chatbots de WhatsApp",
        "Automatización de procesos",
        "Inteligencia artificial",
        "Next.js",
        "React",
        "NestJS",
        "PostgreSQL",
        "n8n",
        "LangChain",
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#servicio`,
      name: `${site.name}, software a medida`,
      description: site.shortDescription,
      url: siteUrl,
      image: `${siteUrl}/icon.png`,
      telephone: contact.phone,
      email: contact.email,
      founder: { "@id": `${siteUrl}/#persona` },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Mendoza",
        addressRegion: "Mendoza",
        addressCountry: "AR",
      },
      areaServed: [
        { "@type": "Country", name: "Argentina" },
        { "@type": "Place", name: "Latinoamérica" },
      ],
      sameAs: site.sameAs,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Servicios",
        itemListElement: services.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.title,
            description: service.body,
          },
        })),
      },
    },
    {
      "@type": "ItemList",
      name: "Proyectos",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: project.title,
          description: project.summary,
          url: project.url,
          creator: { "@id": `${siteUrl}/#persona` },
        },
      })),
    },
  ],
};

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
