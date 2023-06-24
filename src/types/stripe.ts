export type Plan = {
    id: string
    name: string
    price: number | null
    interval: 'day' | 'month' | 'week' | 'year'
    currency: string
    description: string | null
  }