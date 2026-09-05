import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Proteção com liberdade para profissionais PJ",
  description:
    "A Vastor Capital conecta profissionais PJ, empresas e soluções de proteção em uma experiência com liberdade de escolha e continuidade.",
  robots: { index: true, follow: true },
};

const audiences = [
  {
    icon: "UserRound",
    label: "Profissional",
    title: "Sua proteção, suas escolhas.",
    text: "Entenda o seu momento, compare possibilidades e construa uma proteção que pode continuar com você.",
    points: ["Índice de Proteção", "Escolha individual", "Continuidade e portabilidade"],
  },
  {
    icon: "Building2",
    label: "Empresa",
    title: "Gestão com autonomia.",
    text: "Estruture apoio e subsídio com critérios claros, sem transformar benefício em obrigação para o profissional.",
    points: ["Políticas transparentes", "Elegibilidade organizada", "Visão administrativa"],
  },
  {
    icon: "Network",
    label: "Operação",
    title: "Tudo conectado e rastreável.",
    text: "Organize ofertas, decisões, documentos e movimentos em uma jornada única para toda a operação.",
    points: ["Decisões registradas", "Documentos e ativações", "Conciliação do cenário"],
  },
];

const solutionPrinciples = [
  {
    icon: "Compass",
    title: "Clareza para decidir",
    text: "Uma leitura simples do cenário ajuda cada profissional a entender prioridades antes de escolher.",
  },
  {
    icon: "Fingerprint",
    title: "Autonomia preservada",
    text: "A empresa pode apoiar. A decisão continua pertencendo a quem recebe a proteção.",
  },
  {
    icon: "ShieldCheck",
    title: "Continuidade de verdade",
    text: "Histórico, escolhas e proteção não precisam desaparecer quando a relação de trabalho muda.",
  },
];

const journey = [
  ["01", "A empresa estrutura", "Define política, elegibilidade e formas de apoio."],
  ["02", "O profissional escolhe", "Entende o cenário e decide o que faz sentido para si."],
  ["03", "A operação acompanha", "Registra decisões, documentos, ativações e movimentos."],
  ["04", "A proteção continua", "A jornada permanece organizada mesmo quando o contrato muda."],
];

const indexPillars = [
  { label: "Saúde", score: 100 },
  { label: "Renda", score: 25 },
  { label: "Família", score: 100 },
  { label: "Futuro", score: 50 },
  { label: "Reserva", score: 50 },
  { label: "Trabalho", score: 75 },
];

const previewPillars = indexPillars.slice(0, 4);

export default function HomePage() {
  return (
    <div className="vc-page vc-home">
      <a className="vc2-skip" href="#conteudo">
        Pular para o conteúdo
      </a>

      <header className="vc2-header">
        <div className="vc-shell vc2-nav">
          <Link href="/" aria-label="Vastor Capital — início">
            <Brand compact priority />
          </Link>
          <nav aria-label="Navegação principal">
            <a href="#solucao">Solução</a>
            <a href="#publicos">Para quem</a>
            <a href="#indice">Índice</a>
            <a href="#como-funciona">Como funciona</a>
          </nav>
          <Link className="vc2-nav-cta" href="/login">
            Explorar demo <Icon name="ArrowUpRight" size={15} />
          </Link>
        </div>
      </header>

      <main id="conteudo">
        <section className="vc2-hero">
          <div className="vc2-hero-image" aria-hidden="true">
            <Image
              src="/vastor-headquarters.jpeg"
              alt=""
              fill
              priority
              sizes="(max-width: 900px) 100vw, 58vw"
            />
          </div>
          <div className="vc2-hero-wash" />
          <div className="vc2-hero-gridlines" aria-hidden="true" />
          <div className="vc-shell vc2-hero-grid">
            <div className="vc2-hero-copy">
              <span className="vc2-kicker">
                <i /> PROTEÇÃO PORTÁTIL PARA PROFISSIONAIS PJ
              </span>
              <h1>
                Seu trabalho muda.
                <em>Sua proteção continua.</em>
              </h1>
              <p>
                A Vastor conecta profissionais, empresas e soluções de proteção em uma experiência
                que preserva escolhas, organiza benefícios e acompanha cada mudança de contrato.
              </p>
              <div className="vc2-hero-actions">
                <Link className="vc2-button vc2-button-gold" href="/login">
                  Explorar a demonstração <Icon name="ArrowRight" size={17} />
                </Link>
                <a className="vc2-text-link" href="#solucao">
                  Entender a solução <Icon name="ChevronDown" size={15} />
                </a>
              </div>
              <div className="vc2-hero-assurances" aria-label="Princípios da solução">
                <span>
                  <Icon name="CheckCircle2" size={15} /> Escolha individual
                </span>
                <span>
                  <Icon name="CheckCircle2" size={15} /> Apoio sem imposição
                </span>
                <span>
                  <Icon name="CheckCircle2" size={15} /> Histórico rastreável
                </span>
              </div>
            </div>

            <div
              className="vc2-product-card"
              role="img"
              aria-label="Prévia demonstrativa do painel profissional com Índice de Proteção 67 de 100"
            >
              <div className="vc2-product-chrome">
                <span>
                  <i /> <i /> <i />
                </span>
                <strong>VISÃO DO PROFISSIONAL</strong>
                <small>DEMO</small>
              </div>
              <div className="vc2-product-body">
                <div className="vc2-product-heading">
                  <div>
                    <span>ÍNDICE DE PROTEÇÃO</span>
                    <strong>
                      67<small>/100</small>
                    </strong>
                  </div>
                  <span className="vc2-product-level">Proteção intermediária</span>
                </div>
                <div className="vc2-product-pillars">
                  {previewPillars.map((pillar) => (
                    <div key={pillar.label}>
                      <span>
                        {pillar.label} <strong>{pillar.score}%</strong>
                      </span>
                      <i>
                        <b style={{ width: `${pillar.score}%` }} />
                      </i>
                    </div>
                  ))}
                </div>
                <div className="vc2-product-foot">
                  <span>
                    <Icon name="ShieldCheck" size={17} /> 6 dimensões acompanhadas
                  </span>
                  <strong>Cenário demonstrativo</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="vc2-proofline" aria-label="Perspectivas conectadas">
          <div className="vc-shell">
            <span>UMA EXPERIÊNCIA CONECTADA</span>
            <div>
              <strong>Profissional</strong>
              <i />
              <strong>Empresa</strong>
              <i />
              <strong>Operação</strong>
            </div>
          </div>
        </section>

        <section className="vc2-solution" id="solucao">
          <div className="vc-shell">
            <div className="vc2-heading-split">
              <div>
                <span className="vc2-section-index">01 — A SOLUÇÃO</span>
                <h2>
                  Proteção que pertence à pessoa,
                  <em>não ao contrato.</em>
                </h2>
              </div>
              <div>
                <p>
                  Benefícios tradicionais costumam terminar quando o vínculo termina. A Vastor cria
                  uma ponte entre o apoio da empresa e a autonomia do profissional para que cada
                  escolha seja compreendida, registrada e acompanhada.
                </p>
                <blockquote className="vc2-brand-thesis">
                  Capital, aqui, também significa autonomia para seguir em frente.
                </blockquote>
              </div>
            </div>

            <div className="vc2-principle-grid">
              {solutionPrinciples.map((principle, index) => (
                <article key={principle.title}>
                  <span className="vc2-principle-number">0{index + 1}</span>
                  <div className="vc2-principle-icon">
                    <Icon name={principle.icon} size={23} />
                  </div>
                  <h3>{principle.title}</h3>
                  <p>{principle.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="vc2-audiences" id="publicos">
          <div className="vc-shell">
            <div className="vc2-section-heading">
              <div>
                <span className="vc2-section-index vc2-section-index-light">
                  02 — TRÊS PERSPECTIVAS
                </span>
                <h2>Uma plataforma. Três formas de cuidar da mesma jornada.</h2>
              </div>
              <p>
                Cada pessoa enxerga somente o que precisa — sem perder a conexão entre escolha,
                apoio e operação.
              </p>
            </div>

            <div className="vc2-audience-grid">
              {audiences.map((audience) => (
                <article key={audience.label}>
                  <div className="vc2-audience-top">
                    <span>
                      <Icon name={audience.icon} size={22} />
                    </span>
                    <small>{audience.label}</small>
                  </div>
                  <h3>{audience.title}</h3>
                  <p>{audience.text}</p>
                  <ul>
                    {audience.points.map((point) => (
                      <li key={point}>
                        <Icon name="Check" size={15} /> {point}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="vc2-index" id="indice">
          <div className="vc-shell vc2-index-grid">
            <div className="vc2-index-copy">
              <span className="vc2-section-index">03 — ÍNDICE DE PROTEÇÃO</span>
              <h2>
                Um retrato simples para decisões mais <em>conscientes.</em>
              </h2>
              <p>
                Seis dimensões ajudam o profissional a visualizar forças e lacunas da própria
                proteção. O índice transforma um tema complexo em uma conversa clara, sem decidir
                por ele.
              </p>
              <div className="vc2-index-note">
                <Icon name="Info" size={18} />
                <span>
                  O índice tem caráter educativo e organizacional. Ele não substitui análise ou
                  orientação especializada.
                </span>
              </div>
              <Link className="vc2-inline-cta" href="/login">
                Ver o índice na demonstração <Icon name="ArrowRight" size={16} />
              </Link>
            </div>

            <div
              className="vc2-index-panel"
              aria-label="Cenário demonstrativo do índice de proteção"
            >
              <div className="vc2-index-panel-head">
                <div>
                  <span>CENÁRIO DA DEMONSTRAÇÃO</span>
                  <strong>Seu Índice de Proteção</strong>
                </div>
                <small>DADOS FICTÍCIOS</small>
              </div>
              <div className="vc2-index-panel-body">
                <div className="vc2-index-score" aria-label="67 de 100">
                  <div>
                    <strong>67</strong>
                    <span>de 100</span>
                  </div>
                </div>
                <div className="vc2-index-bars">
                  {indexPillars.map((pillar) => (
                    <div key={pillar.label}>
                      <span>
                        {pillar.label} <strong>{pillar.score}%</strong>
                      </span>
                      <i>
                        <b style={{ width: `${pillar.score}%` }} />
                      </i>
                    </div>
                  ))}
                </div>
              </div>
              <div className="vc2-index-panel-foot">
                <span>
                  <Icon name="ShieldCheck" size={17} /> Proteção intermediária
                </span>
                <small>Dados fictícios para demonstração</small>
              </div>
            </div>
          </div>
        </section>

        <section className="vc2-process" id="como-funciona">
          <div className="vc-shell">
            <div className="vc2-section-heading vc2-section-heading-process">
              <div>
                <span className="vc2-section-index vc2-section-index-light">
                  04 — COMO FUNCIONA
                </span>
                <h2>Apoio coordenado. Escolha individual.</h2>
              </div>
              <p>
                Um fluxo simples conecta a intenção da empresa à decisão do profissional, com
                clareza em cada etapa.
              </p>
            </div>

            <ol className="vc2-process-list">
              {journey.map(([number, title, text]) => (
                <li key={number}>
                  <span>{number}</span>
                  <i aria-hidden="true" />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="vc2-cta" id="contato">
          <div className="vc2-cta-glow" aria-hidden="true" />
          <div className="vc-shell vc2-cta-content">
            <span className="vc2-section-index vc2-section-index-light">CONHEÇA A EXPERIÊNCIA</span>
            <h2>
              Veja a proteção ganhar <em>continuidade.</em>
            </h2>
            <p>
              Explore os ambientes de profissional, empresa e operação em um cenário demonstrativo
              completo.
            </p>
            <div className="vc2-cta-actions">
              <Link className="vc2-button vc2-button-gold" href="/login">
                Explorar a demonstração <Icon name="ArrowRight" size={17} />
              </Link>
              <a className="vc2-text-link" href="mailto:contato@vastorcapital.com.br">
                Falar com a Vastor <Icon name="ArrowUpRight" size={16} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="vc2-footer">
        <div className="vc-shell">
          <div className="vc2-footer-main">
            <div className="vc2-footer-brand">
              <Brand compact light />
              <p>Proteção com liberdade para quem trabalha por CNPJ.</p>
            </div>
            <div>
              <span>EXPERIÊNCIA</span>
              <a href="#solucao">A solução</a>
              <a href="#publicos">Para quem</a>
              <a href="#indice">Índice de Proteção</a>
            </div>
            <div>
              <span>ACESSO</span>
              <Link href="/login">Explorar demonstração</Link>
              <a href="mailto:contato@vastorcapital.com.br">Contato</a>
            </div>
            <div>
              <span>LOCALIZAÇÃO</span>
              <strong>Fortaleza, Ceará</strong>
              <small>Brasil</small>
            </div>
          </div>
          <div className="vc2-footer-bottom">
            <span>© 2026 Vastor Capital. Todos os direitos reservados.</span>
            <p>
              O ambiente demonstrativo utiliza dados, valores, produtos e fornecedores fictícios.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
