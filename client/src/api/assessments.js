const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getAssessmentQuestions(token) {
  const res = await fetch(`${API_BASE}/assessments/questions`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error('Gagal mengambil pertanyaan');
  }

  const data = await res.json();
  return data.data || [];
}

export async function submitAssessment(token, answers) {
  const res = await fetch(`${API_BASE}/assessments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ userId: '9082072b-2eee-4423-86f1-cc403418a921', answers })
  });

  if (!res.ok) {
    throw new Error('Gagal mengirim assessment');
  }

  return res.json(); 
}

export async function getAssessmentResult(token, sessionId) {
  const res = await fetch(`${API_BASE}/assessments/${sessionId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error('Gagal mengambil hasil assessment');
  }

  return res.json(); 
}
