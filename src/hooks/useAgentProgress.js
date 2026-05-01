import { useState, useCallback, useEffect } from 'react';
import agentOrchestrationService from '../agents/agentOrchestrationService';

/**
 * Hook for managing agent progress and coordination
 * Provides real-time updates from agent orchestration service
 */
export const useAgentProgress = () => {
  const [activeAgents, setActiveAgents] = useState([]);
  const [progress, setProgress] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const handleProgress = (data) => {
      setProgress(prev => ({
        ...prev,
        [data.agentName]: data
      }));
    };

    const handleStarted = (data) => {
      setActiveAgents(prev => [...new Set([...prev, data.agentName])]);
    };

    const handleCompleted = (data) => {
      setActiveAgents(prev => prev.filter(a => a !== data.agentName));
    };

    agentOrchestrationService.on('agent:progress', handleProgress);
    agentOrchestrationService.on('agent:started', handleStarted);
    agentOrchestrationService.on('agent:completed', handleCompleted);

    return () => {
      agentOrchestrationService.off('agent:progress', handleProgress);
      agentOrchestrationService.off('agent:started', handleStarted);
      agentOrchestrationService.off('agent:completed', handleCompleted);
    };
  }, []);

  const startAgents = useCallback(async (agentList, engagement) => {
    setIsRunning(true);
    try {
      await agentOrchestrationService.coordinateAgents(agentList, engagement);
    } finally {
      setIsRunning(false);
    }
  }, []);

  const cancelAgent = useCallback((agentName) => {
    setActiveAgents(prev => prev.filter(a => a !== agentName));
  }, []);

  const getAgentStatus = useCallback((agentName) => {
    return agentOrchestrationService.getAgentStatus(agentName);
  }, []);

  return {
    activeAgents,
    progress,
    isRunning,
    startAgents,
    cancelAgent,
    getAgentStatus,
    getWorkflowSummary: agentOrchestrationService.getWorkflowSummary.bind(agentOrchestrationService)
  };
};

export default useAgentProgress;
