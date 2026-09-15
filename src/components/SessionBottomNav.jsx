export default function SessionBottomNav({
    activePage = "participants",
    canOpenBills,
    onParticipantsClick,
    onBillsClick
}) {
    return (
        <nav aria-label="Navigasi sesi" className="fixed bottom-0 inset-x-0 z-40 bg-surface-container/90 rounded-t-xl border-t border-slate-200/60 shadow-[0_-2px_10px_rgba(0,0,0,0.03)] pb-[env(safe-area-inset-bottom)] w-full max-w-app mx-auto">
            <div className="grid grid-cols-2 h-16">
                {/* Tab 1: Peserta */}
                <button
                    type="button"
                    onClick={onParticipantsClick}
                    aria-current={
                        activePage === "participants"
                            ? "page"
                            : undefined
                    }
                    className={`flex flex-col items-center justify-center gap-1 transition-colors text-primary ${activePage === "participants"
                        ? "font-semibold bg-white/90 rounded-t-xl"
                        : "hover:text-primary-hover font-medium"
                        }`}
                >
                    <span className="material-symbols-outlined text-[22px]">
                        group
                    </span>
                    <span className="text-xs">
                        Peserta
                    </span>
                </button>
                {/* Tab 2: Tagihan */}
                <button
                    type="button"
                    disabled={!canOpenBills}
                    onClick={onBillsClick}
                    aria-current={
                        activePage === "bills"
                            ? "page"
                            : undefined
                    }
                    className={`flex flex-col items-center justify-center gap-1 transition-colors text-primary ${activePage === "bills"
                        ? "font-semibold bg-white/90 rounded-t-xl"
                        : "hover:text-primary-hover font-medium"
                        } disabled:opacity-25 disabled:cursor-not-allowed disabled:active:scale-100`}
                >
                    <span className="material-symbols-outlined text-[22px]">
                        receipt_long
                    </span>
                    <span className="text-xs">
                        Tagihan
                    </span>
                </button>
            </div>
        </nav>
    );
}
