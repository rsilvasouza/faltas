interface NoticeProps {
  message: string;
  tone?: "error" | "success" | "info";
}

export function Notice({ message, tone = "info" }: NoticeProps) {
  return <div className={`notice ${tone}`}>{message}</div>;
}
