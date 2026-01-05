"use client";

import { CheckCircle, Mail, Clock, XCircle, AlertTriangle } from "lucide-react";

interface ActivityLog {
  id: string;
  activity_type: 'application_sent' | 'confirmation_received' | 'interview_scheduled' | 'rejection_received' | 'ghosted';
  activity_date: string;
  email_source?: string;
}

interface ActivityTimelineProps {
  activities: ActivityLog[];
  isVerified: boolean;
  applicationDate?: string;
  lastContactDate?: string;
  autoGhosted: boolean;
}

export default function ActivityTimeline({ 
  activities, 
  isVerified, 
  applicationDate,
  lastContactDate,
  autoGhosted 
}: ActivityTimelineProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'application_sent':
        return <Mail className="h-4 w-4" />;
      case 'confirmation_received':
        return <CheckCircle className="h-4 w-4" />;
      case 'interview_scheduled':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejection_received':
        return <XCircle className="h-4 w-4" />;
      case 'ghosted':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'application_sent':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
      case 'confirmation_received':
      case 'interview_scheduled':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'rejection_received':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'ghosted':
        return 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30';
      default:
        return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800';
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'application_sent':
        return 'Application Sent';
      case 'confirmation_received':
        return 'Confirmation Received';
      case 'interview_scheduled':
        return 'Interview Scheduled';
      case 'rejection_received':
        return 'Rejection Received';
      case 'ghosted':
        return 'Auto-Ghosted (30+ days no response)';
      default:
        return type;
    }
  };

  // Build timeline from activities and dates
  const timelineItems = [];

  if (applicationDate) {
    timelineItems.push({
      type: 'application_sent',
      date: applicationDate,
      source: null,
    });
  }

  if (isVerified && applicationDate) {
    timelineItems.push({
      type: 'confirmation_received',
      date: applicationDate,
      source: 'Email verified',
    });
  }

  activities.forEach(activity => {
    timelineItems.push({
      type: activity.activity_type,
      date: activity.activity_date,
      source: activity.email_source,
    });
  });

  if (autoGhosted) {
    timelineItems.push({
      type: 'ghosted',
      date: lastContactDate || applicationDate || new Date().toISOString(),
      source: 'Automated detection',
    });
  }

  // Sort by date
  timelineItems.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (timelineItems.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
        No activity recorded yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {timelineItems.map((item, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${getActivityColor(item.type)}`}>
              {getActivityIcon(item.type)}
            </div>
            {index < timelineItems.length - 1 && (
              <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-700 min-h-[20px]" />
            )}
          </div>
          <div className="flex-1 pb-4">
            <p className="text-sm font-medium text-primary">
              {getActivityLabel(item.type)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {new Date(item.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            {item.source && (
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {item.source}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
