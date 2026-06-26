import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")  # e.g., Gmail App Password
SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USERNAME)

def send_otp_email(to_email: str, otp: str) -> bool:
    """
    Sends an OTP verification email to the user.
    If SMTP credentials are not set, it prints a message to the console.
    """
    if not SMTP_USERNAME or not SMTP_PASSWORD:
        print(f"\n[WARNING] SMTP not configured. OTP not sent to email. Printed to logs instead.")
        print(f"==================================================")
        print(f"MOCK EMAIL SENT TO: {to_email}")
        print(f"SUBJECT: Login Verification Code")
        print(f"BODY: Your verification code is {otp}. Valid for 5 minutes.")
        print(f"==================================================\n")
        return False

    try:
        # Create message container
        msg = MIMEMultipart()
        msg["From"] = SMTP_FROM
        msg["To"] = to_email
        msg["Subject"] = f"Your Login Verification OTP: {otp}"

        # Write message body
        body = f"""Hello,

Your verification code is: {otp}

It is valid for 5 minutes. Please use this to verify your login.

If you did not request this code, please ignore this email.

Best regards,
User Registration API
"""
        msg.attach(MIMEText(body, "plain"))

        # Setup server connection
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        server.starttls()  # Upgrade connection to secure encrypted TLS
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.sendmail(SMTP_FROM, to_email, msg.as_string())
        server.quit()
        print(f"Successfully sent OTP email to {to_email}")
        return True
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")
        return False
