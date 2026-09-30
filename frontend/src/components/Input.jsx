export default function Input({
    label,
    icon,
    errorMessage,
    id,
    className = "",
    ...props
}) {
    return (
        <div className="flex flex-col gap-2 w-full">
            {label && (
                <label htmlFor={id} className="text-xs text-on-surface font-semibold uppercase tracking-wider">
                    {label}
                </label>
            )}

            <div className="relative flex items-center">
                {icon && (
                    <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                        {icon}
                    </span>
                )}

                <input
                    id={id}
                    {...props}
                    className={`w-full h-11 pr-3 rounded-xl bg-white text-slate-800 text-sm placeholder:text-slate-400 outline-none transition-all ${icon ? "pl-11" : "pl-3.5"
                        } ${errorMessage
                            ? "border border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                            : "border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary"
                        } ${className}`}
                />
            </div>

            {errorMessage && (
                <div className="flex items-center gap-1.5 text-rose-500 text-xs mt-1">
                    <span className="material-symbols-outlined text-[16px]">error</span>
                    <span>{errorMessage}</span>
                </div>
            )}
        </div>
    );
}
