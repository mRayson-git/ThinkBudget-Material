export interface CSVParsingProfile {
    id?: string,
    profileName: string,
    hasHeader: boolean,
    amountCol: number,
    dateCol: number,
    payeeCol: number,
    typeCol: number,
}
