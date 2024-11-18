## BACKEND

Simple Express js CRUD API

### Aspectos Técnicos

- _Stack:_ Node.js, Express.js, PostgreSQL, Cloudinary.

- _Autenticación:_ Login con Google inicial, luego se utiiza JSON Web Tokens para autenticación y autorización, según lo visto en clase.

- _Middlewares:_ Se utilizan middlewares para verificar los tokens de acceso y para validar datos en las rutas.

- _Rutas, Controladores y Servicios:_ Las rutas están organizadas en diferentes archivos y corresponden a las funcionalidades específicas del sistema.

- _Configuración del Entorno:_ Se utiliza el archivo `config.js` para almacenar y exportar variables de entorno, como claves secretas y configuraciones de la base de datos

### Variables de Entorno

Utilizar operador de fusión nula para definir valores locales de desarrollo en el archivo `config.js`

- `PORT`: Puerto de escucha de la aplicación.
- `JWT_SECRET_KEY`: Esta clave secreta se utiliza para firmar los tokens JWT de autenticación.
- `PG_DATABASE`: Nombre de la base de datos de PostgreSQL.
- `PG_HOST`: Host donde se encuentra la base de datos de PostgreSQL.
- `PG_PASSWORD`: Contraseña para acceder a la base de datos de PostgreSQL.
- `PG_PORT`: Puerto utilizado para la conexión a la base de datos de PostgreSQL.
- `PG_USER`: Usuario para conectarse a la base de datos de PostgreSQL.
- `CLOUDINARY_API_SECRET`: Clave secreta proporcionada por Cloudinary para acceder a sus servicios. Mantén esta clave segura y no la compartas.
- `CLOUDINARY_API_KEY`: Clave de API proporcionada por Cloudinary para autenticar tus solicitudes.
- `CLOUDINARY_CLOUD_NAME`: Nombre de tu cuenta de Cloudinary. Esto es necesario para identificar tu espacio en la nube de Cloudinary.
