import React from 'react';
import { Card, CardContent } from '@/design-system/ui/base/card';
import { Button } from '@/design-system/ui/base/button';
import { X } from 'lucide-react';
import { ScrollArea } from '@/design-system/ui/base/scroll-area';
import { cn } from '../../../../core/utils';
import { BuildableItem } from './index';
import { motion } from 'framer-motion';

interface BuildPanelProps {
  title?: string;
  items: BuildableItem[];
  emptyMessage?: string;
  buildButtonText?: string;
  onRemoveItem: (itemId: string) => void;
  onBuild: () => void;
  onClose: () => void;
}

const BuildPanel: React.FC<BuildPanelProps> = ({
  title = 'Build your program',
  items = [],
  emptyMessage = 'Add items to build your program',
  buildButtonText = 'Build',
  onRemoveItem,
  onBuild,
  onClose,
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        'flex flex-col bg-gray-50 rounded-[10px] overflow-hidden',
        'h-full w-[315px]',
      )}
    >
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-800">
            {title}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-grow px-6 py-4">
        {items.length === 0 ? (
          <p className="py-8 text-center text-gray-500">
            {emptyMessage}
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.id} className="relative bg-white border border-gray-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute w-6 h-6 top-3 right-3 hover:bg-gray-100"
                  onClick={() => onRemoveItem(item.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
                <CardContent className="p-4">
                  <p className="font-medium text-gray-800">{item.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-6 border-t">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={onBuild}
          disabled={items.length === 0}
        >
          {buildButtonText}
        </Button>
      </div>
    </motion.div>
  );
};

export default BuildPanel;
