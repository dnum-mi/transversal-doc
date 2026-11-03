# Skills link to the documentation instead of copying it

Agent skills that help developers follow the conventions live in this repository, not in `starter-kit-opencode`, whose skills copy large parts of the documentation and drift from it. A skill only routes to a chapter of a reference page (site URL with an anchor) and reproduces that page's key points, which are extracted from the page by a script and checked in CI. The skills are written in English, the key points stay quoted in French.

## Considered Options

- Moving the work into `starter-kit-opencode`: rejected, the checks that keep skills and documentation in sync need to live next to the documentation.
- Hand-written checklists in each skill: rejected, they diverge from the documentation silently.
