import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import SampleSelector from './components/SampleSelector.jsx';
import EmailAnalyzer from './components/EmailAnalyzer.jsx';
import AnalysisView from './components/AnalysisView.jsx';
import LoginPage from './components/LoginPage.jsx';
import { fetchSamples, analyzeEmail } from './api.js';

const DEFAULT_BODY = `From: Marcus Vance <mvance@acmecorp.com>
To: alex@company.com
Subject: URGENT: Unacceptable delays on Enterprise Dashboard rollout
Date: 2026-09-29 10:15 IST

Hi,

I am writing to express our deep disappointment regarding the Q3 Enterprise Dashboard delivery. According to our SOW signed in July, the staging environment was supposed to be fully operational by yesterday (Sept 28th).

We have an executive review with our CEO on Friday, Oct 2nd at 9:00 AM EST, and currently we have zero visibility into the analytics portal.

Can you please confirm by EOD today:
1. Root cause of the delay.
2. The exact revised deployment date.
3. Who is assigned as the lead technical contact for the remediation?

If we do not receive a clear path forward by 5 PM today, we will have to escalate this to your Managing Director and review our contract terms.

Regards,
Marcus Vance
VP of Technology, Acme Corp`;

function parseEmailBody(raw) {
  const lines = raw.split('\n');
  let sender = '', subject = '', received_at = '', bodyLines = [];
  let inBody = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!inBody) {
      if (/^from:/i.test(line)) sender = line.replace(/^from:\s*/i, '').trim();
      else if (/^subject:/i.test(line)) subject = line.replace(/^subject:\s*/i, '').trim();
      else if (/^date:/i.test(line)) received_at = line.replace(/^date:\s*/i, '').trim();
      else if (line.trim() === '') inBody = true;
    } else {
      bodyLines.push(line);
    }
  }

  return {
    sender: sender || 'unknown@email.com',
    recipients: 'me@company.com',
    subject: subject || '(No Subject)',
    received_at: received_at || new Date().toISOString(),
    body: bodyLines.join('\n').trim() || raw,
    user_name: 'User',
    user_role: 'Executive',
    tone: 'professional',
    signoff: 'Best regards',
  };
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem('auth') === '1');
  const [samples, setSamples] = useState([]);
  const [currentSampleId, setCurrentSampleId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [executionSource, setExecutionSource] = useState(null);
  const [body, setBody] = useState(DEFAULT_BODY);

  useEffect(() => {
    fetchSamples()
      .then((data) => {
        setSamples(data);
        if (data.length > 0) setCurrentSampleId(data[0].id);
      })
      .catch((err) => console.error('Failed to load samples:', err));
  }, []);

  const handleSelectSample = (sample) => {
    setCurrentSampleId(sample.id);
    const e = sample.email;
    const raw = `From: ${e.sender}\nTo: ${e.recipients}\nSubject: ${e.subject}\nDate: ${e.received_at || ''}\n\n${e.body}`;
    setBody(raw);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setAnalysisResult(null);
    try {
      const payload = parseEmailBody(body);
      const response = await analyzeEmail(payload);
      setAnalysisResult(response.data);
      setExecutionSource(response.execution_source);
    } catch (err) {
      alert('Analysis Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!loggedIn) {
    return <LoginPage onLogin={() => { sessionStorage.setItem('auth', '1'); setLoggedIn(true); }} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header onLogout={() => { sessionStorage.removeItem('auth'); setLoggedIn(false); }} />
      <main className="main-container">
        {samples.length > 0 && (
          <SampleSelector
            samples={samples}
            onSelectSample={handleSelectSample}
            currentSampleId={currentSampleId}
          />
        )}
        <div className="analyzer-grid">
          <EmailAnalyzer body={body} setBody={setBody} onAnalyze={handleAnalyze} loading={loading} />
          <AnalysisView result={analysisResult} executionSource={executionSource} loading={loading} />
        </div>
      </main>
    </div>
  );
}
