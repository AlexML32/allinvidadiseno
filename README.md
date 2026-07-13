# 🌿 ALLINVIDA SALUD — Sistema Web de Compra y Venta

Sistema web completo para la tienda naturista **ALLINVIDA SALUD**, con gestión de inventario, pedidos y ventas por roles (Administrador, Cliente y Repartidor).

---

## 🏗️ Estructura del Proyecto

```
allinvida-salud/
├── backend/        # FastAPI + Clean Architecture + PostgreSQL
├── frontend/       # React 18 + TypeScript + Vite + TailwindCSS
├── schema.sql      # Script SQL de referencia
└── README.md
```

---

## ⚙️ Requisitos Previos

- **Python 3.12+** con pip
- **Node.js 18+** con npm  
- **PostgreSQL 15+** corriendo localmente

---

## 🔧 Instalación y Puesta en Marcha

### 1. Base de Datos

Crea la base de datos en PostgreSQL:

```sql
CREATE DATABASE allinvida_salud;
```

### 2. Backend (FastAPI)

```bash
cd allinvida-salud/backend

# Crear y activar entorno virtual
python -m venv venv

# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
copy .env.example .env
# Edita .env con tu DATABASE_URL y JWT_SECRET

# Ejecutar migraciones de Alembic
alembic upgrade head

# Poblar la base de datos (admin semilla + productos de ejemplo)
python -m app.infrastructure.database.seed

# Iniciar el servidor
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

La API estará disponible en: http://localhost:8000  
Documentación Swagger: http://localhost:8000/docs

### 3. Frontend (React + Vite)

```bash
cd allinvida-salud/frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
copy .env.example .env

# Iniciar en modo desarrollo
npm run dev
```

La aplicación estará disponible en: http://localhost:5173

---

## 👤 Usuarios Semilla

| Rol | Correo | Contraseña |
|---|---|---|
| **Administrador** | admin@allinvida.com | Admin123! |

> El admin puede crear usuarios Repartidor y otros Administradores desde el panel de gestión.

---

## 🌐 Exposición con ngrok (acceso público)

1. Instala ngrok: https://ngrok.com/download
2. Expón el backend: `ngrok http 8000`
3. Copia la URL generada (ej: `https://xxxx.ngrok.io`)
4. Agrega esa URL a `ALLOWED_ORIGINS` en `backend/.env`
5. Actualiza `VITE_API_BASE_URL` en `frontend/.env` con la URL de ngrok
6. Reinicia ambos servidores

---

## 🔑 Roles y Permisos

| Rol | Acceso |
|---|---|
| **ADMIN** | Todo: inventario, usuarios, pedidos, ventas, reportes |
| **CLIENT** | Catálogo, carrito, sus propios pedidos |
| **DELIVERY** | Solo pedidos PENDING, confirmar entrega y pago |

---

## 📡 API Endpoints Principales

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/v1/auth/register` | Registro de cliente |
| POST | `/api/v1/auth/login` | Login (devuelve JWT) |
| GET | `/api/v1/products` | Catálogo de productos |
| POST | `/api/v1/orders` | Confirmar pedido |
| PATCH | `/api/v1/orders/{id}/confirm-delivery` | Confirmar entrega (Repartidor) |
| GET | `/api/v1/reports/sales-summary` | Reporte de ventas (Admin) |

Documentación completa: http://localhost:8000/docs

---

## 🎨 Tecnologías

**Backend:** Python 3.12 · FastAPI · SQLAlchemy 2.0 · Alembic · PostgreSQL · JWT · bcrypt  
**Frontend:** React 18 · TypeScript · Vite · TailwindCSS · Zustand · Axios · React Router  
**Arquitectura:** Clean Architecture (Domain → Application → Infrastructure → Presentation)
