import { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectdRoute";
import ConfirmationModal from "./components/ConfirmationModal";
import Home from "./feature/session/Home";
import Participants from "./feature/session/Participants";
import Header from "./components/Header";
import Bills from "./feature/session/Bill/Bills";
import BillForm from "./feature/session/Bill/BillForm";
import Result from "./feature/session/Result";
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from "./utils/sessionStorage";

function App() {
	const navigate = useNavigate();
	const [isFormDirty, setIsFormDirty] = useState(false);
	const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

	const handleLogoClick = () => {
		if (isFormDirty) {
			setIsLeaveModalOpen(true);
		} else {
			if (location.pathname.startsWith('/result/')) {
				setCurrentSession({ name: '', participants: [], bills: [] });
			}
			navigate('/');
		}
	};

	const handleConfirmLeave = () => {
		setIsLeaveModalOpen(false);
		setIsFormDirty(false);
		navigate('/');
	};

	const [currentSession, setCurrentSession] = useState(() => loadFromStorage(STORAGE_KEYS.CURRENT_SESSION, INITIAL_SESSION));

	useEffect(() => {
		saveToStorage(STORAGE_KEYS.CURRENT_SESSION, currentSession);
	}, [currentSession]);

	const [savedSessions, setSavedSessions] = useState(() => loadFromStorage(STORAGE_KEYS.SAVED_SESSIONS, []));

	useEffect(() => {
		saveToStorage(STORAGE_KEYS.SAVED_SESSIONS, savedSessions);
	}, [savedSessions]);

	const handleResumeSession = () => {
		if (currentSession.participants.length >= 2) {
			navigate('/bills');
		} else {
			navigate('/participants');
		}
	};

	const handleDiscardSession = () => {
		setCurrentSession({ name: '', participants: [], bills: [] });
	};

	const handleStartSession = (name) => {
		setCurrentSession({
			name,
			participants: [],
			bills: []
		});

		navigate('/participants');
	}

	const handleAddParticipants = (name) => {
		const newParticipant = {
			id: 'p-' + Date.now(),
			name
		};

		setCurrentSession((prev) => ({
			...prev,
			participants: [...prev.participants, newParticipant],
		}));
	};

	const handleRemoveParticipant = (id) => {
		setCurrentSession((prev) => ({
			...prev,
			participants: prev.participants.filter((p) => p.id !== id),
		}));
	};

	const handleSaveBill = (bill) => {
		setCurrentSession((prev) => {
			const existingIndex = prev.bills.findIndex((b) => b.id === bill.id);

			if (existingIndex >= 0) {
				const updated = [...prev.bills];
				updated[existingIndex] = bill;

				return { ...prev, bills: updated };
			} else {
				return { ...prev, bills: [...prev.bills, bill] };
			}
		});
	};

	const handleDeleteBill = (billId) => {
		setCurrentSession((prev) => ({
			...prev,
			bills: prev.bills.filter((b) => b.id !== billId)
		}));
	};

	const handleCalculateSession = () => {
		const sessionId = currentSession.id || 'session-' + Date.now();
		const sessionToSave = {
			...currentSession,
			id: sessionId,
			createdAt: Date.now(),
			expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000)
		};

		setSavedSessions((prev) => {
			const existingIndex = prev.findIndex((s) => s.id === sessionToSave.id);
			if (existingIndex >= 0) {
				const updated = [...prev];
				updated[existingIndex] = sessionToSave;
				return updated;
			}
			return [sessionToSave, ...prev];
		});

		navigate(`/result/${sessionId}`);
	};

	const handleBackToHomeFromResult = () => {
		setCurrentSession({ name: '', participants: [], bills: [] });
		navigate('/');
	};

	const handleOpenSession = (sessionId) => {
		const session = savedSessions.find((s) => s.id === sessionId);

		if (session) {
			navigate(`/result/${sessionId}`);
		}
	}

	return (
		<div className="min-h-screen flex flex-col bg-surface text-on-surface">
			<Header onLogoClick={handleLogoClick} />

			<div className="flex-1 flex flex-col">
				<Routes>
					<Route path="*" element={<Navigate to="/" replace />} />

					<Route
						path="/"
						element={<Home
							onStartSession={handleStartSession}
							currentSession={currentSession}
							savedSessions={savedSessions}
							onOpenSession={handleOpenSession}
							onResumeSession={handleResumeSession}
							onDiscardSession={handleDiscardSession}
						/>}
					/>

					<Route
						path="/participants"
						element={
							<ProtectedRoute condition={Boolean(currentSession.name.trim())} redirectTo="/">
								<ProtectedRoute condition={Boolean(currentSession.bills.length === 0)} redirectTo="/bills">
									<Participants
										sessionName={currentSession.name}
										setSession
										participants={currentSession.participants}
										onAddParticipant={handleAddParticipants}
										onRemoveParticipant={handleRemoveParticipant}
										onDirtyChange={setIsFormDirty}
										onNext={() => navigate('/bills')}
										onBack={() => {
											setCurrentSession({ name: '', participants: [], bills: [] });
											navigate('/');
										}}
									/>
								</ProtectedRoute>
							</ProtectedRoute>
						}
					/>

					<Route
						path="/bills"
						element={
							<ProtectedRoute condition={currentSession.participants.length >= 2} redirectTo="/participants">
								<Bills
									session={currentSession}
									onAddBill={() => navigate('/bills/create')}
									onEditBill={(bill) => navigate(`/bills/edit/${bill.id}`)}
									onDeleteBill={handleDeleteBill}
									onCalculateSession={handleCalculateSession}
									onBack={() => {
										setCurrentSession(prev => ({ ...prev, bills: [] }));
										navigate('/participants');
									}}
								/>
							</ProtectedRoute>
						}
					/>

					<Route
						path="/bills/create"
						element={
							<ProtectedRoute condition={currentSession.participants.length >= 2} redirectTo="/participants">
								<BillForm
									participants={currentSession.participants}
									onDirtyChange={setIsFormDirty}
									onSaveBill={(newBill) => {
										handleSaveBill(newBill);
										navigate('/bills');
									}}
									onBack={() => navigate('/bills')}
								/>
							</ProtectedRoute>
						}
					/>

					<Route
						path="/bills/edit/:billId"
						element={
							<ProtectedRoute condition={currentSession.bills.length > 0} redirectTo="/bills">
								<BillForm
									participants={currentSession.participants}
									onDirtyChange={setIsFormDirty}
									bills={currentSession.bills}
									onSaveBill={(bill) => {
										handleSaveBill(bill);
										navigate('/bills');
									}}
									onBack={() => navigate('/bills')}
								/>
							</ProtectedRoute>
						}
					/>

					<Route
						path="/result/:sessionId"
						element={
							<Result
								savedSessions={savedSessions}
								onBackToHome={handleBackToHomeFromResult}
							/>
						}
					/>
				</Routes>
			</div>

			<ConfirmationModal
				isOpen={isLeaveModalOpen}
				onClose={() => setIsLeaveModalOpen(false)}
				onConfirm={handleConfirmLeave}
				confirmationMessage="Perubahan yang belum disimpan akan hilang jika Anda kembali ke Beranda. Apakah Anda yakin ingin melanjutkan?"
			/>
		</div>
	);
}

export default App;
