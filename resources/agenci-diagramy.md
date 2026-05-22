# Agenci warsztatowi — jak współpracują (diagramy)

Materiał wizualny do bloku o **custom agents** w GitHub Copilot. Pokazuje, jak
trzej istniejący agenci z [.github/agents/](../.github/agents/) i pięć pomysłów ze
[ściągawki](pomysly-na-agentow.md) wpinają się we wspólny cykl pracy nad aplikacją.

## Jedna pointa: `tools` = rola

Wszyscy ci „agenci" to ten sam mechanizm. Różni ich tylko **zestaw narzędzi (`tools`)**
i system prompt:

- **read-only** (`read`, `search/codebase`) → agent **patrzy i mówi**, nie ruszy kodu.
- **+ `edit`** → agent **zmienia pliki**.
- **+ `execute`** → agent **uruchamia** (rzadko potrzebne przy vanilla HTML).

Legenda kolorów używana w diagramach niżej:

- 🟦 **read-only** — Tłumacz, Reviewer
- 🟩 **+ edit** — Spec, Planner, Tester, Dokumentalista, Copywriter
- 🟧 **+ execute** — Implementer

## Tabela agentów

| Agent | `tools` | Co robi | Handoff → |
|---|---|---|---|
| **Spec** | `search/codebase`, `read`, `edit` | 2-3 zdania pomysłu → `aplikacje/<nazwa>/SPEC.md` | → Planner |
| **Planner** | `search/codebase`, `search/usages`, `edit`, `read` | czyta `SPEC.md` → pisze `plans/NN-feature.md` | → Implementer |
| **Implementer** | `edit`, `execute`, `search/codebase`, `read` | wykonuje plan → `index.html` / `css` / `js` | ↺ Planner |
| **Tester** | `search/codebase`, `read`, `edit` | pisze asercje w `tests.html`; nie rusza `js/app.js` | → Implementer |
| **Reviewer** | `search/codebase`, `read` | recenzuje kod → werdykt `APPROVE` / `CHANGES` | → Implementer |
| **Tłumacz** | `search/codebase`, `read` | tłumaczy `js/app.js` na prosty polski | — |
| **Dokumentalista** | `search/codebase`, `read`, `edit` | pisze `README.md` aplikacji | — |
| **Copywriter** | `search/codebase`, `read`, `edit` | poprawia teksty w `index.html` | — |

> **`handoffs` + `send: false`** — agent **podsuwa** gotowy prompt do następnego agenta,
> ale to **człowiek zatwierdza** przekazanie. Strzałki na diagramach to właśnie te handoffy.

---

## Diagram 1 — Spektrum narzędzi = rola

Drabinka uprawnień: każdy kolejny szczebel dokłada jedno narzędzie i zmienia to, co agent może zrobić.

```mermaid
graph LR
    A["🟦 read + search<br/>patrzy i mówi"] --> B["🟩 + edit<br/>zmienia pliki"] --> C["🟧 + execute<br/>uruchamia"]

    A --- A1[Tłumacz]
    A --- A2[Reviewer]

    B --- B1[Spec]
    B --- B2[Planner]
    B --- B3[Tester]
    B --- B4[Dokumentalista]
    B --- B5[Copywriter]

    C --- C1[Implementer]

    classDef ro fill:#dbeafe,stroke:#3b82f6,color:#1e3a8a;
    classDef ed fill:#dcfce7,stroke:#22c55e,color:#14532d;
    classDef ex fill:#ffedd5,stroke:#f97316,color:#7c2d12;

    class A,A1,A2 ro;
    class B,B1,B2,B3,B4,B5 ed;
    class C,C1 ex;
```

---

## Diagram 2 — Rdzeń: cykl życia aplikacji

Istniejący łańcuch handoffów z [.github/agents/](../.github/agents/). Etykiety strzałek to
skróty realnych promptów z pól `handoffs`.

```mermaid
flowchart TD
    Idea(["💡 Pomysł<br/>2-3 zdania"]) --> Spec

    Spec["🟩 Spec<br/>tworzy SPEC.md"]
    Planner["🟩 Planner<br/>plans/NN-feature.md"]
    Impl["🟧 Implementer<br/>index.html · css · js"]

    Spec -->|"Zaplanuj budowę wg SPEC.md"| Planner
    Planner -->|"Zaimplementuj plan, trzymaj się go ściśle"| Impl
    Impl -->|"Skończone — podsumuj i zaproponuj kolejny krok"| Planner

    Done(["✅ Działająca apka<br/>w folderze aplikacji"])
    Impl -.-> Done

    classDef ed fill:#dcfce7,stroke:#22c55e,color:#14532d;
    classDef ex fill:#ffedd5,stroke:#f97316,color:#7c2d12;
    class Spec,Planner ed;
    class Impl ex;
```

---

## Diagram 3 — Pełen zespół wokół cyklu

Rdzeń (Spec → Planner → Implementer) w centrum. Wokół niego wpinają się nowe role:
**Tester** i **Reviewer** domykają jakość, a **Copywriter / Dokumentalista / Tłumacz**
pracują na gotowych artefaktach.

```mermaid
flowchart TD
    Idea(["💡 Pomysł"]) --> Spec

    subgraph Budowa["🏗️ Budowa"]
        Spec["🟩 Spec<br/>SPEC.md"]
        Planner["🟩 Planner<br/>plans/NN-*.md"]
        Impl["🟧 Implementer<br/>index.html · css · js"]
        Spec --> Planner --> Impl
        Impl -->|"podsumuj, kolejny krok"| Planner
    end

    subgraph Jakosc["✅ Jakość"]
        Tester["🟩 Tester<br/>tests.html"]
        Reviewer["🟦 Reviewer<br/>APPROVE / CHANGES"]
    end

    subgraph Docs["🗣️ Komunikacja / Docs"]
        Copywriter["🟩 Copywriter<br/>teksty w index.html"]
        Dokumentalista["🟩 Dokumentalista<br/>README.md"]
        Tlumacz["🟦 Tłumacz<br/>czyta js/app.js"]
    end

    Impl --> Tester
    Tester -->|"testy nie przechodzą — napraw kod"| Impl
    Impl --> Reviewer
    Reviewer -->|"CHANGES — popraw wg uwag"| Impl

    Impl -.->|"po zbudowaniu"| Copywriter
    Impl -.->|"po zbudowaniu"| Dokumentalista
    Impl -.->|"po zbudowaniu"| Tlumacz

    classDef ro fill:#dbeafe,stroke:#3b82f6,color:#1e3a8a;
    classDef ed fill:#dcfce7,stroke:#22c55e,color:#14532d;
    classDef ex fill:#ffedd5,stroke:#f97316,color:#7c2d12;
    class Spec,Planner,Tester,Copywriter,Dokumentalista ed;
    class Reviewer,Tlumacz ro;
    class Impl ex;
```

---

## Diagram 4 — Pętla jakości (TDD + review)

Pełna podróż jako sekwencja. Zwróć uwagę, że **człowiek zatwierdza każdy handoff**
(`send: false`) — agenci niczego nie przekazują dalej automatycznie.

```mermaid
sequenceDiagram
    actor H as 🧑 Człowiek
    participant S as Spec
    participant P as Planner
    participant I as Implementer
    participant T as Tester
    participant R as Reviewer
    participant D as Dokumentalista

    H->>S: pomysł (2-3 zdania)
    S-->>H: SPEC.md gotowy (proponuje → Planner)
    H->>P: zatwierdza handoff
    P-->>H: plan gotowy (proponuje → Implementer)
    H->>I: zatwierdza handoff
    I-->>H: kod gotowy

    Note over T,I: Pętla TDD
    H->>T: napisz testy
    T-->>H: tests.html (proponuje → Implementer)
    H->>I: "testy nie przechodzą — napraw kod"
    I-->>H: poprawione

    Note over R,I: Pętla review
    H->>R: zrecenzuj kod
    alt CHANGES
        R-->>H: lista uwag (proponuje → Implementer)
        H->>I: "popraw wg uwag"
        I-->>H: poprawione
    else APPROVE
        R-->>H: ✅ werdykt APPROVE
    end

    H->>D: napisz README
    D-->>H: README.md gotowy
```

---

## Diagram 5 — Read-only vs piszący vs uruchamiający

Wizualne podsumowanie pointy o `tools`: kto **nie ruszy** kodu, kto go **edytuje**,
a kto dodatkowo **uruchamia**.

```mermaid
graph TD
    subgraph RO["🟦 read-only — patrzą i mówią"]
        Tlumacz[Tłumacz]
        Reviewer[Reviewer]
    end

    subgraph ED["🟩 + edit — zmieniają pliki"]
        Spec[Spec]
        Planner[Planner]
        Tester[Tester]
        Dokumentalista[Dokumentalista]
        Copywriter[Copywriter]
    end

    subgraph EX["🟧 + execute — uruchamiają"]
        Implementer[Implementer]
    end

    classDef ro fill:#dbeafe,stroke:#3b82f6,color:#1e3a8a;
    classDef ed fill:#dcfce7,stroke:#22c55e,color:#14532d;
    classDef ex fill:#ffedd5,stroke:#f97316,color:#7c2d12;
    class Tlumacz,Reviewer ro;
    class Spec,Planner,Tester,Dokumentalista,Copywriter ed;
    class Implementer ex;
```

---

## Jak czytać handoffy

W pliku agenta (`.github/agents/<nazwa>.agent.md`) sekcja `handoffs` definiuje przekazania:

```yaml
handoffs:
  - label: Przekaż do Implementera   # tekst przycisku w czacie
    agent: Implementer               # do kogo
    prompt: Zaimplementuj plan...    # gotowy prompt dla następnego agenta
    send: false                      # człowiek zatwierdza, nie wysyła się samo
```

Każda strzałka między agentami na powyższych diagramach to dokładnie taki wpis `handoffs`.
`send: false` znaczy, że uczestnik widzi gotowy prompt i sam decyduje, czy go wysłać —
to nie jest automatyczny, niekontrolowany łańcuch.
