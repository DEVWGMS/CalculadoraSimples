
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Hello World!");

app.MapGet("/api/calculadora/somar", (double a, double b) =>
{
    return a + b;
});

app.MapGet("/api/calculadora/subtrair", (double a, double b) =>
{
    return a - b;
});

app.MapGet("/api/calculadora/multiplicar", (double a, double b) =>
{
    return a * b;
});

app.Run();
