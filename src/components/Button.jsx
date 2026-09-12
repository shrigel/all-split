const VARIANTS = {
    primary: "bg-primary hover:bg-primary-hover text-white shadow-xs",
    tonal: "bg-primary/10 hover:bg-primary/20 text-primary",
    danger: "bg-rose-50 hover:bg-rose-100 text-rose-600",
    ghost: "text-slate-400 hover:text-slate-600",
};

export default function Button({
    children,
    variant = "primary",
    iconStart,
    iconEnd,
    className = "",
    type = "button",
    ...props
}) {
    return (
        <button
            type={type}
            {...props}
            className={`flex items-center justify-center gap-2 h-11 rounded-xl font-semibold text-sm transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
                ${VARIANTS[variant] || VARIANTS.primary} ${className}`}
        >
            {iconStart && <span className="material-symbols-outlined text-[18px]">{iconStart}</span>}

            {children}

            {iconEnd && <span className="material-symbols-outlined text-[18px]">{iconEnd}</span>}
        </button>
    );
}
