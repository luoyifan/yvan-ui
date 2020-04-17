let designMode = false;

export function initDesign(): void {
    designMode = true;
}

export function isDesignMode(): boolean {
    return designMode;
}
