# Photo Gallery App (Ionic + Capacitor)

Aplicación móvil y web multiplataforma desarrollada con **Ionic**, **Angular** y **Capacitor**, creada paso a paso para aprender el flujo de desarrollo nativo y web.

---

## Características

- **Cámara nativa y web:** Captura imágenes utilizando la cámara del dispositivo o el navegador.
- **Sistema de archivos:** Almacenamiento seguro de las fotos utilizando `@capacitor/filesystem`.
- **Persistencia de datos:** Guardado y recuperación del listado de imágenes con `@ionic/storage-preferences`.
- **Soportes multiplataforma:** Configurada y probada para Web, iOS y Android.

---

## Tecnologías Utilizadas

- [Ionic Framework](https://ionicframework.com/) (Componentes UI / Signals)
- [Angular](https://angular.dev/) (Lógica y TypeScript)
- [Capacitor](https://capacitorjs.com/) (Puente nativo para iOS y Android)
- `@capacitor/camera`
- `@capacitor/filesystem`
- `@capacitor/preferences`

---

## Guía Rápida de Comandos

Cada vez que modifiques el código y quieras pasarlo al entorno nativo:

1. **Compilar la aplicación web:**
   ```bash
   ionic build
   ```
2. **Actualizar los proyectos nativos:**
   ```bash
   ionic cap copy
   ```
3. **Ejecutar en dispositivo:**
   ```bash
   ionic cap open ios / android
   ```

---
## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

