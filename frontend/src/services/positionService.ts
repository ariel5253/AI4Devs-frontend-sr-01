const API_URL = 'http://localhost:3010';

export interface InterviewStep {
  id: number;
  interviewFlowId: number;
  interviewTypeId: number;
  name: string;
  orderIndex: number;
}

export interface InterviewFlowResponse {
  positionName: string;
  status: string;
  interviewFlow: {
    id: number;
    description: string;
    interviewSteps: InterviewStep[];
  };
}

export interface Candidate {
  fullName: string;
  currentInterviewStep: string;
  averageScore: number;
  id: number;
  applicationId: number;
}

/**
 * Obtiene el flujo de entrevistas de una posición específica
 * @param id - ID de la posición
 * @returns Promise con el flujo de entrevistas y nombre de la posición
 */
export const getInterviewFlow = async (id: string): Promise<InterviewFlowResponse> => {
  try {
    const response = await fetch(`${API_URL}/position/${id}/interviewflow`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 404) {
        throw new Error('Position not found');
      }
      throw new Error(errorData.message || `Error al obtener el flujo de entrevistas: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getInterviewFlow:', error);
    throw error;
  }
};

/**
 * Obtiene los candidatos asociados a una posición específica
 * @param id - ID de la posición
 * @returns Promise con el array de candidatos
 */
export const getCandidates = async (id: string): Promise<Candidate[]> => {
  try {
    const response = await fetch(`${API_URL}/position/${id}/candidates`);
    if (!response.ok) {
      throw new Error(`Error al obtener los candidatos: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getCandidates:', error);
    throw error;
  }
};

/**
 * Actualiza la etapa (stage) de un candidato en el proceso de entrevistas
 * @param candidateId - ID del candidato
 * @param applicationId - ID de la aplicación
 * @param newStepId - ID de la nueva etapa de entrevista
 * @returns Promise con la respuesta del servidor
 */
export const updateCandidateStage = async (
  candidateId: string,
  applicationId: number,
  newStepId: number
): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/candidates/${candidateId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        applicationId: applicationId,
        currentInterviewStep: newStepId,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error al actualizar la etapa: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en updateCandidateStage:', error);
    throw error;
  }
};

