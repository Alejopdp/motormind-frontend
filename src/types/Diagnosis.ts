export type Diagnosis = {
    _id?: string
    carId: string
    fault: string
    notes: string
    preliminary: {
        possibleReasons: {
            title: string
            probability: string
            reasonDetails: string
        }[]
        fixSteps: {
            title: string
            procedure: string
            tools: string
        }[]
    }
    finalNotes: string
    diagnosis: string
    wasUseful?: boolean
    createdAt: Date
    updatedAt: Date
}
