export type Scheme = { id: string; duration: 10 | 20 | 25 | 40; value: number; monthly: number; approvalStatus: 'pending-company-approval' }
const values: Record<10 | 20 | 25 | 40, [number, number][]> = {
  10: [[2500000,250000],[2000000,200000],[1000000,100000],[500000,50000],[300000,30000],[200000,20000],[100000,10000],[50000,5000]],
  20: [[2500000,125000],[2000000,100000],[1000000,50000],[500000,25000],[300000,15000],[200000,10000],[100000,5000],[50000,2500]],
  25: [[10000000,400000],[5000000,200000],[2500000,100000],[2000000,80000],[1000000,40000],[500000,20000],[300000,12000],[200000,8000],[100000,4000],[50000,2000]],
  40: [[10000000,250000],[5000000,125000],[2500000,62500],[2000000,50000],[1000000,25000],[500000,12500],[300000,7500],[200000,5000],[100000,2500],[50000,1250]],
}
export const schemes: Scheme[] = (Object.entries(values) as [string, [number, number][]][]).flatMap(([duration, rows]) => rows.map(([value, monthly]) => ({ id: `${duration}-${value}`, duration: Number(duration) as Scheme['duration'], value, monthly, approvalStatus: 'pending-company-approval' })))
export const currency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)

