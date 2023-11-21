from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
from email.mime.text import MIMEText
import smtplib
from .config import settings

def hash(password: str) -> str:
    return pwd_context.hash(password)


def verify(plain_password, hashed_password) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def send_reset_email(email, token):
    subject = "Password Reset Request"
    body = (
        f"Click the following link to reset your password: "
        f"http://localhost:3000/resetpassword/{token}\n\n"
        f"The link is valid for only 15 minutes. "
        f"After that, you need to generate another link."
    )

    # Construct the email message
    message = MIMEText(body)
    message["Subject"] = subject
    message["From"] = settings.email_address
    message["To"] = email

    # Connect to the SMTP server (in this case, Gmail's SMTP server)
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(settings.email_address, settings.email_password)

        # Send the email
        server.sendmail(settings.email_address, [email], message.as_string())