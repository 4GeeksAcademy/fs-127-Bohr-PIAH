import os
import resend


def send_task_assigned_email(user, task):
    if os.getenv("SEED_MODE"):
        return
    resend.api_key = os.getenv("RESEND_API_KEY")
    to_email = os.getenv("RESEND_TEST_EMAIL", user.email)
    deadline_str = task.deadline.strftime("%d/%m/%Y") if task.deadline else "No deadline set"
    resend.Emails.send({
        "from": "onboarding@resend.dev",
        "to": to_email,
        "subject": f"New task assigned: {task.name}",
        "html": f"""
            <h2>New Task Assigned</h2>
            <p>Hi {user.first_name},</p>
            <p>You have been assigned a new task:</p>
            <h3>{task.name}</h3>
            {f'<p>{task.task_description}</p>' if task.task_description else ''}
            <p><strong>Deadline:</strong> {deadline_str}</p>
            <p>Log in to Bohr PIAH to view the task details.</p>
        """
    })


def send_password_changed_email(user):
    resend.api_key = os.getenv("RESEND_API_KEY")
    to_email = os.getenv("RESEND_TEST_EMAIL", user.email)
    resend.Emails.send({
        "from": "onboarding@resend.dev",
        "to": to_email,
        "subject": "Password changed - Bohr PIAH",
        "html": f"""
            <h2>Password Changed</h2>
            <p>Hi {user.first_name},</p>
            <p>Your password has been successfully changed.</p>
            <p>If you did not make this change, please contact support immediately.</p>
        """
    })


def send_deadline_reminder_email(user, task):
    resend.api_key = os.getenv("RESEND_API_KEY")
    to_email = os.getenv("RESEND_TEST_EMAIL", user.email)
    deadline_str = task.deadline.strftime("%d/%m/%Y")
    resend.Emails.send({
        "from": "onboarding@resend.dev",
        "to": to_email,
        "subject": f"Reminder: '{task.name}' is due in 3 days",
        "html": f"""
            <h2>Task Deadline Reminder</h2>
            <p>Hi {user.first_name},</p>
            <p>Your task <strong>{task.name}</strong> is due in 3 days ({deadline_str}).</p>
            {f'<p>{task.task_description}</p>' if task.task_description else ''}
            <p>Log in to Bohr PIAH to update the task status.</p>
        """
    })
