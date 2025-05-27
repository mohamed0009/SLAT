"use client"

import { Card } from "@/components/ui/card"
import { Folder } from "lucide-react"

interface FolderProps {
  id: number;
  name: string;
  count: number;
}

interface FolderViewProps {
  folders: FolderProps[];
}

export default function FolderView({ folders }: FolderViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {folders.map(folder => (
        <Card 
          key={folder.id} 
          className="overflow-hidden border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
              <Folder className="h-6 w-6 text-blue-700" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-blue-900">{folder.name}</h3>
              <p className="text-sm text-blue-600">{folder.count} recordings</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 