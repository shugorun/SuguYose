import {describe, expect, it} from 'vitest'
import {clampToRange} from './geometry'

describe('clampToRange', () => {
    const minValue = 0
    const maxValue = 100
    it('lower than minValue', () => {
        expect(clampToRange(-5, minValue, maxValue)).toBe(minValue)
    })
    it('higher than maxValue', () => {
        expect(clampToRange(105, minValue, maxValue)).toBe(maxValue)
    })
    it('in the boundary', () => {
        const currentValue = 50 
        expect(clampToRange(currentValue, minValue, maxValue)).toBe(currentValue)
    })
    it('on the lower boundary', () => {
        const currentValue = minValue
        expect(clampToRange(currentValue, minValue, maxValue)).toBe(currentValue)
    })
    it('on the higher boundary', () => {
        const currentValue = maxValue
        expect(clampToRange(currentValue, minValue, maxValue)).toBe(currentValue)
    })
})