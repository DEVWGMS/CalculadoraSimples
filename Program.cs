
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "#");

app.MapGet("/api/calculadora/somar", (double a, double b) =>
{
    double resultado = a + b;
    return resultado;
});

app.Run();
