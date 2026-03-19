interface SpeakButtonProps {
  text: string;
  className?: string;
}

export function SpeakButton({ text, className = '' }: SpeakButtonProps) {
  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title="Hear pronunciation"
      className={`p-1 flex items-center justify-center text-gray-300 hover:text-indigo-500 transition-colors shrink-0 ${className}`}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5L6 9H2v6h4l5 4V5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.54 8.46a5 5 0 010 7.07" />
      </svg>
    </button>
  );
}
