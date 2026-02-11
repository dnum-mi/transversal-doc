# Ce document

## Ce qu’il est

La présente documentation rassemble les conventions et bonnes pratiques à respecter pour les projets de la Fabrique Numérique, qu'ils soient en TypeScript/JavaScript, Python ou d'autres technologies. Elle contient aussi des "recettes" réutilisables (selon la technologie utilisée) dans les projets.

## Pour qui il est

Elle doit être lue par les développeurs de ces projets.

Cette documentation est vivante et les retours des développeurs seront appréciés. Même si les éventuelles critiques et nouvelles propositions ne seront pas toujours retenues, elles seront écoutées, et les refus seront argumentés (comme les propositions elles-mêmes).

## Pourquoi il est

Il n'existait pas jusqu'à récemment de conventions communes pour les projets de la Fabrique Numérique : certains utilisent JavaScript et d'autres TypeScript, certains Python et d'autres Node.js, certains utilisent MongoDB, d'autres PostgreSQL, certains utilisent Express, d'autres Fastify, NestJS ou FastAPI...

D'autre part, certains projets ont été commencés par des prestataires qui travaillent parfois seuls sur des technologies qu'ils ne maîtrisent pas, et cela engendre de la dette technique qui aurait pu être évitée (au moins en partie) s'ils avaient un document avec certains points à respecter.

## Pour quoi il est

Ce document a pour but :

- d’éviter de perdre du temps sur l’établissement de conventions pour chaque projet : elles sont déjà là ;
- d’éviter de se retrouver avec des projets qui ne respectent pas les conventions du web (un certain nombre seront rappelées dans ce document) ;
- d’avoir une cohérence dans les projets, que ce soit au niveau des stacks techniques ou des architectures et d’autres choix (nommage, lint, formattage...) ;
- de fixer un standard pour les prestataires : le Ministère de l’Intérieur doit d’une part pouvoir reprendre les projets qui seraient en grande partie (ou totalement) développés par des prestataires, et d’autre part pouvoir facilement changer les membres de l’équipe (interne ou externe) d’un projet à un autre (même si ce n’est pas souhaitable) en cas de modification de planning ou de départ ou d’absence (temporaire ou prolongée)... et cela sera d’autant moins pénible et couteux si les projets respectent les mêmes conventions.
