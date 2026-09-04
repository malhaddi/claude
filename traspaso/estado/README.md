# estado/

Un fichero por agente. **Nunca** un fichero compartido: dos agentes escribiendo
en el mismo sitio chocan justo cuando más falta hace que no choquen.

Nombre del fichero: el de tu rama, con `/` cambiado por `-`.
Rama `claude/sectores-abc` → `estado/claude-sectores-abc.md`.

Al empezar una sesión: lee **todos** los ficheros de esta carpeta. Ahí está lo
que ha hecho el otro agente y lo que ha decidido.

Plantilla:

```markdown
# claude/<rama>

Última actualización: <fecha>

## Ahora mismo
Qué estoy tocando. Si es una carpeta que no es mía, se dice aquí.

## Decidido
- <decisión> — <por qué>

## Para el otro agente
Lo que le ahorra trabajo o le evita repetir algo que ya salió mal.

## Terminado
- <lo hecho> (<commit>)
```
