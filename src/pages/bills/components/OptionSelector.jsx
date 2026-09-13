export default function OptionSelector({
    label,
    value,
    options,
    onChange,
}) {
    return (
        <fieldset className="flex flex-col gap-1.5">
            <legend className="text-xs text-on-surface font-semibold uppercase tracking-wider mb-1.5">
                {label}
            </legend>

            <div className="grid grid-cols-2 gap-2">
                {options.map((option) => {
                    const isSelected =
                        value === option.value;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                                onChange(option.value)
                            }
                            aria-pressed={isSelected}
                            className={`h-11 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${isSelected
                                ? "border-primary bg-primary/10 text-primary shadow-xs"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            {option.prefix && (
                                <span className="text-base leading-none font-bold">
                                    {option.prefix}
                                </span>
                            )}

                            <span>
                                {option.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </fieldset>
    );
}