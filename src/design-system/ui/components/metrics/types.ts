export interface CoachingProgram {
	id: string;
	title: string;
	subtitle?: string;
	description?: string;
	imageSrc?: string;
	tags?: Array<{ text: string; color?: string }>;
	highlighted?: boolean;
}
