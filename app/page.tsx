"use client";

import { CSSProperties, FormEvent, PointerEvent, useEffect, useRef, useState } from "react";
import "./wall.css";

type Arrival = "MUM" | "DAD" | "BOTH";

const arrivals: Record<Arrival, { eyebrow: string; frequency: string; color: string; line: string; detail: string }> = {
  MUM: {
    eyebrow: "MUM / 3:08 AM",
    frequency: "88.3 FM",
    color: "#f2bd68",
    line: "I love this baby. I miss being asked about me.",
    detail: "Recovery, identity, feeding and friendship with people who see the person behind mum.",
  },
  DAD: {
    eyebrow: "DAD / 2:41 AM",
    frequency: "94.1 FM",
    color: "#94bed6",
    line: "I am a parent too. I do not have to know everything yet.",
    detail: "Connection, confidence and honest support that never treats dad like the assistant.",
  },
  BOTH: {
    eyebrow: "BOTH / 4:02 AM",
    frequency: "101.7 FM",
    color: "#df7761",
    line: "Same baby. Same home. Two completely different nights.",
    detail: "Somewhere to remember you are on the same side, without pretending it is always easy.",
  },
};

const parentSignals = [
  ["FEEDING", "Bottle warm. Coffee cold."],
  ["WALKING", "Another lap of the hallway."],
  ["TEXTING", "‘Is this normal?’ sent at 3:12."],
  ["RESTING", "For eleven whole minutes."],
];

const HEMA_SIGNUP_URL = "https://script.google.com/macros/s/AKfycbxQ8vaILXuBr8rOOq72bKnrY3Z4YVWF_UnGytue6IyaEij5zP5vU9wUJQyFBbZuWqnlcg/exec";

const starterNotes = [
  "I love my baby. I miss my old mornings.",
  "Nobody warned me how lonely paternity leave could feel.",
  "We argued about a bottle and laughed ten minutes later.",
  "Today nothing dramatic happened. It was just hard.",
];

const rooms = [
  ["01", "THE 3AM ROOM", "Open when the question feels too small for a professional and too real for the family chat."],
  ["02", "PARENT CIRCLES", "Small groups matched by stage. Join alone, together, late or with the baby awake."],
  ["03", "OUT IN THE WORLD", "Coffee walks, mum dinners, dad mornings and gatherings where leaving early still counts."],
];

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [arrival, setArrival] = useState<Arrival>("MUM");
  const [now, setNow] = useState<Date | null>(null);
  const [awake, setAwake] = useState(false);
  const [holding, setHolding] = useState(false);
  const [notes, setNotes] = useState(starterNotes);
  const [newNote, setNewNote] = useState("");
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [phase, setPhase] = useState("night");
  const [openWindow, setOpenWindow] = useState<number | null>(null);
  const [signalMessage, setSignalMessage] = useState("");
  const [soundOn, setSoundOn] = useState(false);
  const pageRef = useRef<HTMLElement>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<{ context: AudioContext; source: AudioBufferSourceNode } | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    const sections = [...root.querySelectorAll<HTMLElement>("[data-time]")];
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) setPhase((entry.target as HTMLElement).dataset.time || "night");
    }), { rootMargin: "-35% 0px -45%", threshold: 0 });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => { audioRef.current?.source.stop(); audioRef.current?.context.close(); }, []);

  const toggleSound = () => {
    if (audioRef.current) {
      audioRef.current.source.stop();
      audioRef.current.context.close();
      audioRef.current = null;
      setSoundOn(false);
      return;
    }
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const context = new AudioCtx();
    const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    source.loop = true;
    filter.type = "lowpass";
    filter.frequency.value = 320;
    gain.gain.value = 0.018;
    source.connect(filter).connect(gain).connect(context.destination);
    source.start();
    audioRef.current = { context, source };
    setSoundOn(true);
  };

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    const sections = [...root.querySelectorAll<HTMLElement>("[data-reveal]")];
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.14 },
    );
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const clock = now ? now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "3:17 AM";

  const moveLight = (event: PointerEvent<HTMLElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--light-x", `${event.clientX - box.left}px`);
    event.currentTarget.style.setProperty("--light-y", `${event.clientY - box.top}px`);
  };

  const startSignal = () => {
    if (awake) return;
    setHolding(true);
    holdTimer.current = setTimeout(() => {
      setAwake(true);
      setHolding(false);
    }, 1100);
  };

  const stopSignal = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = null;
    setHolding(false);
  };

  const addNote = (event: FormEvent) => {
    event.preventDefault();
    const note = newNote.trim();
    if (!note) return;
    setNotes(current => [note, ...current]);
    setNewNote("");
  };

  const join = async (event: FormEvent) => {
    event.preventDefault();
    if (!email || joining) return;
    setJoining(true);
    setJoinError("");
    try {
      const body = new URLSearchParams({ email: email.trim(), source: "HEMA Website", consent: "Yes", website: "" });
      await fetch(HEMA_SIGNUP_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" }, body });
      setJoined(true);
    } catch {
      setJoinError("We could not save your email. Please try again in a moment.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <main className="h-site" ref={pageRef}>
      <header className="h-nav">
        <a className="h-logo" href="#top" aria-label="HEMA home">H<span>E</span>MA<i className="h-logo-signal" /></a>
        <button className="h-menu" type="button" onClick={() => setMenu(current => !current)}>{menu ? "CLOSE" : "MENU"}</button>
        <nav className={menu ? "open" : ""}>
          <a href="#story">OUR NIGHT</a>
          <a href="#wall">THE WALL</a>
          <a href="#inside">INSIDE</a>
          <a className="h-nav-join" href="#join">COME IN</a>
        </nav>
      </header>

      <aside className={`h-timeline phase-${phase}`} aria-label="Your journey through the night">
        <span data-phase="night"><i />03:17</span><span data-phase="small-hours"><i />05:52</span><span data-phase="morning"><i />MORNING</span>
      </aside>
      <button className={`h-room-tone ${soundOn ? "on" : ""}`} type="button" onClick={toggleSound} aria-pressed={soundOn}><i /> ROOM TONE {soundOn ? "ON" : "OFF"}</button>

      <section className={`h-night ${awake ? "is-awake" : ""}`} id="top" onPointerMove={moveLight} data-time="night">
        <div className="h-cursor-light" aria-hidden="true" />
        <div className="h-lightfield" aria-hidden="true">{[1,2,3,4,5,6,7].map(light => <i key={light} />)}</div>
        <div className="h-night-photo" aria-hidden="true">
          <img src="/hema-night-parent.png" alt="" />
        </div>
        <div className="h-time"><span>LOCAL TIME</span><strong>{clock}</strong></div>
        <div className="h-night-copy">
          <p className="h-kicker">HEMA / THE NEW PARENT NIGHT LIGHT</p>
          <h1>Someone<br />else is<br /><em>awake.</em></h1>
          <p className="h-intro">A free living community for new mums, new dads and parents figuring it out together.</p>
          <div className="h-live-dial" aria-label="Live HEMA parent frequencies">
            <span>LIVE PARENT FREQUENCIES</span>
            {(["MUM", "DAD", "BOTH"] as Arrival[]).map(item => <a key={item} href="#story" onClick={() => setArrival(item)}><i />{item} <b>{arrivals[item].frequency}</b></a>)}
          </div>
          <button
            className={`h-signal ${holding ? "is-holding" : ""} ${awake ? "is-awake" : ""}`}
            type="button"
            aria-pressed={awake}
            onPointerDown={startSignal}
            onPointerUp={stopSignal}
            onPointerCancel={stopSignal}
            onPointerLeave={stopSignal}
            onClick={event => { if (event.detail === 0) setAwake(true); }}
          >
            <span className="h-signal-dot" />
            <span>{awake ? "YOUR LIGHT IS ON" : holding ? "KEEP HOLDING" : "PRESS AND HOLD — I’M AWAKE TOO"}</span>
            <i aria-hidden="true" />
          </button>
          {awake && <p className="h-awake-note">There you are. The night is a little brighter now.</p>}
        </div>
        <a className="h-scroll" href="#story"><span>SCROLL INTO THE NIGHT</span><i>↓</i></a>
        <div className="h-night-caption">No perfect parents.<br />Just people, awake.</div>
        <div className="h-night-routes"><a href="#documentary">FIELD NOTES ↘</a><a href="#wall">LIT WINDOWS ↘</a></div>
        <div className="h-parent-signals" aria-label="Other parents awake now">
          {parentSignals.map(([label, message], index) => <button key={label} type="button" style={{ "--signal-index": index } as CSSProperties} onClick={() => setSignalMessage(message)}><i /><span>{label}</span></button>)}
          {signalMessage && <p key={signalMessage} className="h-signal-whisper">{signalMessage}</p>}
        </div>
      </section>

      <section className="h-story" style={{ "--frequency": arrivals[arrival].color } as CSSProperties} id="story" data-reveal data-time="small-hours">
        <div className="h-story-heading">
          <p className="h-kicker">03:17 / THE SMALL HOURS</p>
          <h2>The baby has a village.<br /><em>You should too.</em></h2>
          <p>Everyone asks how the baby is doing. HEMA begins with the person holding them.</p>
        </div>
        <div className="h-constellation">
          <div className="h-orbit orbit-one" aria-hidden="true" />
          <div className="h-orbit orbit-two" aria-hidden="true" />
          <div className="h-arrival-buttons" role="group" aria-label="Choose whose story to read">
            {(["MUM", "DAD", "BOTH"] as Arrival[]).map((item, index) => (
              <button className={arrival === item ? "active" : ""} onClick={() => setArrival(item)} type="button" key={item}>
                <span>{arrivals[item].frequency}</span>{item}
              </button>
            ))}
          </div>
          <article className="h-transmission" key={arrival}>
            <p>{arrivals[arrival].frequency} / {arrivals[arrival].eyebrow}</p>
            <blockquote>“{arrivals[arrival].line}”</blockquote>
            <span>{arrivals[arrival].detail}</span>
          </article>
          <div className="h-listening"><i /><span>HEMA IS LISTENING</span></div>
          <span className="h-scribble scribble-one">however you got here →</span>
        </div>
      </section>

      <section className="h-dawn" data-reveal data-time="morning">
        <div className="h-dawn-sun" aria-hidden="true"><span /></div>
        <p className="h-kicker">05:52 / THE LIGHT CHANGES</p>
        <h2>You do not have to<br />do this part <em>alone.</em></h2>
        <p className="h-dawn-copy">HEMA turns the private hours of early parenthood into real friendship, useful support and places to go when you are ready.</p>
        <a href="#inside">SEE WHAT IS INSIDE <span>↘</span></a>
        <span className="h-scribble scribble-dawn">we survived tonight.</span>
      </section>

      <section className="h-documentary" id="documentary" data-reveal>
        <header><p className="h-kicker">FIELD NOTES / REAL LIFE, UNFILTERED</p><h2>Small hours.<br /><em>Big love.</em></h2></header>
        <div>
          <figure><img src="/hema-bottle-hands.png" alt="A parent preparing a bottle in a dim kitchen" /><figcaption><span>02:26</span> The bottle is warm. Yours went cold.</figcaption></figure>
          <figure><img src="/hema-dad-carrier.png" alt="A Black dad carrying his baby on a quiet morning walk" /><figcaption><span>06:14</span> First one out. Still part of the village.</figcaption></figure>
          <figure><img src="/hema-mum-coffee.png" alt="A Black mum holding her baby and a cup of coffee by a window" /><figcaption><span>07:03</span> A new day. No performance required.</figcaption></figure>
        </div>
      </section>

      <section className="h-wall" id="wall" data-reveal>
        <header>
          <div><p className="h-kicker">ANONYMOUS / HONEST / OPEN ALL NIGHT</p><h2>The 3AM Wall.</h2></div>
          <p>Leave the sentence that does not fit in the family group chat. Every note makes the night a little less lonely.</p>
        </header>
        <div className="h-city" aria-label="Lights left on by other parents">
          {notes.slice(0, 5).map((note, index) => (
            <button type="button" className={openWindow === index ? "active" : ""} onClick={() => setOpenWindow(openWindow === index ? null : index)} key={`${note}-${index}`}>
              <span className="h-window-grid" aria-hidden="true">{Array.from({ length: 12 }, (_, light) => <i key={light} />)}</span>
              <small>WINDOW / {String(notes.length - index).padStart(3, "0")}</small>
              <blockquote>“{note}”</blockquote><em>{openWindow === index ? "CLOSE THE CURTAIN" : "LIGHT ON — OPEN"}</em>
            </button>
          ))}
        </div>
        <form onSubmit={addNote}>
          <label htmlFor="night-note">LEAVE A LIGHT ON FOR SOMEONE</label>
          <div><textarea id="night-note" maxLength={140} value={newNote} onChange={event => setNewNote(event.target.value)} placeholder="Tonight I need somebody to know…" /><button>PUT IT ON THE WALL <span>↗</span></button></div>
          <small>{newNote.length}/140 / POSTED HERE ONLY FOR THIS VISIT</small>
        </form>
      </section>

      <section className="h-inside" id="inside" data-reveal>
        <header><p className="h-kicker">AFTER THE NIGHT</p><h2>Somewhere<br />to belong.</h2><p>Come as Mum. Come as Dad. Come together. Come tired. HEMA meets you where you are.</p></header>
        <div className="h-rooms">
          {rooms.map(room => <article key={room[0]}><span>{room[0]}</span><h3>{room[1]}</h3><p>{room[2]}</p><a href="#join">ENTER <b>↗</b></a></article>)}
        </div>
      </section>

      <section className="h-membership" data-reveal>
        <div><p className="h-kicker">START WHERE YOU ARE</p><h2>Free, because<br />the village <em>should be.</em></h2></div>
        <article className="h-free-card">
          <div><span>HEMA FOUNDING COMMUNITY</span><strong>FREE TO JOIN</strong><p>Because new parents need fewer barriers and more people who understand.</p></div>
          <ul><li>The 3AM Wall and open rooms</li><li>Parent circles and field notes</li><li>Selected sessions and gatherings</li><li>Join alone, with a partner or co-parent</li></ul>
          <a href="#join">COME INTO HEMA <b>↗</b></a>
        </article>
        <p className="h-membership-note">No price. No perfect attendance. Come back whenever you need the village.</p>
      </section>

      <section className="h-work" data-reveal>
        <p className="h-kicker">HEMA BEYOND THE WALL</p>
        <h2>Built for parents.<br />Useful to the world around them.</h2>
        <div><a href="mailto:work@hema.community"><span>FOR EMPLOYERS</span><strong>HEMA AT WORK</strong><i>Parental-leave and return-to-work support ↗</i></a><a href="mailto:partners@hema.community"><span>FOR GOOD BRANDS + PEOPLE</span><strong>HEMA PARTNERS</strong><i>Practitioners, venues and useful collaborations ↗</i></a></div>
      </section>

      <section className="h-join" id="join" data-reveal>
        <div><p className="h-kicker">THE LIGHT IS STILL ON</p><h2>Come as<br />you are.</h2><p>Tired counts.</p></div>
        {joined ? <div className="h-joined"><span>WELCOME TO HEMA</span><strong>You are not doing this alone.</strong><p>We saved {email} to the HEMA founding community list.</p></div> : <form onSubmit={join}><label htmlFor="email">START WITH YOUR EMAIL</label><input id="email" name="email" type="email" required autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@stillawake.com" /><input className="h-honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" /><button disabled={joining}>{joining ? "SAVING YOUR PLACE…" : "COME INTO HEMA"} <span>{joining ? "·" : "↗"}</span></button>{joinError && <p className="h-form-error" role="alert">{joinError}</p>}<small>By joining, you agree to receive HEMA community updates. You can leave at any time.</small></form>}
      </section>

      <footer><a className="h-logo" href="#top">H<span>E</span>MA</a><p>THE NEW PARENT NIGHT LIGHT</p><p>© 2026 / STILL AWAKE</p></footer>
    </main>
  );
}
