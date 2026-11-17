import Image from "next/image";
import { Footer } from "../components/footer";
import { Hero } from "../components/hero";
import { ScrollTop } from "../components/scroll-top";
import { WhatsAppFloat } from "../components/whatsapp-float";
import { glyphs, Icon } from "../components/icons";
import { CountUp, Reveal, RevealRow, Tilt } from "../components/motion";
import { Stack } from "../components/stack";
import { Steps } from "../components/steps";
import { StructuredData } from "../components/structured-data";
import { Terminal } from "../components/terminal";
import {
  aiPractices,
  aiSplit,
  experience,
  facts,
  services,
} from "../content";

const wrap = "mx-auto w-full max-w-[1400px] px-5 md:px-10";

export default function Home() {
  return (
    <>
      <StructuredData />
      <main>
        <Hero />

        {/* Sobre mí */}
        <section id="sobre-mi" className={`${wrap} py-24 md:py-36`}>
          <div className="grid items-center gap-14 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <h2 className="display text-6xl leading-[0.95] md:text-8xl">
                Software a medida para empresas y negocios
              </h2>
              <p className="mt-10 max-w-[44ch] text-2xl leading-snug md:text-3xl">
                Soy Lautaro, desarrollador full stack en Mendoza. Construyo
                soluciones completas: el sistema que usa tu equipo, la web o la
                tienda online que ven tus clientes, las integraciones y las automatizaciones que
                te sacan trabajo de encima.
              </p>
              <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-smoke">
                Trabajo en remoto con empresas de Argentina y de afuera. Me
                encargo de todo, de la primera charla al soporte después del
                lanzamiento, y cuando el proyecto pide más manos sumo a mi
                equipo de Artisain.
              </p>
            </Reveal>
            <Reveal className="lg:col-span-5" delay={0.1}>
              <Tilt>
                <Image
                  src="/me/milan.jpg"
                  alt="Lautaro frente al Duomo de Milán"
                  width={1400}
                  height={1750}
                  sizes="(min-width: 1024px) 520px, 100vw"
                  className="w-full rounded-3xl"
                />
              </Tilt>
            </Reveal>
          </div>

          {/* Cuatro columnas iguales que llenan el ancho, separadas por líneas */}
          <dl className="mt-20 grid gap-10 border-t border-bone/15 pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-bone/15">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="lg:px-8 lg:first:pl-0 lg:last:pr-0"
              >
                <dt className="display text-7xl md:text-8xl">
                  <CountUp
                    to={fact.value}
                    prefix={fact.prefix}
                  />
                </dt>
                <dd className="mt-3 max-w-[28ch] text-smoke lg:max-w-none">{fact.label}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Servicios */}
        <section id="servicios" className="border-t border-bone/10">
          <div className={`${wrap} py-24 md:py-36`}>
            <h2 className="display max-w-[14ch] text-6xl leading-[0.95] md:text-8xl">
              Qué puedo hacer por tu negocio
            </h2>
            <ul className="mt-14 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <RevealRow key={service.title} className="py-8">
                  <h3 className="display text-3xl md:text-4xl">
                    {service.title}
                  </h3>
                  <p className="mt-3 max-w-[40ch] leading-relaxed text-smoke">
                    {service.body}
                  </p>
                </RevealRow>
              ))}
            </ul>

            <h3 className="mt-24 display text-4xl md:text-5xl">
              Cómo trabajamos
            </h3>
            <Steps />
          </div>
        </section>

        {/* IA */}
        <section id="ia" className="border-t border-bone/10">
          <div className={`${wrap} py-24 md:py-36`}>
            <div className="grid items-center gap-14 lg:grid-cols-12">
              <Reveal className="lg:col-span-6">
                <p className="flex items-center gap-2 text-smoke">
                  <Icon glyph={glyphs.claude} color="#d97757" className="size-4" />
                  Inteligencia artificial
                </p>
                <h2 className="mt-5 display text-6xl leading-[0.95] md:text-8xl">
                  IA que trabaja para tu negocio
                </h2>
                <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-smoke">
                  Sumo IA donde ahorra tiempo o plata de verdad: un chatbot de
                  WhatsApp que atiende a tus clientes, un agente que lee facturas y
                  carga los datos, reportes que se arman solos. Y la uso para
                  desarrollar: con Claude entrego más rápido, pero cada cambio
                  lo reviso yo antes de que llegue a producción.
                </p>
              </Reveal>
              <Reveal className="lg:col-span-6" delay={0.1}>
                <Terminal />
                <p className="mt-4 text-sm text-smoke">
                  Curso Claude Code in Action, de Anthropic.
                </p>
              </Reveal>
            </div>

            <div className="mt-20 grid gap-10 md:grid-cols-3">
              {aiPractices.map((practice, index) => (
                <Reveal
                  key={practice.title}
                  delay={index * 0.08}
                  className="border-t border-bone/15 pt-6"
                >
                  <Icon
                    glyph={glyphs[practice.tool]}
                    // Claude y n8n con su color; LangChain queda claro
                    color={
                      practice.tool === "langchain"
                        ? undefined
                        : `#${glyphs[practice.tool].hex}`
                    }
                    className="size-8"
                  />
                  <h3 className="mt-5 display text-4xl">
                    {practice.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-smoke">
                    {practice.body}
                  </p>
                </Reveal>
              ))}
            </div>

            {/* Reparto del trabajo al programar: lo que hace la IA frente a
                lo que decido yo, fila por fila */}
            <Reveal className="mt-24">
              <h3 className="display text-4xl md:text-5xl">
                Cómo reparto el trabajo con la IA
              </h3>
              <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-smoke">
                La IA acelera lo mecánico. Las decisiones que afectan a tu
                negocio las tomo yo.
              </p>
              <div className="mt-10 grid overflow-hidden rounded-3xl border border-bone/15 md:grid-cols-2">
                <div className="p-7 md:p-10">
                  <div className="flex items-center gap-4">
                    <span className="grid size-12 place-items-center rounded-full bg-[#d97757]/15">
                      <Icon glyph={glyphs.claude} color="#d97757" className="size-6" />
                    </span>
                    <div>
                      <p className="display text-2xl">Lo hace la IA</p>
                      <p className="text-sm text-smoke">Con Claude Code, bajo mi revisión</p>
                    </div>
                  </div>
                  <ul className="mt-8">
                    {aiSplit.delegated.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 border-t border-bone/10 py-4 text-bone/80"
                      >
                        <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-[#d97757]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-bone/15 bg-bone/[0.04] p-7 md:border-t-0 md:border-l md:p-10">
                  <div className="flex items-center gap-4">
                    <span className="display grid size-12 place-items-center rounded-full bg-bone text-lg text-void">
                      LB
                    </span>
                    <div>
                      <p className="display text-2xl">Lo decido yo</p>
                      <p className="text-sm text-smoke">Nunca se delega</p>
                    </div>
                  </div>
                  <ul className="mt-8">
                    {aiSplit.mine.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 border-t border-bone/10 py-4"
                      >
                        <svg viewBox="0 0 16 16" aria-hidden className="size-4 shrink-0">
                          <path
                            d="m3 8.5 3 3 7-7"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <Stack />

        {/* Experiencia */}
        <section id="experiencia" className="border-t border-bone/10">
          <div className={`${wrap} py-24 md:py-36`}>
            <h2 className="display text-6xl md:text-8xl">
              Experiencia
            </h2>
            <ol className="mt-14">
              {experience.map((job) => (
                <RevealRow
                  key={job.place}
                  className="grid gap-3 py-8 md:grid-cols-12 md:gap-8"
                >
                    <p className="text-smoke tabular-nums md:col-span-2">
                      {job.period}
                    </p>
                    <div className="md:col-span-4">
                      <h3 className="display text-4xl md:text-5xl">
                        {job.place}
                      </h3>
                      <p className="mt-2 text-smoke">{job.role}</p>
                    </div>
                    <p className="max-w-[60ch] leading-relaxed text-bone/85 md:col-span-6">
                      {job.body}
                    </p>
                </RevealRow>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollTop />
      <WhatsAppFloat />
    </>
  );
}
