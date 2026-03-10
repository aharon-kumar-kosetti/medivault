import { useState } from 'react';
import { searchPatientByEmail, writeDrugInteraction, getDrugInteractions, deleteDrugInteraction } from '../../services/accessApi';

const SEVERITY_OPTIONS = [
  { value: 'mild', label: 'Mild' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'severe', label: 'Severe' },
  { value: 'contraindicated', label: 'Contraindicated' },
];

const TYPE_OPTIONS = [
  { value: 'pharmacokinetic', label: 'Pharmacokinetic' },
  { value: 'pharmacodynamic', label: 'Pharmacodynamic' },
  { value: 'food_drug', label: 'Food-Drug' },
  { value: 'allergy', label: 'Allergy' },
  { value: 'other', label: 'Other' },
];

const EMPTY_FORM = {
  drugA: '',
  drugB: '',
  severity: 'moderate',
  interactionType: 'pharmacokinetic',
  description: '',
  recommendation: '',
};

export default function DrugInteractions() {
  const [email, setEmail] = useState('');
  const [patient, setPatient] = useState(null);
  const [searching, setSearching] = useState(false);
  const [interactions, setInteractions] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('error'); // 'error' | 'success'
  const [deletingId, setDeletingId] = useState(null);

  const showFeedback = (msg, type = 'error') => {
    setFeedback(msg);
    setFeedbackType(type);
  };

  const handleSearch = async () => {
    if (!email.includes('@')) { showFeedback('Enter a valid patient email.'); return; }
    setSearching(true);
    setFeedback('');
    setPatient(null);
    setInteractions([]);
    try {
      const result = await searchPatientByEmail(email.trim());
      setPatient(result.patient);
      // Load existing interactions for this patient
      try {
        const diResult = await getDrugInteractions(result.patient.id);
        setInteractions(diResult.interactions || []);
      } catch {
        setInteractions([]);
      }
    } catch (err) {
      showFeedback(err.message || 'Patient not found.');
    } finally {
      setSearching(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!patient) { showFeedback('Search for a patient first.'); return; }
    if (!form.drugA.trim() || !form.drugB.trim() || !form.description.trim()) {
      showFeedback('Drug A, Drug B, and Description are required.');
      return;
    }
    setBusy(true);
    setFeedback('');
    try {
      await writeDrugInteraction({
        patientId: patient.id,
        drugA: form.drugA,
        drugB: form.drugB,
        severity: form.severity,
        interactionType: form.interactionType,
        description: form.description,
        recommendation: form.recommendation,
      });
      showFeedback('Drug interaction saved successfully.', 'success');
      setForm(EMPTY_FORM);
      // Refresh list
      const diResult = await getDrugInteractions(patient.id);
      setInteractions(diResult.interactions || []);
    } catch (err) {
      showFeedback(err.message || 'Failed to save.');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this drug interaction note?')) return;
    setDeletingId(id);
    setFeedback('');
    try {
      await deleteDrugInteraction(id);
      setInteractions(prev => prev.filter(i => i.id !== id));
      showFeedback('Deleted.', 'success');
    } catch (err) {
      showFeedback(err.message || 'Delete failed.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="di-container">
      {/* Patient Search */}
      <div className="di-search-bar">
        <input
          type="email"
          placeholder="Search patient by email..."
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          className="di-search-input"
        />
        <button
          type="button"
          className="btn btn-outline"
          onClick={handleSearch}
          disabled={searching}
        >
          {searching ? 'Searching…' : 'Search'}
        </button>
      </div>

      {feedback && (
        <div className={`di-feedback di-feedback--${feedbackType}`}>{feedback}</div>
      )}

      {patient && (
        <>
          {/* Patient summary strip */}
          <div className="di-patient-strip">
            <span className="di-patient-avatar">👤</span>
            <div>
              <div className="di-patient-name">{patient.fullName}</div>
              <div className="di-patient-meta">
                {patient.email}
                {patient.bloodGroup ? ` · ${patient.bloodGroup}` : ''}
                {patient.dateOfBirth ? ` · DOB: ${String(patient.dateOfBirth).split('T')[0]}` : ''}
              </div>
            </div>
          </div>

          {/* Write new interaction form */}
          <div className="di-form-card">
            <div className="di-form-title">💊 New Drug Interaction Note</div>
            <div className="di-form-grid">
              <div className="di-field">
                <label>Drug A</label>
                <input
                  name="drugA"
                  value={form.drugA}
                  onChange={handleFormChange}
                  placeholder="e.g. Warfarin"
                />
              </div>
              <div className="di-field">
                <label>Drug B</label>
                <input
                  name="drugB"
                  value={form.drugB}
                  onChange={handleFormChange}
                  placeholder="e.g. Aspirin"
                />
              </div>
              <div className="di-field">
                <label>Severity</label>
                <select name="severity" value={form.severity} onChange={handleFormChange}>
                  {SEVERITY_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="di-field">
                <label>Interaction Type</label>
                <select name="interactionType" value={form.interactionType} onChange={handleFormChange}>
                  {TYPE_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="di-field di-field--full">
                <label>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="Describe the nature and mechanism of the interaction..."
                  rows={3}
                />
              </div>
              <div className="di-field di-field--full">
                <label>Recommendation <span className="di-optional">(optional)</span></label>
                <textarea
                  name="recommendation"
                  value={form.recommendation}
                  onChange={handleFormChange}
                  placeholder="Clinical recommendation for the treating physician..."
                  rows={2}
                />
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={busy}
            >
              {busy ? 'Saving…' : 'Save Interaction Note'}
            </button>
          </div>

          {/* Existing interactions list */}
          {interactions.length > 0 && (
            <div className="di-list">
              <div className="di-list-title">Recorded Interactions ({interactions.length})</div>
              {interactions.map(item => (
                <div key={item.id} className={`di-card di-card--${item.severity}`}>
                  <div className="di-card-header">
                    <div className="di-drug-pair">
                      <span className="di-drug">{item.drugA}</span>
                      <span className="di-interact-icon">⇄</span>
                      <span className="di-drug">{item.drugB}</span>
                    </div>
                    <div className="di-card-badges">
                      <span className={`di-severity-badge di-sev--${item.severity}`}>{item.severity}</span>
                      <span className="di-type-badge">{item.interactionType?.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                  <p className="di-description">{item.description}</p>
                  {item.recommendation && (
                    <div className="di-recommendation">
                      <span className="di-rec-label">Recommendation:</span> {item.recommendation}
                    </div>
                  )}
                  <div className="di-card-footer">
                    <span className="di-meta">
                      {item.doctorName ? `Dr. ${item.doctorName}` : 'You'} · {item.date}
                    </span>
                    <button
                      type="button"
                      className="di-delete-btn"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                    >
                      {deletingId === item.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {interactions.length === 0 && (
            <p className="di-empty">No drug interactions recorded for this patient yet.</p>
          )}
        </>
      )}
    </div>
  );
}
