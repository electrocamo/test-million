// ==============================================================================
// Ejemplo: Proteger Swagger con Autenticación Básica en Producción
// ==============================================================================
// Agregar en Program.cs para proteger Swagger en producción

// Swagger con autenticación básica (solo en producción)
if (app.Environment.IsProduction())
{
    app.Use(async (context, next) =>
    {
        // Solo aplicar autenticación a rutas de Swagger
        if (context.Request.Path.StartsWithSegments("/swagger"))
        {
            // Verificar header de autorización
            string authHeader = context.Request.Headers["Authorization"];
            
            if (authHeader != null && authHeader.StartsWith("Basic "))
            {
                // Decodificar credenciales
                var encodedUsernamePassword = authHeader.Substring("Basic ".Length).Trim();
                var encoding = System.Text.Encoding.GetEncoding("iso-8859-1");
                var usernamePassword = encoding.GetString(Convert.FromBase64String(encodedUsernamePassword));
                var separatorIndex = usernamePassword.IndexOf(':');
                
                var username = usernamePassword.Substring(0, separatorIndex);
                var password = usernamePassword.Substring(separatorIndex + 1);
                
                // Verificar credenciales (cambiar por tus credenciales)
                if (username == "admin" && password == "tu-password-seguro")
                {
                    await next();
                    return;
                }
            }
            
            // Si no está autenticado, pedir credenciales
            context.Response.Headers["WWW-Authenticate"] = "Basic";
            context.Response.StatusCode = 401;
            return;
        }
        
        await next();
    });
}

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Real Estate API v1");
    c.RoutePrefix = "swagger";
});

// ==============================================================================
// Nota: Para mayor seguridad, usa un sistema de autenticación completo
// como JWT tokens o integración con Identity Server
// ==============================================================================

