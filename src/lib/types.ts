// Additional helpers for lib/types.ts

export function computeVaultCompleteness(
    sectionStatuses: SectionStatus[],
    totalSections: number = Object.keys(SECTIONS).length
): VaultCompleteness {
    const completedSections = sectionStatuses.filter(s => s.status === 'complete').length;
    const inProgressSections = sectionStatuses.filter(s => s.status === 'in_progress').length;
    const notStartedSections = sectionStatuses.filter(s => s.status === 'not_started').length;
    const overallPercentage = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;
    const readinessLevel = calculateReadinessLevel(completedSections, totalSections);

    return {
        totalSections,
        completedSections,
        inProgressSections,
        notStartedSections,
        overallPercentage,
        readinessLevel,
        sectionStatuses,
    };
}

export function getSectionName(sectionId: number): string {
    return SECTION_NAMES[sectionId] ?? `Section ${sectionId}`;
}

export function getSectionIcon(sectionId: number): string {
    return SECTION_ICONS[sectionId] ?? '📁';
}

export function contractTypeLabel(type: ContractType): string {
    return CONTRACT_TYPE_LABELS[type] ?? 'Unknown';
}

export function getContractCategory(type: ContractType): keyof typeof CONTRACT_TYPE_CATEGORIES | 'unknown' {
    const categories = CONTRACT_TYPE_CATEGORIES;
    for (const key of Object.keys(categories) as (keyof typeof CONTRACT_TYPE_CATEGORIES)[]) {
        if (categories[key].includes(type)) return key;
    }
    return 'unknown';
}