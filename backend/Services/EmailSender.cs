using Microsoft.AspNetCore.Identity;
using System.Net;
using System.Net.Mail;
using backend.Models;

namespace backend.Services;

public class EmailSender : IEmailSender<ApplicationUser>
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailSender> _logger;

    public EmailSender(IConfiguration configuration, ILogger<EmailSender> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public Task SendConfirmationLinkAsync(ApplicationUser user, string email, string confirmationLink)
    {
        return SendEmailAsync(email, "تأكيد بريدك الإلكتروني", $"لتأكيد بريدك الإلكتروني يرجى <a href='{confirmationLink}'>الضغط هنا</a>.");
    }

    public Task SendPasswordResetCodeAsync(ApplicationUser user, string email, string resetCode)
    {
        return SendEmailAsync(email, "رمز استعادة كلمة المرور", $"يرجى استخدام الرمز التالي لاستعادة كلمة المرور: <b>{resetCode}</b>");
    }

    public Task SendPasswordResetLinkAsync(ApplicationUser user, string email, string resetLink)
    {
        return SendEmailAsync(email, "استعادة كلمة المرور", $"لإعادة تعيين كلمة المرور الخاصة بك، يرجى <a href='{resetLink}'>الضغط هنا</a>.");
    }

    private async Task SendEmailAsync(string email, string subject, string htmlMessage)
    {
        try
        {
            var host = _configuration["SmtpSettings:Host"] ?? "smtp.gmail.com";
            var port = int.Parse(_configuration["SmtpSettings:Port"] ?? "587");
            var enableSsl = bool.Parse(_configuration["SmtpSettings:EnableSsl"] ?? "true");
            var userName = _configuration["SmtpSettings:UserName"];
            var password = _configuration["SmtpSettings:Password"];

            if (string.IsNullOrEmpty(userName) || string.IsNullOrEmpty(password))
            {
                _logger.LogWarning("SMTP settings are missing. Email not sent.");
                return;
            }

            using var client = new SmtpClient(host, port)
            {
                Credentials = new NetworkCredential(userName, password),
                EnableSsl = enableSsl
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(userName, "نظام إدارة مزرعة الطيور"),
                Subject = subject,
                Body = htmlMessage,
                IsBodyHtml = true
            };
            mailMessage.To.Add(email);

            await client.SendMailAsync(mailMessage);
            _logger.LogInformation("Email sent to {email}", email);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email");
        }
    }
}
