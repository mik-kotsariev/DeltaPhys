// Функція для обчислення площі трикутника за трьома сторонами (формула Герона)

public static double GetTriangleArea(double a, double b, double c)
{
    double p = (a + b + c) / 2;
    return Math.Sqrt(p * (p - a) * (p - b) * (p - c));
}