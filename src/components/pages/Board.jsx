import React from "react";
import { useParams } from "react-router-dom";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import Empty from "@/components/ui/Empty";

const Board = () => {
  const { projectId } = useParams();

  if (!projectId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Empty
          title="Select a Project"
          description="Choose a project from the selector above to view its Kanban board and manage tasks."
          icon="Kanban"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <KanbanBoard projectId={projectId} />
    </div>
  );
};

export default Board;