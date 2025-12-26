import React, { useState, useMemo, useCallback } from 'react';
import {
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
} from '@/design-system/ui/base/tabs';
import { X, Filter } from 'lucide-react';
import { Button } from '@/design-system/ui/base/button';
import { toast } from 'sonner';
import { ScrollArea } from '@/design-system/ui/base/scroll-area';
import { cn } from '../../../../core/utils';
import BuildPanel from './BuildPanel';
import { AnimatePresence, motion } from 'framer-motion';

export interface TabItem {
	id: string;
	label: string;
	description?: string;
	header?: React.ReactNode;
	content: React.ReactNode;
}

export interface BuildableItem {
	id: string;
	title: string;
}

interface TabNavigationProps {
	tabs: TabItem[];
	onFilter?: () => void;
	showFilter?: boolean;
	buildPanel?: {
		enabled: boolean;
		title?: string;
		buildButtonText?: string;
		emptyMessage?: string;
	};
}

const TabNavigation: React.FC<TabNavigationProps> = ({
	tabs,
	onFilter,
	showFilter = true,
	buildPanel = { enabled: false },
}) => {
	const [activeTabId, setActiveTabId] = useState<string | undefined>(tabs[0]?.id);
	const [selectedItems, setSelectedItems] = useState<BuildableItem[]>([]);
	const [buildPanelOpen, setBuildPanelOpen] = useState(false);

	// Use useCallback for stable function references
	const handleAddToBuildPanel = useCallback((item: BuildableItem) => {
		if (!selectedItems.some((i) => i.id === item.id)) {
			setSelectedItems(prevItems => [...prevItems, item]);
			setBuildPanelOpen(true);
			toast.success(`Added ${item.title} to your program`);
		}
	}, [selectedItems]);

	// Use useCallback for stable function references
	const handleRemoveFromBuildPanel = useCallback((itemId: string) => {
		setSelectedItems(prevItems => prevItems.filter(item => item.id !== itemId));
		toast.info('Item removed from your program');
	}, []);

	const handleBuild = useCallback(() => {
		toast.success('Your program has been built!');
		setBuildPanelOpen(false);
		setSelectedItems([]);
	}, []);

	// Create a memoized context value to prevent unnecessary re-renders
	const navigationContext = useMemo(() => ({
		addToBuildPanel: handleAddToBuildPanel,
		buildPanelEnabled: buildPanel.enabled,
	}), [handleAddToBuildPanel, buildPanel.enabled]);

	// Memoize the tab content rendering to prevent unnecessary re-renders
	const tabContent = useMemo(
		() => (
			<AnimatePresence mode="wait" initial={false}>
				{tabs.map((tab) => (
					<TabsContent
						key={tab.id}
						value={tab.id}
						className="flex flex-col gap-[12px] w-full h-full"
						asChild
					>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2, ease: 'easeOut' }}
						>
							{/* Upper section with description and header - not scrollable */}
							<div className="flex flex-col gap-[23px] ">
								{/* Optional description */}
								{tab.description && (
									<div className="">
										<p className="text-gray-700">{tab.description}</p>
									</div>
								)}

								{/* Optional header component */}
								{tab.header && <div className="">{tab.header}</div>}
							</div>

							{/* Scrollable content area */}
							<div className="w-full h-full">
								{/* Tab content - this is now fully customizable */}
								<TabNavigationContext.Provider value={navigationContext}>
									{tab.content}
								</TabNavigationContext.Provider>
							</div>
						</motion.div>
					</TabsContent>
				))}
			</AnimatePresence>
		),
		[tabs, activeTabId, navigationContext],
	);

	// Memoize the build panel rendering
	const buildPanelContent = useMemo(() => (
		<AnimatePresence>
			{buildPanelOpen &&
				buildPanel.enabled &&
				selectedItems.length > 0 && (
					<BuildPanel
						title={buildPanel.title}
						items={selectedItems}
						emptyMessage={buildPanel.emptyMessage}
						buildButtonText={buildPanel.buildButtonText}
						onRemoveItem={handleRemoveFromBuildPanel}
						onBuild={handleBuild}
						onClose={() => setBuildPanelOpen(false)}
					/>
				)}
		</AnimatePresence>
	), [buildPanelOpen, buildPanel, selectedItems, handleRemoveFromBuildPanel, handleBuild]);

	return (
        <div className='h-full overflow-y-hidden'>
            <div className='flex flex-col h-full'>
                <Tabs value={activeTabId} onValueChange={setActiveTabId} className='flex flex-col w-full h-full'>
                    <div>
                        <div className='flex items-center justify-between'>
                            <ScrollArea className='w-full whitespace-nowrap'>
                                <TabsList className='inline-flex h-12 border-b-[1px] gap-[20px] border-b-primary-200 p-0 rounded-t-[10px] rounded-b-none bg-white'>
                                    {tabs.map((tab) => (
                                        <TabsTrigger
                                            key={tab.id}
                                            value={tab.id}
                                            className='relative h-12 rounded-none border-b-[2px]  border-transparent px-4 py-3 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none'>
                                            {tab.label}
                                            {activeTabId === tab.id && (
                                                <motion.div
                                                    layoutId='contentTabUnderline'
                                                    initial={{ opacity: 0.8 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                                                    className='absolute -bottom-0.5 left-0 right-0 h-[4px] bg-secondary-900 dark:bg-primary-500 rounded-sm'
                                                />
                                            )}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </ScrollArea>
                        </div>
                    </div>{' '}
                    {/* Tab content area */}
                    <div
                        className={cn(
                            'flex flex-grow overflow-hidden',
                            'px-[10px] bg-white gap-[16px]'
                        )}>
                        <motion.div
                            layout
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className='relative flex flex-grow w-full rounded-[20px'>
                            {tabContent}
                        </motion.div>
                        {buildPanelContent}
                    </div>
                </Tabs>
            </div>
        </div>
    );
};

// Create a context for child components to access the navigation functions
export const TabNavigationContext = React.createContext<{
	addToBuildPanel: (item: BuildableItem) => void;
	buildPanelEnabled: boolean;
}>({
	addToBuildPanel: () => {},
	buildPanelEnabled: false,
});

// Custom hook to access the navigation context
export const useTabNavigation = () => React.useContext(TabNavigationContext);

export default TabNavigation;
