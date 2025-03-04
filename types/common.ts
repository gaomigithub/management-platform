export interface ICommonResponse<T> {
    // code: number
    // message: string
    // result: T
    // success: boolean
    // timestamp: number
    data:T
  }
  
  export interface ICommonQueryPageListRes<T> {
    countId: number | null
    current: number
    maxLimit: number | null
    optimizeCountSql: boolean
    orders: any[]
    pages: number
    records: T[]
    searchCount: boolean
    size: number
    total: number
  }
  
  export interface ICommonQueryPageListParams {
    pageNo?: number;
    pageSize?: number;
  }
  