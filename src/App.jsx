import { useState } from "react";
import {
	Route,
	Routes,
	Navigate,
	useNavigate
} from "react-router-dom";
import { useSessionManager } from "./hooks/useSessionManager";
import ProtectedRoute from "./components/ProtectedRoute";
import ConfirmationModal from "./components/ConfirmationModal";
import Header from "./components/Header";
import Home from "./pages/home/Home";
import Participants from "./pages/participants/Participants";
import Bills from "./pages/bills/Bills";
import BillForm from "./pages/bills/BillForm";
import Result from "./pages/results/Result";

function App() {
	const {
		currentSession,
		savedSessions,
		startSession,
		discardSession,
		addParticipant,
		removeParticipant,
		saveBill,
		deleteBill,
		clearBills,
		finalizeSession,
	} = useSessionManager();

	const navigate = useNavigate();

	const [isFormDirty, setIsFormDirty] = useState(false);
	const [isBackConfModalOpen, setIsBackConfModalOpen] = useState(false);

	const handleStartSession = (name) => {
		startSession(name);

		navigate('/participants');
	};

	const handleResumeSession = () => {
		if (currentSession.participants.length >= 2) {
			navigate('/bills');

			return;
		}

		navigate('/participants');
	};

	const handleGoHome = () => {
		setIsFormDirty(false);
		navigate('/');
	};

	const handleDiscardSessionAndGoHome = () => {
		discardSession();

		setIsFormDirty(false);

		navigate('/');
	};

	const handleClearBillsAndBack = () => {
		clearBills();

		navigate('/participants');
	};

	const handleSaveBill = (bill) => {
		saveBill(bill);

		setIsFormDirty(false);

		navigate('/bills');
	};

	const handleCalculateSession = () => {
		const sessionId = finalizeSession();

		navigate(`/result/${sessionId}`);
	};

	const handleOpenSession = (sessionId) => {
		const sessionExists = savedSessions.some(
			(s) => s.id === sessionId
		);

		if (!sessionExists) {
			return;
		}

		navigate(`/result/${sessionId}`);
	};

	const handleLogoClick = () => {
		if (isFormDirty) {
			setIsBackConfModalOpen(true);

			return;
		}

		navigate('/');
	};

	const handleConfirmBackToHome = () => {
		setIsBackConfModalOpen(false);
		setIsFormDirty(false);

		navigate('/');
	};

	return (
		<>
			<div className="min-h-screen flex flex-col bg-surface text-on-surface">
				<Header
					onLogoClick={handleLogoClick}
				/>

				<div className="flex-1 flex flex-col">
					<Routes>
						<Route
							path="*"
							element={
								<Navigate
									to="/"
									replace
								/>
							}
						/>

						<Route
							path="/"
							element={
								<Home
									onStartSession={handleStartSession}
									currentSession={currentSession}
									savedSessions={savedSessions}
									onOpenSession={handleOpenSession}
									onResumeSession={handleResumeSession}
									onDiscardSession={discardSession}
								/>
							}
						/>

						<Route
							path="/participants"
							element={
								<ProtectedRoute
									condition={Boolean(currentSession.name.trim())}
									redirectTo="/"
								>
									<ProtectedRoute
										condition={currentSession.bills.length === 0}
										redirectTo="/bills"
									>
										<Participants
											sessionName={currentSession.name}
											participants={currentSession.participants}
											onAddParticipant={addParticipant}
											onRemoveParticipant={removeParticipant}
											onDirtyChange={setIsFormDirty}
											onNext={() => navigate('/bills')}
											onBack={handleDiscardSessionAndGoHome}
										/>
									</ProtectedRoute>
								</ProtectedRoute>
							}
						/>

						<Route
							path="/bills"
							element={
								<ProtectedRoute
									condition={currentSession.participants.length >= 2}
									redirectTo="/participants"
								>
									<Bills
										session={currentSession}
										onAddBill={() => navigate('/bills/create')}
										onEditBill={(bill) =>
											navigate(`/bills/edit/${bill.id}`)
										}
										onDeleteBill={deleteBill}
										onCalculateSession={handleCalculateSession}
										onBack={handleClearBillsAndBack}
									/>
								</ProtectedRoute>
							}
						/>

						<Route
							path="/bills/create"
							element={
								<ProtectedRoute
									condition={currentSession.participants.length >= 2}
									redirectTo="/participants"
								>
									<BillForm
										participants={currentSession.participants}
										onDirtyChange={setIsFormDirty}
										onSaveBill={handleSaveBill}
										onBack={() => navigate('/bills')}
									/>
								</ProtectedRoute>
							}
						/>

						<Route
							path="/bills/edit/:billId"
							element={
								<ProtectedRoute
									condition={currentSession.bills.length > 0}
									redirectTo="/bills"
								>
									<BillForm
										participants={currentSession.participants}
										bills={currentSession.bills}
										onDirtyChange={setIsFormDirty}
										onSaveBill={handleSaveBill}
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
									onBackToHome={handleGoHome}
								/>
							}
						/>
					</Routes>
				</div>
			</div>

			<ConfirmationModal
				btnLabel="Kembali"
				isOpen={isBackConfModalOpen}
				onClose={() => setIsBackConfModalOpen(false)}
				onConfirm={handleConfirmBackToHome}
				confirmationMessage="Perubahan yang belum disimpan akan hilang jika Anda kembali ke Beranda. Apakah Anda yakin ingin melanjutkan?"
			/>
		</>
	);
}

export default App;