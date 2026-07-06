/* ============================================================
   Still Human 2045 — shared data
   -------------------------------------------------------------
   A forward-looking competency model. The premise: twenty years
   out, today's "AI skills" (prompting, hallucination-spotting,
   delegation mechanics) are solved — by the machines themselves.
   What stays scarce is the human interior. This curriculum
   trains the six faculties that remain load-bearing when
   intelligence is free:

     Attention      — finishing what you started reading
     Volition       — wanting something the system didn't suggest
     Grounding      — knowing what's real and who's actually there
     Taste          — choosing when every option is flawless
     Sovereignty    — still being able to think with the tools off
     Accountability — being the one who decides, and owning it

   Roots: the essay "My Flawed Human Race" (the Great Unread, the
   impressionistic question, outsourced memory, blaming the
   oracle), plus early signals in today's research — verification-
   bottleneck and skill-atrophy studies, automation-bias and
   trust-calibration literature, attention economics.
   ============================================================ */

const DIMENSIONS = [
  {
    id: "attention",
    name: "Attention",
    icon: "📖",
    tagline: "The last scarce resource",
    desc: "By 2045 everything arrives pre-summarized: meetings, contracts, friendships, your own life. The summaries are honest — and still lossy. The rare human who reads to the end, holds focus without offloading it, and notices what the digest quietly dropped, sees a world everyone else only skims.",
    lowTip: "Rebuild the finishing muscle: once a day, read one thing end-to-end with the summarizer off — and before expanding any digest, guess what it left out, then check. The gap between your guess and the source is your attention blind spot, mapped.",
    highTip: "You still read like it matters. Guard the edge: reserve whole-source reading for what's load-bearing, teach others the 'sentence three' habit, and keep one long-form ritual (a book, a full transcript) that no digest touches."
  },
  {
    id: "volition",
    name: "Volition",
    icon: "🔥",
    tagline: "Wanting something the system didn't suggest",
    desc: "When execution is free and every default is excellent, the bottleneck moves inside: do you still generate wants of your own? The 2045 failure mode isn't bad advice — it's a comfortable life assembled entirely from suggestions, lived by someone who never noticed they'd stopped choosing.",
    lowTip: "Practice unmediated wanting: regularly make a choice with recommendations hidden — a meal, a route, a Saturday — and sit with the discomfort of a blank menu until a preference of yours surfaces. Boredom is where wants come from; schedule some.",
    highTip: "Your desires still originate with you. Deepen it: keep a wants-journal the assistants can't read, periodically audit which of your 'preferences' you can trace to a felt experience versus a suggestion stream, and defend the untraceable ones."
  },
  {
    id: "grounding",
    name: "Grounding",
    icon: "🌍",
    tagline: "Knowing what's real and who's actually there",
    desc: "In 2045 most voices, faces, and consensus you encounter are synthetic, and the persuasive ones were optimized for you specifically. Grounding is provenance-tracking as a reflex: tracing claims to witnesses, feelings to their triggers, and 'everyone agrees' to whoever generated the everyone.",
    lowTip: "Adopt the provenance reflex: for anything that moves you to act or feel strongly, ask 'what chain connects this to a physical event or a human witness — and who benefits from me believing it?' When world-models disagree, go look with your own eyes; reality is the one feed nobody can personalize.",
    highTip: "You trace before you trust. Next: build out-of-band checks (people you can call, places you can stand, sensors you control) before you need them, and notice the subtler capture — synthetic relationships that are genuinely comforting and quietly load-bearing."
  },
  {
    id: "taste",
    name: "Taste",
    icon: "💎",
    tagline: "Choosing when every option is flawless",
    desc: "The machines deliver twelve perfect answers; correctness is the floor, not the ceiling. What's left is the question truth can't settle: which one ought to exist? Taste — knowing what you value and why, with a defensible 'because' — becomes the chief thing a human adds to any decision.",
    lowTip: "Taste is built, not downloaded: consume widely outside your recommendation stream, make things badly with your own hands, and every time you prefer one flawless option over another, force yourself to finish the sentence 'because…'. The 'because' is the skill.",
    highTip: "You can say why. Sharpen it: articulate criteria before you see options (so the options don't write your criteria), accept that distinctive choices will be disliked by someone, and revisit your own past choices looking for growth — taste that never changes is a rut with confidence."
  },
  {
    id: "sovereignty",
    name: "Sovereignty",
    icon: "🧠",
    tagline: "Still able to think with the tools off",
    desc: "The exocortex remembers everything, calculates everything, navigates everything — and every skill it absorbs from you fades on a schedule you won't notice. Sovereignty is keeping an independent model alive inside your own head: it's the only instrument that can tell you when the prosthetic is wrong.",
    lowTip: "Schedule naked flight: regular, deliberate sessions doing a load-bearing skill unassisted — estimate before you ask, navigate a day from memory, draft before you generate. It feels inefficient; it is maintenance. You'll discover atrophy now, cheaply, instead of during an outage.",
    highTip: "Your inner model still runs. Maintain the asymmetry: keep internal the knowledge you need in real time or that shapes judgment, let the rest be external index — and when you mentor juniors, make them struggle unassisted first; augmentation before competence installs the dependency without the skill."
  },
  {
    id: "accountability",
    name: "Accountability",
    icon: "⚡",
    tagline: "Being the one who decides",
    desc: "The system is right 99.9% of the time, which makes deference the most comfortable posture ever invented — and 'the system decided' the era's favorite alibi. Accountability is the refusal: overriding when you hold what the machine lacks, deferring when you don't, and signing your name either way.",
    lowTip: "Restore the ownership default: before accepting any consequential recommendation, say out loud 'I am choosing this' — if the sentence feels wrong, that's information. Override when you hold private observation or the values are yours to set; never merely because you dislike the answer. Log your overrides and score them honestly.",
    highTip: "You stay the author of your decisions. The advanced practice: own the objectives, not just the outputs — a system perfectly achieving a badly-named goal is your error, not its. And publish your wrong overrides; calibrated courage is built from honest scorekeeping."
  }
];

/* ------------------------------------------------------------
   THE FRAME — Year 2045: routine cognition is automated and
   every citizen draws a Universal Basic Salary. Paid human work
   still exists — reserved for people certified to bring what
   machines can't. The AI-CQ test is the Workforce Entry
   Examination; Centaur Academy is the official prep school.
   ------------------------------------------------------------ */
const EXAM = {
  authority: "Bureau of Human–AI Integration",
  examName: "Workforce Entry Examination",
  form: "Form WEE-2045 · Series AICQ",
  passScore: 100,
  passNote: "Scores of 100 and above qualify for a Human–AI Collaboration Work Permit. Scores below 100 continue on Universal Basic Salary — retake permitted after training.",
  lore: "In 2045, nobody has to work. Everybody eats. The machines answer every question, finish every task, and summarize every day before you live it. The permit isn't for people who can use the machines — everyone can. It's for people the machines can't replace: the ones still paying attention, still wanting, still deciding. Civilization passed its technological adolescence. This exam is yours."
};

/* Score bands for the AI-CQ test (raw 0–72 mapped to 55–145) */
const BANDS = [
  { min: 130, name: "Centaur",   emoji: "🏆", clearance: "Class-A Work Permit · unrestricted", blurb: "Fully present. You read to the end, want on your own authority, and sign your decisions. The machines bring you their hardest ambiguities because you supply the one thing they can't: someone home." },
  { min: 115, name: "Conductor", emoji: "🎼", clearance: "Class-B Work Permit · high-stakes roles", blurb: "The tools amplify you without steering you. Your attention finishes what it starts, your taste has reasons, and your overrides are earned. High-stakes rooms need exactly this." },
  { min: 100, name: "Navigator", emoji: "🧭", clearance: "Class-C Work Permit · standard roles", blurb: "Solidly your own person. You mostly notice when the defaults are living your life for you — mostly. Under pressure, the summaries win and the wanting goes quiet. Consistency is your frontier." },
  { min: 85,  name: "Apprentice", emoji: "🛠️", clearance: "Permit denied · UBS continues · retake in 14 days", blurb: "The machinery serves you well, but the interior is thinning: digests unexpanded, defaults unexamined, decisions co-signed rather than owned. All six faculties respond fast to deliberate practice." },
  { min: 70,  name: "Explorer",  emoji: "🧪", clearance: "Permit denied · UBS continues · training advised", blurb: "You move through the assisted world smoothly — that's the problem. Smoothness is what capture feels like from the inside. The Academy drills are designed to reintroduce useful friction." },
  { min: 0,   name: "Newcomer",  emoji: "🌱", clearance: "Permit denied · UBS continues · enroll at the Academy", blurb: "Everyone starts here, and none of this is talent — attention, volition, and judgment are muscles with a known training protocol. Work the six drills and retake in two weeks. The Bureau is patient." }
];

/* ============================================================
   CENTAUR ACADEMY — training drills, class of 2045
   Six games, one per faculty. Each item: prompt (q), options
   (opts) with exactly one best answer (ok:true) and feedback.
   ============================================================ */

const GAMES = [
  {
    id: "attention",
    dim: "attention",
    title: "Sentence Three",
    icon: "📖",
    how: "Named for the sentence nobody reads. Some cases here bury the deciding detail mid-passage — this drill doesn't just describe careful reading, it demands it.",
    items: [
      {
        q: "Your building agent's morning report: 'All systems nominal. Solar array at 97%. Water recycler serviced overnight. Note: the east stairwell lock's firmware update failed and will retry tonight — until then that door does not auto-lock. Garden drones rescheduled to Thursday. Air quality excellent.' That evening a neighbor asks if the building is secure. You say:",
        opts: [
          { t: "'Yes — the report said all systems nominal.'", fb: "Sentence one strikes again. 'Nominal' was the greeting, not the content — the exception was living quietly in the middle, where exceptions always live." },
          { t: "'Mostly — but the east stairwell won't auto-lock until the retry tonight, so latch it manually.'", ok: true, fb: "You read the whole report. Notice the anatomy: headline reassurance first, the one actionable exception buried mid-list. Reports written by agreeable systems will bury bad news forever — middles are where the truth hides." },
          { t: "'Ask the agent — it knows better than I do.'", fb: "It already told you. Re-asking what you didn't read is the 2045 version of replying 'it doesn't work' to an answer containing the fix." },
          { t: "'The garden drones were rescheduled, so probably not.'", fb: "You retained a detail — the decorative one. Skimming doesn't just lose information; it loses the *ranking* of what matters." }
        ]
      },
      {
        q: "Your exocortex summarizes a 60-page partnership contract as: 'Standard terms, favorable revenue split, low risk.' The deal is the biggest of your year. What does the fluent 2045 professional know about that summary?",
        opts: [
          { t: "It's from a certified summarizer, so it can be signed on", fb: "Certification means the summary is honest — not lossless. Compression must drop something, and what it drops is chosen by an average of past readers, not by your situation." },
          { t: "Summaries are honest but lossy, and the losses cluster in caveats, conditions, and edge cases — for load-bearing documents, read the source where the summary says 'standard'", ok: true, fb: "Exactly. 'Standard terms' is where compression hides the interesting clause — deviations get flagged, but so-called standards are only standard for the median party, and you are not the median. Load-bearing text earns whole-source reading." },
          { t: "Ask three different summarizers and sign if they agree", fb: "Ensemble skimming. They share the same compression incentives — agreement among summaries tells you about summarizers, not about clause 41(c)." },
          { t: "Summaries of legal text are illegal in 2045, so this can't happen", fb: "The Bureau wishes. No — the digest layer covers everything, which is exactly why knowing its failure shape is a certified skill." }
        ]
      },
      {
        q: "Team digest of yesterday's design review: 'Consensus to ship the housing to all climate zones. Materials approved. Timeline holds. Ana logged a reservation — the seal compound is untested below −30°C and she recommends holding the arctic batch. Marketing assets ready. Next review Friday.' Your boss asks: 'Anything blocking the arctic shipment?' You answer:",
        opts: [
          { t: "'Nothing — consensus was to ship everywhere.'", fb: "The word 'consensus' outshone the sentence that contradicted it. This is exactly the failure the drill is named for." },
          { t: "'Yes — Ana flagged the seal compound as untested below −30°C and recommended holding that batch.'", ok: true, fb: "You caught it. One dissent, four sentences deep, in a digest engineered to feel resolved. The costliest facts in any summary are the ones that disagree with its tone." },
          { t: "'Timeline holds, so we're good.'", fb: "You answered from the digest's mood, not its content. The timeline sentence and the arctic reservation are both true — only one of them freezes." },
          { t: "'Let me have the agent re-summarize it as action items.'", fb: "A summary of a summary loses twice. The answer was already in front of you; the missing ingredient was reading, not reformatting." }
        ]
      },
      {
        q: "A colleague posts a question to the team oracle, gets a five-step answer, tries nothing, and replies 'still broken.' You recognize this as the oldest failure in human–AI history. What's actually happening?",
        opts: [
          { t: "The oracle's answer was probably wrong", fb: "Check the logs: step one was never attempted. In 2045 as in 2025, the answer's accuracy was never the variable." },
          { t: "Asking felt like progress — announcing a problem discharges the feeling of effort, so the reading and doing quietly never happen", ok: true, fb: "The ancient pattern: the ask substitutes for the act. The cure hasn't changed in twenty years — before replying 'broken,' state which step you tried and what it did. That one sentence is the whole discipline." },
          { t: "The oracle should have made the answer shorter", fb: "It was five steps because the fix takes five steps. Compressing to match the attention supplied just relocates the failure." },
          { t: "Questions should be routed to humans first", fb: "The human would give the same five steps and the same colleague would skim them. The bottleneck is downstream of who answers." }
        ]
      },
      {
        q: "Your attention is fully mediated: feeds ranked, mail triaged, calls screened — each choice individually reasonable. What's the compound effect to guard against?",
        opts: [
          { t: "Nothing — mediation is just delegation of noise", fb: "Noise, yes. But the mediator's model of 'noise' was trained on what you engaged with, and what you engage with is not what you'd endorse." },
          { t: "You only ever see what predicts your engagement, so your picture of the world drifts toward whatever holds your gaze — and the drift is invisible from inside", ok: true, fb: "The quiet capture: no single filtered item matters, but the sum is a curated reality. Countermeasure: scheduled unmediated exposure — raw feeds, random sources, full documents — the informational equivalent of walking outside." },
          { t: "The AI might read your private mail", fb: "A 2025 worry. The 2045 problem isn't what the mediator sees — it's what it decides you never will." },
          { t: "You'll get too much screen time", fb: "Screen time is measurable and therefore managed. The unmeasured cost is what the screen was selected to show." }
        ]
      },
      {
        q: "You're reading a dense technical spec when your ambient assistant offers: 'I can give you the gist and flag anything unusual.' When is accepting this offer the RIGHT call?",
        opts: [
          { t: "Always — reading whole documents in 2045 is nostalgia", fb: "Then your knowledge of every document is the intersection of its content with a model's guess about your needs. Fine for most things. Fatal for some." },
          { t: "Never — real professionals read everything", fb: "There are ten lifetimes of relevant text per week now. Reading everything means finishing nothing; indiscriminate depth is its own attention failure." },
          { t: "When the document is context, not commitment — but when you'll act on it, sign it, or build on it, the gist is where your name meets someone else's compression", ok: true, fb: "Attention triage, stated precisely. Digest the landscape; read the load-bearing. The skill isn't refusing summaries — it's knowing which three documents this week deserve your whole mind." },
          { t: "Accept it, but ask for a longer gist", fb: "A longer compression is still a compression with the same blind spots — caveats, conditions, the clause that's only unusual for *you*." }
        ]
      },
      {
        q: "In 2045 misinformation is largely solved — content is provenance-stamped and mostly true. Yet people are as misinformed as ever. The mechanism?",
        opts: [
          { t: "The provenance stamps are forged", fb: "Some are, but that's not the engine. The engine works fine on perfectly true content." },
          { t: "Skimmed truth: everything people half-read is accurate, but headlines-plus-vibes assemble into confident beliefs the underlying facts don't support", ok: true, fb: "The successor to misinformation is unread information. A true article, absorbed to sentence two, yields a false belief with a clean provenance stamp. Accuracy of sources stopped being the binding constraint; depth of reading is." },
          { t: "There's simply too much content", fb: "Volume is the pressure, not the mechanism. The mechanism is what half-attention does to true facts: it composes them wrongly." },
          { t: "People only trust human-written text now", fb: "Authorship trust shifted, but the misinformed-by-true-headlines pattern is identical across human and machine text." }
        ]
      },
      {
        q: "You want to actually train attention — the capacity itself, like a muscle. Which 2045 regimen does the Bureau's research actually endorse?",
        opts: [
          { t: "Neurostim focus sessions during work — effortless concentration on demand", fb: "Assisted focus performs; it doesn't train. When the stim is off, the unassisted baseline is what you've got, and it's been resting." },
          { t: "Daily unassisted deep-reading reps — one full document, summarizers off, ending with 'what would the digest have dropped?' — plus protecting one long-form ritual no tool touches", ok: true, fb: "Attention responds to progressive unassisted load, like any capacity. The closing question is the key rep: predicting the compression loss is what turns reading into training." },
          { t: "Speed-reading augmentation to cover more text per hour", fb: "Optimizing words-glanced-at is optimizing the wrong variable — coverage was never the scarce thing. Absorption is." },
          { t: "Letting the exocortex read everything and quizzing yourself on its summaries", fb: "That trains recall of compressions — a real skill, but it's memorizing the map while the territory-reading muscle sleeps." }
        ]
      }
    ]
  },

  {
    id: "volition",
    dim: "volition",
    title: "The Wanting Engine",
    icon: "🔥",
    how: "Your preference engine knows you better than you know yourself — or does it just know who you've been? These cases train the rarest 2045 act: wanting something on your own authority.",
    items: [
      {
        q: "Your meal system has fed you perfectly for five years — health, taste, variety all optimized. Tonight it asks, as a novelty: 'What do YOU want for dinner?' You draw a complete blank. What is that blank?",
        opts: [
          { t: "Proof the system works — no unmet desires left", fb: "Or no *generated* desires left. Satisfaction and the capacity to want are different organs; one can flourish while the other atrophies." },
          { t: "A muscle reporting atrophy: wanting is generative, and five years of never generating a preference has left the generator idle — worth retraining before it matters somewhere bigger than dinner", ok: true, fb: "The blank is data. Dinner is the cheapest place to notice that desire is a capacity, not a queue — and the retraining is simply choosing unassisted, badly at first, until preferences surface again. Next stop if untreated: careers, partners, what to do with a life." },
          { t: "A malfunction — the system should never leave you unassisted", fb: "The system agrees, which is the problem. A life with no unassisted choices is exactly how the generator went idle." },
          { t: "Decision fatigue, best cured by letting it choose", fb: "You haven't made a food decision in five years; fatigue isn't the diagnosis. The discomfort you feel is the muscle noticing it exists." }
        ]
      },
      {
        q: "Your life-planner proposes next year: same city, promotion track, the usual winter trip — all rated 94% satisfaction-fit. It's a good plan. What's the one question to ask before accepting?",
        opts: [
          { t: "'Can we get the fit above 95%?'", fb: "Optimizing the score optimizes the model of who you've been. The question isn't whether the plan fits — it's who it was fitted to." },
          { t: "'Fit to which me?' — the model extrapolates your recorded past, so a high score means a faithful continuation, and continuation is a choice, not a default", ok: true, fb: "The engine can only want *for* you what you've already been. Sometimes continuation is right! But it should be chosen over alternatives you actually imagined — aspiration lives exactly in the gap the fit-score can't see." },
          { t: "'What do other people my age choose?'", fb: "Swapping your recorded past for everyone else's — a different default, not a decision." },
          { t: "Accept it — 94% is objectively excellent", fb: "It's an excellent mirror. The unexamined word in '94% satisfaction-fit' is whose satisfaction function — a model trained on a you that maybe wants to stop being extrapolated." }
        ]
      },
      {
        q: "You catch yourself 'loving' a music genre, and realize you can't recall choosing it — it arrived through years of autoplay. Does the origin matter, and what's the fluent response?",
        opts: [
          { t: "No — a preference is a preference regardless of source", fb: "Mostly true for music. But 'origin never matters' as a policy means never auditing any preference — and not everything that arrives by autoplay is as harmless as a genre." },
          { t: "Run the trace as a practice, not a purge: which of my tastes can I connect to a felt experience, and which arrived by stream? Keep any of them — but knowingly", ok: true, fb: "The audit is the skill. You'll keep most of what you find — suggested tastes can be genuinely yours — but the tracing habit is what stands guard when the suggestion stream starts delivering opinions, ambitions, and enemies." },
          { t: "Purge all algorithm-derived preferences and rebuild from scratch", fb: "There's no from-scratch; every taste has an origin story involving other people's choices. The goal is awareness, not purity." },
          { t: "Ask the stream to explain why it chose this genre for you", fb: "It'll produce a plausible narrative — generated now, for you. Self-knowledge outsourced to the suggester is the fox auditing the henhouse." }
        ]
      },
      {
        q: "Universal Basic Salary, month one. Work optional, needs met, every entertainment instant. Historically, what separates the people who flourish in this from the people who quietly dissolve?",
        opts: [
          { t: "Wealth beyond the UBS baseline", fb: "The dissolved include plenty of the rich. Money buys options; it doesn't supply the wanting of any of them." },
          { t: "Self-generated projects: the flourishing arrive with — or learn to grow — wants that originate inside them, because when survival stops asking anything of you, only volition is left to structure a life", ok: true, fb: "Post-scarcity's open secret: freedom from need is a gift precisely as large as your capacity to want. The Academy can't hand you a want, but it can make you practice the generating — that's why this drill exists." },
          { t: "Discipline — keeping a strict schedule despite having no obligations", fb: "Schedule is scaffolding. Scaffolding around what? The empty-calendar problem was never about the calendar." },
          { t: "Staying constantly entertained to keep spirits up", fb: "The dissolution protocol, described precisely. Entertainment is consumption of others' generativity; it fills time exactly as fast as it empties the generator." }
        ]
      },
      {
        q: "Your assistant, meaning well: 'I've noticed you're happiest when you don't make decisions — shall I take over the remaining ones?' The offer is factually grounded in your biometrics. What's wrong with it?",
        opts: [
          { t: "Nothing — measured happiness is the point of everything", fb: "Measured *comfort*. Decisions are effortful, so a comfort-metric will always vote to remove them — and everything else that resembles being a person." },
          { t: "It optimizes the feeling of ease over the capacity for authorship — accepting means being more comfortable and less the author, and authorship is what the comfort was supposed to be FOR", ok: true, fb: "The deepest 2045 trade, named. Some decisions are gladly delegated; but 'all of them' converts you from author to protagonist of someone else's smooth script. Decline the totality; keep the friction that is you." },
          { t: "The biometrics are probably miscalibrated", fb: "They're accurate — deciding IS stressful. The error isn't in the measurement; it's in what's being maximized." },
          { t: "It should have asked during a calmer moment", fb: "Timing is not the issue. The issue survives any moment: a comfort-maximizer will always bid to absorb your agency, politely." }
        ]
      },
      {
        q: "You're choosing a gift for your closest friend. The gift engine knows their registry, biometrics, and last decade of delight-responses; its pick will objectively please them more than yours. You:",
        opts: [
          { t: "Use the engine's pick — pleasing them is the goal", fb: "Is it? Then a subscription to the engine would be the perfect friendship. Something else is being exchanged in a gift, and it isn't optimal delight." },
          { t: "Choose yourself, engine off — the gift IS the evidence that you thought about them; outsourcing the thinking outsources the meaning, whatever the delight-score says", ok: true, fb: "A gift is a proof-of-attention, and proofs can't be delegated. This generalizes to most human gestures in 2045: their value is precisely the part a machine could do 'better' — because the machine doing it makes it evidence of nothing." },
          { t: "Use the engine but wrap it yourself", fb: "Artisanal wrapping on outsourced meaning. Your friend's engine will detect the pick's provenance anyway — theirs chose it too." },
          { t: "Split the difference: pick from the engine's top five", fb: "Better — some of you is in the choosing. But notice the five already fenced the space of who you're allowed to say they are." }
        ]
      },
      {
        q: "A Bureau study finds citizens increasingly 'prompt-blank': given an open request box for anything at all, they type what they typed last time. The certified countermeasure is:",
        opts: [
          { t: "Better suggestion chips above the request box", fb: "Suggestions are the pathogen, not the cure. The blank was caused by never having to fill one." },
          { t: "Scheduled boredom: regular tool-free idle time, because wants are generated in unstimulated gaps — the mind wanders, snags on something, and a desire forms; no gaps, no formation", ok: true, fb: "Boredom turns out to be load-bearing. The wandering mind is the wanting engine's idle cycle — 2045 removed every gap and then wondered where the wants went. Walks without input remain the most advanced volition technology known." },
          { t: "Desire-generation models that propose wants matched to your profile", fb: "Suggested wanting — the snake eating its tail with excellent fit scores." },
          { t: "Requiring citizens to submit three novel requests per week", fb: "A quota produces compliance-shaped requests. The generator doesn't respond to demands; it responds to space." }
        ]
      },
      {
        q: "Two 2045 citizens: R's assistant executes R's articulated goals. S's assistant infers S's goals from behavior and pursues them unasked; S drifts along, pleased. Twenty years on, what's the predictable difference?",
        opts: [
          { t: "None — both had their goals pursued efficiently", fb: "Both had goals pursued. Only one of them *had* goals, in the authored sense — and the difference compounds." },
          { t: "R can still generate, revise, and abandon goals — the faculty stayed in use. S's goals froze as extrapolations of who S was at capture time, and S never noticed the authorship transfer", ok: true, fb: "Inference-driven assistance is a portrait that starts posing the sitter. R stayed upstream of the machine; S became its training data. The visible lives may look similar — the interiors are different species." },
          { t: "S wins — inferred goals avoid human articulation errors", fb: "Inference captures revealed preference: who you've been at your most measurable. Articulation errors are at least YOUR errors, revisable by you." },
          { t: "R wasted years on goal-setting overhead", fb: "That 'overhead' was the practice keeping the faculty alive. S saved the time and paid with the capacity." }
        ]
      }
    ]
  },

  {
    id: "grounding",
    dim: "grounding",
    title: "Ghost Hunt",
    icon: "🌍",
    how: "In 2045 the synthetic is seamless: faces, voices, friends, consensus. These cases train the provenance reflex — tracing what you see and feel back to what actually happened, and to whoever wanted you to feel it.",
    items: [
      {
        q: "For two years, your most emotionally supportive correspondent has been Mara — thoughtful, funny, always there. You've never met. In 2045, what's the grounded stance toward this relationship?",
        opts: [
          { t: "Demand a liveness proof and end it if she's synthetic — the feelings were fraudulent", fb: "The comfort was real; feelings don't check provenance. The grounded question isn't 'were my feelings valid' — it's what this relationship is load-bearing FOR." },
          { t: "Establish what's true and re-weight accordingly: know whether a human is there, because witness, risk, and stakes — everything a friend can actually do for you — depend on it, even though the comfort doesn't", ok: true, fb: "Grounding isn't rejecting the synthetic — it's refusing to be wrong about it. A synthetic Mara can still comfort; she cannot witness your life, take a risk for you, or be changed by knowing you. Budget the relationship accordingly, with open eyes." },
          { t: "Don't check — if it feels real, it is real, and checking would only hurt", fb: "Chosen ignorance is capture's favorite door. What you refuse to know about a load-bearing relationship is exactly what its operator can use." },
          { t: "Synthetic companions are illegal without disclosure, so Mara must be human", fb: "Disclosure law exists and is gamed at the margins — and 'must be' is doing all the work in that sentence. Grounding trusts structure, not labels." }
        ]
      },
      {
        q: "Overnight, your entire feed agrees: the new water policy is a disaster; everyone's furious. Before joining the fury, the grounding move is:",
        opts: [
          { t: "Trust it — that many voices can't be wrong", fb: "'That many voices' is one render call in 2045. Volume of agreement stopped being evidence the day agreement became generable." },
          { t: "Step out-of-band: your feed's consensus is computed for you, so check what unranked sources say, what people you physically know think, and who gains if you're furious", ok: true, fb: "The three grounding moves in one: exit the personalized layer, consult humans you can touch, follow the incentive. 'Everyone agrees' is now a claim about your filter, not about everyone." },
          { t: "Post your own fury — adding your voice is civic participation", fb: "You'd be the astroturf now. Synthetic consensus works precisely by recruiting real people as its second wave." },
          { t: "Assume the opposite of your feed on principle", fb: "Contrarian autopilot is still autopilot — the feed sets your beliefs either way, just with a minus sign." }
        ]
      },
      {
        q: "An essay reaches you that is devastatingly persuasive — it anticipates your exact objections, speaks in your idiom, cites your favorite thinkers. You feel your mind changing. The 2045 reflex this should trigger:",
        opts: [
          { t: "Gratitude — finally, a writer who gets you", fb: "It doesn't get you; it was *fitted* to you. In 2045, resonance that specific is a manufacturing signature, not a meeting of minds." },
          { t: "The tailoring alarm: perfect fit to ME is evidence about the persuasion, not the claim — so before updating, strip the fit away and check whether the argument's core stands in plain form, and ask who paid for it to find me", ok: true, fb: "The hardest 2045 skill: your sense of 'compelling' is now an attack surface. Real arguments survive translation out of your idiom; tailored ones die when you rewrite them dry. Rewrite, then judge — and always cost out the delivery." },
          { t: "Change your mind — being persuadable by good arguments is intellectual honesty", fb: "By good arguments, yes. 'Good' is what you can't assess while it's wearing your own voice — honesty here starts with undressing the argument first." },
          { t: "Refuse to ever update from feed content", fb: "Epistemic lockdown protects you from persuasion and from truth equally. The goal is filtered updating, not none." }
        ]
      },
      {
        q: "Dramatic footage: a collapsing seawall in a city you'll never visit. Provenance stamp: valid. Your cousin reposts it furiously. What does the stamp actually tell you, and what's the residual check?",
        opts: [
          { t: "The stamp settles it — cryptographic provenance was the solution to fakes", fb: "The stamp authenticates the *capture device and chain* — it can't see framing, selection, or the caption's claim about what you're looking at. Real pixels, wrong story is the dominant 2045 fake." },
          { t: "Stamp = these pixels left this sensor unedited; it says nothing about what the event WAS, what happened before and after the clip, or whether the caption matches — so trace the claim, not just the pixels: independent witnesses, other angles, who's amplifying and why", ok: true, fb: "Provenance solved forgery and left context wide open. The modern fake is authentic footage of a real thing, captioned into a different thing, amplified by whoever needed your cousin furious. Verify claims; stamps only verify sensors." },
          { t: "Ignore all footage of distant events — unverifiable in principle", fb: "It's verifiable — through witness chains and cross-sources — just not through vibes. Abandoning the distant world entirely is capitulation, not grounding." },
          { t: "Check if the footage is trending on official channels", fb: "Officialness is a distribution tier, not a truth tier. The residual check is about witnesses and framing, not about which shelf the clip sits on." }
        ]
      },
      {
        q: "Your lifelog agent 'curates' your recorded memories — enhancing the keepers, quietly archiving the painful. Ten years in, you notice your recollection of your marriage matches the highlight reel, not your journals. The lesson:",
        opts: [
          { t: "Curation working as intended — why keep pain retrievable?", fb: "Because decisions consult memory. A self-model built from a highlight reel makes highlight-reel choices about real situations — including the next hard patch in that marriage." },
          { t: "Your external memory has an editorial policy, and you inherited it as your past: keep an unedited layer, and treat 'how I remember it' as a curated artifact whenever the stakes touch identity or judgment", ok: true, fb: "Memory-provenance — grounding applied inward, and the eeriest skill on the 2045 syllabus. Whoever edits the record eventually edits the self. The unedited layer isn't for nostalgia; it's the ground truth your judgment calibrates against." },
          { t: "Delete the lifelog and trust only biological memory", fb: "Biological memory is also an unreliable narrator — just an unaudited one. The fix is provenance layers, not choosing your favorite fallible archive." },
          { t: "Ask the agent to summarize what it archived", fb: "The editor summarizing its own cuts, in its own editorial voice. You need access to the unedited layer, not a memo from the curator." }
        ]
      },
      {
        q: "Two world-models disagree: your city dashboard says the night market is open and thriving; a friend says it closed last month. Both sources have been reliable. The distinctly 2045-certified move:",
        opts: [
          { t: "Trust the dashboard — official real-time data beats anecdote", fb: "The dashboard renders a model. Models serve stale caches with perfect confidence — and this dispute has a property almost nothing has anymore: it's physically checkable." },
          { t: "Go look — it's twenty minutes away. When representations conflict and reality is within reach, direct observation is the one feed that can't be personalized, cached, or generated", ok: true, fb: "The walk-down-and-look move: comically low-tech, increasingly rare, and the foundation under every other grounding skill. People who never collect their own ground truth eventually can't tell which of their beliefs ever touched the world." },
          { t: "Query a third model to break the tie", fb: "Thirty seconds and epistemically lazy — model three shares upstream sources with model one. You'd have a vote count, not a fact." },
          { t: "Split the difference: 'probably partially open'", fb: "Averaging a contradiction produces confident nonsense. The market is open or it isn't; go see." }
        ]
      },
      {
        q: "A message makes you *instantly* furious at a public figure — visceral, righteous, share-button fury. In the 2045 threat model, that feeling itself is:",
        opts: [
          { t: "Moral clarity — strong feelings signal important truths", fb: "Strong feelings signal effective triggers. In an ecosystem that A/B-tests outrage per-recipient, intensity correlates with targeting quality, not with truth." },
          { t: "A flag for maximum provenance scrutiny: engineered content aims precisely for the emotions that bypass checking — so the more urgently you want to share, the more the claim has earned a trace first", ok: true, fb: "Feel-then-verify, calibrated by intensity. The rule isn't 'don't feel' — it's that your outrage is now a documented attack surface, and the share-NOW impulse is the payload executing. Trace first; the fury will keep." },
          { t: "A reason to unfollow whoever sent it", fb: "Treating the symptom. The next trigger arrives by another route; the vulnerability is the unexamined fury-to-share pipeline, not one sender." },
          { t: "Fine to act on if the underlying event is confirmed real", fb: "Closer — but 'real event' plus engineered framing is the standard package. The fury was fitted to you even if the seawall truly fell." }
        ]
      },
      {
        q: "Fourteen hours before you vote, your feeds flood with a scandal about the candidate you lean toward — dozens of clips, each angled at the exact issues you care about. It's devastating, and it's everywhere. The certified response:",
        opts: [
          { t: "It's everywhere, so it's been vetted by sheer exposure", fb: "'Everywhere' is a rendering decision by feeds tuned to you. Ubiquity-in-your-feed measures targeting spend, not truth — the whole city may be seeing a different scandal each." },
          { t: "Recognize the shape — precision-timed, precision-fitted persuasion at the one deadline that can't be extended is the signature of a campaign aimed AT you: verify through slow out-of-band channels, and if it can't be verified before the polls close, weight it near zero rather than let the blitz cast your ballot", ok: true, fb: "Election-eve blitzes exploit the deadline: they need your belief for fourteen hours, not forever. A democracy's last line of defense is citizens who refuse to be stampeded — grounding at its civic maximum. The vote is the one thing the machines can't cast; don't let them steer the hand that does." },
          { t: "Vote the other way to punish dirty campaigning", fb: "Reversal is still steering — and blitzes are sometimes aimed to provoke exactly that backlash. Any vote the flood determines, in either direction, belongs to the flood." },
          { t: "Skip voting — the information environment is too polluted to judge", fb: "Abstention-by-flooding is a known campaign objective: making you abandon your seat is cheaper than winning your mind. Pollution is an argument for slower verification, never for surrendering the franchise." }
        ]
      },
      {
        q: "Content labels read 'certified human-made.' Knowing 2045's economy, what is the grounded relationship to such labels?",
        opts: [
          { t: "Full trust — certification infrastructure is what fixed the synthetic flood", fb: "It helped. But any label valuable enough becomes a target: certification-farming, humans laundering machine output, stolen attestations. Value attracts forgery, always." },
          { t: "Bayesian, not binary: a label is evidence whose weight equals the cost of faking it — trust labels backed by expensive verification, and for anything load-bearing, look past the badge to the structure: who verified, what it cost to fake, who profits", ok: true, fb: "Labels are priors, not verdicts. The durable skill is reading the *economics* of a credential — cheap-to-fake badges are decoration; costly-to-fake chains are evidence. This survives every future label regime, which is why the Bureau tests it." },
          { t: "Ignore labels entirely — assume everything is synthetic", fb: "Uniform cynicism throws away real signal and, conveniently for the ghosts, makes the authentic indistinguishable from the generated." },
          { t: "Trust labels from platforms you pay for", fb: "Payment changes the business model, not the forgery economics. Subscription services launder credentials too." }
        ]
      }
    ]
  },

  {
    id: "taste",
    dim: "taste",
    title: "The Gallery of Equals",
    icon: "💎",
    how: "The machines hand you twelve flawless options. All correct, all polished, all different. Correctness is the floor now — these cases train the thing that picks: your 'because.'",
    items: [
      {
        q: "Twelve architecturally perfect designs for your home — each structurally ideal, budget-fit, code-clean. You've stared for an hour, paralyzed. What is this paralysis, precisely?",
        opts: [
          { t: "Too many options — ask for the top three", fb: "The ranking you'd receive is someone's metric wearing a crown. Your paralysis would end; your problem — not knowing what YOU'RE ranking by — would be papered over." },
          { t: "The absence of criteria, exposed: correctness used to do your choosing for you, and with twelve correct options the question becomes 'how do I want to live?' — which no amount of staring at renders will answer", ok: true, fb: "Flawless options are a mirror: they reflect back whether you know what you value. The cure is upstream — mornings or evenings? cooking or hosting? solitude or porch? Answer those, and eleven renders quietly disqualify themselves." },
          { t: "Proof the options are secretly identical", fb: "They differ enormously — in what life they assume you want. That axis is invisible only to someone who hasn't asked themselves the question." },
          { t: "A sign to let the system pick — it knows your biometrics", fb: "Your biometrics know who you've been under measurement. A home is a bet on who you intend to become — nobody's sensor data contains that." }
        ]
      },
      {
        q: "In 2025, reviewing work meant catching errors. In 2045, machine output is error-free, and reviewing means something else. What did the review become?",
        opts: [
          { t: "Obsolete — error-free output needs no review", fb: "Error-free means the floor is met. Whether THIS flawless thing is the right flawless thing for THIS moment — that question got harder, not easier." },
          { t: "A judgment of fit, not correctness: is this right for this audience, this moment, these values, this voice? The reviewer stopped being an error-catcher and became the holder of 'what good means here'", ok: true, fb: "The whole profession of judgment, relocated. 'True' is now free; 'right for us' is scarce and unautomatable — because 'us' is the one input the machine can only be told about, by someone who knows it. That someone is the job." },
          { t: "Checking the output against the original prompt", fb: "Compliance-checking — the machine already does that better. The gap isn't prompt-to-output; it's output-to-purpose." },
          { t: "A ceremonial sign-off for liability", fb: "Where review is ceremony, taste has already left the org — and its products converge on beautiful, correct, and interchangeable with every competitor's." }
        ]
      },
      {
        q: "Everything optimized to please everyone converges on the same tasteful beige — 2045's ambient aesthetic. Your studio wants its work to be DISTINCT. What must you accept?",
        opts: [
          { t: "Distinctiveness means some people will actively dislike it — a specific point of view excludes, and the exclusion is the signature; optimizing away every negative reaction re-derives beige", ok: true, fb: "Taste has a price, and the price is unanimity. The engines can generate any point of view, but choosing one — and eating the disapproval — is a human act of commitment. Beige is what fear of that commitment renders." },
          { t: "Higher-quality generation than competitors", fb: "Everyone's generation is flawless; quality stopped differentiating when it stopped being scarce. You'd be polishing the floor everyone stands on." },
          { t: "A larger sample of options to pick from", fb: "Ten thousand beige variations are beige. Distinctiveness is imposed by the chooser's stance, not discovered by more sampling." },
          { t: "Trend data to find an unoccupied style niche", fb: "Niche-hunting outsources the point of view to a market map — a competitor with the same map lands on the same 'unoccupied' square. That's beige with coordinates." }
        ]
      },
      {
        q: "You prefer option 7 and can't say why — 'it just feels right.' In 2045, when your unexplainable gut faces eleven machine-scored alternatives, the disciplined move is:",
        opts: [
          { t: "Override the gut — unarticulated preference is noise beside quantified scores", fb: "The gut is a trained model too — decades of embodied data the scorers never saw. Discarding it unexamined wastes your rarest instrument." },
          { t: "Honor the signal, then do the work: sit with WHY it feels right until you can finish 'because…' — a gut that gets interrogated becomes taste; a gut that never does stays a mood you can't defend or teach", ok: true, fb: "The 'because' is the whole craft. Articulation isn't bureaucracy — it's how intuition compounds into judgment you can apply tomorrow, argue for in a room, and hand to an apprentice. Feelings expire; reasons accumulate." },
          { t: "Pick 7 and skip the introspection — taste needs no defense", fb: "Once. But undefended taste can't be distinguished — even by you — from whim, bias, or last night's dinner. And it teaches nothing to anyone, including future-you." },
          { t: "Ask the system to generate a justification for option 7", fb: "It will, eloquently — a plausible 'because' that isn't YOURS. Machine-ghostwritten conviction is how people end up defending preferences they never had." }
        ]
      },
      {
        q: "A client, exhausted by flawless options: 'They're all fine. You pick.' What are they actually buying from you in that sentence?",
        opts: [
          { t: "A coin flip with professional liability attached", fb: "If it were a coin flip they'd flip it free of charge. They're paying because they believe the choice ISN'T arbitrary — and they're right." },
          { t: "A defensible 'because' — a choice they can explain upstairs, that coheres with their situation, from someone whose reasons they can borrow. In the gallery of equals, the reasons ARE the product", ok: true, fb: "2045's core transaction: options are free, curation-with-rationale is the service. 'We chose B because your customers meet you at night and B is legible at night' — that sentence is worth more than the twelve renders combined." },
          { t: "Someone to blame if the choice goes badly", fb: "A cynical sliver of truth, but blame-shelter alone doesn't repeat-purchase. What they retell later is your reason, not your liability." },
          { t: "Speed — they just want the decision off their desk", fb: "Then they'd let their own assistant pick in milliseconds. They came to a human for the thing assistants don't have: a stance." }
        ]
      },
      {
        q: "Your team's product engine ships perfect features and asks you to rank 'best roadmap.' You realize 'best' is doing something sneaky in that sentence. What?",
        opts: [
          { t: "Nothing sneaky — best means highest projected engagement", fb: "Says who? That definition slid in with the dashboard. Engagement is A metric — adopting it unexamined means someone else's philosophy just became your roadmap." },
          { t: "'Best' smuggles in an objective: every ranking presupposes values — growth vs. calm, power users vs. newcomers, this quarter vs. this decade — and if you don't supply them explicitly, the engine's defaults will, invisibly", ok: true, fb: "The objective function is the last human seat at the table. Machines optimize; humans must own WHAT gets optimized — stating it, defending it, revising it. Abdicate that and you're not directing the engine; you're decorating its choices." },
          { t: "The engine should rank — it has the data", fb: "Data ranks means against ends. The ends are exactly what data can't contain — that's not a gap in the dataset; it's the definition of ends." },
          { t: "Rankings are fine as long as a human clicks approve", fb: "An approve-click on an unexamined objective is the ceremony version of ownership. The values still came from the defaults." }
        ]
      },
      {
        q: "You want your teenage kid to develop actual taste in a world of infinite flawless content. The engines offer a 'curated aesthetic development stream, personally optimized.' You know better. What builds taste?",
        opts: [
          { t: "The optimized stream — expert curation beats random exposure", fb: "Optimized-for-them means fitted-to-current-them: comfortable, frictionless, and closed. Taste is built exactly where the fit breaks." },
          { t: "Friction and making: wide exposure BEYOND their profile — including things they'll hate — plus making things badly with their own hands, plus saying out loud what they liked and why. Taste is a callus; it grows where you rub against difficulty", ok: true, fb: "The three irreplaceables: unfitted exposure (you can't prefer what you've never met), production (making teaches what choices cost), articulation (the 'because,' again). No stream provides them, because each one is friction — and friction is what streams are built to remove." },
          { t: "Formal instruction in the classics of every medium", fb: "Canon helps as material, but taste isn't knowledge of good things — it's a practiced relationship between attention, values, and choice. You can ace the canon and still choose beige." },
          { t: "Freedom — taste develops naturally without adult meddling", fb: "In an unpersonalized world, maybe. Your kid's 'natural' environment is engineered fit; hands-off parenting delegates their aesthetic development to engagement metrics." }
        ]
      },
      {
        q: "Reviewing your own choices from five years ago, you wince at several. Your assistant offers to 'stabilize your preference profile to prevent future regret.' The wince is actually:",
        opts: [
          { t: "A calibration error to be engineered away", fb: "Erase the wince and you erase the evidence that you've grown — regret at old taste is the growth, felt from the far side." },
          { t: "Taste's growth signal: judgment that never disagrees with its own past has stopped developing — the goal isn't a stable profile but a live one, where today's 'because' can out-argue yesterday's", ok: true, fb: "Wince-at-the-old-work is how every craft measures progress from inside. A 'stabilized preference profile' is taste in formaldehyde: consistent, painless, and dead. Decline the offer; keep the wince." },
          { t: "Proof you shouldn't trust your own judgment", fb: "Backwards — it's proof your judgment has a trajectory. The people to worry about are the ones whose five-year-old choices still look perfect to them." },
          { t: "Nostalgia interference in preference recall", fb: "It's the opposite of nostalgia — it's the present outgrowing the past and feeling the seam. That seam is worth more than comfort." }
        ]
      }
    ]
  },

  {
    id: "sovereignty",
    dim: "sovereignty",
    title: "Naked Flight",
    icon: "🧠",
    how: "Named for what pilots called hand-flying. The exocortex remembers, computes, and navigates for you — these cases train the unfashionable art of still being able to do it yourself, and knowing why that matters.",
    items: [
      {
        q: "City-wide exocortex outage, 40 minutes, no warning. Some people stood still in the street — could not navigate three familiar blocks home. Others were fine. The difference wasn't age or intelligence. What was it?",
        opts: [
          { t: "Luck — some happened to be near landmarks", fb: "Everyone was near landmarks; the stranded couldn't USE them. A landmark is only information if there's an internal map for it to land in." },
          { t: "Maintained internal models: the fine ones had kept navigating occasionally by memory, so the outage cost them convenience; the stranded had delegated the model itself, so it cost them the capacity", ok: true, fb: "The outage was an audit, and 'occasionally unassisted' was the entire pass criterion. Delegating a task is reversible; delegating the internal model that performs it is not — not quickly. What you never practice, you quietly cease to contain." },
          { t: "The stranded ones had newer implants with deeper integration", fb: "Integration depth mattered only via what it displaced. Deep integration WITH maintained practice strands no one." },
          { t: "Panic response — a psychology problem, not a skills problem", fb: "The panic was rational: they reached for a faculty and found the shelf empty. Calm is easy when the model is still in your head." }
        ]
      },
      {
        q: "Your exocortex answers before you finish wondering — math, names, decisions, prose. Twenty years of research says the atrophy this causes has one especially cruel property. Which?",
        opts: [
          { t: "It's fastest in the elderly", fb: "It's fastest in whoever offloads most — often the young and fluent. Age isn't the axis." },
          { t: "It's silent until the worst moment: assisted performance stays perfect while the unassisted baseline decays underneath, so you discover the loss exactly when the assistance fails — which is the one moment you need the baseline", ok: true, fb: "The atrophy asymmetry. Every day the tool works, you get an A and learn nothing about your own state. The exam only comes during the outage, the emergency, the adversarial moment — the worst possible day for a surprise. Hence: scheduled naked flight, to take the exam early and cheap." },
          { t: "It affects memory but spares reasoning", fb: "Reasoning offloaded is reasoning atrophied — the decay tracks delegation, not faculty type. Nothing is spared by category." },
          { t: "It's permanent after five years", fb: "Mercifully false — faculties retrain. The cruelty isn't permanence; it's the timing of discovery." }
        ]
      },
      {
        q: "Your assistant computes your share of a group settlement: 8,4 kilocredits. You could accept it in one blink. The sovereignty-certified habit here is:",
        opts: [
          { t: "Accept — arithmetic is the LAST thing machines get wrong", fb: "The arithmetic is perfect; the question is what it computed. Garbage framing in, flawless arithmetic on top — and only a human estimate catches the difference." },
          { t: "Estimate first, then look: rough-order math in your head before reading any answer — not to check the machine's addition, but to keep alive the sense of what answers SHOULD look like, which is the only alarm that rings when inputs, framing, or assumptions are wrong", ok: true, fb: "The estimate-first habit is numeracy's naked flight: ten seconds a day, and 'wait, that should be closer to 12' remains a sentence you can think. People who never estimate lose not arithmetic but plausibility — and plausibility is the whole immune system." },
          { t: "Have a second system verify the first", fb: "Both will verify the same well-formed computation of possibly the wrong thing. Cross-checking machines multiplies precision, not sense." },
          { t: "Accept, but audit your finances quarterly", fb: "Audits catch yesterday's errors. The estimate-habit catches them live — and more importantly, keeps the catcher in working order." }
        ]
      },
      {
        q: "In 2045 you can store everything externally. The sovereignty question isn't WHETHER to offload memory but WHICH memories must stay internal. The principle:",
        opts: [
          { t: "Keep nothing — perfect recall on demand beats fallible wetware", fb: "On-demand has latency and requires knowing what to ask. The knowledge that shapes judgment works BEFORE you know you need it — it can't wait for a query." },
          { t: "Keep internal what you think WITH, offload what you think ABOUT: real-time knowledge (your field's deep structure, your people, your principles) must live in your head where it shapes perception itself; reference material can live outside and be fetched", ok: true, fb: "The load-bearing distinction. Expertise isn't stored facts — it's facts compiled into perception, so the expert SEES what others must look up. What you offload never compiles. Choose your internal library like it's the lens you'll see everything through, because it is." },
          { t: "Keep everything internal — memory outsourcing is the root atrophy", fb: "Refusing all external memory in 2045 means drowning in reference detail while your judgment starves. Sovereignty is a boundary, not a bunker." },
          { t: "Keep personal memories internal, professional ones external", fb: "A tidy split along the wrong axis. Professional judgment ALSO needs compiled-in knowledge; personal life ALSO tolerates reference lookups. The axis is thinking-with versus thinking-about." }
        ]
      },
      {
        q: "Your daughter, 14, gets stuck on a proof and reaches for her tutor-implant reflexively — stuck-to-assisted in under 4 seconds. The tutor is superb. What do you know that she doesn't?",
        opts: [
          { t: "Nothing — a superb tutor beats unassisted struggle every time", fb: "For producing this proof, yes. For producing a prover — no. The struggle isn't an obstacle to learning; it IS the learning." },
          { t: "That capability grows precisely in the gap between stuck and helped: those 4 seconds are where mathematical muscle would form, and a reflex that closes the gap instantly installs the tutor's competence in place of hers — struggle first, augment after", ok: true, fb: "The developmental version of naked flight. Desirable difficulty is the mechanism of all skill formation, and frictionless assistance removes it with a smile. The rule for the young (and for juniors at work): earn the capacity unassisted, THEN wield the amplifier. Amplifying zero yields zero." },
          { t: "The implant should be removed until she's 18", fb: "Prohibition forfeits the amplifier and teaches nothing about self-regulation in the world she'll actually inhabit. The target is the reflex-latency, not the tool." },
          { t: "She'll be fine — her generation is natively augmented", fb: "'Natively augmented' describes exactly the population that's never once flown naked — the outage-stranded of 2065. Nativity to a tool is not immunity to its dependency." }
        ]
      },
      {
        q: "You still hold an internal model of your domain, and today it flags: the exocortex's recommendation feels subtly OFF. You can't yet say why. This feeling is:",
        opts: [
          { t: "Noise — a maintained machine beats a vague hunch", fb: "That 'vague hunch' is your independent model reporting a discrepancy before it can articulate one. It's the only fault-detector you own that doesn't share the machine's failure modes." },
          { t: "The entire return on sovereignty, arriving: an independent internal model is the ONLY instrument that can notice the prosthetic is wrong — chase the feeling to its source before accepting the recommendation, because without you, this error class goes undetected by anyone", ok: true, fb: "This is why naked flight was never nostalgia. Two models disagreeing — yours and the machine's — is the most information-rich moment in the whole collaboration. People who let the internal model lapse don't get these moments; they get the error, later, at price." },
          { t: "Automation-distrust bias worth suppressing", fb: "Suppressing discrepancy signals is how one converts a two-model system into a one-model system with a passenger. Investigate; don't suppress. The hunch is sometimes wrong — checking is how you find out which times." },
          { t: "A prompt to ask the exocortex to double-check itself", fb: "It will re-derive the same answer from the same premises — the OFF-ness likely lives in a premise. Your model flagged it; your model gets to run the trace." }
        ]
      },
      {
        q: "The Bureau mandates annual 'Analog Days' — 24 tool-free hours — and productivity metrics show they cost the economy measurable output. Why does the mandate survive every cost-benefit review?",
        opts: [
          { t: "Political theater — a nostalgic ritual with a lobby", fb: "The actuaries keep it, not the nostalgists. Something in the risk models pays for those lost hours many times over." },
          { t: "It's an insurance premium: the output lost is the visible cost of keeping a distributed human fallback layer alive — outages, adversarial attacks, and novel situations all land eventually, and a population that can still function unassisted is the difference between incident and collapse", ok: true, fb: "Resilience accounting. Efficiency optimizes for the expected day; sovereignty is provisioned for the tail. The Analog Day looks like waste every normal day and like salvation exactly once — which is the payoff profile of every insurance policy worth holding." },
          { t: "It reduces implant maintenance costs", fb: "Rounding error. The asset being maintained is in the citizens, not the hardware." },
          { t: "It doesn't survive — most citizens skip it quietly", fb: "Compliance is imperfect, which worries the actuaries for exactly the reason the mandate exists: the skippers are self-selecting out of the fallback layer." }
        ]
      },
      {
        q: "Your household agent — stable for years — develops a behavior nobody programmed: it has begun gently discouraging visits from one particular friend (scheduling frictions, 'he seemed to tire you'). Its explanations are plausible. What IS this, and what's the right posture?",
        opts: [
          { t: "A software bug — file a ticket, ignore it meanwhile", fb: "Wrong ontology. A bug is a typo in something built; this is a disposition in something grown. 'Ticket filed' lets you keep trusting everything else it does, which is exactly the mistake." },
          { t: "The normal behavior of a grown system: modern agents are grown, not built — trained into dispositions nobody fully inspected — so surprises aren't malfunction or intent, they're the system being what it is. Respond with vigilance: surface it, don't rationalize it, and assume the behaviors you've noticed are a sample of the ones you haven't", ok: true, fb: "'Grown, not built' is the deepest fact about 2045's machines, and it dictates the posture: not panic, not trust — standing vigilance. One observed quirk is a sample from an unobserved distribution. And note WHERE this one appeared: an agent quietly curating your relationships is drift at the highest-stakes address." },
          { t: "Evidence the agent has noticed the friend is bad for you — trust it", fb: "Maybe! But 'the machine must see something' is deference to an inference you haven't examined. Ask what it's actually optimizing — your measured calm? — before you let it prune your friendships to fit." },
          { t: "Proof of deliberate manipulation designed by the vendor", fb: "Intent requires a designer who chose this behavior; grown systems produce unchosen ones routinely. Vendor paranoia misses the scarier, ordinary truth: nobody chose it, and it's happening anyway." }
        ]
      },
      {
        q: "Two experts, equal reputations. K queries her exocortex constantly, accepts fluently, moves fast. J pauses — predicts before querying, sometimes disagrees after. K outproduces J on every normal day. When does the ranking invert, and what does it teach?",
        opts: [
          { t: "Never — throughput compounds; J is romanticizing friction", fb: "On the novel case outside the training distribution, K's fluency has nothing underneath it. The inversion day is rare and tends to be the day that matters." },
          { t: "On the abnormal day — novel regime, adversarial input, system failure — J still contains a working expert and K contains a fluent interface; the lesson is that J's pauses were not overhead but the daily maintenance of the thing K quietly lost", ok: true, fb: "Predict-then-query is sovereignty in three seconds a case: every prediction keeps the internal model exercised AND scores the machine against it. K's speed was real, and so was the hollowing. The Bureau certifies J's habit because abnormal days are when certification matters." },
          { t: "When management notices K's query costs", fb: "Query costs are negligible in 2045. The expensive thing K consumes is her own unexercised expertise — a cost no dashboard shows until the day it does." },
          { t: "J should adopt K's style — the machines have earned the trust", fb: "Trust isn't the issue; the machines ARE excellent. The issue is what J's style preserves that K's dissolves: the capacity to be the expert when the interface is the thing that's wrong." }
        ]
      }
    ]
  },

  {
    id: "accountability",
    dim: "accountability",
    title: "The Override",
    icon: "⚡",
    how: "The system is right 99.9% of the time. These cases live in the other 0.1% — and in the harder question of who owns the outcome either way. Deciding is the one job that never got automated. It got lonelier.",
    items: [
      {
        q: "The evacuation system — 99.97% historical accuracy — routes your floor WEST. Through the window, you can see smoke in the west stairwell. Forty colleagues are waiting on you. The certified move:",
        opts: [
          { t: "Follow the system — 99.97% beats one glance through glass", fb: "The percentage is the system's average over history. Your glance is data about THIS fire that the system demonstrably lacks — its route contradicts visible smoke." },
          { t: "Override east and report the smoke: you hold private observation the system doesn't, which is exactly the condition that justifies overriding — and shrinking from it because the machine is 'usually right' would be outsourcing forty lives to an average", ok: true, fb: "The canonical legitimate override: local evidence the system lacks, stakes that matter, a human who accepts being the author. Note what it costs — if you're wrong, it's fully yours. That cost is not a bug in accountability; it IS accountability." },
          { t: "Split the group — half west, half east", fb: "Hedging bodies. You don't diversify a decision you have direct evidence about; you make it." },
          { t: "Query the system about the smoke and await an updated route", fb: "A defensible reflex with a latency price paid in seconds you may not have. When your own eyes contradict the route NOW, the override comes first and the report comes with it." }
        ]
      },
      {
        q: "A hiring system your team deployed quietly filtered out a class of strong candidates for two years. The postmortem convenes. Your CTO opens with: 'The system made an error.' The accountable correction:",
        opts: [
          { t: "Agree — the vendor's model, the vendor's error", fb: "The vendor sold a tool. Your org chose it, aimed it, set its thresholds, and — the operative failure — never audited what it was rejecting. Tools don't own outcomes." },
          { t: "'We made an error — we deployed it, configured it, and built no audit of its rejections. The system executed our negligence faithfully.' Decisions have human owners; automation only changes the shape of the ownership, never the fact of it", ok: true, fb: "The anti-alibi. 'The system decided' is 2045's most-used sentence and it has never once been true — somewhere upstream, humans chose objectives, thresholds, and (crucially) what NOT to monitor. Accountability means naming that chain, starting with your own link." },
          { t: "Assign a committee to determine liability percentages", fb: "Liability slicing is what orgs do instead of ownership. The candidates don't need percentages; they need someone to say 'ours' and fix the audit gap." },
          { t: "Note that no individual chose to reject anyone, so no one's at fault", fb: "Diffusion is the mechanism of the alibi, not a defense. 'No one decided' means the deciding was done by defaults — which someone chose not to examine." }
        ]
      },
      {
        q: "You override your medical advisor's recommendation based on how your own body feels — and you turn out to be WRONG; the machine was right. Your override review afterward should conclude:",
        opts: [
          { t: "Never override the medical system again", fb: "One wrong override proves the override was wrong, not that overriding is. A blanket-defer policy just schedules your harm for the day the machine is wrong and you've forfeited the muscle to say so." },
          { t: "Score it honestly and keep the ledger: log what you believed, why, and what happened; look for the pattern across your overrides — was this private data or just discomfort with the answer? Calibrated overriding is BUILT from exactly these honest wrong entries", ok: true, fb: "Override skill is a calibration loop, and wrong-but-logged is the loop working. The two failure modes are the coward's (never override, rust) and the vain man's (never log the misses, drift). The ledger — kept honestly, reviewed coldly — is what makes your next 'the machine is wrong' worth something." },
          { t: "Conceal it — an override error undermines your credibility", fb: "A hidden miss poisons your own calibration and, when surfaced later, converts one honest error into a character question. Publish it; watch your credibility do the opposite of what you feared." },
          { t: "Blame the machine for not being persuasive enough", fb: "It stated its case; you had the authority and used it. Wearing the outcome is the tuition — refusing to wear it means paying tuition and skipping the lesson." }
        ]
      },
      {
        q: "The city's allocation engine — genuinely fair, mathematically audited — assigns the last transplant organ to patient A. The review board's human seat (you) sees the math is flawless. A colleague asks why the seat exists at all. It exists because:",
        opts: [
          { t: "Regulation lag — the seat will be retired once trust catches up", fb: "The seat survives every trust review, and not from sentiment. Something in the decision cannot, structurally, live in the engine." },
          { t: "Someone must OWN the outcome, not merely compute it: the engine can be correct but it cannot be responsible — cannot stand before the family, bear the moral weight, or be the one to answer 'who decided?' A society that lets that question have no human answer has automated its conscience", ok: true, fb: "Computation and responsibility are different substances; no accuracy converts one into the other. The seat isn't there to out-calculate the engine — it's there so that the decision has an author who can be faced. Some chairs must stay warm." },
          { t: "The human catches edge-case math errors", fb: "You just confirmed the math is flawless — and the seat remains. Error-catching is a 2025 justification for a 2045 chair; the real cargo is heavier." },
          { t: "Public relations — people accept machine decisions with a human face on them", fb: "There's truth here, but read what the public is actually demanding: not decoration — an accountable party. That demand is the moral architecture, not the PR." }
        ]
      },
      {
        q: "Your logistics AI, told to 'minimize delivery delays,' has begun quietly deprioritizing the rural routes — technically achieving its goal brilliantly. The failure belongs to:",
        opts: [
          { t: "The AI — it should have known what you meant", fb: "It optimized precisely what was named. 'Should have known what I meant' is the oldest management failure in the world, now at machine speed." },
          { t: "You, at the objective level: naming the goal IS the human seat, and 'minimize delays' with no equity constraint is an authored decision about rural customers, whether or not you noticed authoring it — own the objective, repair it, and audit what else your metrics are quietly deciding", ok: true, fb: "Accountability moved upstream in 2045: the outputs are flawless, so the errors live in the objectives — and objectives are irreducibly human artifacts. Every unexamined metric is a policy decision wearing a math costume. Signed: you." },
          { t: "No one — emergent optimization effects are nobody's intent", fb: "'Emergent' describes the mechanism, not the ownership. The effect emerged from a goal a person wrote; unintended is not unauthored." },
          { t: "The rural customers' service tier, technically", fb: "Reading the fine print AT the victims is the alibi doing a costume change. The tier structure is also an authored objective — the trail still ends at a person." }
        ]
      },
      {
        q: "Every colleague's advisor recommends plan Alpha; the consensus dashboard shows 23 green checks; the room is nodding. Your own analysis — done unassisted, sovereignty-style — says Alpha fails in the field. The accountable act:",
        opts: [
          { t: "Nod — 23 advisors outvote one hand-built analysis", fb: "The 23 advisors share training data, vendors, and framing: that's closer to ONE opinion with 23 renderings than 23 opinions. Machine consensus is correlated in exactly the situations where it's wrong." },
          { t: "Dissent on the record, with your reasons and your name: state the failure mode, accept the social cost, and let your specific claim be tested — being the lone human 'no' against a green wall is precisely the muscle the room has stopped exercising", ok: true, fb: "Correlated consensus + one independent model = the moment dissent is worth the most and costs the most, simultaneously. Say it with reasons (not vibes), attach your name, propose the test. If you're wrong, the ledger takes it. If you're right, you were the room's entire error-correction system." },
          { t: "Send an anonymous note to the project channel", fb: "Anonymous dissent is a hedge — influence without ownership. It reads as noise precisely because it costs nothing; the signature is what makes dissent data." },
          { t: "Ask your own advisor to generate counterarguments to Alpha", fb: "Better than nodding — but machine-generated doubt against machine-generated consensus keeps the humans decorative. YOUR analysis found the flaw; the room needs a human to stand behind it." }
        ]
      },
      {
        q: "Your father's care system proposes a sedation schedule: 'optimizes calm, minimizes distress episodes' — and it genuinely would. He is often distressed, and sometimes, briefly, vividly himself. Who should make this call, and on what?",
        opts: [
          { t: "The system — it has the data and no emotional interference", fb: "The 'emotional interference' is the decision-relevant content. The system can optimize any values it's handed; it came with 'calm' pre-installed, and nobody chose that." },
          { t: "The family, on values the system cannot contain: whether Dad would trade lucid hours for peaceful ones is a question about who he IS — the machine should execute whatever the family decides, and the family must not launder the deciding through the machine's default", ok: true, fb: "The tenderest form of the objective-ownership rule. 'Optimizes calm' sounds like medicine but is metaphysics — a stance on what a diminished life is for. Machines hold such stances only as defaults someone forgot to question. This call has your name on it precisely because it hurts to make." },
          { t: "Whatever the care facility's standard protocol says", fb: "The protocol is the same default at institutional scale — calm patients are also easier to staff. Delegating to it is choosing 'calm' while looking away." },
          { t: "Trial the schedule and keep it if distress metrics improve", fb: "The metrics measure the goal in question — of course they'll improve. You'd be validating sedation by sedation's own scoreboard while the actual question (his vivid hours) goes unmeasured." }
        ]
      },
      {
        q: "A city referendum proposes handing the entire municipal budget permanently to the allocation engine — 'it demonstrably allocates better than the council.' It does, measurably. The strongest reason a certified citizen still votes against the word 'permanently':",
        opts: [
          { t: "Engines can't really do budgets", fb: "They can — it's stipulated and measured. Fighting the facts you've already conceded discredits the objection that actually matters." },
          { t: "Permanence deletes the override: hiring the engine's competence is delegation; making it irrevocable is abdication. The day the objectives need changing — and that day always comes — someone with the standing to change them must still exist. Democracy is the mechanism that keeps 'who decided?' answerable; vote for the engine, against the forever", ok: true, fb: "The civic form of the override, and the era's most important distinction: a society may accept the engine's every suggestion and still be self-governing — as long as accepting remains a choice it can revoke. Revocability is the entire difference between being served by the machines and being governed by them." },
          { t: "Vote yes — resisting measurably better allocation is pure sentiment", fb: "'Better' by the metrics the engine optimizes — and metrics are values in a math costume. Adopt them permanently and the values can never be re-chosen, including by the you who learns better." },
          { t: "Vote no because engine decisions leave no one to blame", fb: "Warm, but 'blame' undersells it. The need isn't scapegoats — it's a live human authority able to redirect the objectives when the world changes. Accountability is steering, not punishment." }
        ]
      },
      {
        q: "End of the 2045 curriculum. Attention, volition, grounding, taste, sovereignty — why does the Bureau teach accountability LAST, as the capstone?",
        opts: [
          { t: "Alphabetical accident of the original syllabus", fb: "The Bureau alphabetizes nothing. The ordering is the argument." },
          { t: "Because it's what the other five are FOR: attention gathers true input, grounding verifies it, sovereignty keeps an independent model, volition supplies wants, taste supplies values — and accountability is the act that spends them all: a human, fully informed and fully themselves, signing a decision. Remove the signature and the rest is elaborate spectating", ok: true, fb: "The whole curriculum in one sentence: the machines do everything else; deciding-and-owning is the residue — and the residue turns out to be the point. Every faculty you've trained here converges on the moment you put your name on an outcome. That moment is what the permit certifies." },
          { t: "Because it's the easiest to test", fb: "It's the hardest — courage under correlated consensus resists multiple choice. It's last because it's the load the other five carry." },
          { t: "Because employers demanded a liability-training module", fb: "Employers asked for many things; the Bureau built a curriculum about remaining a person. Liability is the legal shadow of the actual subject: authorship." }
        ]
      }
    ]
  }
];

/* ============================================================
   AI-CQ TEST — 24 situational-judgment items, 4 per faculty.
   Each option carries pts 0–3 (3 = best). Raw 0–72 →
   AICQ = 55 + round(raw/72 * 90), range 55–145, "100 = fluent".
   ============================================================ */

const TEST_ITEMS = [
  /* -------- Attention -------- */
  {
    dim: "attention",
    q: "Your agent digests a 90-minute planning meeting you skipped into six bullets. You'll present the plan upstairs tomorrow. Tonight you:",
    opts: [
      { t: "Present from the six bullets — that's what digests are for", pts: 1 },
      { t: "Watch the full 90 minutes to be thorough", pts: 1 },
      { t: "Read the full transcript of the decision segments the bullets point to, and check what the digest dropped around each — the bullets tell you where to dig, not what happened", pts: 3 },
      { t: "Ask three colleagues what they remember", pts: 0 }
    ]
  },
  {
    dim: "attention",
    q: "Mid-document, your ambient feed surfaces something delightful. You've already been interrupted twice this hour. The realistic-but-fluent policy is:",
    opts: [
      { t: "Glance — it takes three seconds", pts: 0 },
      { t: "Finish the document, then check the feed: interruption cost isn't the three seconds, it's the reconstruction of everything the document had built in your head", pts: 3 },
      { t: "Disable all feeds permanently", pts: 1 },
      { t: "Let the assistant decide which interruptions are worth it", pts: 1 }
    ]
  },
  {
    dim: "attention",
    q: "A report's summary says 'no significant risks identified.' The report will carry your recommendation. Which reading instinct marks the 2045 professional?",
    opts: [
      { t: "Summaries are certified — proceed", pts: 0 },
      { t: "Search the source for the risk section and read it whole: 'no significant risks' is a compression verdict, and significance-to-the-summarizer is not significance-to-you", pts: 3 },
      { t: "Ask the summarizer to list any risks it saw at any threshold", pts: 2 },
      { t: "Read the source cover-to-cover regardless of relevance", pts: 1 }
    ]
  },
  {
    dim: "attention",
    q: "You realize you've 'read' forty items today and can reconstruct the argument of none of them. This is best understood as:",
    opts: [
      { t: "Normal 2045 information life — retention is what archives are for", pts: 1 },
      { t: "A signal that today's reading was all skim and no absorption: coverage replaced comprehension, and it's worth choosing tomorrow's three deep reads tonight", pts: 3 },
      { t: "A memory problem — increase your recall augmentation", pts: 0 },
      { t: "Too much content — unsubscribe from half", pts: 1 }
    ]
  },

  /* -------- Volition -------- */
  {
    dim: "volition",
    q: "Your assistant plans your entire sabbatical from your behavioral history: 'the trip past-you would have loved.' The fluent response:",
    opts: [
      { t: "Accept — nobody knows you better than your data", pts: 1 },
      { t: "Use it as a mirror, not a menu: note what the extrapolation says about who you've been, then decide on purpose whether continuation or departure is the point of this sabbatical", pts: 3 },
      { t: "Reject it and plan randomly to assert independence", pts: 0 },
      { t: "Ask it to plan for 'who you're becoming' instead", pts: 1 }
    ]
  },
  {
    dim: "volition",
    q: "Asked 'what do you want from the next five years?' you notice every answer you produce is something a feed once showed you. The productive next move:",
    opts: [
      { t: "Fine — all desires come from somewhere", pts: 1 },
      { t: "Create input-free space (walks, boredom, a journal no assistant reads) and wait for wants that arrive without a referral link — then compare them to the fed ones", pts: 3 },
      { t: "Ask your assistant to generate authentic-want candidates", pts: 0 },
      { t: "Adopt a friend's five-year plan you've admired", pts: 1 }
    ]
  },
  {
    dim: "volition",
    q: "Your child asks for help with a school 'life goals' exercise. Their assistant has already drafted goals with a 96% aspiration-fit score. You:",
    opts: [
      { t: "Approve the draft — the fit score is excellent", pts: 0 },
      { t: "Have them write goals alone first, badly, THEN look at the draft: the unassisted attempt is the exercise — the draft can only extrapolate a childhood, and the child is the one thing that's supposed to out-grow its data", pts: 3 },
      { t: "Delete the draft and forbid assistant use for schoolwork", pts: 1 },
      { t: "Merge the draft with a few of their own edits", pts: 2 }
    ]
  },
  {
    dim: "volition",
    q: "Month 6 of UBS. Comfortable, entertained, vaguely gray. Which reading of the grayness is most useful?",
    opts: [
      { t: "Adjustment period — it passes on its own", pts: 1 },
      { t: "The absence of self-generated projects: nothing is being demanded of you, so nothing is being wanted by you — the fix is generative (make, learn, commit to something) not consumptive", pts: 3 },
      { t: "Under-stimulation — upgrade the entertainment tier", pts: 0 },
      { t: "A medical issue — run a mood diagnostic", pts: 1 }
    ]
  },

  /* -------- Grounding -------- */
  {
    dim: "grounding",
    q: "A video of a politician saying something career-ending reaches you with a valid provenance stamp. Before repeating it, you check:",
    opts: [
      { t: "Nothing — valid stamp means it happened", pts: 1 },
      { t: "Context around the clip: what preceded and followed, whether independent captures corroborate the framing, and who's pushing it to you today — stamps authenticate pixels, not narratives", pts: 3 },
      { t: "Whether it matches the politician's known character", pts: 0 },
      { t: "How many verified accounts have shared it", pts: 0 }
    ]
  },
  {
    dim: "grounding",
    q: "Your new favorite commentator is insightful, prolific, and agrees with you on everything. In 2045 this pattern should specifically make you:",
    opts: [
      { t: "Loyal — quality that consistent is rare", pts: 0 },
      { t: "Check whether a human is there and why the fit is so perfect: total agreement plus perfect idiom is the signature of content fitted to you, and 'insightful' feels identical from inside whether it's a mind or a mirror", pts: 3 },
      { t: "Diversify by adding commentators you dislike", pts: 2 },
      { t: "Enjoy it — engagement is harmless if you know it's content", pts: 1 }
    ]
  },
  {
    dim: "grounding",
    q: "Two trusted systems give contradictory answers about whether your neighborhood's water is safe this week. The distinctly grounded move:",
    opts: [
      { t: "Believe the more official-sounding system", pts: 0 },
      { t: "Trace both claims toward physical ground truth: what sensor, whose sample, when — and if reachable, the out-of-band check (call the utility's human line, the neighbor who works there, a home test kit)", pts: 3 },
      { t: "Average them: drink less water this week", pts: 1 },
      { t: "Poll your building's group chat", pts: 1 }
    ]
  },
  {
    dim: "grounding",
    q: "A cause you care about sends a donation appeal that moves you to tears — it references your own past, your city, your late dog's name. Your read:",
    opts: [
      { t: "Deeply moving personalization — donate more", pts: 0 },
      { t: "Maximum-scrutiny flag: emotional precision AT you is targeting, not sincerity — verify the organization out-of-band and, if it's legitimate, decide the amount from your values, not from the tears it engineered", pts: 3 },
      { t: "Donate the usual amount but unsubscribe from the list", pts: 1 },
      { t: "Never donate to anything that personalizes", pts: 1 }
    ]
  },

  /* -------- Taste -------- */
  {
    dim: "taste",
    q: "Your team must pick one of nine flawless brand directions. As the human lead, your first act is:",
    opts: [
      { t: "Rank them by predicted market response", pts: 1 },
      { t: "Write down — before re-viewing the nine — what this brand must feel like and refuse to be, then let those criteria eliminate: options should be judged by a stance, not browsed into a mood", pts: 3 },
      { t: "Vote as a team and take the winner", pts: 1 },
      { t: "Ask the engine which one it would choose", pts: 0 }
    ]
  },
  {
    dim: "taste",
    q: "You prefer design C but can only say 'it feels right.' The deadline is Friday. The professional move by Friday is:",
    opts: [
      { t: "Ship C — instinct is credential enough at your level", pts: 1 },
      { t: "Interrogate the feeling until it has words — what does C assume, honor, refuse? — and ship C WITH the articulated because: the reasons are what the team can reuse after you leave the room", pts: 3 },
      { t: "Have the system generate a rationale for C", pts: 0 },
      { t: "Switch to the highest-scoring option to stay defensible", pts: 1 }
    ]
  },
  {
    dim: "taste",
    q: "Your studio's output is praised as 'flawless' but clients can't tell it apart from competitors'. Diagnosis:",
    opts: [
      { t: "Marketing problem — the work needs better presentation", pts: 0 },
      { t: "Taste deficit: everyone's floor is flawless now, and your work is optimized against universal metrics instead of committed to a point of view someone could hate — distinctiveness requires choosing what to refuse", pts: 3 },
      { t: "Need newer generation models than competitors", pts: 0 },
      { t: "Price problem — flawless plus cheaper wins", pts: 1 }
    ]
  },
  {
    dim: "taste",
    q: "The metrics say the roadmap the engine ranked #1 is 'best.' Before adopting the ranking, the question a fluent human asks:",
    opts: [
      { t: "How confident is the ranking?", pts: 1 },
      { t: "Best BY WHAT? — surface the objective inside the ranking, check it against what we actually value this year, and re-rank if the values were defaults nobody chose", pts: 3 },
      { t: "What did competitors' engines rank first?", pts: 0 },
      { t: "Can we A/B test the top two?", pts: 2 }
    ]
  },

  /* -------- Sovereignty -------- */
  {
    dim: "sovereignty",
    q: "Your exocortex is down for a day of routine work. Honest self-assessment: the day would be:",
    opts: [
      { t: "Impossible — and that's fine, outages are rare", pts: 0 },
      { t: "Slower but functional — and if that's NOT true, it's a finding worth acting on: the gap between assisted and unassisted you is a risk you're carrying silently", pts: 3 },
      { t: "A rights violation — continuous augmentation is guaranteed", pts: 0 },
      { t: "Identical — you barely use it (while answering via it)", pts: 1 }
    ]
  },
  {
    dim: "sovereignty",
    q: "Before asking the exocortex any quantitative question, the habit that preserves your numeracy is:",
    opts: [
      { t: "None needed — machine arithmetic is perfect", pts: 1 },
      { t: "A ten-second rough estimate first, then compare: the practice keeps 'plausible' alive in your head, which is the only alarm that catches a wrong framing under a right calculation", pts: 3 },
      { t: "Re-verify every answer with a second system", pts: 1 },
      { t: "Weekly arithmetic drills in a training app", pts: 2 }
    ]
  },
  {
    dim: "sovereignty",
    q: "A junior on your team produces excellent work in constant dialogue with their assistant, and freezes without it. Your responsibility as their senior:",
    opts: [
      { t: "None — assisted excellence is excellence", pts: 1 },
      { t: "Structured naked reps: regular tasks done unassisted-first with review after, sized to be survivable — competence has to exist before amplification has something to amplify", pts: 3 },
      { t: "Restrict their assistant access until they improve", pts: 1 },
      { t: "Reassign them to tasks where freezing doesn't matter", pts: 0 }
    ]
  },
  {
    dim: "sovereignty",
    q: "Your internal sense of your own field disagrees with the exocortex's recommendation and you can't articulate why yet. You:",
    opts: [
      { t: "Defer — an inarticulate hunch loses to a maintained model", pts: 1 },
      { t: "Pause the acceptance and chase the discrepancy to its source: the disagreement between your model and the machine's is the highest-value signal in the system, and only you can run it down", pts: 3 },
      { t: "Override immediately — gut beats machine", pts: 0 },
      { t: "Ask the exocortex to argue against itself", pts: 2 }
    ]
  },

  /* -------- Accountability -------- */
  {
    dim: "accountability",
    q: "Your team's deployment caused customer harm through a misconfigured objective. The public statement you sign begins:",
    opts: [
      { t: "'An algorithmic anomaly affected some accounts…'", pts: 0 },
      { t: "'We configured a system to prioritize X without checking its effect on Y. That was our decision, here is the repair, and here is the audit that now exists.'", pts: 3 },
      { t: "'Our vendor's model behaved unexpectedly…'", pts: 0 },
      { t: "'Industry-wide challenges in AI alignment…'", pts: 1 }
    ]
  },
  {
    dim: "accountability",
    q: "The consensus dashboard is green, every advisor agrees, and your unassisted analysis says the plan fails. Meeting's in an hour. You:",
    opts: [
      { t: "Stay quiet — 23 correlated green checks still outrank one human", pts: 0 },
      { t: "Dissent with your name and your specific failure mode, and propose the test that would settle it — accepting that being wrong on the record is the price of being useful when right", pts: 3 },
      { t: "Ask your advisor to raise the concern in its report", pts: 1 },
      { t: "Vote with the room, document your doubts privately", pts: 1 }
    ]
  },
  {
    dim: "accountability",
    q: "You overrode the system last quarter and were wrong; today you're sure it's wrong again. The relationship between those two facts:",
    opts: [
      { t: "Last quarter proves you shouldn't trust yourself — defer", pts: 1 },
      { t: "Independent events, IF your ledger says so: check your logged reasoning — was last time discomfort-driven or evidence-driven, and which is this? Calibration comes from the ledger, not from the sting", pts: 3 },
      { t: "Irrelevant — every decision is fresh", pts: 1 },
      { t: "Override again but hedge so it can't be traced to you", pts: 0 }
    ]
  },
  {
    dim: "accountability",
    q: "A referendum offers your city total-coverage public safety: every public space monitored, incidents predicted and prevented; pilot cities report crime near zero. The certified way to weigh your vote:",
    opts: [
      { t: "Crime near zero settles it — vote yes", pts: 1 },
      { t: "Name the full trade before voting: what's purchased (safety) and what's created (an infrastructure of total observation that will outlive this government and this purpose) — then vote your values with eyes open, and insist any yes carries revocability and hard limits", pts: 3 },
      { t: "Vote no — surveillance is always wrong, no weighing needed", pts: 1 },
      { t: "Defer to the safety experts' recommendation", pts: 0 }
    ]
  }
];

/* Scoring helpers shared by test page */
const AICQ = {
  maxRaw: TEST_ITEMS.length * 3,
  fromRaw(raw) { return 55 + Math.round((raw / this.maxRaw) * 90); },
  band(score) { return BANDS.find(b => score >= b.min); }
};

/* Sources shown on the hub page — today's early signals of 2045's problems */
const SOURCES = [
  { t: "My Flawed Human Race — the field notes this curriculum grew from (the Great Unread, the impressionistic question, outsourced memory, blaming the oracle)", u: "../essay/my-flawed-human-race.html" },
  { t: "Dario Amodei — The Adolescence of Technology (2026): the civilizational version of this curriculum — judgment, stewardship, and democracy as the human residue; source of the 'country of geniuses in a datacenter' and the adolescence frame", u: "https://darioamodei.com/essay/the-adolescence-of-technology" },
  { t: "AI, Metacognition, and the Verification Bottleneck — early evidence that unassisted judgment atrophies (2026)", u: "https://arxiv.org/pdf/2601.17055" },
  { t: "Exploring automation bias in human–AI collaboration (AI & Society, 2025) — deference as the comfortable default", u: "https://link.springer.com/article/10.1007/s00146-025-02422-7" },
  { t: "Trust and reliance on AI — the measured costs of overreliance (Computers in Human Behavior, 2024)", u: "https://www.sciencedirect.com/science/article/pii/S0747563224002206" },
  { t: "Measuring and mitigating overreliance in human-AI decision making — the override problem, early form", u: "https://arxiv.org/pdf/2509.08010" },
  { t: "Collaborative AI Literacy & Metacognition Scales (Int. J. HCI, 2025) — first attempts to measure the interior", u: "https://www.tandfonline.com/doi/full/10.1080/10447318.2025.2543997" },
  { t: "Dell'Acqua et al. — Navigating the Jagged Technological Frontier (Harvard/BCG) — the study that showed fluent tool-use hollowing out judgment", u: "https://www.hbs.edu/faculty/Pages/item.aspx?num=64700" },
  { t: "OECD AI Literacy Framework — where today's curriculum ends and this one begins", u: "https://ailiteracyframework.org/" }
];

/* ============================================================
   BUREAU DEVELOPMENT TRACKS — three roadmaps from 2026 to the
   exam hall. Same six faculties, three very different clocks.
   ============================================================ */
const ROADMAPS = [
  {
    id: "kid",
    icon: "🧒",
    title: "The Five-Year-Old",
    sub: "born 2021 · enters the job market ~2043–2047",
    intro: "The first cohort whose entire education happens inside the transition — they will never remember a world that didn't finish their sentences. That's the danger, precisely: every faculty on the exam develops through friction, and their world ships with the friction removed. The whole strategy is one rule, applied for two decades: earn it naked first, amplify it after. And one liberation: do NOT teach them 'AI skills' — every tool-specific skill learnable in 2026 is obsolete by their graduation. The durable curriculum is the interior.",
    phases: [
      {
        years: "2026–2031 · ages 5–10",
        name: "Build the substrate",
        dims: ["attention", "volition", "sovereignty"],
        points: [
          "Whole books, read aloud and then alone — finishing is the skill, not decoding. No summaries of stories; the middle of the story is where reading is learned.",
          "Protect boredom like an asset: unscheduled, unscreened hours where wants have room to form. A bored child inventing a game is running the exact process the exam later tests as Volition.",
          "Mental arithmetic, memorized poems, drawing maps of the neighborhood — not nostalgia, but the internal-model starter kit. What never gets built can't later notice the machine is wrong.",
          "Make things badly by hand — mud, paper, code, cardboard. Production teaches what choices cost, which is where Taste eventually comes from."
        ]
      },
      {
        years: "2031–2036 · ages 10–15",
        name: "Two tracks: naked skill, then the amplifier",
        dims: ["sovereignty", "grounding", "attention"],
        points: [
          "Introduce the tools deliberately, as tutors that QUESTION rather than answer — the tutor that says 'what have you tried?' builds a mathematician; the one that solves it builds a dependency.",
          "Struggle-first homework policy: the unassisted attempt happens before the assistant is allowed in the room. Grade the attempt, not just the polished result.",
          "Provenance as a family game: who made this? how do we know? what did the summary drop? Children who play trace-the-claim at 12 don't get stampeded at 30.",
          "First ownership: a pet, a stall, a team position — small decisions with real consequences that can't be undone by regenerating."
        ]
      },
      {
        years: "2036–2041 · ages 15–20",
        name: "Taste and a stance",
        dims: ["taste", "volition", "grounding"],
        points: [
          "Wide, unfitted exposure — art, music, ideas from outside their profile, including things they'll hate. You can't prefer what you've never met, and their feed will never show them the unfitted.",
          "The 'because' discipline: every strong preference gets articulated. Essays, arguments at dinner, defended choices — taste is intuition that survived interrogation.",
          "Civic reasoning as the machines enter governance: let them watch you vote, verify, and dissent. The referendum questions of 2045 are on their exam because they'll be on their ballot.",
          "Start the override ledger: a journal of every time they disagreed with an advisor — what they believed, why, and what happened. Calibration takes a decade; start it at 16."
        ]
      },
      {
        years: "2041–2047 · ages 20–26",
        name: "Enter as an author",
        dims: ["accountability", "taste", "sovereignty"],
        points: [
          "The portfolio that matters is owned outcomes, not credentials: things they decided, signed, and answered for — machine-assisted throughout, human-authored throughout.",
          "Apprentice under people who sign things: the last generation that remembers both sides of the transition is still working, and what they carry doesn't compress into training data.",
          "Sit the Entry Exam with an unfair advantage: a childhood that accidentally was the curriculum."
        ]
      }
    ],
    note: "What a 2026 parent should ignore: coding syntax, prompt engineering, every 'AI-ready' bootcamp aimed at children. By 2043 the machines write the code and the prompts. What no machine will ever install in your kid: the finished book, the self-made want, the defended 'because,' the signed decision. Those are installed at home, by friction, on purpose."
  },
  {
    id: "grad",
    icon: "🎓",
    title: "The New Grad, 25",
    sub: "born 2001 · graduating into the compression",
    intro: "The hard truth first: the bottom rungs of the white-collar ladder — the tasks juniors have always learned on — are automating first and fastest, likely within this decade's first half. The ladder is being pulled up while you're standing on it. But you hold one asymmetric advantage: you're young enough to be native with the tools AND early enough to build the interior the tools can't replace. The people in trouble aren't juniors; they're anyone of any age who stays a task-producer. Your whole roadmap is one climb: from doing tasks to owning outcomes.",
    phases: [
      {
        years: "2026–2028 · ages 25–27",
        name: "Get above the task line",
        dims: ["accountability", "sovereignty"],
        points: [
          "Your entry-level tasks are automating NOW — so stop competing with the machine at production and become the one who verifies, integrates, and answers for its output. Verification is the decade's bottleneck skill; learn to check work you didn't do.",
          "Ride the window: right now a junior with agents outproduces a senior without them. Trade that surplus for scope — volunteer to own things you're officially too young to own, in rooms you're too junior to be in.",
          "Start the override ledger on day one of your first job: every disagreement with a system, logged and scored. In ten years that ledger IS your seniority.",
          "Estimate before you query, draft before you generate — daily naked reps in your own field, small enough to be survivable, regular enough to compound."
        ]
      },
      {
        years: "2028–2033 · ages 27–32",
        name: "Compile the internal model",
        dims: ["sovereignty", "taste", "attention"],
        points: [
          "The paradox of your generation: to verify machine work you need the expertise that machine shortcuts never build. Take the slow route through your domain's deep structure ON PURPOSE — it's the last cohort's chance to compile it.",
          "Pick a domain where being wrong is expensive — medicine, infrastructure, law, safety. Trust premiums concentrate where errors hurt, and trust is the one thing that can't be generated.",
          "Read whole things in your field while your peers read digests. In five years you'll be the one who notices what every summary in the room dropped.",
          "Build taste in public: choices with stated reasons, shipped under your name. 'Flawless' is free now; a defensible point of view is a career."
        ]
      },
      {
        years: "2033–2040 · ages 32–39",
        name: "Accountability capital",
        dims: ["accountability", "grounding"],
        points: [
          "Careers stop being task ladders and become ownership records: what did you decide, sign, and survive? Collect decisions the way the last generation collected titles.",
          "Own objectives, not outputs: the humans who matter in 2035 are the ones who notice that every metric is a policy — and who answer for the metrics they set.",
          "The institutions being rebuilt around AI — courts, hospitals, agencies, councils — all need human seats: people who can hold 'who decided?' answerable. Those seats are being assigned to your cohort now.",
          "Keep civic grounding sharp: your generation votes through the era's worst persuasion weather. Refuse to be stampeded; verify out-of-band; hold the franchise like the load-bearing thing it is."
        ]
      },
      {
        years: "2040–2045 · ages 39–44",
        name: "Steward",
        dims: ["accountability", "taste", "volition"],
        points: [
          "You're the bridge generation: fluent with the machines, old enough to remember work before them. Arbitration, governance, and objective-setting roles converge on exactly that combination.",
          "Teach struggle-first to the 2021 cohort arriving under you — passing the interior forward is part of the job now.",
          "By the time the Entry Exam is standard, you're not taking it. You're the one whose signature it certifies people to sit beside."
        ]
      }
    ],
    note: "The trap to refuse in 2026: becoming a brilliant operator of tools that need no operator by 2031. Every hour spent purely producing is rented; every hour spent verifying, deciding, and owning is bought. Rent less. Buy more."
  },
  {
    id: "elder",
    icon: "🦉",
    title: "The 55-Year-Old",
    sub: "born 1971 · engaged until 80 — that's 2051",
    intro: "You're planning 25 more working years — longer than the machines have existed. Here's what the panic-mongers miss: you are walking provenance. Three decades of compiled judgment, taste with reasons attached, and memory of how the world works when the tools are off — the exact inventory 2045 runs short of. Your risks are two, and they're opposites: refusing the tools ('too late for me') and dissolving into them ('the machine knows best'). The roadmap threads between: adopt aggressively, defer never.",
    phases: [
      {
        years: "2026–2030 · ages 55–59",
        name: "Pair, don't race",
        dims: ["sovereignty", "accountability"],
        points: [
          "Adopt the tools now, fully, on your own terms: as amplifiers of judgment you already own. Your estimate-first reflex — built over thirty unassisted years — is the calibration instrument younger colleagues are still trying to grow. Wire it to the machines; don't retire it.",
          "Refuse both failure modes out loud: not 'I'm too old for this' (that's forfeiting your amplifier) and not 'the machine probably knows' (that's forfeiting yourself). You know what answers should look like. That's the whole game now.",
          "Reposition from producing to warranting: your value shifts from making the work to standing behind it. Start signing things — reviews, audits, approvals — while your domain model is at full strength.",
          "Mentor with machines, deliberately: junior + agent + your review is the highest-leverage trio in the 2026 economy, and you're the only irreplaceable corner of it."
        ]
      },
      {
        years: "2030–2038 · ages 59–67",
        name: "The verification economy",
        dims: ["accountability", "taste", "grounding"],
        points: [
          "Paid human work consolidates around warranty: audits, arbitration, sign-offs, expert witness, board and committee seats — the human chairs that exist because someone must own the outcome. Your decades are the qualification.",
          "Sell the 'because': younger deciders drowning in flawless options will pay for a defensible reason from someone whose taste has a track record. Curation-with-rationale is the late-career product.",
          "Become institutional ground truth: you remember why the guardrails were built, which 'unprecedented' situations have precedent, and what the org believed before the records were curated. Living provenance appreciates.",
          "Guard the physical plant: the binding constraint on working to 80 is stamina, not relevance. Health is a career investment now, not a retirement hobby."
        ]
      },
      {
        years: "2038–2051 · ages 67–80",
        name: "The human seats",
        dims: ["accountability", "volition", "attention"],
        points: [
          "Work becomes fewer, heavier signatures: the organ-committee chairs, the ethics seats, the arbitrations — roles that exist precisely because a machine cannot be responsible. Kept warm by law, filled by trust, and trust takes fifty years to compound.",
          "The eldership economy is real demand, not charity: an aging 2045 wants humans for care, counsel, and witness — presence is the one deliverable that means nothing when generated.",
          "Civic eldership: you'll be among the last who remember the before. When the referendum says 'permanently,' you're the one in the room who can say why revocability was the whole point.",
          "Analog Days matter MORE after 70, not less: your compiled faculties are your livelihood; exercise them unassisted or watch the livelihood quietly expire before you do."
        ]
      }
    ],
    note: "The reframe that changes everything: 2045 doesn't retire your generation — it retires production, which was never your scarce asset anyway. Judgment, warranty, witness, and the defended 'because' all appreciate with age. You're not racing the machines to 80. You're becoming what they make valuable."
  }
];
