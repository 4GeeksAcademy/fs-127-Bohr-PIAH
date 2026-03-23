from datetime import datetime, timezone


def parse_dt_utc(value, field_name):
    if isinstance(value, datetime):
        dt = value
    elif isinstance(value, str):
        s = value.strip()
        if s.endswith("Z"):
            s = s[:-1] + "+00:00"
        try:
            dt = datetime.fromisoformat(s)
        except ValueError:
            raise ValueError(f"{field_name} must be ISO 8601 datetime")
    else:
        raise ValueError(f"{field_name} must be datetime or ISO string")

    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    else:
        dt = dt.astimezone(timezone.utc)

    return dt
