import { useTheme } from 'next-themes';
import { Toaster as Sonner, toast } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = 'system' } = useTheme();

	return (
                 <Sonner
             theme={theme as ToasterProps['theme']}
             className='toaster group'
             position='bottom-right'
             closeButton
             richColors
             duration={1000}
             visibleToasts={5}
             expand={true}
             gap={12}
             toastOptions={{
                 classNames: {
                     toast: 'group toast rounded-md border shadow-lg bg-background text-foreground border-border',
                     title: 'font-semibold',
                     description: 'text-sm text-muted-foreground',
                     actionButton: 'bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 rounded text-sm font-medium',
                     cancelButton: 'bg-muted text-muted-foreground hover:bg-muted/90 px-3 py-1 rounded text-sm font-medium',
                     closeButton: 'absolute right-2 top-2 opacity-70 hover:opacity-100 transition-opacity'
                 }
             }}
             {...props}
         />
    );
};

export { Toaster, toast };
