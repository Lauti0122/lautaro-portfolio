// Todo el contenido del portfolio vive acá: para cambiar un texto o sumar
// un proyecto no hace falta tocar los componentes.

export const contact = {
  email: "lautarobua.10@gmail.com",
  phone: "+54 261 206 8833",
  whatsapp: "https://wa.me/5492612068833",
  linkedin: "https://www.linkedin.com/in/lautarobua-full-stack-developer/",
  github: "https://github.com/Lauti0122",
  instagram: "https://www.instagram.com/lautibua",
  cv: "/Lautaro_Bua_CV.pdf",
};

export type Project = {
  slug: string;
  title: string;
  kind: string;
  client: string;
  url: string;
  urlLabel: string;
  summary: string;
  points: string[];
  // Nombres tal como aparecen en `techByName` de components/icons.tsx
  stack: string[];
  // Portada armada para la tarjeta 3D (public/covers)
  cover: string;
  // Captura de escritorio para el detalle
  shot: string;
  // Captura vertical para el detalle (celular o pantalla de ingreso)
  side?: { src: string; width: number; height: number; phone: boolean };
  facts?: { value: number; prefix?: string; suffix?: string; label: string }[];
  press?: { outlet: string; title: string; url: string }[];
};

export const projects: Project[] = [
  {
    slug: "cumbre",
    cover: "/covers/cumbre.jpg",
    title: "Cumbre B2B",
    kind: "Plataforma de reuniones de negocios",
    client: "Surtidores y FECRA",
    url: "https://meetings.cumbredeestacionesdeservicio.com",
    urlLabel: "meetings.cumbredeestacionesdeservicio.com",
    summary:
      "Surtidores organiza el encuentro más grande del sector de combustibles en Argentina. Les construimos la plataforma donde estacioneros y proveedores arman su perfil, eligen con quién reunirse y agendan antes de que empiece el evento.",
    points: [
      "Perfiles de empresas expositoras y de sus representantes",
      "Agenda con disponibilidad, pausas y excepciones por expositor",
      "Reservas que no se pisan aunque dos personas pidan el mismo horario",
      "Panel del organizador con eventos, expositores, asistentes y métricas",
      "Varios organizadores en la misma plataforma, cada uno con sus datos aislados",
    ],
    stack: ["Next.js", "NestJS", "Prisma", "PostgreSQL", "Supabase"],
    shot: "/work/surtidores-d.jpg",
    side: {
      src: "/work/meetings-card.jpg",
      width: 870,
      height: 1215,
      phone: false,
    },
    facts: [
      {
        value: 700,
        prefix: "+",
        label: "asistentes en la Cumbre de mayo de 2026, en el Sheraton de Buenos Aires",
      },
      {
        value: 130,
        prefix: "+",
        label: "reuniones pactadas antes de abrir la Cumbre Virtual de noviembre",
      },
      {
        value: 10,
        suffix: " min",
        label: "por reunión, sin superposiciones en la agenda de cada empresa",
      },
    ],
    press: [
      {
        outlet: "Surtidores Latam",
        title:
          "Con más de 130 reuniones ya pactadas, la Cumbre Virtual conecta a estacioneros y proveedores",
        url: "https://surtidoreslatam.com/cumbre-virtual-conecta-estacioneros-proveedores-mas-130-reuniones/",
      },
      {
        outlet: "Surtidores Latam",
        title:
          "La Cumbre 2026 llega con una app exclusiva para potenciar el networking",
        url: "https://surtidoreslatam.com/la-cumbre-de-estaciones-de-servicio-2026-llega-con-fuerte-apuesta-tecnologica-y-una-app-exclusiva-para-potenciar-el-networking/",
      },
      {
        outlet: "Surtidores Latam",
        title:
          "La Cumbre de Estaciones de Servicio reunió a más de 700 referentes",
        url: "https://surtidoreslatam.com/la-cumbre-de-estaciones-de-servicio-reunio-a-mas-de-700-referentes-para-analizar-el-nuevo-mapa-del-negocio/",
      },
      {
        outlet: "elDinero",
        title:
          "La cumbre llega al Caribe: primera edición en Santo Domingo, República Dominicana",
        url: "https://eldinero.com.do/382217/sec-respalda-la-cumbre-de-estaciones-de-servicio-del-caribe-2026-y-exhorta-al-sector-a-participar/",
      },
    ],
  },
  {
    slug: "turnolab",
    cover: "/covers/turnolab.jpg",
    title: "Turno Lab",
    kind: "SaaS de turnos online",
    client: "Producto propio",
    url: "https://turnolab.ar/",
    urlLabel: "turnolab.ar",
    summary:
      "Para peluquerías, consultorios y centros de estética. Cada negocio tiene su página de reservas y los turnos caen directo en la agenda, sin pasar por WhatsApp.",
    points: [
      "Página de reservas con la marca y los servicios de cada negocio",
      "Agenda por profesional, con horarios y francos",
      "Señas y pagos con Mercado Pago, recordatorios por WhatsApp",
      "Sincronización con Google Calendar y reportes de ingresos",
    ],
    stack: ["Next.js", "NestJS", "PostgreSQL", "Prisma", "Mercado Pago"],
    shot: "/work/turnolab-d.jpg",
    side: { src: "/work/turnolab-m.jpg", width: 780, height: 1600, phone: true },
  },
  {
    slug: "importcuyo",
    cover: "/covers/importcuyo.jpg",
    title: "Import Cuyo",
    kind: "Tienda online de productos importados",
    client: "Import Cuyo, Mendoza",
    url: "https://importcuyo.vercel.app/",
    urlLabel: "importcuyo.vercel.app",
    summary:
      "Importadora de tecnología, consolas, audio y hogar que trabaja por encargue. Armamos la tienda con un catálogo de más de 300 productos, precios en dólares y en pesos al día, y un panel para que el equipo cargue todo sin depender de nadie.",
    points: [
      "Catálogo con filtros por categoría y marca, buscador y orden",
      "Precios en dólares con el equivalente en pesos al dólar oficial del día",
      "Precio en efectivo, en 3 cuotas y en 12 cuotas por cada versión, con recargo por color",
      "Panel para cargar productos, fotos, versiones y colores",
      "Encargos que llegan a WhatsApp con el producto y el color ya elegidos",
    ],
    stack: ["Next.js", "TypeScript", "Supabase"],
    shot: "/work/importcuyo-d.jpg",
    side: {
      src: "/work/importcuyo-m.jpg",
      width: 780,
      height: 1600,
      phone: true,
    },
    facts: [
      { value: 330, prefix: "+", label: "productos en el catálogo" },
      {
        value: 3,
        label: "precios por versión: efectivo, 3 cuotas y 12 cuotas",
      },
    ],
  },
  {
    slug: "surtidores",
    cover: "/covers/surtidores.jpg",
    title: "Surtidores",
    kind: "Portal de noticias de combustibles",
    client: "Surtidores y Surtidores Latam",
    url: "https://surtidores.com.ar/",
    urlLabel: "surtidores.com.ar",
    summary:
      "El medio de las estaciones de servicio en Argentina, con su edición regional Surtidores Latam. Trabajamos sobre los dos sitios para que carguen rápido, posicionen y sigan funcionando todos los días.",
    points: [
      "Nueva home de Surtidores Latam, llevada del diseño en Figma a WordPress",
      "Mejoras de velocidad de carga y SEO técnico",
      "Mantenimiento, actualizaciones y copias de seguridad",
    ],
    stack: ["WordPress", "Elementor"],
    shot: "/work/surtidoreslatam-d.jpg",
  },
  {
    slug: "marche",
    cover: "/covers/marche.jpg",
    title: "Marche!",
    kind: "Pedidos a domicilio y panel de reparto",
    client: "Marche! Congelados, Mendoza",
    url: "https://marchecongelados.com.ar/",
    urlLabel: "marchecongelados.com.ar",
    summary:
      "Tienda de congelados que reparte por zonas. El cliente arma el pedido desde el celular y el negocio lo sigue en un tablero, desde que entra hasta que se entrega.",
    points: [
      "Carta con buscador, categorías y pedido siempre a la vista",
      "Zonas de reparto con sus días y horarios",
      "Tablero de pedidos: confirmar, armar, repartir, entregar",
      "Hoja de ruta por día para enviar por WhatsApp o imprimir",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    shot: "/work/marche-d.jpg",
    side: { src: "/work/marche-m.jpg", width: 780, height: 1600, phone: true },
  },
  {
    slug: "salentina",
    cover: "/covers/salentina.jpg",
    title: "Salentina",
    kind: "Catálogo con panel de administración",
    client: "Salentina Store, Mendoza",
    url: "https://salentina.vercel.app/",
    urlLabel: "salentina.vercel.app",
    summary:
      "Catálogo de calzado de mujer con stock real. La dueña carga modelos, talles y precios desde su panel, y cada consulta llega a WhatsApp con el producto y el talle ya escritos.",
    points: [
      "Catálogo por categorías con talles disponibles",
      "Precio con tarjeta y precio en efectivo en cada modelo",
      "Panel para cargar productos, fotos y stock sin depender de nadie",
    ],
    stack: ["Next.js", "Supabase", "Tailwind CSS"],
    shot: "/work/salentina-d.jpg",
    side: {
      src: "/work/salentina-m.jpg",
      width: 780,
      height: 1600,
      phone: true,
    },
  },
  {
    slug: "artisain",
    cover: "/covers/artisain.jpg",
    title: "Artisain",
    kind: "Mi agencia de IA y software a medida",
    client: "Con Nicolás Planas y Micaela Vallina",
    url: "https://www.artisain.com.ar/",
    urlLabel: "artisain.com.ar",
    summary:
      "Cuando el proyecto pide más que un desarrollador, trabajo con mi equipo: Nicolás Planas, ingeniero de software, y Micaela Vallina, diseñadora gráfica y UX/UI. Hacemos agentes y automatizaciones, sistemas a medida, sitios web y diseño de producto.",
    points: [
      "Agentes de IA, RAG sobre datos de la empresa y chatbots",
      "Automatizaciones con n8n",
      "Sistemas, paneles y SaaS a medida",
      "Sitios web, UX/UI y marca",
    ],
    stack: ["Claude Code", "n8n", "LangChain", "Next.js"],
    shot: "/work/artisain-d.jpg",
  },
];

export const facts = [
  {
    value: 5,
    prefix: "+",
    label: "años programando, desde que me recibí en 2021",
  },
  { value: 7, label: "productos en producción para clientes y propios" },
  {
    value: 700,
    prefix: "+",
    label: "asistentes en la Cumbre que se organizó con mi plataforma B2B",
  },
  {
    value: 30,
    prefix: "+",
    label: "automatizaciones con IA y n8n funcionando para clientes",
  },
];

// Qué le ofrezco a una empresa o negocio, en textos cortos para la grilla
export const services = [
  {
    title: "Software a medida",
    body: "Sistemas de gestión, paneles y plataformas B2B hechos para cómo trabaja tu empresa.",
  },
  {
    title: "Tiendas online",
    body: "Catálogo, carrito, pagos, stock y un panel para cargar productos sin depender de nadie.",
  },
  {
    title: "WhatsApp para tu negocio",
    body: "Chatbots que atienden 24 horas, toman pedidos y reservan turnos, con avisos y recordatorios automáticos.",
  },
  {
    title: "Automatizaciones",
    body: "Carga de datos, reportes y pasos entre sistemas que pasan solos. Tu equipo gana horas.",
  },
  {
    title: "IA aplicada",
    body: "Agentes que leen documentos, cargan datos y responden sobre la información de tu empresa.",
  },
  {
    title: "Integraciones",
    body: "WhatsApp Business, Mercado Pago, Google Calendar, planillas, CRM o ERP, conectados entre sí.",
  },
];

// Cómo avanza un proyecto, en orden
export const steps = [
  {
    title: "Entender el negocio",
    when: "Primera reunión, sin costo",
    body: "Una charla para ver cómo trabajan hoy, dónde se pierde tiempo y qué tiene que resolver el sistema.",
  },
  {
    title: "Propuesta y presupuesto",
    when: "En pocos días",
    body: "Alcance, plazos y precio cerrados por escrito antes de empezar.",
  },
  {
    title: "Desarrollo con entregas",
    when: "Entregas semanales",
    body: "Avances que podés probar cada semana, así los cambios se piden a tiempo.",
  },
  {
    title: "Lanzamiento y soporte",
    when: "Después de lanzar",
    body: "Lo pongo en producción, capacito al equipo y sigo disponible para mantenerlo y sumar mejoras.",
  },
];

export const aiPractices = [
  {
    tool: "langchain",
    title: "Agentes para tu empresa",
    body: "Chatbots de WhatsApp y agentes con LangChain y LangGraph que responden consultas, leen documentos y trabajan sobre los datos y sistemas del negocio, con permisos acotados.",
  },
  {
    tool: "n8n",
    title: "Automatizaciones con n8n",
    body: "Flujos que conectan tus herramientas y sacan del día a día las tareas repetitivas: mensajes de WhatsApp automáticos, cargas de datos, reportes y pasos entre sistemas.",
  },
  {
    tool: "claude",
    title: "Desarrollo con Claude Code",
    body: "Uso Claude Code para planificar, escribir y refactorizar. Leo y pruebo cada cambio antes de subirlo: entrego más rápido sin bajar la calidad.",
  },
] as const;

export const aiSplit = {
  delegated: [
    "Código repetitivo y primeras versiones",
    "Borradores de tests",
    "Lectura de código ajeno y documentación",
    "Migraciones y cambios mecánicos",
  ],
  mine: [
    "La arquitectura y el modelo de datos",
    "La revisión de cada cambio",
    "La seguridad y los datos de los clientes",
    "Qué conviene construir y qué no",
  ],
};

export const experience = [
  {
    period: "2023 — hoy",
    role: "Programador full stack",
    place: "Outtrip",
    body: "Plataformas SaaS B2B para turismo: reservas, inventario y gestión operativa. Interfaces con React y Next.js, backend con Node.js y NestJS, agentes con LangGraph y automatizaciones internas con n8n.",
  },
  {
    period: "2023 — hoy",
    role: "Full stack developer freelance",
    place: "Artisain y clientes directos",
    body: "Soluciones a medida para empresas y negocios, desde la definición hasta producción: sistemas de gestión, plataformas B2B, automatizaciones, integraciones e IA aplicada.",
  },
  {
    period: "2021",
    role: "Full stack developer",
    place: "Bootcamp Henry",
    body: "Más de 800 horas teórico-prácticas. Después: Claude Code in Action (Anthropic), SOLID Principles & Clean Code y Advanced React & Frontend Performance.",
  },
];

export const skills = [
  {
    area: "Frontend",
    items: ["TypeScript", "React", "Next.js", "React Native", "Tailwind CSS"],
  },
  {
    area: "Backend",
    items: ["Node.js", "NestJS", "APIs REST", "PostgreSQL", "MongoDB", "Prisma", "Supabase"],
  },
  {
    area: "IA y automatización",
    items: ["Claude Code", "LangChain", "LangGraph", "n8n"],
  },
  {
    area: "Cloud y prácticas",
    items: ["AWS", "Git", "GitHub", "Jest", "Metodologías ágiles"],
  },
];
