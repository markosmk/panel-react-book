# Crear o Editar Reserva

Ayuda para crear o editar una reserva a las situaciones que pueden surgir.

## Idioma de una reserva

El sistema limita el idioma de todas las reservas en un horario específico basándose en la primera reserva que se realice. Así, una vez que se realice una reserva por ejemplo en español a las 11:00, todas las reservas a las 11:00 de ese mismo dia deben ser en español, independientemente del tour.

### Cambiar el idioma de una reserva

- Caso 1: Si en ese horario y dia hay solo una reserva, se puede cambiar el idioma de la reserva a cualquiera disponible.
- Caso 2: Si hay mas de una reserva en ese horario y dia (en diferentes tours), y el idioma esta en español (debido a como funciona ahora el sistema), y se desea cambiar por ejemplo a ingles, no se podra realizar el cambio.
  - Si aun asi se quiere cambiar el idioma por x motivo, se puede cambiar el estado de la reserva a `Cancelada` y ahi se puede editar la reserva eligiendo el idioma deseado, porque funciona esto?, porque en base de datos se hacen las comprobaciones con estados `pendiente` y `confirmada`, esto da mas flexibilidad al sistema.
