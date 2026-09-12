export default function InputRupiah({
    label,
    id,
    value,
    onChange,
    placeholder = "0"
}) {
    const handleChange = (e) => {
        const rawDigits =
            e.target.value.replace(/\D/g, "");

        onChange(
            rawDigits
                ? Number(rawDigits)
                : ""
        );
    };

    return (
        <div className="flex-1 flex flex-col gap-1.5">
            {label && (
                <label
                    htmlFor={id}
                    className="text-xs text-on-surface font-semibold uppercase tracking-wider"
                >
                    {label}
                </label>
            )}

            <div className="relative flex items-center h-11">
                <span className="absolute left-3.5 text-xs font-bold text-slate-400 pointer-events-none">
                    Rp
                </span>

                <input
                    type="text"
                    inputMode="numeric"
                    id={id}
                    placeholder={placeholder}
                    autoComplete="off"
                    value={value ? Number(value).toLocaleString("id-ID") : ""}
                    onChange={handleChange}
                    className="w-full h-full pl-9 pr-3.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
            </div>
        </div>
    )
}