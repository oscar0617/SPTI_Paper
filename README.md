# Seguridad WebSockets y APIs en Aplicaciones Web
En este proyecto vamos a abordar la seguridad de una aplicación de chats construida con JAVA 17 y React. Haciendo uso de SpringBoot y un servidor de WebSockets Socket IO.

# Vulnerabilidades y Mitigaciones

En nuestro proyecto inicialmente se tenian las siguientes vulnerabilidades:

 - EndPoints sin protección de autenticación.
 - Suceptible a DoS.
 - Riesgos de bloqueo en el WebSockets (inundación).
 - Sin autenticación de usuarios.

## EndPoints

Para la protección de los EndPoints de nuestra API Rest, decidimos usar SpringBoot Security en su versión 6. La cual nos permite proteger nuestros Endpoints vulnerables de posibles ataques de integridad de la aplicación junto a la disponibilidad, eliminando las salas de la misma.

## DoS

Para cubrir el ataque de denegación de servicio (DoS), desplegamos nuestra aplicación en instancias EC2 de AWS, donde tenemos la posibilidad de denegar el acceso a IPs que pueden ser de procedencia sospechosa. Manteniendo asi, la disponibilidad de nuestro servicio de chat.

## Bloqueo WebSocket

Para esta vulnerabilidad la aplicación automaticamente bloquea el envio de mensajes automatizados, evitando que el socket colapse y los usuarios se vean afectados en la funcionalidad de la aplicación.

## Autenticación

Nuestra aplicación tiene el rol de Administrador, el cual es el unico usuario que tiene la posibilidad de eliminar una sala utilizando sus credenciales de acceso. Esto se logró gracias al uso de SpringBoot Security 6.


# Analisis SAST 

Para garantizar el cubrimiento de posibles vulnerabilidades en el código de la aplicación, corrimos un analisis SAST utilizando la herramienta gratuita de SNYK, en donde podemos ver el siguiente antes y después:
*Antes:*
![image](https://github.com/user-attachments/assets/41ff33c0-7af5-4f2d-bc2e-f4b3c2004177)
*Después:*
![image](https://github.com/user-attachments/assets/1e963546-b889-4c5d-816b-0f1747c517a2)

Podemos observar una reducción en las vulnerabilidades encontradas por el escaner.
# Demostración ataques

Puede observar el siguiente video para ver el detalle de los ejercicios realizados:


# Conclusiones
-   **Protección Proactiva:** La implementación de **Spring Boot Security 6** en los endpoints de la API REST asegura una capa esencial de autenticación y autorización, reduciendo significativamente los riesgos asociados con accesos no autorizados y ataques dirigidos a la integridad de los datos.
    
-   **Mitigación de Ataques DoS:** Al desplegar la aplicación en instancias de AWS EC2 y utilizar reglas de firewall para restringir IPs sospechosas, se logró mantener la disponibilidad del servicio frente a posibles intentos de denegación de servicio.
    
-   **Robustez en WebSockets:** La protección contra mensajes automatizados o inundaciones en los canales de WebSocket garantiza una experiencia fluida para los usuarios, evitando bloqueos y garantizando la estabilidad de la aplicación.
    
-   **Autenticación de Roles Críticos:** Al restringir las acciones administrativas, como la eliminación de salas, exclusivamente al rol de administrador autenticado, se aseguró un control más granular sobre operaciones sensibles.
    
-   **Fortalecimiento del Código:** El análisis SAST realizado con **Snyk** evidenció mejoras notables en la seguridad del código, logrando una reducción efectiva en el número de vulnerabilidades detectadas, lo que aumenta la confianza en la robustez del sistema.
    
-   **Enfoque Integral de Seguridad:** Este proyecto ejemplifica cómo la combinación de medidas preventivas (como el análisis de código estático) y reactivas (como la detección de actividades sospechosas) puede abordar tanto vulnerabilidades presentes como amenazas dinámicas en tiempo real.

# Herramientas 

 - Java
 - Maven
 - SpringBoot
 - React
 - AWS
 - Snyk
# Autores 

 - Johan Alejandro Estrada Pastran
 - Jhon Sebastian Sosa Muñoz
 - Oscar Santiago Lesmes Parra
