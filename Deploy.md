# Antes de actualizar

- 0. Chekear el `.env` o `.env.production` que este correcto el `VITE_API_URL` apuntando a la api
- 1. Revisar el archivo `src/constants/config.ts` y modificar la version `platformVersion`,
- 2. Actualizar la lista `changelog.json` con los cambios y agregar esa version a la lista en `public/assets/changelog.json`
- 3. revisar y corregir errores con el comando `pn lint` o `pnpm run lint`
- 4. generar la build `pnpm run build`
- 5. ejecutar `pnpm run preview` para probar la build localmente, si todo esta ok, subir archivos.
- 6. hacer `backup` de los archivos existentes, subir nuevos archivos.
