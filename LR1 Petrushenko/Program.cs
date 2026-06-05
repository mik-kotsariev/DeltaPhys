using System;
using System.Security.Cryptography;

public static class VerificationHelper
{
    public static string GenerateCode()
    {
        return RandomNumberGenerator.GetInt32(1000, 10000).ToString();
    }

    public static bool Verify(string inputCode, string expectedCode)
    {
        if (string.IsNullOrWhiteSpace(inputCode) || string.IsNullOrWhiteSpace(expectedCode))
        {
            return false;
        }
        return inputCode == expectedCode;
    }
}

class Program
{
    static void Main()
    {
        string expectedCode = VerificationHelper.GenerateCode();
        
        Console.WriteLine($"[Системное сообщение] Отправлен 4-значный код: {expectedCode}");
        Console.WriteLine(new string('-', 30));
        Console.Write("Введите код подтверждения: ");
        
        string userInput = expectedCode; 
        Console.WriteLine(userInput);

        if (VerificationHelper.Verify(userInput, expectedCode))
        {
            Console.WriteLine("✅ Доступ разрешен!");
        }
        else
        {
            Console.WriteLine("❌ Неверный код.");
        }
    }
}