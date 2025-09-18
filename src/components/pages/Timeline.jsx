import React from "react";
import { useParams } from "react-router-dom";
import TimelineView from "@/components/organisms/TimelineView";
import Empty from "@/components/ui/Empty";

const Timeline = () => {
  const { projectId } = useParams();

  if (!projectId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Empty
          title="Select a Project"
          description="Choose a project from the selector above to view its timeline and scheduled tasks."
          icon="Calendar"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TimelineView projectId={projectId} />
    </div>
  );
};

export default Timeline;