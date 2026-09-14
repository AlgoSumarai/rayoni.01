import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Menu,
  X,
  Building2,
  Package,
  Factory,
  Compass,
  Printer,
  Check,
  Plus,
  MapPin,
  Mail,
  Phone,
  Clock3,
  Upload,
  FileCheck2,
  MoveUpRight,
} from 'lucide-react';
import { company, services, projects, credentials, team } from './content';

const icons = {
  building: Building2,
  package: Package,
  factory: Factory,
  compass: Compass,
  printer: Printer,
};
const nav = ['Home', 'About', 'Services', 'Projects', 'Credentials', 'Team', 'Contact'];
const quoteUrl = (id?: string) => `/request-a-quote${id ? `?service=${id}` : ''}`;

function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className={`brand ${light ? 'brand-light' : ''}`} aria-label="Rayoni home">
      <span className="brand-symbol">
        <img src="/images/rayoni-logo.png" alt="" width="1254" height="1254" />
      </span>
      <span className="brand-type">
        RAYONI<span>CONSTRUCTION & SUPPLY</span>
      </span>
    </Link>
  );
}
function Button({
  children,
  to = quoteUrl(),
  secondary = false,
  className = '',
}: {
  children: React.ReactNode;
  to?: string;
  secondary?: boolean;
  className?: string;
}) {
  return (
    <Link className={`button ${secondary ? 'button-outline' : ''} ${className}`} to={to}>
      {children}
      <ArrowUpRight size={18} aria-hidden="true" />
    </Link>
  );
}
function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`eyebrow ${light ? 'light' : ''}`}>
      <span />
      {children}
    </p>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setOpen(false);
  }, [location]);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        menuRef.current?.focus();
      }
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [open]);
  return (
    <header className="header">
      <div className="container header-inner">
        <Brand />
        <nav
          aria-label="Main navigation"
          className={open ? 'nav is-open' : 'nav'}
          id="main-navigation"
        >
          {nav.map((item) => (
            <Link
              key={item}
              className={
                location.pathname === '/' && (location.hash || '#home') === `#${item.toLowerCase()}`
                  ? 'active'
                  : ''
              }
              to={`/#${item.toLowerCase()}`}
            >
              {item}
            </Link>
          ))}
          <Button className="mobile-quote">Request a quote</Button>
        </nav>
        <Button className="header-quote">Request a quote</Button>
        <button
          ref={menuRef}
          className="menu-toggle"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-controls="main-navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    document.title =
      pathname === '/request-a-quote'
        ? 'Request a Quote | RAYONI'
        : pathname === '/privacy'
          ? 'Privacy | RAYONI'
          : 'RAYONI | Construction & General Supply, Johannesburg';
    if (hash)
      requestAnimationFrame(() =>
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' }),
      );
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function Home() {
  const [mapOpen, setMapOpen] = useState(false);
  return (
    <>
      <section className="hero container" id="home" aria-labelledby="hero-title">
        <div className="hero-copy">
          <Eyebrow>Built on vision. Driven by purpose.</Eyebrow>
          <h1 id="hero-title">
            Building today.
            <br />
            Creating
            <br />
            <span>tomorrow.</span>
          </h1>
          <p className="hero-description">
            Construction. Supply. Possibility. <br />
            Practical solutions and purposeful execution for the spaces, businesses and communities
            of South Africa.
          </p>
          <div className="hero-actions">
            <Button>Let’s build together</Button>
            <a className="text-link" href="#services">
              Explore our services <ArrowDown size={16} />
            </a>
          </div>
          <div className="hero-location">
            <MapPin size={15} />
            <span>
              Westonaria, Johannesburg <span className="location-dot">·</span> South Africa
            </span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-photo">
            <img
              src="/images/architecture.jpg"
              alt="Upward view of contemporary glass buildings"
              width="1400"
              height="1750"
              fetchPriority="high"
            />
            <div className="photo-shade" />
            <span className="image-corner">
              A VISION BEYOND
              <br />
              THE BLUEPRINT.
            </span>
            <span className="image-coordinate">R / 01</span>
          </div>
          <div className="vision-card">
            <span className="vision-icon">
              <MoveUpRight size={32} strokeWidth={1.2} />
            </span>
            <div>
              From vision
              <br />
              to execution.<span>DREAM. DESIGN. BUILD.</span>
            </div>
          </div>
          <span className="vertical-caption">THE FUTURE TAKES SHAPE HERE</span>
        </div>
      </section>
      <section className="trust-strip" aria-label="Company at a glance">
        <div className="container trust-grid">
          <div>
            <span className="trust-big">2016</span>
            <span>Founded with vision</span>
          </div>
          <div>
            <span className="trust-big">100%</span>
            <span>Black youth-owned</span>
          </div>
          <div>
            <span className="trust-label">
              Construction <span>&</span> Supply
            </span>
            <span>Connected capabilities</span>
          </div>
          <div className="trust-motto">
            <span className="tiny-mark">↗</span>
            <span>
              South African roots.
              <br />
              <strong>Forward-looking ambition.</strong>
            </span>
          </div>
        </div>
      </section>
      <section className="section container about" id="about">
        <div className="about-heading">
          <Eyebrow>The Rayoni story</Eyebrow>
          <h2>
            We see beyond.
            <br />
            Then we get <br />
            <span className="muted-heading">to work.</span>
          </h2>
          <Link className="text-link" to={quoteUrl()}>
            Put your vision in motion <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="about-copy">
          <p className="lead">
            Our name means “visualize, see beyond.”
            <br />
            It’s also how we approach every opportunity.
          </p>
          <p>
            Founded in 2016, Rayoni is a 100% black youth-owned construction and general supply
            company based in Westonaria, Johannesburg. We connect practical expertise with the drive
            to turn a client’s requirements into a considered, well-executed solution.
          </p>
          <p>
            From building and property services to corporate and industrial supply, our focus is
            straightforward: quality service, reliable delivery and customer satisfaction.
          </p>
          <div className="purpose-note">
            <span className="gold-line" />
            <p>
              Building opportunity is part of building our business. We aim to create employment,
              open doors for young people and continually improve the way we serve our clients.
            </p>
          </div>
        </div>
      </section>
      <section className="services-section section" id="services">
        <div className="container">
          <div className="section-heading">
            <div>
              <Eyebrow>What we do</Eyebrow>
              <h2>
                Many capabilities.
                <br />
                One committed partner.
              </h2>
            </div>
            <p>
              From the ground up to the everyday essentials.
              <br />
              Find the right support for your next project.
            </p>
          </div>
          <div className="services-grid">
            {services.map((service, index) => {
              const Icon = icons[service.icon as keyof typeof icons];
              return (
                <article
                  key={service.id}
                  className={`service-card ${index === 0 ? 'service-featured' : ''}`}
                >
                  {index === 0 && (
                    <img
                      className="service-image"
                      src="/images/construction.jpg"
                      alt="Construction site with tower cranes"
                      loading="lazy"
                      width="1200"
                      height="800"
                    />
                  )}
                  <div className="service-body">
                    <div className="service-top">
                      <Icon size={28} strokeWidth={1.3} />
                      <span>{service.number}</span>
                    </div>
                    <h3>{service.title}</h3>
                    <p>{service.short}</p>
                    <details>
                      <summary>
                        Explore services <Plus size={18} />
                      </summary>
                      <div className="service-expanded">
                        <p>{service.description}</p>
                        <ul>
                          {service.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </details>
                    <Link className="service-quote" to={quoteUrl(service.id)}>
                      Request a quote <ArrowUpRight size={18} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="service-note">
            <span>Have a requirement that spans more than one service?</span>
            <Link to={quoteUrl()}>
              Let’s talk about it <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section why-section container">
        <div className="why-image">
          <img
            src="/images/planning.jpg"
            alt="Architectural drawings and tools used for project planning"
            loading="lazy"
            width="1000"
            height="800"
          />
          <span className="image-label">PURPOSE IN EVERY PLAN.</span>
        </div>
        <div className="why-copy">
          <Eyebrow>Why Rayoni</Eyebrow>
          <h2>
            Your vision.
            <br />
            Our commitment.
          </h2>
          <p>
            Good outcomes begin with a partner who listens, thinks ahead and takes pride in the
            work.
          </p>
          <div className="commitment">
            <Check size={19} />
            <div>
              <h3>Quality in the details</h3>
              <p>
                Careful workmanship and considered solutions, from planning through to delivery.
              </p>
            </div>
          </div>
          <div className="commitment">
            <Check size={19} />
            <div>
              <h3>Practical, connected expertise</h3>
              <p>
                Construction, supply and project services brought together around your requirements.
              </p>
            </div>
          </div>
          <div className="commitment">
            <Check size={19} />
            <div>
              <h3>People and progress</h3>
              <p>
                A youth-owned business driven by customer satisfaction, opportunity and sustainable
                growth.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="process-section section" id="process">
        <div className="process-watermark" aria-hidden="true">
          <img src="/images/rayoni-logo.png" alt="" />
        </div>
        <div className="container">
          <div className="section-heading">
            <div>
              <Eyebrow light>How we bring it to life</Eyebrow>
              <h2>
                A clear path.
                <br />
                From possibility to reality.
              </h2>
            </div>
            <span className="process-tag">
              THE RAYONI APPROACH <ArrowUpRight size={22} />
            </span>
          </div>
          <div className="process-grid">
            {[
              {
                name: 'Dream',
                description:
                  'We listen first. Together, we understand your requirements, objectives and vision for the project.',
                label: 'UNDERSTAND THE VISION',
              },
              {
                name: 'Design',
                description:
                  'We define the scope, resources and execution strategy to shape an appropriate, practical solution.',
                label: 'PLAN WITH PURPOSE',
              },
              {
                name: 'Build',
                description:
                  'We deliver with a focus on quality, reliability and your satisfaction, bringing the plan into the real world.',
                label: 'DELIVER WITH CARE',
              },
            ].map((step, i) => (
              <div className="process-step" key={step.name}>
                <div className="process-number">
                  <span>0{i + 1}</span>
                  <ArrowRight size={23} />
                </div>
                <h3>
                  {step.name}
                  <span>.</span>
                </h3>
                <p>{step.description}</p>
                <span className="step-label">{step.label}</span>
              </div>
            ))}
          </div>
          <div className="values">
            <span>THE VALUES THAT MOVE US</span>
            <div>
              {['Vision', 'Passion', 'Drive', 'Consistency'].map((v) => (
                <span key={v}>
                  <i />
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section container projects-section" id="projects">
        <div className="section-heading">
          <div>
            <Eyebrow>Our work</Eyebrow>
            <h2>
              Built on capability.
              <br />
              Made for impact.
            </h2>
          </div>
          <p>
            Construction, supply and specialist solutions.
            <br />A space for the work that tells our story.
          </p>
        </div>
        <div className="projects-grid">
          {projects.length
            ? projects.map((project) => (
                <article className="project-card" key={project.id}>
                  {project.images.map((src, i) => (
                    <img
                      key={src}
                      src={src}
                      alt={`${project.name} — image ${i + 1}`}
                      loading="lazy"
                    />
                  ))}
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <dl>
                    <dt>Client / industry</dt>
                    <dd>{project.industry}</dd>
                    <dt>Location</dt>
                    <dd>{project.location}</dd>
                    <dt>Service</dt>
                    <dd>{project.service}</dd>
                    <dt>Completed</dt>
                    <dd>{project.completed}</dd>
                  </dl>
                </article>
              ))
            : ['Construction & property', 'Supply & procurement', 'Specialist solutions'].map(
                (title, i) => (
                  <article className="project-placeholder" key={title}>
                    <div className={`project-drawing drawing-${i}`} aria-hidden="true">
                      <span />
                      <span />
                      <span />
                      <span />
                      <b>R / 0{i + 1}</b>
                    </div>
                    <div className="project-placeholder-copy">
                      <span className="pending-label">PORTFOLIO PLACEHOLDER</span>
                      <h3>{title}</h3>
                      <p>Verified project details and photography coming soon.</p>
                    </div>
                  </article>
                ),
              )}
        </div>
        <p className="project-footnote">
          Project names, clients, locations and completion dates will be published once confirmed.
        </p>
      </section>
      <section className="credentials-section" id="credentials">
        <div className="container credentials-layout">
          <div>
            <Eyebrow>Company credentials</Eyebrow>
            <h2>
              Confidence starts
              <br />
              with clarity.
            </h2>
            <p>
              Information for procurement teams, project partners and organisations evaluating
              Rayoni.
            </p>
            <Link className="text-link" to={quoteUrl()}>
              Enquire about company documents <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="credential-list">
            {credentials.map((credential) => (
              <article key={credential.title}>
                <FileCheck2 size={25} strokeWidth={1.3} />
                <div>
                  <h3>{credential.title}</h3>
                  <p>{credential.description}</p>
                  {credential.url && (
                    <a href={credential.url} download>
                      Download verified document
                    </a>
                  )}
                </div>
                <span className="credential-status">{credential.status}</span>
              </article>
            ))}
            <p className="credential-note">
              Registration grades, numbers and certifications are not claimed until verified.
            </p>
          </div>
        </div>
      </section>
      <section className="section container team-section" id="team">
        <div className="team-intro">
          <Eyebrow>The people behind the promise</Eyebrow>
          <h2>
            Shared drive.
            <br />
            Hands-on thinking.
          </h2>
          <p>
            Rayoni brings together a hardworking team with experience in planning, problem solving,
            construction, plumbing, painting and catering.
          </p>
          <p>
            We believe the strength of our business starts with our people — and the opportunities
            we create for them to grow.
          </p>
        </div>
        <div className="team-members">
          {team.map((person) => (
            <TeamMember key={person.name} person={person} />
          ))}
        </div>
      </section>
      <section className="cta-section">
        <div className="container cta-inner">
          <div>
            <Eyebrow>Let’s move your project forward</Eyebrow>
            <h2>
              What do you see
              <br />
              for tomorrow?
            </h2>
            <p>Tell us what you need. Let’s shape the next step together.</p>
          </div>
          <Button>Request a quote</Button>
          <span className="cta-arrow" aria-hidden="true">
            ↗
          </span>
        </div>
      </section>
      <section className="section container contact-section" id="contact">
        <div className="contact-info">
          <Eyebrow>Get in touch</Eyebrow>
          <h2>
            A conversation
            <br />
            is a good start.
          </h2>
          <p>For projects, supply requirements or business enquiries, send us a message.</p>
          <div className="contact-details">
            <div>
              <MapPin />
              <span>
                <strong>Find us</strong>
                {company.location}
                <small>{company.address || 'Street address to be confirmed'}</small>
              </span>
            </div>
            <div>
              <Mail />
              <span>
                <strong>Email</strong>
                {company.email ? (
                  <a href={`mailto:${company.email}`}>{company.email}</a>
                ) : (
                  'Verified email to be supplied'
                )}
              </span>
            </div>
            <div>
              <Phone />
              <span>
                <strong>Phone</strong>
                {company.phone ? (
                  <a href={`tel:${company.phone}`}>{company.phone}</a>
                ) : (
                  'Verified phone number to be supplied'
                )}
              </span>
            </div>
            <div>
              <Clock3 />
              <span>
                <strong>Operating hours</strong>
                {company.hours || 'Business hours to be confirmed'}
              </span>
            </div>
          </div>
          {company.whatsapp && (
            <a className="text-link" href={`https://wa.me/${company.whatsapp.replace(/\D/g, '')}`}>
              Contact us on WhatsApp <ArrowUpRight size={18} />
            </a>
          )}
          <div className="map-panel">
            {mapOpen ? (
              <iframe
                title="Map of Westonaria — general area, not a verified office location"
                src="https://maps.google.com/maps?q=Westonaria%2C%20Gauteng%2C%20South%20Africa&z=12&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            ) : (
              <button onClick={() => setMapOpen(true)}>
                <MapPin size={24} />
                <span>
                  Westonaria, Gauteng<small>View area map · Loads Google Maps</small>
                </span>
                <ArrowUpRight size={20} />
              </button>
            )}
            <small>General area shown. Office address awaiting confirmation.</small>
          </div>
        </div>
        <div className="contact-form-wrap">
          <h3>Let’s hear your vision.</h3>
          <p>
            Have a detailed brief?{' '}
            <Link to={quoteUrl()}>
              Use our quotation form <ArrowUpRight size={14} />
            </Link>
          </p>
          <EnquiryForm kind="contact" />
        </div>
      </section>
    </>
  );
}

function TeamMember({ person }: { person: (typeof team)[number] }) {
  return (
    <article className="team-card">
      <div className="team-portrait">
        {person.image ? (
          <img src={person.image} alt={person.name} loading="lazy" />
        ) : (
          <>
            <div className="team-mark" aria-hidden="true">
              <img src="/images/rayoni-logo.png" alt="" />
            </div>
            <span className="team-initials">{person.initials}</span>
            <span className="team-portrait-label">LEADERSHIP / RAYONI</span>
          </>
        )}
      </div>
      <div className="team-card-copy">
        <span>MEET THE LEADERSHIP</span>
        <h3>{person.name}</h3>
        <p className="team-role">{person.role}</p>
        <p>{person.description}</p>
      </div>
    </article>
  );
}

function EnquiryForm({
  kind,
  selectedService = '',
}: {
  kind: 'quote' | 'contact';
  selectedService?: string;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [reference, setReference] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const isQuote = kind === 'quote';
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Johannesburg' }).format(
    new Date(),
  );
  useEffect(() => {
    if (status === 'success') resultRef.current?.focus();
  }, [status]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (fileError || status === 'sending') return;
    const form = event.currentTarget;
    const data = new FormData(form);
    data.delete('documents');
    files.forEach((file) => data.append('documents', file));
    data.set('kind', kind);
    setStatus('sending');
    try {
      const response = await fetch('/api/enquiries', { method: 'POST', body: data });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || 'We could not save your enquiry. Please try again.');
      setReference(result.reference);
      setStatus('success');
      form.reset();
      setFiles([]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to connect. Please try again.');
      setStatus('error');
    }
  }
  if (status === 'success')
    return (
      <div className="form-success" ref={resultRef} tabIndex={-1}>
        <span className="success-icon">
          <Check size={30} />
        </span>
        <h3>{isQuote ? 'Your brief is in.' : 'Your message is in.'}</h3>
        <p>
          Your {isQuote ? 'quotation request' : 'enquiry'} has been saved for the Rayoni team to
          review.
        </p>
        <div className="reference">
          YOUR REFERENCE<strong>{reference}</strong>
        </div>
        <p className="form-small">
          Keep this reference for your records. A quote is only confirmed once the scope and terms
          have been agreed.
        </p>
        <button
          className="text-link"
          onClick={() => {
            setStatus('idle');
            setReference('');
          }}
        >
          Send another enquiry <ArrowUpRight size={16} />
        </button>
      </div>
    );
  return (
    <form onSubmit={submit} className="enquiry-form">
      <div className="form-grid">
        <label>
          Full name <span>*</span>
          <input
            name="fullName"
            autoComplete="name"
            placeholder="Your full name"
            required
            maxLength={120}
          />
        </label>
        {isQuote && (
          <label>
            Company / organisation
            <input
              name="company"
              autoComplete="organization"
              placeholder="Company name (optional)"
              maxLength={160}
            />
          </label>
        )}
        <label>
          Email address <span>*</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.co.za"
            required
            maxLength={254}
          />
        </label>
        {isQuote && (
          <label>
            Phone number <span>*</span>
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="Your contact number"
              required
              minLength={7}
              maxLength={30}
            />
          </label>
        )}
        {isQuote && (
          <label className="full-width">
            Service category <span>*</span>
            <select name="service" defaultValue={selectedService} required>
              <option value="" disabled>
                Select a service
              </option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
              <option value="multiple">Multiple services / other requirement</option>
            </select>
          </label>
        )}
        <label className="full-width">
          {isQuote ? 'Tell us about your project' : 'Your message'} <span>*</span>
          <textarea
            name="description"
            placeholder={
              isQuote
                ? 'Share your scope, requirements, quantities or any details that will help us understand your vision.'
                : 'How can we help?'
            }
            rows={isQuote ? 5 : 4}
            required
            minLength={10}
            maxLength={10000}
          />
        </label>
        {isQuote && (
          <>
            <label>
              Project / service location <span>*</span>
              <input
                name="location"
                placeholder="Town / city and province"
                required
                maxLength={200}
              />
            </label>
            <label>
              Preferred completion date
              <input name="completionDate" type="date" min={today} />
            </label>
            <div className="full-width upload-field">
              <label htmlFor="documents">
                Supporting documents <span className="optional">(optional)</span>
              </label>
              <label className="upload-zone" htmlFor="documents">
                <Upload size={24} />
                <strong>Choose files to attach</strong>
                <span>RFQs, drawings, specifications or bills of quantities</span>
                <small>PDF, DOCX, XLSX, JPG or PNG · Up to 3 files, 10 MB each</small>
              </label>
              <input
                ref={fileRef}
                id="documents"
                className="file-input"
                type="file"
                name="documents"
                multiple
                accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png"
                aria-describedby="file-feedback"
                onChange={(e) => {
                  const next = Array.from(e.target.files || []);
                  const invalid =
                    next.length > 3
                      ? 'Please choose no more than 3 files.'
                      : next.some((f) => f.size > 10 * 1024 * 1024)
                        ? 'Each file must be 10 MB or smaller.'
                        : next.some((f) => !/\.(pdf|docx|xlsx|jpe?g|png)$/i.test(f.name))
                          ? 'Choose a PDF, DOCX, XLSX, JPG or PNG file.'
                          : '';
                  setFileError(invalid);
                  setFiles(invalid ? [] : next);
                }}
              />
              <div id="file-feedback" aria-live="polite">
                {fileError && <p className="form-error">{fileError}</p>}
                {files.map((f, i) => (
                  <div className="file-row" key={`${f.name}-${i}`}>
                    <span>
                      {f.name} <small>({(f.size / 1024).toFixed(0)} KB)</small>
                    </span>
                    <button
                      type="button"
                      aria-label={`Remove ${f.name}`}
                      onClick={() => {
                        setFiles(files.filter((_, index) => index !== i));
                        if (fileRef.current) fileRef.current.value = '';
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        <div className="honeypot" aria-hidden="true">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
      </div>
      <label className="consent">
        <input type="checkbox" name="consent" required />
        <span>
          I agree that Rayoni may use these details to respond to my enquiry.{' '}
          <Link to="/privacy" target="_blank">
            Privacy notice
          </Link>
        </span>
      </label>
      <p className="form-small">Fields marked * are required.</p>
      {status === 'error' && (
        <p className="form-error" role="alert">
          {message}
        </p>
      )}
      <button
        className="button submit-button"
        type="submit"
        disabled={status === 'sending' || !!fileError}
      >
        {status === 'sending'
          ? 'Sending your enquiry…'
          : isQuote
            ? 'Submit quotation request'
            : 'Send message'}
        <ArrowUpRight size={18} />
      </button>
    </form>
  );
}

function QuotePage() {
  const query = new URLSearchParams(useLocation().search).get('service') || '';
  const selected = services.some((s) => s.id === query) || query === 'multiple' ? query : '';
  return (
    <section className="quote-page container section">
      <div className="quote-intro">
        <Link to="/" className="back-link">
          ← Back to Rayoni
        </Link>
        <Eyebrow>Request a quote</Eyebrow>
        <h1>
          Every great build
          <br />
          starts with
          <br />
          <span>a conversation.</span>
        </h1>
        <p>
          Tell us what you have in mind. Whether it’s a construction project, a supply requirement
          or a specialist service, we’re ready to understand your vision.
        </p>
        <div className="quote-steps">
          <h2>What happens next?</h2>
          <div>
            <span>01</span>
            <p>We review your brief and requirements.</p>
          </div>
          <div>
            <span>02</span>
            <p>We clarify the scope, location and timeline with you.</p>
          </div>
          <div>
            <span>03</span>
            <p>We prepare an appropriate solution and quotation.</p>
          </div>
        </div>
        <div className="quote-note">
          <Compass size={26} />
          <p>
            Not sure which service fits?
            <br />
            <strong>Select “Multiple services / other requirement”.</strong>
          </p>
        </div>
      </div>
      <div className="quote-form-card">
        <div className="form-card-heading">
          <span>YOUR NEXT PROJECT</span>
          <h2>Let’s get the details.</h2>
          <p>A little context helps us plan the right solution.</p>
        </div>
        <EnquiryForm kind="quote" selectedService={selected} />
      </div>
    </section>
  );
}
function Privacy() {
  return (
    <section className="section container privacy-page">
      <Eyebrow>Privacy notice</Eyebrow>
      <h1>
        Your enquiry.
        <br />
        Handled with care.
      </h1>
      <p>
        This website collects the details you choose to provide in its contact and quotation forms:
        your name, contact details, organisation, project requirements, location, preferred
        completion date and any documents you attach.
      </p>
      <h2>Why we collect it</h2>
      <p>
        These details are used to review your enquiry, contact you about your requirements and
        prepare a potential quotation. Submitting a form does not subscribe you to marketing.
      </p>
      <h2>Where your enquiry goes</h2>
      <p>
        Enquiries and attachments are stored on the website’s server for review by the Rayoni team.
        Attachments are not made publicly available. Please submit only information relevant to your
        request and avoid including sensitive personal documents.
      </p>
      <h2>Third-party content</h2>
      <p>
        Fonts and site photography are hosted with the website. The area map loads Google Maps only
        when you choose to view it; Google then processes the map request under its own privacy
        terms. This site does not use advertising or analytics cookies.
      </p>
      <h2>Requests about your information</h2>
      <p>
        You can use the contact form to request access, correction or deletion of an enquiry,
        quoting its reference. Rayoni’s verified privacy contact details and retention schedule are
        awaiting confirmation and must be supplied before public launch.
      </p>
      <Button to="/#contact">Contact Rayoni</Button>
    </section>
  );
}
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Brand light />
            <p>
              From vision to execution.
              <br />
              Construction and general supply, South Africa.
            </p>
          </div>
          <div className="footer-links">
            <span>EXPLORE</span>
            {['About', 'Services', 'Projects'].map((n) => (
              <Link key={n} to={`/#${n.toLowerCase()}`}>
                {n}
              </Link>
            ))}
          </div>
          <div className="footer-links">
            <span>CONNECT</span>
            <Link to="/#credentials">Company credentials</Link>
            <Link to="/#contact">Contact us</Link>
            <Link to={quoteUrl()}>
              Request a quote <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="footer-location">
            <MapPin size={20} />
            <span>
              Rooted in Westonaria.
              <br />
              Looking to tomorrow.
            </span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Rayoni. All rights reserved.</span>
          <Link to="/privacy">Privacy notice</Link>
          <a
            href="#main"
            onClick={(e) => {
              if (window.location.pathname !== '/') return;
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Back to top <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ScrollManager />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/request-a-quote" element={<QuotePage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route
            path="*"
            element={
              <section className="section container privacy-page">
                <Eyebrow>Page not found</Eyebrow>
                <h1>
                  Let’s get you
                  <br />
                  back on site.
                </h1>
                <Button to="/">Back to home</Button>
              </section>
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
