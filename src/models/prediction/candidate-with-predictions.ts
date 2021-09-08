import {CandidatePrediction} from '@/models/prediction/candidate-prediction'

export interface CandidateWithPredictions {
    candidate: string

    parentPredictions: CandidatePrediction[]
    synonymPredictions: CandidatePrediction[]
}
