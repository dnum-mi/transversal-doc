# Transversal Doc

Shared documentation of the Fabrique Numérique projects (conventions, stack, CI/CD, recipes), and the agent skills that help developers follow it.

## Language

**Reference page**:
A page of the published documentation that states a rule. It is the only place where the rule's text lives.
_Avoid_: Source doc, rule text

**Key points**:
The short, visible block of a reference page that lists its essential rules. It is the only part of a reference page that a skill reproduces, and it is generated from the page, never written by hand in the skill.
_Avoid_: Summary, checklist, TL;DR

**Skill**:
A directory with a `SKILL.md` that follows the Agent Skills specification and that a coding agent loads on demand.
_Avoid_: Prompt, instruction file

**Domain skill**:
A skill that covers one domain of the documentation (for example naming or CI/CD) by pointing the agent to the right reference pages.
_Avoid_: Topic skill, per-page skill

**Entry skill**:
The skill that tells the agent which domain skill applies to the task at hand.
_Avoid_: Router, index skill

**Plugin**:
The wrapper through which a tool installs the skills: a Claude plugin installed from a marketplace, or an opencode plugin declared in its configuration.
_Avoid_: Package, extension

**Marketplace**:
The catalogue from which Claude Code lists and installs plugins.
_Avoid_: Registry, store
