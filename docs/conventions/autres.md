# Autres conventions pour le code

## Taille des lignes

Les lignes sont par défaut de 80 colonnes si Prettier est utilisé. C’est un héritage des consoles qui ne pouvaient afficher que 80 colonnes. Cela fait un peu court avec les écrans dont nous disposons aujourd’hui.

Les lignes de plus de 120 colonnes doivent être évitées, et les lignes de plus de 140 colonnes **proscrites**.

Pour VS Code, le paramètre suivant permet de montrer ces deux limites dans la vue éditeur :

```json
  "editor.rulers": [120, 140],
```

## Taille des fonctions/méthodes

Une fonction (ou méthode) ne devrait pas faire plus de 20 lignes.

## Une fonction - un but

Une fonction ne doit faire qu’une chose, et le faire bien, et idéalement être testée.

Le nom de la fonction doit être explicite quant à son raison d’être.
