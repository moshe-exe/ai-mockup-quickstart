# ai-mockup-quickstart

Toolkit para construir mockups competentes de IA Generativa en poco tiempo — hackatones, demos, prototipos de validación.

Nace de la charla **"Cómo construir un producto de IA Generativa en menos de 48 horas"** (Desafío IA Bagó Perú 2026), pero los recursos están pensados para reutilizarse en cualquier contexto donde necesites pasar de idea a demo funcional rápido.

**Autor:** [Moshe Ojeda](https://github.com/moshe-exe) · cofundador de [Agentman](https://github.com/agentman) y [Mentorium](https://github.com/mentoriumai)

---

## Para quién es esto

- Equipos en un hackatón de IA Generativa con 24-48h
- Devs construyendo prototipos rápidos para validar una hipótesis
- Founders armando una demo para una primera ronda
- Cualquiera que necesite llegar de **idea → mockup en pantalla** sin perder días en infraestructura

No es para construir productos de producción. Es para llegar al **wow moment** lo antes posible.

---

## Estructura del repo

```
ai-mockup-quickstart/
├── reference/           # Cheatsheets y tablas de decisión
├── examples/            # Código funcional, copy-paste y adaptable
├── skills/              # Claude SKILLs para acelerar el flujo
└── starter/             # Template de proyecto recomendado
```

### `reference/` — archivos de referencia

Cheatsheets y tablas que respondan rápido a *"¿qué comando uso?"* o *"¿agente o workflow?"* sin tener que leer documentación de 30 páginas.

```
reference/
├── foundry-cli-cheatsheet.md    # Comandos `az` correctos para deployar gpt-4o-mini en Foundry
├── agente-vs-workflow.md         # Tabla decisional con ejemplos healthcare
├── 48h-checklist.md              # Los 4 bloques + checkpoints hora 12 y 24
└── errores-comunes.md            # Patterns a evitar (multi-agente prematuro, RAG innecesario, etc.)
```

### `examples/` — recursos de código

Cada ejemplo es **autocontenido** (corre solo, mínimas dependencias) y **flexible** (variables claras, fácil de adaptar a tu caso). Numerados para sugerir un orden pedagógico, pero todos son independientes.

```
examples/
├── 01-hello-llm/                 # Llamada básica a gpt-4o-mini (Python + Node)
├── 02-function-calling/          # Cómo darle herramientas al LLM
├── 03-mini-agent/                # Agente con loop, tools y memoria mínima
└── 04-dummy-data-generator/      # Pattern: agente redactor de pacientes/casos sintéticos
```

Cada ejemplo tiene:
- `README.md` con qué hace, cuándo usarlo, y cómo correrlo
- Código en Python y/o Node
- `.env.example` con las variables que necesita
- Un comentario clave por archivo explicando dónde personalizar

### `skills/` — Claude SKILLs

Skills para [Claude Code](https://claude.ai/code) que automatizan tareas repetitivas del flujo de hackatón. Cada skill se puede usar tal cual o adaptar (son markdown editable).

```
skills/
├── foundry-cli/                  # Skill que ayuda con comandos `az` para Foundry
├── mockup-architect/             # Skill que ayuda a recortar scope y diseñar arquitectura mínima
└── dummy-redactor/               # Skill que genera pools de datos sintéticos con reglas
```

Cada skill tiene:
- `SKILL.md` con descripción, comandos, y mecánica
- Plantillas o helpers asociados si aplica
- Instrucciones para instalarla en tu Claude Code

### `starter/` — template de proyecto

Una estructura recomendada para arrancar tu mockup. Container local + backend FastAPI + frontend mínimo + .env. La idea es que clones esto y solo escribas la lógica del agente.

```
starter/
├── docker-compose.yml            # Container local listo
├── backend/                      # FastAPI con endpoint de chat al LLM
├── frontend/                     # Streamlit o página HTML mínima
├── .env.example
└── README.md
```

---

## Cómo usar este repo

**Antes del hackatón:**
1. Clona o descarga el `starter/` y arma tu container local
2. Instala las skills de `skills/` en tu Claude Code
3. Lee `reference/48h-checklist.md` para entender el método

**Durante el hackatón:**
1. Hora 0-4: usa la `mockup-architect` skill para acotar tu scope
2. Hora 4-20: levanta el starter, adapta un ejemplo de `examples/` a tu caso
3. Hora 20-36: itera prompts y lógica del agente
4. Hora 36-48: pule UI, graba video backup, ensaya pitch

**En cualquier momento:**
- Si necesitas datos sintéticos → `examples/04-dummy-data-generator/`
- Si te trabas con `az` → `reference/foundry-cli-cheatsheet.md`
- Si dudas entre agente y workflow → `reference/agente-vs-workflow.md`

---

## Filosofía

- **Recortar con cabeza, aunque duela.** El miedo al dolor no es razón para no decidir bien.
- **Tu demo es lo que sobrevive al recorte.** Construye eso, nada más.
- **El deploy de la hora 12 no es para mostrar** — es para descubrir lo que no funciona mientras todavía hay tiempo.

---

## Estado del repo

🚧 **En construcción.** Estructura propuesta arriba. Los archivos se irán materializando uno por uno. PRs y feedback son bienvenidos.

## Licencia

MIT — usa, modifica, redistribuye libremente.
