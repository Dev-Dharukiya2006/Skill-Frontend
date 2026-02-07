import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Video, ExternalLink } from 'lucide-react';
import { useRoadmap } from '../context/RoadmapContext';

const Roadmap = () => {
  const { roadmap, updateTaskCompletion } = useRoadmap();
  const [selectedPhase, setSelectedPhase] = useState(0);

  if (!roadmap) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-xl text-slate-600 dark:text-slate-400">
          No roadmap found. Please create one from your profile.
        </p>
      </div>
    );
  }

  const currentPhase = roadmap.phases[selectedPhase];
  const phaseWeeks = roadmap.weeklyGoals.filter(w => w.phase === currentPhase?.name);

  const handleTaskToggle = async (weekId, taskId, currentStatus) => {
    await updateTaskCompletion(weekId, taskId, !currentStatus);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Your Learning Roadmap</h1>
        <p className="text-slate-600 dark:text-slate-400">
          {roadmap.targetRole} • {roadmap.totalDuration} weeks
        </p>
      </motion.div>

      {/* Phase Tabs */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-2 min-w-max">
          {roadmap.phases.map((phase, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedPhase(idx)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedPhase === idx
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-800 hover:shadow-md'
              }`}
            >
              <div className="text-left">
                <div className="text-sm opacity-80">Phase {phase.order}</div>
                <div>{phase.name}</div>
                <div className="text-xs mt-1">{phase.progress}% Complete</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Phase Details */}
      {currentPhase && (
        <motion.div
          key={selectedPhase}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card mb-8"
        >
          <h2 className="text-2xl font-bold mb-2">{currentPhase.name}</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {currentPhase.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {currentPhase.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Weekly Goals */}
      <div className="space-y-6">
        {phaseWeeks.map((week, weekIdx) => (
          <motion.div
            key={week._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: weekIdx * 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Week {week.weekNumber}</span>
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {week.progress}% complete
                </p>
              </div>
              {week.completed && (
                <span className="px-3 py-1 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold">
                  Completed
                </span>
              )}
            </div>

            <div className="space-y-3">
              {week.tasks.map((task) => (
                <div
                  key={task._id}
                  onClick={() => handleTaskToggle(week._id, task._id, task.completed)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                    task.completed
                      ? 'border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-950/30'
                      : 'border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-700'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h4 className={`font-semibold mb-1 ${task.completed ? 'line-through opacity-70' : ''}`}>
                        {task.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {task.description}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        Estimated: {task.estimatedHours}h
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommended Video Resources */}
            {week.videoLinks && week.videoLinks.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-2 mb-4">
                  <Video className="w-5 h-5 text-red-600" />
                  <h4 className="font-bold text-lg">Recommended Video Resources</h4>
                </div>
                <div className="space-y-4">
                  {week.videoLinks.map((skillVideo, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                      <h5 className="font-semibold text-orange-600 dark:text-orange-400 mb-3">
                        {skillVideo.skill} Tutorials
                      </h5>
                      <div className="space-y-2">
                        {skillVideo.videos.map((video, vIdx) => (
                          <a
                            key={vIdx}
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg hover:shadow-md transition-all hover:border-red-300 dark:hover:border-red-700 border-2 border-transparent"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-red-100 dark:bg-red-950 rounded-lg flex items-center justify-center">
                                <Video className="w-5 h-5 text-red-600" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{video.title}</p>
                                <p className="text-xs text-slate-500">{video.platform}</p>
                              </div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-slate-400" />
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Roadmap;
