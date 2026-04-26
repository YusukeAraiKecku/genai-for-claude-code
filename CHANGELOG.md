# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added — v0.1 (compiler MVP)

- `genai.recipe.yml` JSON Schema (`schemas/genai.recipe.schema.json`)
- `@genai/core` package: recipe loader, Skill generator, input.schema.json generator, safety checker
- `@genai/cli` package: `genai init / new / compile / validate / doctor`
- Skill / Recipe Handlebars templates
- Example: `proposal-review`
- README (en / ja), CLEANROOM, SECURITY, CONTRIBUTING

### Added — v0.2 (harness layer)

- `.claude/hooks/` skeleton: pre-bash guard, post-write validate, stop context saver, pre-compact handoff
- Three-layer eval (static / contract / qualitative — qualitative is structure-based for MVP)
- `genai test` command
- Examples: `contract-review-lite`, `meeting-to-actions`
- Self-skills: `genai-new`, `genai-compile`, `genai-validate`
- Subagents: `genai-architect`, `genai-security-reviewer`

### Not yet (deferred)

- v0.3: Plugin marketplace packaging, full subagent set, genai-pack
- v0.4: Importers (prompt / README / OpenAPI / workflow / script)
- v1.0: Skill catalog, eval leaderboard, vector-DB local-rag
