'use client';
import React from 'react';
import { Card, CardContent } from '@/design-system/ui/base/card';
import { Button } from '@/design-system/ui/base/button';
import { Bookmark, Eye, Plus, Users, X } from 'lucide-react';
import { cn } from '@/core/utils';
import { AvatarGroup } from '../../components/avatar-group';

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role?: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  membersCount: number;
  department: string;
  isSaved?: boolean;
  imageUrl?: string;
}

interface TeamCardProps {
  team: Team;
  onSave?: () => void;
  onViewDetails?: () => void;
  onAddToProgram?: () => void;
  onRemoveFromProgram?: () => void;
  inProgram?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
  colorAccent?: 'blue' | 'amber' | 'green' | 'purple';
  className?: string;
}

const TeamCard: React.FC<TeamCardProps> = ({
  team,
  onSave,
  onViewDetails,
  onAddToProgram,
  onRemoveFromProgram,
  inProgram = false,
  variant = 'default',
  colorAccent = 'blue',
  className,
}) => {
  const colorClasses = {
    blue: 'text-blue-800 border-blue-600',
    amber: 'text-amber-800 border-amber-500',
    green: 'text-green-800 border-green-600',
    purple: 'text-purple-800 border-purple-600',
  };

  const buttonColorClasses = {
    blue: 'text-blue-600 border-blue-600 hover:bg-blue-50',
    amber: 'text-amber-600 border-amber-600 hover:bg-amber-50',
    green: 'text-green-600 border-green-600 hover:bg-green-50',
    purple: 'text-purple-600 border-purple-600 hover:bg-purple-50',
  };

  return (
    <Card
      className={cn(
        'h-full overflow-hidden',
        variant === 'compact' && 'shadow-sm border-l-4',
        variant === 'compact' && colorAccent && `border-l-${colorAccent}-500`,
        className,
      )}
    >
      <CardContent
        className={cn(
          'p-0 flex flex-col h-full',
          variant === 'compact' && 'p-4',
        )}
      >
        {team.imageUrl && variant !== 'compact' && variant !== 'minimal' && (
          <div className="relative">
            <img
              src={team.imageUrl}
              alt={team.name}
              className="w-full h-48 object-cover"
            />
            {inProgram && (
              <div className="absolute top-2 right-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8 bg-white/80 text-red-500 border border-red-200 hover:bg-white"
                  onClick={onRemoveFromProgram}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        <div
          className={cn(
            'p-6 flex flex-col flex-grow',
            variant === 'compact' && 'p-0',
            variant === 'minimal' && 'p-3',
          )}
        >
          <div className="flex justify-between items-start">
            <h3
              className={cn(
                'font-medium mb-2',
                colorAccent && colorClasses[colorAccent],
                variant === 'default' ? 'text-lg' : 'text-base',
              )}
            >
              {team.name}
            </h3>
            {onSave && variant !== 'minimal' && (
              <button
                onClick={onSave}
                className={cn(
                  'text-blue-600',
                  colorAccent && colorClasses[colorAccent],
                )}
              >
                <Bookmark
                  className={
                    team.isSaved
                      ? cn(
                          'fill-current',
                          colorAccent && colorClasses[colorAccent],
                        )
                      : ''
                  }
                  size={variant === 'compact' ? 16 : 20}
                />
              </button>
            )}
          </div>

          <div className="text-sm text-gray-500 mb-2">
            {team.department}
          </div>

          {variant !== 'minimal' && (
            <p
              className={cn(
                'text-gray-500 mb-6 flex-grow',
                variant === 'compact' ? 'text-xs' : 'text-sm',
              )}
            >
              {team.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{team.membersCount} members</span>
            </div>

            <div className="flex items-center gap-2">
              {onAddToProgram && !inProgram && variant !== 'minimal' && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={onAddToProgram}
                >
                  <Plus
                    className={cn(
                      'h-4 w-4',
                      colorAccent && colorClasses[colorAccent],
                    )}
                  />
                </Button>
              )}

              {onViewDetails && variant !== 'minimal' && (
                <Button
                  variant="outline"
                  className={cn(
                    'border hover:text-current rounded-full',
                    buttonColorClasses[colorAccent],
                    variant === 'compact' ? 'text-xs py-1 px-2' : '',
                  )}
                  onClick={onViewDetails}
                >
                  <Eye className="mr-1 h-4 w-4" />
                  {variant === 'compact' ? 'View' : 'View Details'}
                </Button>
              )}

              {inProgram && variant === 'minimal' && onRemoveFromProgram && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 p-1 h-auto"
                  onClick={onRemoveFromProgram}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="mt-4">
            {team.members.length > 0 && (
              <AvatarGroup
                members={team.members.map(member => ({
                  id: member.id,
                  avatar: member.avatar,
                }))}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCard;
