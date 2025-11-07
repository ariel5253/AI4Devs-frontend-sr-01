import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert, Card } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { getInterviewFlow, getCandidates, updateCandidateStage, InterviewStep, Candidate, InterviewFlowResponse } from '../services/positionService';
import './PositionBoard.css';

const PositionBoard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [positionName, setPositionName] = useState<string>('');
  const [steps, setSteps] = useState<InterviewStep[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);

  /**
   * Obtiene los datos de la posición (flujo de entrevistas y candidatos)
   */
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError('ID de posición no válido');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Realizar ambas peticiones en paralelo
        const [interviewFlowData, candidatesData] = await Promise.all([
          getInterviewFlow(id),
          getCandidates(id),
        ]);

        setPositionName(interviewFlowData.positionName);
        
        // Ordenar los pasos por orderIndex
        const sortedSteps = [...interviewFlowData.interviewFlow.interviewSteps].sort(
          (a, b) => a.orderIndex - b.orderIndex
        );
        setSteps(sortedSteps);
        setCandidates(candidatesData);
      } catch (err: any) {
        console.error('Error al obtener los datos:', err);
        // Verificar si es un error de posición no encontrada
        if (err?.message === 'Position not found' || err?.message?.includes('Position not found')) {
          setError('La posición no existe');
        } else {
          setError('Error al obtener los datos del proceso');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /**
   * Maneja el evento de drag and drop
   */
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Si no hay destino o es el mismo lugar, no hacer nada
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const candidateId = draggableId;
    const newStepId = parseInt(destination.droppableId);
    const sourceStepId = parseInt(source.droppableId);

    // Si es la misma columna, no hacer nada
    if (newStepId === sourceStepId) return;

    // Encontrar el candidato
    const candidate = candidates.find((c) => c.id.toString() === candidateId);
    if (!candidate) return;

    // Guardar el estado anterior para poder revertir en caso de error
    const previousCandidates = [...candidates];
    const newStepName = steps.find((s) => s.id === newStepId)?.name || candidate.currentInterviewStep;

    // Actualizar el estado local optimísticamente
    const updatedCandidates = candidates.map((c) =>
      c.id === candidate.id
        ? { ...c, currentInterviewStep: newStepName }
        : c
    );
    setCandidates(updatedCandidates);

    try {
      setUpdating(true);
      await updateCandidateStage(candidateId, candidate.applicationId, newStepId);
      setError(null);
    } catch (err) {
      console.error('Error al actualizar la etapa:', err);
      // Revertir el cambio en caso de error
      setCandidates(previousCandidates);
      setError('Error al actualizar la etapa del candidato');
    } finally {
      setUpdating(false);
    }
  };

  /**
   * Obtiene los candidatos de una fase específica
   */
  const getCandidatesByStep = (stepName: string): Candidate[] => {
    return candidates.filter((candidate) => candidate.currentInterviewStep === stepName);
  };

  /**
   * Renderiza los indicadores de puntuación
   */
  const renderScoreIndicators = (score: number) => {
    const maxScore = 5;
    const filledCircles = Math.round(score);
    const circles = [];

    for (let i = 0; i < maxScore; i++) {
      circles.push(
        <span
          key={i}
          className={`score-circle ${i < filledCircles ? 'filled' : ''}`}
          title={`Puntuación: ${score.toFixed(1)}`}
        />
      );
    }
    return <div className="score-indicators">{circles}</div>;
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p className="mt-3">Cargando datos del proceso...</p>
      </Container>
    );
  }

  if (error && !positionName) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
            Volver al listado de posiciones
          </button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="position-board-container">
      {/* Header con título y botón de retorno */}
      <div className="position-header mb-4">
        <button
          className="btn-back"
          onClick={() => navigate(-1)}
          aria-label="Volver al listado de posiciones"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="position-title">{positionName} Position</h1>
        {updating && (
          <Spinner animation="border" size="sm" className="ms-3" />
        )}
      </div>

      {error && (
        <Alert variant="warning" dismissible onClose={() => setError(null)} className="mb-3">
          {error}
        </Alert>
      )}

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          {steps.map((step) => {
            const stepCandidates = getCandidatesByStep(step.name);
            return (
              <div key={step.id} className="kanban-column">
                <div className="kanban-column-header">
                  <h3>{step.name}</h3>
                  <span className="candidate-count">{stepCandidates.length}</span>
                </div>
                <Droppable droppableId={step.id.toString()}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`kanban-column-content ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                    >
                      {stepCandidates.length === 0 ? (
                        <>
                          <div className="no-candidates-message">
                            <p>No hay candidatos en esta fase</p>
                          </div>
                          {provided.placeholder}
                        </>
                      ) : (
                        <>
                          {stepCandidates.map((candidate, index) => (
                            <Draggable
                              key={candidate.id}
                              draggableId={candidate.id.toString()}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <Card
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`candidate-card ${snapshot.isDragging ? 'dragging' : ''}`}
                                >
                                  <Card.Body>
                                    <Card.Title className="candidate-name">
                                      {candidate.fullName}
                                    </Card.Title>
                                    <div className="candidate-score">
                                      {renderScoreIndicators(candidate.averageScore)}
                                      <span className="score-value">
                                        {candidate.averageScore.toFixed(1)}
                                      </span>
                                    </div>
                                  </Card.Body>
                                </Card>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </Container>
  );
};

export default PositionBoard;

