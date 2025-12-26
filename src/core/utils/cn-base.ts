// /**
//  * Core classname utility for combining class names
//  * Based on the classnames package with extended functionality
//  */
// import classNames from 'classnames';
// import clsx from 'clsx';
// import { twMerge } from 'tailwind-merge';

// /**
//  * Type definition for class values that can be combined
//  */
// export type ClassValue = string | number | boolean | undefined | null | Record<string, unknown> | unknown[];

// /**
//  * Extended class name utility that supports combining multiple class values
//  * @param inputs - Class values to be combined
//  * @returns Combined class string
//  * 
//  * @example
//  * cn('text-red-500', isActive && 'bg-blue-500')
//  */
// // export function cn(...inputs: ClassValue[]) {
// //   return classNames(...inputs);
// // }
// export function cn(...inputs: ClassValue[]) {
// 	return twMerge(clsx(inputs));
// }
// /**
//  * Default export for convenience
//  */
// export default cn; 