"use client";

/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element */

import {
  CSSProperties,
  FormEvent,
  MouseEvent,
  PointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";

const SIGNUP_URL =
  "https://script.google.com/macros/s/AKfycbxQ8vaILXuBr8rOOq72bKnrY3Z4YVWF_UnGytue6IyaEij5zP5vU9wUJQyFBbZuWqnlcg/exec";

type TransitionKind = "bottle" | "route" | "ring" | "card" | null;

const objectLinks = [
  {
    id: "stories",
    label: "Father stories",
    className: "coffee-hit",
    kind: null,
    image: "/nairobaba/growing-table.png",
    eyebrow: "Notes from the table",
    headline: "The things dads say once the table feels safe.",
    copy: "Open a note and hear a father say what he usually keeps to himself.",
  },
  {
    id: "after-hours",
    label: "After Hours",
    className: "beer-hit",
    kind: "ring" as const,
    image: "/nairobaba/after-hours.png",
    eyebrow: "20:30 / Nairobi",
    headline: "A drink. A coffee. A proper conversation.",
    copy: "Work, money, relationships, fatherhood, and whatever has been sitting heavy.",
  },
  {
    id: "night-shift",
    label: "The Night Shift",
    className: "bottle-hit",
    kind: "bottle" as const,
    image: "/nairobaba/night-shift.png",
    eyebrow: "03:17 / Nairobi",
    headline: "Up at 3:17? So is another dad.",
    copy: "For bottle warming, pacing the floor, and checking whether the baby is actually breathing.",
  },
  {
    id: "baba-walks",
    label: "Baba Walks",
    className: "phone-hit",
    kind: "route" as const,
    image: "/nairobaba/baba-walks.png",
    eyebrow: "10:00 / Karura",
    headline: "Baby ready? Let’s go outside.",
    copy: "Karura, carriers, prams, and coffee afterwards. We are not timing the walk.",
  },
  {
    id: "baba-sundays",
    label: "Baba Sundays",
    className: "card-hit",
    kind: "card" as const,
    image: "/nairobaba/baba-sundays.png",
    eyebrow: "Sunday / Nairobi",
    headline: "Come for lunch. Leave when the baby says so.",
    copy: "Food, music, children under the table, and dads who understand interrupted conversations.",
  },
];

const fatherNotes = [
  {
    id: "sleep",
    className: "note-one",
    short: "Sleep is not a flex.",
    quote:
      "The first time another dad admitted he was exhausted, I stopped feeling like I was failing.",
    byline: "A new dad, Kilimani",
  },
  {
    id: "help",
    className: "note-two",
    short: "Asking for help is part of the job.",
    quote:
      "I thought being a good father meant knowing what to do. Most days it means being willing to ask.",
    byline: "A father of two, Lavington",
  },
  {
    id: "moments",
    className: "note-three",
    short: "The walk helped more than I expected.",
    quote:
      "I thought I was going for the baby. I came back realising I needed the walk too.",
    byline: "Sunday walker, Westlands",
  },
  {
    id: "alone",
    className: "note-four",
    short: "I needed somewhere I could say I was struggling.",
    quote:
      "I love my family. I also needed somewhere I could admit I had no idea what I was doing.",
    byline: "A new dad, Kilimani",
  },
];

function SignalCursor() {
  const [point, setPoint] = useState({ x: -30, y: -30 });
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (event: globalThis.PointerEvent) => {
      setPoint({ x: event.clientX, y: event.clientY });
      setVisible(true);
      const target = event.target as HTMLElement;
      const interactive = target.closest<HTMLElement>("[data-cursor], a, button, input");
      setLabel(interactive?.dataset.cursor ?? (interactive ? "OPEN" : ""));
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div
      className={`signal-cursor ${visible ? "visible" : ""} ${label ? "active" : ""}`}
      style={{ transform: `translate3d(${point.x}px, ${point.y}px, 0)` }}
      aria-hidden="true"
    >
      <span />
      <small>{label}</small>
    </div>
  );
}

function TransitionLayer({
  kind,
  origin,
  label,
}: {
  kind: TransitionKind;
  origin: { x: number; y: number };
  label: string;
}) {
  if (!kind) return null;
  const style = {
    "--origin-x": `${origin.x}px`,
    "--origin-y": `${origin.y}px`,
    "--bottle-scene-x": `${31 - origin.x}px`,
    "--bottle-scene-y": `${63 - origin.y}px`,
    "--ring-scene-x": `${52 - origin.x}px`,
    "--ring-scene-y": `${52 - origin.y}px`,
  } as CSSProperties;

  return (
    <div className={`transition-layer transition-${kind}`} style={style} aria-hidden="true">
      {kind === "bottle" && (
        <div className="transition-bottle-window">
          <img src="/nairobaba/night-shift.png" alt="" />
          <span className="transition-bottle-neck" />
        </div>
      )}
      {kind === "route" && (
        <>
          <img className="transition-route-scene" src="/nairobaba/baba-walks.png" alt="" />
          <div className="transition-phone-origin"><span>03:17</span></div>
          <svg className="transition-route" viewBox="0 0 1000 700" preserveAspectRatio="none">
            <path d="M0 440 C170 440 140 120 350 120 S530 580 710 470 S820 150 1000 190" />
            <circle cx="350" cy="120" r="7" />
            <circle cx="710" cy="470" r="7" />
          </svg>
        </>
      )}
      {kind === "ring" && (
        <div className="transition-ring-window">
          <img src="/nairobaba/after-hours.png" alt="" />
          <span className="transition-ring-edge" />
        </div>
      )}
      {kind === "card" && (
        <div className="transition-card">
          <img src="/nairobaba/baba-sundays.png" alt="" />
          <span className="transition-card-wash" />
          <strong>Sunday / Nairobi</strong>
        </div>
      )}
      <div className="transition-destination">{label}</div>
    </div>
  );
}

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [transition, setTransition] = useState<TransitionKind>(null);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [transitionLabel, setTransitionLabel] = useState("");
  const [launching, setLaunching] = useState("");
  const [visited, setVisited] = useState<string[]>([]);
  const [instructionSettled, setInstructionSettled] = useState(false);
  const [portalId, setPortalId] = useState<string | null>(null);
  const [openNoteId, setOpenNoteId] = useState<string | null>(null);
  const [speakingNoteId, setSpeakingNoteId] = useState<string | null>(null);
  const [noteOffsets, setNoteOffsets] = useState<Record<string, { x: number; y: number }>>({});
  const dragNote = useRef<{
    id: string;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
    moved: boolean;
  } | null>(null);
  const suppressNoteClick = useRef<string | null>(null);

  useEffect(() => {
    const overlayOpen = modalOpen || Boolean(openNoteId) || Boolean(portalId);
    document.body.classList.toggle("modal-open", overlayOpen);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setModalOpen(false);
      setOpenNoteId(null);
      setPortalId(null);
      window.speechSynthesis?.cancel();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [modalOpen, openNoteId, portalId]);

  useEffect(() => {
    const instructionTimer = window.setTimeout(() => setInstructionSettled(true), 6800);
    const elements = [...document.querySelectorAll<HTMLElement>(".reveal")];
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("in-view")),
      { threshold: 0.18 },
    );
    elements.forEach((element) => observer.observe(element));

    const hero = document.querySelector<HTMLElement>(".village-hero");
    const growingTable = document.querySelector<HTMLElement>(".growing-table");
    const onScroll = () => {
      if (hero) {
        const progress = Math.min(1, Math.max(0, window.scrollY / Math.max(1, window.innerHeight)));
        hero.style.setProperty("--hero-progress", String(progress));
      }
      if (growingTable) {
        const bounds = growingTable.getBoundingClientRect();
        const travel = Math.max(1, bounds.height + window.innerHeight);
        const progress = Math.min(1, Math.max(0, (window.innerHeight - bounds.top) / travel));
        growingTable.style.setProperty("--table-growth", String(progress));
        growingTable.style.setProperty("--table-clip", `${13 - progress * 13}%`);
        growingTable.style.setProperty("--table-scale", String(1.14 - progress * .14));
        growingTable.style.setProperty("--table-scale-y", String(.9 + progress * .1));
        growingTable.style.setProperty("--table-extension-height", `${52 + progress * 41}%`);
        growingTable.style.setProperty("--table-extension-opacity", String(.2 + progress * .55));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.clearTimeout(instructionTimer);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.speechSynthesis?.cancel();
    };
  }, []);

  function openSection(
    sectionId: string,
    kind: TransitionKind,
    event?: MouseEvent<HTMLElement>,
  ) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const x = event?.clientX ?? window.innerWidth / 2;
    const y = event?.clientY ?? window.innerHeight / 2;
    setOrigin({ x, y });
    setVisited((current) => current.includes(sectionId) ? current : [...current, sectionId]);
    setLaunching(sectionId);
    setTransitionLabel(objectLinks.find((item) => item.id === sectionId)?.label ?? "");
    if (reduced) {
      setPortalId(sectionId);
      setLaunching("");
      return;
    }
    if (kind) window.setTimeout(() => setTransition(kind), 140);
    window.setTimeout(() => {
      setTransition(null);
      setLaunching("");
      setPortalId(sectionId);
    }, kind ? 1160 : 240);
  }

  function enterSection(sectionId: string) {
    setPortalId(null);
    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }

  function moveNote(event: PointerEvent<HTMLButtonElement>, noteId: string) {
    const drag = dragNote.current;
    if (!drag || drag.id !== noteId) return;
    const x = Math.max(-150, Math.min(150, drag.offsetX + event.clientX - drag.startX));
    const y = Math.max(-105, Math.min(105, drag.offsetY + event.clientY - drag.startY));
    if (Math.abs(event.clientX - drag.startX) > 4 || Math.abs(event.clientY - drag.startY) > 4) {
      drag.moved = true;
    }
    setNoteOffsets((current) => ({ ...current, [noteId]: { x, y } }));
  }

  function releaseNote(event: PointerEvent<HTMLButtonElement>, noteId: string) {
    if (dragNote.current?.id !== noteId) return;
    if (dragNote.current.moved) suppressNoteClick.current = noteId;
    event.currentTarget.releasePointerCapture(event.pointerId);
    dragNote.current = null;
  }

  function openNote(noteId: string) {
    if (suppressNoteClick.current === noteId) {
      suppressNoteClick.current = null;
      return;
    }
    setOpenNoteId(noteId);
  }

  function speakNote(noteId: string) {
    const note = fatherNotes.find((item) => item.id === noteId);
    if (!note || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    if (speakingNoteId === noteId) {
      setSpeakingNoteId(null);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(note.quote);
    const voices = window.speechSynthesis.getVoices();
    const voicePreferences = [
      (voice: SpeechSynthesisVoice) => voice.lang.toLowerCase() === "en-ke",
      (voice: SpeechSynthesisVoice) => /kenya|kenyan/i.test(`${voice.name} ${voice.lang}`),
      (voice: SpeechSynthesisVoice) => voice.lang.toLowerCase() === "en-za",
      (voice: SpeechSynthesisVoice) => voice.lang.toLowerCase() === "en-ng",
      (voice: SpeechSynthesisVoice) =>
        voice.lang.toLowerCase().startsWith("en") &&
        /natural|neural|premium|google|microsoft/i.test(voice.name),
      (voice: SpeechSynthesisVoice) => voice.lang.toLowerCase().startsWith("en-gb"),
      (voice: SpeechSynthesisVoice) => voice.lang.toLowerCase().startsWith("en"),
    ];
    utterance.voice =
      voicePreferences
        .map((preference) => voices.find(preference))
        .find((voice) => Boolean(voice)) ?? null;
    utterance.rate = 0.97;
    utterance.pitch = 1;
    utterance.volume = 0.96;
    utterance.onend = () => setSpeakingNoteId(null);
    utterance.onerror = () => setSpeakingNoteId(null);
    setSpeakingNoteId(noteId);
    window.speechSynthesis.speak(utterance);
  }

  function closeNote() {
    window.speechSynthesis?.cancel();
    setSpeakingNoteId(null);
    setOpenNoteId(null);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    try {
      const payload = new URLSearchParams({
        email,
        source: "NAIROBABA Website",
        consent: "Yes",
        joiningAs: "Dad",
        website: "",
      });
      await fetch(SIGNUP_URL, { method: "POST", mode: "no-cors", body: payload });
      setEmail("");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="nairobaba-site">
      <SignalCursor />
      <TransitionLayer kind={transition} origin={origin} label={transitionLabel} />

      <header className="table-header">
        <a href="#top" className="header-mark" aria-label="NAIROBABA home">
          NAIRO<span>B</span>ABA
        </a>
        <nav aria-label="Main navigation">
          <a href="#night-shift">The table</a>
          <a href="#stories">Stories</a>
          <a href="#baba-sundays">Gatherings</a>
        </nav>
        <div className="header-actions">
          <a className="hema-return" href="/">HEMA</a>
          <button onClick={() => setModalOpen(true)}>Join</button>
        </div>
      </header>

      <section className="village-hero" id="top">
        <picture className="table-photo-wrap" aria-hidden="true">
          <source
            media="(max-width: 900px), (orientation: portrait)"
            srcSet="/nairobaba/village-table-hero-mobile.png"
          />
          <img className="table-photo" src="/nairobaba/village-table-hero.png" alt="" />
        </picture>
        <div className="table-shade" />

        <div className="hero-title">
          <p className="live-line"><span /> Nairobi table / open</p>
          <h1 aria-label="NAIROBABA">NAIRO<span>B</span>ABA</h1>
          <h2>The city is raising fathers too.</h2>
          <p>A <strong>H<span>E</span>MA</strong> Community</p>
        </div>

        <div className={`table-instruction ${instructionSettled ? "settled" : ""}`}>
          <span>Something on the table will take you somewhere.</span>
          <strong className="pointer-pick">Pick something up.</strong>
          <strong className="touch-pick">Tap an object to pick it up.</strong>
        </div>

        {objectLinks.map((item, index) => (
          <button
            key={item.id}
            className={`table-object ${item.className} ${launching === item.id ? "is-launching" : ""} ${visited.includes(item.id) ? "is-visited" : ""}`}
            onClick={(event) => openSection(item.id, item.kind, event)}
            data-cursor={item.label}
            aria-label={`Open ${item.label}`}
            style={{ "--cue-delay": `${1.15 + index * .7}s` } as CSSProperties}
          >
            <span className="object-ring" />
            <span className="object-dot" />
            <span className="object-label">{item.label}</span>
            <span className="object-cue" aria-hidden="true" />
            {item.id === "baba-walks" && <span className="phone-clock">03:17</span>}
            {item.id === "baba-sundays" && <span className="card-copy">BABA<br />SUNDAYS</span>}
          </button>
        ))}

        <div className="hema-sticker" aria-hidden="true">HEMA<span /></div>

        <button
          className="chair-hit"
          onClick={() => setModalOpen(true)}
          data-cursor="TAKE A SEAT"
        >
          <span>One chair is still open</span>
          <strong>Take a seat</strong>
        </button>

      </section>

      <section className="programme night-section reveal" id="night-shift">
        <div className="programme-copy">
          <p className="section-number">01 / 03:17</p>
          <h2>The Night Shift<span>•</span></h2>
          <p>Some nights, fatherhood is just you, a warm bottle, and a baby who refuses to settle.</p>
          <p className="detail">Come in while the house is quiet. Talk if you want to. Read along if you do not.</p>
          <button onClick={() => setModalOpen(true)}>See who is awake</button>
        </div>
        <figure className="programme-image bottle-reveal">
          <img src="/nairobaba/night-shift.png" alt="A father warming a bottle while holding his sleeping baby at night" />
          <figcaption>03:17 / Nairobi / Someone else is awake</figcaption>
        </figure>
      </section>

      <section className="programme walk-section reveal" id="baba-walks">
        <div className="programme-copy">
          <p className="section-number">02 / 10:00</p>
          <h2>Baba Walks<span>•</span></h2>
          <p>Bring the baby. We will meet you at the gate.</p>
          <p className="detail">Prams, carriers, and coffee afterwards. Nobody cares about pace, sleep schedules, or who turns back first.</p>
          <button onClick={() => setModalOpen(true)}>Find the next walk</button>
        </div>
        <figure className="programme-image route-reveal">
          <img src="/nairobaba/baba-walks.png" alt="Four Nairobi fathers walking together with babies" />
          <svg viewBox="0 0 1000 250" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 170 C160 160 140 40 320 60 S520 220 680 130 S830 40 1000 90" />
            <circle cx="320" cy="60" r="8" />
            <circle cx="680" cy="130" r="8" />
          </svg>
          <figcaption>Karura / Sunday / Prams welcome</figcaption>
        </figure>
      </section>

      <section className="programme after-section reveal" id="after-hours">
        <figure className="programme-image ring-reveal">
          <img src="/nairobaba/after-hours.png" alt="Two Nairobi fathers talking honestly over a drink and coffee" />
          <span className="condensation-ring" aria-hidden="true" />
          <figcaption>20:30 / Drinks optional / Phones down</figcaption>
        </figure>
        <div className="programme-copy">
          <p className="section-number">03 / 20:30</p>
          <h2>After Hours<span>•</span></h2>
          <p>A table where you can finish the thought.</p>
          <p className="detail">Work, money, partnership, identity, and the parts of fatherhood you are still trying to name. The beer is optional.</p>
          <button onClick={() => setModalOpen(true)}>Come to the table</button>
        </div>
      </section>

      <section className="programme sunday-section reveal" id="baba-sundays">
        <div className="programme-copy sunday-card">
          <div className="card-front">
            <p className="section-number">04 / Sunday</p>
            <h2>Baba Sundays<span>•</span></h2>
            <p>Lunch with people who understand why you may arrive late and leave early.</p>
          </div>
          <div className="card-inside">
            <p className="detail">Food, music, babies, bigger children, and no schedule to protect.</p>
            <button onClick={() => setModalOpen(true)}>See the next Sunday</button>
          </div>
        </div>
        <figure className="programme-image card-reveal">
          <img src="/nairobaba/baba-sundays.png" alt="Nairobi fathers and families sharing a relaxed Sunday meal" />
          <figcaption>Families welcome / Stay as long as you like</figcaption>
        </figure>
      </section>

      <section className="growing-table reveal" id="stories">
        <img src="/nairobaba/growing-table.png" alt="" className="growing-table-photo" />
        <div className="table-extension" aria-hidden="true" />
        <div className="growth-shade" />
        <div className="growth-count"><span>04 chairs</span><span>08 chairs</span></div>
        <article className="table-quote">
          <p>Note from the table</p>
          <blockquote>
            “I love my family. I also needed somewhere I could admit I had no idea what I was doing.”
          </blockquote>
          <small>A new dad, Kilimani</small>
        </article>
        {fatherNotes.map((note) => {
          const offset = noteOffsets[note.id] ?? { x: 0, y: 0 };
          return (
            <button
              key={note.id}
              className={`paper-note ${note.className}`}
              style={{
                "--note-x": `${offset.x}px`,
                "--note-y": `${offset.y}px`,
              } as CSSProperties}
              data-cursor="MOVE / LISTEN"
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                dragNote.current = {
                  id: note.id,
                  startX: event.clientX,
                  startY: event.clientY,
                  offsetX: offset.x,
                  offsetY: offset.y,
                  moved: false,
                };
              }}
              onPointerMove={(event) => moveNote(event, note.id)}
              onPointerUp={(event) => releaseNote(event, note.id)}
              onPointerCancel={(event) => releaseNote(event, note.id)}
              onClick={() => openNote(note.id)}
              aria-label={`Open note: ${note.short}`}
            >
              <span className="note-pin" />
              <strong>{note.short}</strong>
              <small><i className="mini-wave" /> Move or listen</small>
            </button>
          );
        })}

        <button className="final-chair" onClick={() => setModalOpen(true)} data-cursor="JOIN">
          <span>One chair is still open</span>
          <strong>Meet the other dads</strong>
          <em>Take a seat</em>
        </button>
      </section>

      <footer>
        <a href="#top" className="header-mark">NAIRO<span>B</span>ABA</a>
        <p>Made in Nairobi. Raised by the village.</p>
        <p><a href="/">A HEMA Community</a> © 2026</p>
      </footer>

      {portalId && (() => {
        const portal = objectLinks.find((item) => item.id === portalId);
        if (!portal) return null;
        const portalKind = portal.kind ?? "stories";
        return (
          <div className={`scene-portal portal-${portalKind}`} role="dialog" aria-modal="true" aria-labelledby="portal-title">
            <img src={portal.image} alt="" className="portal-photo" />
            <div className="portal-shade" />
            {portal.kind === "route" && (
              <svg className="portal-route" viewBox="0 0 1000 650" preserveAspectRatio="none" aria-hidden="true">
                <path d="M720 610 C650 500 780 410 640 340 S420 420 360 260 S170 80 0 160" />
                <circle cx="720" cy="610" r="8" />
                <circle cx="360" cy="260" r="8" />
              </svg>
            )}
            {portal.kind === "ring" && <span className="portal-condensation" aria-hidden="true" />}
            {portal.kind === "bottle" && <span className="portal-bottle-outline" aria-hidden="true" />}
            {portal.kind === "card" && <span className="portal-card-fold" aria-hidden="true" />}
            {portal.kind === null && (
              <div className="portal-note-stack" aria-hidden="true">
                <span>Still figuring it out.</span>
                <span>I nearly stayed home.</span>
                <span>I have no idea either.</span>
              </div>
            )}
            <button
              className="portal-close"
              onClick={() => setPortalId(null)}
              data-cursor="CLOSE"
              aria-label="Close scene"
            >
              ×
            </button>
            <div className="portal-copy">
              <p>{portal.eyebrow}</p>
              <h2 id="portal-title">{portal.headline}</h2>
              <span>{portal.copy}</span>
              <div>
                <button onClick={() => enterSection(portal.id)} data-cursor="ENTER">
                  Enter {portal.label}
                </button>
                <button onClick={() => setPortalId(null)} data-cursor="BACK">
                  Back to the table
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {modalOpen && (
        <div className="modal-backdrop" onMouseDown={() => setModalOpen(false)}>
          <section
            className="join-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="join-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setModalOpen(false)} data-cursor="CLOSE" aria-label="Close">×</button>
            {status === "done" ? (
              <div className="success-message">
                <p className="modal-kicker">Chair reserved</p>
                <h2 id="join-title">You’re at the table.</h2>
                <p>We will send you the next date, place, and time.</p>
                <button onClick={() => setModalOpen(false)}>Back to the table</button>
              </div>
            ) : (
              <>
                <p className="modal-kicker">One chair is still open</p>
                <h2 id="join-title">Take a seat.</h2>
                <p>Leave your email. We will send you the next gathering, not a daily newsletter.</p>
                <form onSubmit={submit}>
                  <label htmlFor="email">Email address</label>
                  <div className="form-row">
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@email.com"
                    />
                    <button type="submit" disabled={status === "sending"}>
                      {status === "sending" ? "Saving…" : "Join"}
                    </button>
                  </div>
                  {status === "error" && <p className="form-error">That didn’t go through. Please try again.</p>}
                  <small>Free to join. We will only email when there is something worth showing up for.</small>
                </form>
              </>
            )}
          </section>
        </div>
      )}

      {openNoteId && (() => {
        const note = fatherNotes.find((item) => item.id === openNoteId);
        if (!note) return null;
        const speaking = speakingNoteId === note.id;
        return (
          <div className="note-backdrop" onMouseDown={closeNote}>
            <section
              className="voice-note"
              role="dialog"
              aria-modal="true"
              aria-labelledby="voice-note-title"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <button className="voice-note-close" onClick={closeNote} data-cursor="CLOSE" aria-label="Close note">×</button>
              <p>Note from the table</p>
              <div className={`voice-wave ${speaking ? "is-speaking" : ""}`} aria-hidden="true">
                {Array.from({ length: 28 }).map((_, index) => <span key={index} />)}
              </div>
              <blockquote id="voice-note-title">“{note.quote}”</blockquote>
              <small>{note.byline}</small>
              <button className="read-note" onClick={() => speakNote(note.id)} data-cursor={speaking ? "STOP" : "LISTEN"}>
                <span>{speaking ? "■" : "▶"}</span>
                {speaking ? "Stop" : "Listen"}
              </button>
              <em>Kenyan English is preferred when your device offers it.</em>
            </section>
          </div>
        );
      })()}
    </main>
  );
}
