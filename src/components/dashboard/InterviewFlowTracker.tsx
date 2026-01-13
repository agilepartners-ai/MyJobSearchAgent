import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  XCircle, 
  ChevronRight, 
  Calendar,
  FileText,
  User,
  ArrowRight
} from 'lucide-react';
import { 
  InterviewStage, 
  InterviewStageData, 
  InterviewStageOrder, 
  InterviewStageLabels, 
  InterviewStageNextSteps 
} from '../../types/interviewStage';
import { JobApplication } from '../../services/supabaseJobApplicationService';

interface InterviewFlowTrackerProps {
  application: JobApplication;
  onUpdate?: (application: JobApplication) => void;
}

const InterviewFlowTracker: React.FC<InterviewFlowTrackerProps> = ({ application, onUpdate }) => {
  const [stages, setStages] = useState<InterviewStageData[]>([]);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    // Parse interview stages from application
    const interviewStages = (application as any).interview_stages || [];
    if (Array.isArray(interviewStages) && interviewStages.length > 0) {
      setStages(interviewStages);
    } else {
      // Initialize with application stage
      const initialStages: InterviewStageData[] = [{
        stage: InterviewStage.APPLICATION,
        status: 'completed',
        completedDate: application.application_date,
        notes: 'Application submitted'
      }];
      setStages(initialStages);
    }

    // Determine current stage
    const currentStage = (application as any).current_stage || InterviewStage.APPLICATION;
    const stageIndex = InterviewStageOrder.indexOf(currentStage as InterviewStage);
    setCurrentStageIndex(stageIndex >= 0 ? stageIndex : 0);
  }, [application]);

  const getStageStatus = (stage: InterviewStage): 'completed' | 'current' | 'upcoming' => {
    const stageIndex = InterviewStageOrder.indexOf(stage);
    if (stageIndex < currentStageIndex) return 'completed';
    if (stageIndex === currentStageIndex) return 'current';
    return 'upcoming';
  };

  const getStageIcon = (stage: InterviewStage, status: 'completed' | 'current' | 'upcoming') => {
    if (status === 'completed') {
      return <CheckCircle2 className="w-6 h-6 text-green-500" />;
    }
    if (status === 'current') {
      return <Clock className="w-6 h-6 text-blue-500 animate-pulse" />;
    }
    return <Circle className="w-6 h-6 text-gray-400" />;
  };

  const getStageColor = (status: 'completed' | 'current' | 'upcoming') => {
    if (status === 'completed') return 'bg-green-100 dark:bg-green-900/30 border-green-500';
    if (status === 'current') return 'bg-blue-100 dark:bg-blue-900/30 border-blue-500';
    return 'bg-gray-100 dark:bg-gray-800 border-gray-300';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Interview Flow: {application.company_name}
        </h3>
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
          {InterviewStageLabels[InterviewStageOrder[currentStageIndex]]}
        </span>
      </div>

      {/* Flow Timeline */}
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700" 
             style={{ height: `${(InterviewStageOrder.length - 1) * 80}px` }} />

        {/* Stages */}
        <div className="space-y-4">
          {InterviewStageOrder.map((stage, index) => {
            const status = getStageStatus(stage);
            const stageData = stages.find(s => s.stage === stage);
            const isLast = index === InterviewStageOrder.length - 1;

            return (
              <div key={stage} className="relative flex items-start gap-4">
                {/* Stage Icon */}
                <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${getStageColor(status)}`}>
                  {getStageIcon(stage, status)}
                </div>

                {/* Stage Content */}
                <div className={`flex-1 pb-8 ${isLast ? 'pb-0' : ''}`}>
                  <div className={`p-4 rounded-lg border-2 ${getStageColor(status)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {InterviewStageLabels[stage]}
                      </h4>
                      {status === 'current' && (
                        <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                          Current
                        </span>
                      )}
                    </div>

                    {stageData && (
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        {stageData.scheduledDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Scheduled: {new Date(stageData.scheduledDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        {stageData.completedDate && (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span>Completed: {new Date(stageData.completedDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        {stageData.interviewer && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>Interviewer: {stageData.interviewer}</span>
                          </div>
                        )}
                        {stageData.notes && (
                          <div className="flex items-start gap-2">
                            <FileText className="w-4 h-4 mt-0.5" />
                            <span>{stageData.notes}</span>
                          </div>
                        )}
                        {stageData.result && (
                          <div className="flex items-center gap-2">
                            {stageData.result === 'passed' ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className={stageData.result === 'passed' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                              Result: {stageData.result.toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Next Steps */}
                    {status === 'current' && InterviewStageNextSteps[stage] && (
                      <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                          <ArrowRight className="w-4 h-4" />
                          Next Steps:
                        </h5>
                        <ul className="space-y-1">
                          {InterviewStageNextSteps[stage].map((step, idx) => (
                            <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                              <ChevronRight className="w-4 h-4 mt-0.5 text-blue-500" />
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InterviewFlowTracker;

