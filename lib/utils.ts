import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
return twMerge(clsx(inputs))
}

export function formateDate(date: string) {
    return new Date(date).toLocaleDateString( 'en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

export function formateViews(views: number) {
    return `${views} ${views === 1 ? 'View' : 'Views'}`
}

export function parseServerResposne<T>(response: T) {
    return JSON.parse(JSON.stringify(response));
}