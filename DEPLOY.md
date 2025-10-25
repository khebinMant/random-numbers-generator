# Guía de Despliegue en Netlify

## ✅ Configuración Completada

El proyecto ya está configurado y listo para desplegarse en Netlify con las siguientes configuraciones:

### Archivos de Configuración:
- ✅ `netlify.toml` - Configuración de build y deploy
- ✅ `next.config.js` - Configurado para exportación estática
- ✅ `.gitignore` - Archivos excluidos del repositorio

### Configuración Actual:

**netlify.toml:**
```toml
[build]
  publish = "out"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**next.config.js:**
```javascript
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}
```

## 🚀 Pasos para Desplegar en Netlify

### Método 1: Desde el Dashboard de Netlify

1. **Ir a [https://netlify.com](https://netlify.com)** e iniciar sesión
2. **Hacer clic en "Add new site"** → "Import an existing project"
3. **Conectar con GitHub** y seleccionar el repositorio `random-numbers-generator`
4. **Netlify detectará automáticamente** la configuración desde `netlify.toml`
5. **Configuración automática será:**
   - Build command: `npm run build`
   - Publish directory: `out`
   - Node version: 18
4. **Hacer clic en "Deploy site"**

### Método 2: Netlify CLI (Opcional)

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Hacer login
netlify login

# Desplegar desde el directorio del proyecto
netlify deploy --prod
```

## 🔧 Resolución de Problemas

### Error: `next export` no encontrado
✅ **SOLUCIONADO** - Ya no usamos `next export`, ahora usamos `output: 'export'` en `next.config.js`

### Error: Archivos no encontrados
- Verificar que `npm run build` genere la carpeta `out/`
- Confirmar que `netlify.toml` tenga `publish = "out"`

### Error: Imágenes no cargan
✅ **SOLUCIONADO** - Configurado `images: { unoptimized: true }` en `next.config.js`

## 📊 Estado del Proyecto

- ✅ Código fuente completo
- ✅ Build local exitoso
- ✅ Configuración de Netlify optimizada
- ✅ Repositorio actualizado en GitHub
- ✅ Listo para despliegue

## 🌐 Después del Despliegue

Una vez desplegado, Netlify te proporcionará:
- **URL única** para tu aplicación (ej: `https://random-app-123.netlify.app`)
- **Dominio personalizable** si lo deseas
- **Despliegues automáticos** cada vez que hagas push a la rama main

## 📝 Notas Importantes

- **Node.js 18** está configurado como versión para el build
- **Exportación estática** habilitada para mejor rendimiento
- **Redirects configurados** para SPA routing
- **No requiere variables de entorno**