export interface FiltersType {
    actions: string[];
    startDate: Date | null;
    endDate: Date | null;
    userIds: string[];
    statusCode: string;
    labnumber: string;
    lowerResTime: number;
    upperResTime: number;
}